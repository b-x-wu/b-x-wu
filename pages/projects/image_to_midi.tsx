import useSWR from 'swr'

export default function ImageToMidi (): JSX.Element {
  const fetcher = async (url: string): Promise<any> => {
    return await fetch(url).then(async (res) => await res.json())
  }
  const { data, error, isLoading } = useSWR('/api/image_to_midi?url=https%3A%2F%2Fi.imgur.com%2FLPRQN7Y.png', fetcher)

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

  console.log(data)
  return (
    <>{data == null ? 'data is null' : `data: ${JSON.stringify(data)}`}</>
  )
}
