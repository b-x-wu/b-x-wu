import { useState } from 'react'
import { type Base64String, isMidiNote, type MidiNote, type Pixel } from '../../types/image_to_midi'
import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'
import ProgressBar from './progressBar'
import { type Note } from '@tonejs/midi/dist/Note'
import Image from 'next/image'

// interface ADSRControllerProps {
//   name: string
//   disabled: boolean
//   setAttack: (attack: number) => void
//   setDecay: (decay: number) => void
//   setSustain: (sustain: number) => void
//   setRelease: (release: number) => void
// }

// function floatToRoundedExp (val: number): number {
//   return Math.round(Math.exp(val) * 100) / 100
// }

// function ADSRController (props: ADSRControllerProps): JSX.Element {
//   const [attackFormValue, setAttackFormValue] = useState<number>(0.02)
//   const [decay, setDecay] = useState<number>(0.1)
//   const [sustain, setSustain] = useState<number>(0.3)
//   const [release, setRelease] = useState<number>(1)

//   return (
//     <div className='flex w-60 flex-col text-sm'>
//       <div className='mx-auto'>{props.name}</div>
//       <div className='flex w-full flex-row gap-x-2'>
//         <div className='w-4/12 text-start'>Attack</div>
//         <input
//           disabled={props.disabled}
//           step={0.001}
//           type='range'
//             min={Math.log(0.005)}
//           max={Math.log(20)}
//           value={attackFormValue}
//           onChange={(event) => { setAttackFormValue(parseFloat(event.target.value)); props.setAttack(floatToRoundedExp(parseFloat(event.target.value))) }}
//         />
//         <div className='w-3/12 text-end'>{floatToRoundedExp(attackFormValue)}</div>
//       </div>
//       <div className='flex flex-row gap-x-2'>
//         <div>Decay</div>
//         <input
//           disabled={props.disabled}
//           step={0.01}
//           type='range'
//           min={0}
//           max={3}
//           value={decay}
//           onChange={(event) => { setDecay(parseFloat(event.target.value)); props.setDecay(parseFloat(event.target.value)) }}
//         />
//         <div>{decay}</div>
//       </div>
//       <div className='flex flex-row gap-x-2'>
//         <div>Sustain</div>
//         <input
//           disabled={props.disabled}
//           step={0.01}
//           type='range'
//           min={0}
//           max={1}
//           value={sustain}
//           onChange={(event) => { setSustain(parseFloat(event.target.value)); props.setSustain(parseFloat(event.target.value)) }}
//         />
//         <div>{sustain}</div>
//       </div>
//       <div className='flex flex-row gap-x-2'>
//         <div>Release</div>
//         <input
//           disabled={props.disabled}
//           step={0.01}
//           type='range'
//           min={0}
//           max={3}
//           value={release}
//           onChange={(event) => { setRelease(parseFloat(event.target.value)); props.setRelease(parseFloat(event.target.value)) }}
//         />
//         <div>{release}</div>
//       </div>
//     </div>
//   )
// }

interface MidiManagerProps {
  image: Base64String
  functionText: string
}

function clamp (val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

async function rgbaToMidiNote (functionText: string, { red, green, blue, alpha, x, y }: Pixel): Promise<MidiNote | undefined> {
  return await new Promise((resolve, reject) => {
    functionText += 'onmessage = (pixel) => { try { postMessage(pixelToMidiNote(pixel)); } catch (e) { console.log(e); } }'
    const webworkerScriptUrl = URL.createObjectURL(new Blob([functionText], {
      type: 'text/javascript'
    }))

    const webworker = new Worker(webworkerScriptUrl)
    webworker.onmessage = (midiNote) => {
      if (!(midiNote.data === undefined || isMidiNote(midiNote.data))) {
        URL.revokeObjectURL(webworkerScriptUrl)
        webworker.terminate()
        reject(new Error('Invalid midi note returned'))
        return
      }
      URL.revokeObjectURL(webworkerScriptUrl)
      webworker.terminate()
      resolve(midiNote.data)
    }

    webworker.onerror = (e) => {
      webworker.terminate()
      URL.revokeObjectURL(webworkerScriptUrl)
      reject(e.error)
    }

    setTimeout(() => {
      webworker.terminate()
      URL.revokeObjectURL(webworkerScriptUrl)
      reject(new Error('Time limit exceeded'))
    }, 5000)

    webworker.postMessage(null)
  })
}

export function MidiManager (props: MidiManagerProps): JSX.Element {
  const [midiBuffer, setMidiBuffer] = useState<ArrayBuffer | undefined>(undefined)
  const [currentProgress, setCurrentProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const handleOnClick = (): void => {
    setIsLoading(true)
    void (async () => {
      const res = await fetch('/api/image_to_midi/image_processor', {
        method: 'POST',
        body: JSON.stringify({ image: props.image })
      })

      if (res.status >= 400) return
      const data = await res.json()
      const width = data.width
      // const height = data.height
      const redBuffer = Buffer.from(data.redBuffer, 'base64')
      const greenBuffer = Buffer.from(data.greenBuffer, 'base64')
      const blueBuffer = Buffer.from(data.blueBuffer, 'base64')
      const alphaBuffer = Buffer.from(data.alphaBuffer, 'base64')
      const indices = Buffer.from(data.indexBuffer, 'base64').toJSON().data

      const midi = new Midi()
      const track = midi.addTrack()

      let red: number | undefined; let green: number | undefined; let blue: number | undefined; let alpha: number | undefined
      let midiNote: MidiNote | undefined

      try {
        let idx
        for (let progress = 0; progress < indices.length; progress++) {
          idx = indices[progress]
          red = redBuffer.at(idx); green = greenBuffer.at(idx); blue = blueBuffer.at(idx); alpha = alphaBuffer.at(idx)

          if (red == null || green == null || blue == null || alpha == null) return

          midiNote = await rgbaToMidiNote(props.functionText, { red, green, blue, alpha, x: idx % width, y: Math.floor(idx / width) })
          if (midiNote != null && midiNote.duration > 0 && midiNote.start >= 0) {
            track.addNote({
              midi: clamp(Math.floor(midiNote.pitch), 0, 127),
              time: midiNote.start,
              duration: midiNote.duration,
              velocity: clamp(midiNote.velocity, 0, 1)
            })
          }
          setCurrentProgress(progress / indices.length)
        }
      } catch (e) {
        console.log(e)
      }

      try {
        const midiBuffer = Buffer.from(midi.toArray())
        setMidiBuffer(midiBuffer)
      } catch (e: any) {
        console.log({ message: 'Error encoding midi buffer.', data: e })
      } finally {
        setIsLoading(false)
      }
    })()
  }

  const convertToMidiButton = (
    <button onClick={handleOnClick} className='flex flex-row items-center gap-x-2 rounded-lg bg-dark-blue py-3 px-4 text-sm'>
      <Image src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Repeat_font_awesome.svg" className='h-5 w-5 invert' height={10} width={10} alt='Convert to Midi' aria-label='Convert to Midi' />
      <div>
        Convert to Midi
      </div>
    </button>
  )

  if (!isLoading && midiBuffer == null) {
    return (
      <div className='mx-auto'>
        {convertToMidiButton}
      </div>
    )
  }

  if (isLoading || midiBuffer == null) {
    return (
      <>
        <ProgressBar currentProgress={currentProgress} maxProgress={1} />
      </>
    )
  }

  const synth = new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  }).toDestination()

  const playMidi = async (): Promise<void> => {
    await Tone.start()

    const midi = new Midi(midiBuffer)

    const baseStartTime = Tone.now() + 0.5
    const midiPart = new Tone.Part((time, note: Note) => {
      synth.triggerAttackRelease(note.name, note.duration, baseStartTime + note.time, note.velocity)
    }, midi.tracks[0].notes) // TODO: add warning for max polyphony reached

    setIsPlaying(true)
    midiPart.start()
    Tone.Transport.start()
  }

  return (
    <div className='mx-auto flex flex-col gap-y-6'>
      <div>
        {convertToMidiButton}
      </div>
      <div className='mx-auto flex h-fit flex-row items-center gap-x-4'>
        {/* Download midi button */}
        {!isPlaying
          ? <button onClick={() => { void playMidi() }} className='flex flex-row items-center gap-x-2'>
              <div className='h-8 w-8 rounded-full bg-dim-gray'>
                <Image src='/play-icon.svg' height={10} width={10} alt='Play' aria-label='Play' className='mx-auto h-full w-6/12 object-contain opacity-70 dark:invert' />
              </div>
              <div className='text-sm'>Play</div>
            </button>
          : <button onClick={() => { setIsPlaying(false); synth.disconnect() }} className='flex flex-row items-center gap-x-2'>
              <div className='h-8 w-8 rounded-full bg-dim-gray'>
                <Image src='/stop-icon.svg' height={10} width={10} alt='Stop' aria-label='Stop' className='mx-auto h-full w-4/12 object-contain opacity-70 dark:invert' />
              </div>
              <div className='text-sm'>Stop</div>
            </button>
        }
      </div>
      <div>
        <button className='mx-auto flex flex-row items-center gap-x-2 rounded-lg bg-dark-blue py-3 px-4 text-sm'>
          <Image src='https://www.svgrepo.com/show/488905/download-2.svg' height={10} width={10} alt='Download Midi' aria-label='Download Midi' className='h-6 w-6 invert' />
          <div>Download Midi</div>
        </button>
      </div>
    </div>
  )
}
