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
      target='_blank'
      rel='noopener noreferrer'
      className='group relative h-48 rounded-xl ring-4 ring-lighter-blue transition-all duration-300'
    >
      {/* TODO: if we're using gifs, change it so that the gif only starts playing on hover */}
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
      <div className='absolute inset-0 h-full w-full rounded-xl bg-lighter-blue opacity-[85%] transition-all duration-300 group-hover:opacity-0'>
        <div className="flex h-full flex-col justify-center gap-y-1 transition-all duration-300 group-hover:opacity-0">
          <h1 className="text-center text-xl font-bold">{name}</h1>
          {description != null ? <p className="text-center sm:group-hover:block xl:block">{description}</p> : <></>}
        </div>
      </div>
    </Link>
  )
}
