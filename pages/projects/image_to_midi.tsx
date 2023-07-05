import useSWR from 'swr'
import { type Pixel, type Image } from '../../types/image_to_midi'

function PixelComponent (props: { pixel: Pixel }): JSX.Element {
  const backgroundColor = `#${props.pixel.red.toString(16)}${props.pixel.green.toString(16)}${props.pixel.blue.toString(16)}`

  return (
    <div className='h-[1px] w-[1px]' style={{ backgroundColor }}></div>
  )
}

function RowComponent (props: { row: Pixel[] }): JSX.Element {
  const pixelRow = props.row.map((pixel, idx) => {
    return <PixelComponent
              pixel={pixel}
              key={idx}
            />
  })
  return (
    <div className='flex flex-row gap-x-0'>{pixelRow}</div>
  )
}

function ImageComponent (props: { bitmap: Pixel[][] }): JSX.Element {
  const image = props.bitmap.map((row, idx) => {
    return <RowComponent
              row={row}
              key={idx}
            />
  })

  return (
    <div className='flex flex-col gap-y-0'>{image}</div>
  )
}

export default function ImageToMidi (): JSX.Element {
  const fetcher = async (url: string): Promise<Image | null> => {
    return await fetch(url).then(async (res) => await res.json())
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

  return (
    <>{data == null ? 'data is null' : <ImageComponent bitmap={data.bitmap} />}</>
  )
}
