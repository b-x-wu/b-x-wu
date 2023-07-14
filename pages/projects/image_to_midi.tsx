import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'
import { type Note } from '@tonejs/midi/dist/Note'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { type Pixel, type MidiNote, isMidiNote } from '../../types/image_to_midi'
import FunctionTextInput from '../../components/image-to-midi/functionTextInput'

type Base64String = string
interface ImageFormComponentProps {
  setImage: (image: Base64String) => void
  image: Base64String | undefined
}

// https://stackoverflow.com/questions/18650168/convert-blob-to-base64
async function blobToBase64 (blob: Blob): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result == null) reject(new Error('reader.result is null'))
      resolve(reader.result as string)
    }
    reader.readAsDataURL(blob)
  })
}

function ImageFormComponent (props: ImageFormComponentProps): JSX.Element {
  const [currentFormValue, setCurrentFormValue] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [imageObjectUrl, setImageObjectUrl] = useState<string | undefined>(undefined)

  // TODO: let this also take in a file

  useEffect(() => {
    void (async () => {
      if (imageUrl == null) return
      try {
        const res = await fetch(imageUrl)
        if (res.status >= 400) return
        const contentType = res.headers.get('Content-Type')
        if (contentType == null || !contentType.includes('image')) return

        const blob = await res.blob()
        const imageBase64 = await blobToBase64(blob)
        props.setImage(imageBase64.replace(/^data:image\/\w+;base64,/, ''))

        const imageObjectUrl = URL.createObjectURL(blob)
        setImageObjectUrl(imageObjectUrl)
      } catch {} // TODO: really really add error messages
    })()
  }, [imageUrl])

  return (
    <div>
      <input type="text" placeholder='Image Url' className='text-darkest-blue' value={currentFormValue} onChange={(event) => { setCurrentFormValue(event.target.value) }}></input>
      <button onClick={() => { setImageUrl(currentFormValue); setCurrentFormValue('') }}>Submit</button>
      {imageObjectUrl == null ? <></> : <Image src={imageObjectUrl} width={100} height={100} alt='Your image'/>}
    </div>
  )
}

interface MidiManagerProps {
  image: Base64String
  functionText: string
}

function MidiManager (props: MidiManagerProps): JSX.Element {
  const [midiBuffer, setMidiBuffer] = useState<ArrayBuffer | undefined>(undefined)

  useEffect(() => {
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
      let midiNoteData: MidiNote | undefined

      try {
        let idx
        for (let progress = 0; progress < indices.length; progress++) {
          idx = indices[progress]
          red = redBuffer.at(idx); green = greenBuffer.at(idx); blue = blueBuffer.at(idx); alpha = alphaBuffer.at(idx)

          if (red == null || green == null || blue == null || alpha == null) return

          midiNoteData = await rgbaToMidiNote(props.functionText, { red, green, blue, alpha, x: idx % width, y: Math.floor(idx / width) })
          if (midiNoteData != null && midiNoteData.duration > 0) {
            track.addNote({
              midi: midiNoteData.pitch,
              time: midiNoteData.start,
              duration: midiNoteData.duration,
              velocity: midiNoteData.velocity
            })
          }
          // TODO: add a progress response
          if (progress % 100 === 0) { console.log(`${progress}/${indices.length}`) }
        }
      } catch (e) {
        console.log(e)
      }

      try {
        const midiBuffer = Buffer.from(midi.toArray())
        setMidiBuffer(midiBuffer)
      } catch (e: any) {
        console.log({ message: 'Error encoding midi buffer.', data: e })
      }
    })()
  }, [props.image])

  if (midiBuffer == null) return (<></>)

  const playMidi = async (): Promise<void> => {
    await Tone.start()
    console.log('audiocontext started')
    const synth = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination()

    const midi = new Midi(midiBuffer)
    const baseStartTime = Tone.now() + 0.5
    const midiPart = new Tone.Part((time, note: Note) => {
      console.log(note)
      synth.triggerAttackRelease(note.name, note.duration, baseStartTime + note.time, note.velocity)
    }, midi.tracks[0].notes) // TODO: add warning for max polyphony reached

    midiPart.start()
    Tone.Transport.start()
  }

  return (
    <div><button onClick={() => { void playMidi() }} className='h-20 w-20 bg-darker-blue'>Click Me</button></div>
  )
}

export default function ImageToMidi (): JSX.Element {
  const [image, setImage] = useState<Base64String | undefined>(undefined)
  const [functionText, setFunctionText] = useState<string | undefined>(undefined)

  return (
    <div className='flex flex-col space-y-5'>
      <FunctionTextInput setFunctionText={setFunctionText} />
      <ImageFormComponent setImage={(val) => { setImage(val); console.log(val) }} image={image}/>
      {image == null || functionText == null ? <></> : <MidiManager image={image} functionText={functionText} />}
    </div>
  )
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
