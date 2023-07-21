import { useEffect, useState } from 'react'
import { type Base64String, isMidiNote, type MidiNote, type Pixel, waveformTrackToOscillatorType, type WaveformTrack, type ConsoleMessage, ConsoleMessageType } from '../../types/image_to_midi'
import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'
import ProgressBar from './progressBar'
import { type Note } from '@tonejs/midi/dist/Note'
import Image from 'next/image'

interface MidiManagerProps {
  image: Base64String
  functionText: string
  setConsoleMessage: (consoleMessage: ConsoleMessage) => void
}

function clamp (val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

async function rgbaToMidiNote (functionText: string, pixel: Pixel): Promise<MidiNote | undefined> {
  return await new Promise((resolve, reject) => {
    functionText += 'onmessage = (message) => postMessage(pixelToMidiNote(message.data));'
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

    webworker.postMessage(pixel)
  })
}

export function MidiManager (props: MidiManagerProps): JSX.Element {
  const [midiBuffer, setMidiBuffer] = useState<ArrayBuffer | undefined>(undefined)
  const [currentProgress, setCurrentProgress] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [midiUrl, setMidiUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (midiBuffer == null) return
    if (midiUrl != null) URL.revokeObjectURL(midiUrl)
    setMidiUrl(URL.createObjectURL(new Blob([midiBuffer])))
  }, [midiBuffer])

  const handleConvertToMidi = (): void => {
    setIsLoading(true)
    setIsPlaying(false)
    void (async () => {
      try {
        const res = await fetch('/api/image_to_midi/image_processor', {
          method: 'POST',
          body: JSON.stringify({ image: props.image })
        })

        if (res.status >= 400) {
          props.setConsoleMessage({ type: ConsoleMessageType.ERROR, message: 'Error parsing image.' })
          throw new Error()
        }
        const data = await res.json()
        const width = data.width
        // const height = data.height
        const redBuffer = Buffer.from(data.redBuffer, 'base64')
        const greenBuffer = Buffer.from(data.greenBuffer, 'base64')
        const blueBuffer = Buffer.from(data.blueBuffer, 'base64')
        const alphaBuffer = Buffer.from(data.alphaBuffer, 'base64')
        const indices = Buffer.from(data.indexBuffer, 'base64').toJSON().data
        const decodedIndexArray = Array.from<string>(data.encodedIndexArray).reduce<number[]>((prev, cur) => {
          prev.push(cur.charCodeAt(0))
          return prev
        }, [])
        // console.log(Math.max(...decodedIndexArray))

        const midi = new Midi()
        for (let i = 0; i < 4; i++) midi.addTrack()

        let red: number | undefined; let green: number | undefined; let blue: number | undefined; let alpha: number | undefined
        let midiNote: MidiNote | undefined

        try {
          let idx
          for (let progress = 0; progress < indices.length; progress++) {
            // if (!isLoading) break
            // idx = indices[progress]
            // const decodedIndexArrayIdx = decodedIndexArray[progress]
            idx = decodedIndexArray[progress]
            red = redBuffer.at(idx); green = greenBuffer.at(idx); blue = blueBuffer.at(idx); alpha = alphaBuffer.at(idx)
            // console.log({ red: redBuffer.at(decodedIndexArrayIdx), green: greenBuffer.at(decodedIndexArrayIdx), blue: blueBuffer.at(decodedIndexArrayIdx), alpha: alphaBuffer.at(decodedIndexArrayIdx) })

            if (red == null || green == null || blue == null || alpha == null) {
              console.log('null value found')
              continue
            }

            const pixel = { red, green, blue, alpha, x: idx % width, y: Math.floor(idx / width) }
            // console.log(pixel)
            midiNote = await rgbaToMidiNote(props.functionText, pixel)
            if (midiNote != null && midiNote.duration > 0 && midiNote.start >= 0) {
              midi.tracks[midiNote.track == null ? 0 : midiNote.track].addNote({
                midi: clamp(Math.floor(midiNote.pitch), 0, 127),
                time: midiNote.start,
                duration: midiNote.duration,
                velocity: clamp(midiNote.velocity, 0, 1)
              })
            }
            setCurrentProgress(progress / indices.length)
          }
        } catch (e: any) {
          props.setConsoleMessage({ type: ConsoleMessageType.ERROR, message: e.toString() })
          throw e
        }

        try {
          const midiBuffer = Buffer.from(midi.toArray())
          setMidiBuffer(midiBuffer)
        } catch (e: any) {
          props.setConsoleMessage({ type: ConsoleMessageType.ERROR, message: 'Error encoding midi buffer.' })
          throw e
        }
      } catch {
      } finally {
        setCurrentProgress(0)
        setIsLoading(false)
        setCurrentProgress(0)
      }
    })()
  }

  const convertToMidiButton = (
    <button onClick={handleConvertToMidi} className='flex flex-row items-center gap-x-2 rounded-md bg-lighter-blue py-3 px-4 text-sm text-darkest-blue ring-0 transition-all duration-300 hover:ring-2 dark:bg-darkest-blue dark:text-glacier'>
      <Image src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Repeat_font_awesome.svg" className='h-5 w-5 opacity-80 transition-all duration-300 dark:invert' height={10} width={10} alt='Convert to Midi' aria-label='Convert to Midi' />
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
        {/* <button onClick={() => { setIsLoading(false) } } className='h-12 w-24 bg-light-gray'>Cancel</button> */}
      </>
    )
  }

  const synths = new Array(4).fill(0).map((_, waveformTrack) => {
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: waveformTrackToOscillatorType.get(waveformTrack as WaveformTrack) ?? 'sine'
      }
    }).toDestination()
  })

  const playMidi = async (): Promise<void> => {
    await Tone.start()

    const midi = new Midi(midiBuffer)

    const baseStartTime = Tone.now() + 0.5
    Array(4).fill(0).map((_, waveformTrack) => {
      return new Tone.Part((time, note: Note) => {
        synths[waveformTrack].triggerAttackRelease(note.name, note.duration, baseStartTime + note.time, note.velocity)
      }, midi.tracks[waveformTrack].notes).start()
    })

    setIsPlaying(true)
    Tone.Transport.start()
  }

  return (
    <div className='mx-auto flex flex-col gap-y-6'>
      <div>
        {convertToMidiButton}
      </div>
      <div className='mx-auto flex h-fit flex-row items-center gap-x-4'>
        {!isPlaying
          ? <button onClick={() => { void playMidi() }} className='flex flex-row items-center gap-x-2'>
              <div className='h-8 w-8 rounded-full bg-lighter-blue ring-0 transition-all duration-300 hover:ring-2 dark:bg-darkest-blue'>
                <Image src='/play-icon.svg' height={10} width={10} alt='Play' aria-label='Play' className='mx-auto h-full w-5/12 object-contain opacity-70 transition-all duration-300 dark:invert' />
              </div>
              <div className='text-sm'>Play</div>
            </button>
          : <button onClick={() => { setIsPlaying(false); for (const synth of synths) synth.disconnect() }} className='flex flex-row items-center gap-x-2'>
              <div className='h-8 w-8 rounded-full bg-lighter-blue ring-0 transition-all duration-300 hover:ring-2 dark:bg-darkest-blue'>
                <Image src='/stop-icon.svg' height={10} width={10} alt='Stop' aria-label='Stop' className='mx-auto h-full w-4/12 object-contain opacity-70 transition-all duration-300 dark:invert' />
              </div>
              <div className='text-sm'>Stop</div>
            </button>
        }
      </div>
      <div>
        <a download="image.mid" href={midiUrl ?? '/'} className='mx-auto flex flex-row items-center gap-x-2 rounded-md bg-lighter-blue py-3 px-4 text-sm text-darkest-blue ring-0 transition-all duration-300 hover:ring-2 dark:bg-darkest-blue dark:text-glacier'>
          <Image src='https://www.svgrepo.com/show/488905/download-2.svg' height={10} width={10} alt='Download Midi' aria-label='Download Midi' className='h-6 w-6 opacity-80 transition-all duration-300 dark:invert' />
          <div>Download Midi</div>
        </a>
      </div>
    </div>
  )
}
