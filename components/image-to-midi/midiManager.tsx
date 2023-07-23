import { useEffect, useState } from 'react'
import { type Base64String, isMidiNote, type MidiNote, type Pixel, type ConsoleMessage, ConsoleMessageType, type Image as ApiImage } from '../../types/image_to_midi'
import { Midi } from '@tonejs/midi'
import ProgressBar from './progressBar'
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
  const [midiUrl, setMidiUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (midiBuffer == null) return
    if (midiUrl != null) URL.revokeObjectURL(midiUrl)
    setMidiUrl(URL.createObjectURL(new Blob([midiBuffer])))
  }, [midiBuffer])

  const handleConvertToMidi = (): void => {
    setIsLoading(true)
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
        const data: ApiImage = await res.json()
        const width = data.width
        const redBuffer = Buffer.from(data.encodedRedBuffer, 'base64')
        const greenBuffer = Buffer.from(data.encodedGreenBuffer, 'base64')
        const blueBuffer = Buffer.from(data.encodedBlueBuffer, 'base64')
        const alphaBuffer = Buffer.from(data.encodedAlphaBuffer, 'base64')
        const indexArray = Array.from<string>(data.encodedIndexArray).reduce<number[]>((prev, cur) => {
          prev.push(cur.charCodeAt(0))
          return prev
        }, [])

        const midi = new Midi()
        for (let i = 0; i < 4; i++) midi.addTrack()

        let red: number | undefined; let green: number | undefined; let blue: number | undefined; let alpha: number | undefined
        let midiNote: MidiNote | undefined

        try {
          let idx
          for (let progress = 0; progress < indexArray.length; progress++) {
            setCurrentProgress(progress / indexArray.length)
            idx = indexArray[progress]
            red = redBuffer.at(idx); green = greenBuffer.at(idx); blue = blueBuffer.at(idx); alpha = alphaBuffer.at(idx)

            if (red == null || green == null || blue == null || alpha == null) continue

            const pixel = { red, green, blue, alpha, x: idx % width, y: Math.floor(idx / width) }
            try {
              midiNote = await rgbaToMidiNote(props.functionText, pixel)
            } catch (e: any) {
              props.setConsoleMessage({ type: ConsoleMessageType.WARNING, message: `Note skipped. (${e.toString() as string})` })
              continue
            }
            if (midiNote != null && midiNote.duration > 0 && midiNote.start >= 0) {
              midi.tracks[midiNote.track == null ? 0 : Math.max(0, Math.floor(midiNote.track))].addNote({
                midi: clamp(Math.floor(midiNote.pitch), 0, 127),
                time: midiNote.start,
                duration: midiNote.duration,
                velocity: clamp(midiNote.velocity, 0, 1)
              })
            }
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
      </>
    )
  }

  return (
    <div className='mx-auto flex flex-col gap-y-6'>
      <div>
        {convertToMidiButton}
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
