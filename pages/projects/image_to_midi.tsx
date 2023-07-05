import useSWR from 'swr'
import * as Tone from 'tone'
import { type MidiNote } from '../../types/image_to_midi'

export default function ImageToMidi (): JSX.Element {
  const fetcher = async (url: string): Promise<MidiNote[]> => {
    return await fetch(url).then(async (res) => {
      if (res.status >= 400) {
        throw new Error(await res.json())
      }
      return await res.json()
    })
  }
  const { data, error, isLoading } = useSWR('/api/image_to_midi?url=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F664662934409211904%2F7SsfbZm2_400x400.jpg', fetcher)

  if (error != null) {
    return (
      <>
        Error: {error.toString()}
      </>
    )
  }

  if (isLoading) {
    return (
      <>Loading</>
    )
  }

  Tone.start().catch(console.log)

  const synth = new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  }).toDestination()

  const now = Tone.now() + 0.5

  data?.forEach((midiNote) => {
    synth.triggerAttackRelease(Tone.mtof(Math.floor(midiNote.pitch) as Tone.Unit.MidiNote), midiNote.duration, midiNote.start + now, midiNote.velocity)
  })

  return (
    <>{data == null ? 'data is null' : JSON.stringify(data)}</>
  )
}
