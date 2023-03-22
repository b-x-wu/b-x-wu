import Link from 'next/link'
import Image from 'next/image'

interface FeaturedProjectProps {
  name: string
  description?: string
  imagePath?: string
  url?: string
}

export default function FeaturedProject ({ name, description, imagePath, url }: FeaturedProjectProps): JSX.Element {
  return (
    <Link
      href={url ?? '#'}
      className='group relative h-48 rounded-xl ring-4 ring-lighter-blue transition-all duration-300'
    >
      {/* TODO: if we're using gifs, change it so that the gif only starts playing on hover */}
      {/* TODO: figure out how to make descriptions not look bad */}
      {imagePath != null
        ? <Image
          src={imagePath}
          width={100}
          height={100}
          alt={description ?? `Image for ${name}`}
          className="h-full w-full rounded-xl object-cover"
        />
        : <></>
      }
      <div className={
        'transition-all ease-linear duration-300 bg-lighter-blue bg-opacity-100 absolute inset-y-0 right-0 w-1/3 flex items-center justify-center rounded-r-lg backdrop-blur ' +
        'sm:w-full sm:h-16 sm:bottom-0 sm:inset-x-0 sm:inset-y-auto sm:rounded-tr-none sm:rounded-b-lg ' +
        'xl:w-1/3 xl:inset-y-0 xl:inset-x-auto xl:h-full xl:bottom-auto xl:right-0 xl:rounded-r-lg xl:rounded-bl-none ' +
        'group-hover:w-full group-hover:h-full group-hover:rounded-xl group-hover:bg-opacity-80'
      }>
        <div className="flex flex-col px-2">
          <h1 className="text-center text-lg">{name}</h1>
          {description != null ? <p className="text-center text-sm font-light sm:group-hover:block xl:block">{description}</p> : <></>}
        </div>
      </div>
    </Link>
  )
}
