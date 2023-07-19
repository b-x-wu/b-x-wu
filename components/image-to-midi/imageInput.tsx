import { useEffect, useState } from 'react'
import { type ConsoleMessage, type Base64String, ConsoleMessageType } from '../../types/image_to_midi'
import Image from 'next/image'

interface ImageGetterProps {
  setImageBlob: (imageBlob: Blob) => void
  setConsoleMessage: (consoleMessage: ConsoleMessage) => void
}

// https://stackoverflow.com/questions/18650168/convert-blob-to-base64
async function blobToBase64 (blob: Blob): Promise<Base64String> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result == null) reject(new Error('reader.result is null'))
      resolve(reader.result as string)
    }
    reader.readAsDataURL(blob)
  })
}

function ImageUrlGetter (props: ImageGetterProps): JSX.Element {
  const [currentFormValue, setCurrentFormValue] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    void (async () => {
      if (imageUrl == null) return
      try {
        const res = await fetch(imageUrl)
        if (res.status >= 400) throw new Error()
        const contentType = res.headers.get('Content-Type')
        if (contentType == null || !contentType.includes('image')) throw new Error()

        props.setImageBlob(await res.blob())
      } catch {
        props.setConsoleMessage({ type: ConsoleMessageType.ERROR, message: 'Error retrieving image from url.' })
      }
    })()
  }, [imageUrl])

  return (
    <div className='mx-auto flex w-96 max-w-full flex-row gap-x-2'>
      <input type="text" placeholder='Image Url' className='w-full rounded-md border-2 border-darkest-blue bg-[#FFF] pl-2 text-darkest-blue' value={currentFormValue} onChange={(event) => { setCurrentFormValue(event.target.value) }}></input>
      <button className='rounded-md bg-lighter-blue p-2 ring-0 transition-all duration-300 hover:cursor-pointer hover:ring-2 dark:bg-darkest-blue' onClick={() => { setImageUrl(currentFormValue) }}>Submit</button>
    </div>
  )
}

function ImageFileGetter (props: ImageGetterProps): JSX.Element {
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault()
    try {
      if (event.target.files == null) throw new Error()
      props.setImageBlob(event.target.files[0])
    } catch {
      props.setConsoleMessage({ type: ConsoleMessageType.ERROR, message: 'Error retrieving image from file' })
    }
  }

  return (
    <div className='mx-auto'>
      <label className='rounded-md bg-lighter-blue p-2 ring-0 transition-all duration-300 hover:cursor-pointer hover:ring-2 dark:bg-darkest-blue'>
        Upload File
        <input type="file" className='hidden' onChange={handleFileChange} />
      </label>
    </div>
  )
}

interface ImageInputProps {
  setImage: (image: Base64String | undefined) => void
  setConsoleMessage: (consoleMessage: ConsoleMessage) => void
}

export function ImageInput (props: ImageInputProps): JSX.Element {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | undefined>(undefined)

  const handleImageBlobChange = async (newImageBlob: Blob): Promise<void> => {
    if (imageBlobUrl != null) URL.revokeObjectURL(imageBlobUrl)
    setImageBlobUrl(URL.createObjectURL(newImageBlob))
    const imageBase64 = await blobToBase64(newImageBlob)
    props.setImage(imageBase64.replace(/^data:image\/\w+;base64,/, ''))
  }

  const handleRemoveImage = (): void => {
    if (imageBlobUrl == null) return
    props.setImage(undefined)
    URL.revokeObjectURL(imageBlobUrl)
    setImageBlobUrl(undefined)
  }

  if (imageBlobUrl == null) {
    return (
      <div className='flex flex-col gap-y-2 text-sm'>
        <ImageFileGetter setImageBlob={(imageBlob) => { void handleImageBlobChange(imageBlob) }} setConsoleMessage={props.setConsoleMessage}/>
        <div className='mx-auto'>or</div>
        <ImageUrlGetter setImageBlob={(imageBlob) => { void handleImageBlobChange(imageBlob) }} setConsoleMessage={props.setConsoleMessage} />
      </div>
    )
  }

  return (
    <div className='relative h-96 w-full border-2 bg-dim-gray/50'>
      <Image src={imageBlobUrl} width={100} height={100} className='h-auto max-h-full w-full object-contain' alt='Your Image' />
      <Image src="/x-icon.svg" width={100} height={100} aria-label='Remove Image' alt='Remove Image' className='absolute right-2 top-2 h-4 w-auto hover:cursor-pointer' onClick={handleRemoveImage} />
    </div>
  )
}
