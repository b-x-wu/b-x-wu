import useSWR from 'swr'
import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'
import { type Note } from '@tonejs/midi/dist/Note'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ImageFormComponentProps {
  setImageUrl: (imageUrl: string) => void
  imageUrl: string | undefined
}

function ImageFormComponent (props: ImageFormComponentProps): JSX.Element {
  const [currentFormValue, setCurrentFormValue] = useState<string>('')
  const [image, setImage] = useState<string | undefined>(undefined)

  useEffect(() => {
    void (async () => {
      if (props.imageUrl == null) return
      try {
        const res = await fetch(props.imageUrl)
        if (res.status >= 400) return
        const contentType = res.headers.get('Content-Type')
        if (contentType == null || !contentType.includes('image')) return

        const blob = await res.blob()
        const imageBase64 = URL.createObjectURL(blob)
        setImage(imageBase64)
      } catch {} // TODO: really really add error messages
    })()
  }, [props.imageUrl])

  return (
    <>
      <input type="text" placeholder='Image Url' value={currentFormValue} onChange={(event) => { setCurrentFormValue(event.target.value) }}></input>
      <button onClick={() => { props.setImageUrl(currentFormValue); console.log(currentFormValue); setCurrentFormValue('') }}>Submit</button>
      {image == null ? <></> : <Image src={image} width={100} height={100} alt='Your image'/>}
    </>
  )
}

export default function ImageToMidi (): JSX.Element {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  return (
    <>
      <ImageFormComponent setImageUrl={setImageUrl} imageUrl={imageUrl}/>
    </>
  )
}

// export default function ImageToMidi (): JSX.Element {
//   const fetcher = async (url: string): Promise<ArrayBuffer> => {
//     return await fetch(url).then(async (res) => {
//       if (res.status >= 400) {
//         throw new Error((await res.json()).message)
//       }
//       if (res.body == null) {
//         throw new Error('Cannot retrieve response from midi endpoint.')
//       }
//       return await res.arrayBuffer()
//     })
//   }
//   const { data, error, isLoading } = useSWR('/api/image_to_midi?url=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F664662934409211904%2F7SsfbZm2_400x400.jpg', fetcher)

//   if (error != null) {
//     return (
//       <>
//         Error: {error.toString()}
//       </>
//     )
//   }

//   if (isLoading) {
//     return (
//       <>Loading</>
//     )
//   }

//   if (data == null) {
//     return (
//       <>No data returned.</>
//     )
//   }

//   const playMidi = async (): Promise<void> => {
//     await Tone.start()
//     console.log('audiocontext started')
//     const synth = new Tone.PolySynth(Tone.Synth, {
//       envelope: {
//         attack: 0.02,
//         decay: 0.1,
//         sustain: 0.3,
//         release: 1
//       }
//     }).toDestination()

//     const midi = new Midi(data)
//     console.log('midi parsed')
//     const now = Tone.now() + 0.5
//     const midiPart = new Tone.Part((time, note: Note) => {
//       synth.triggerAttackRelease(note.name, note.duration, now + note.time, note.velocity)
//       console.log(`scheduled ${JSON.stringify(note)}`)
//     }, midi.tracks[0].notes)

//     console.log('starting')
//     midiPart.start()
//     Tone.Transport.start()
//   }

//   return (
//     <>{data == null ? 'data is null' : <button onClick={() => { void playMidi() }} className='h-10 w-10 bg-glacier'>Click Me</button>}</>
//   )
// }
