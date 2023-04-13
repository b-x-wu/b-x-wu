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
      className='group relative h-48 rounded-xl ring-4 ring-lighter-blue transition-all duration-300 dark:ring-darkest-blue'
    >
      {/* TODO: if we're using gifs, change it so that the gif only starts playing on hover */}
      {imagePath != null
        ? <Image
            src={imagePath}
            width={1000}
            height={1000}
            alt={description ?? `Image for ${name}`}
            className="h-full w-full rounded-xl object-cover"
          />
        : <></>
      }
      <div className='absolute inset-0 h-full w-full rounded-xl bg-lighter-blue opacity-90 transition-all duration-300 group-hover:opacity-0 dark:bg-darkest-blue dark:opacity-95'>
        <div className="mx-4 flex h-full flex-col justify-center gap-y-1 transition-all duration-300 group-hover:opacity-0">
          <h1 className="text-center text-xl font-bold text-dim-gray transition-all duration-300 dark:text-light-gray">{name}</h1>
          {description != null ? <p className="text-center text-dim-gray transition-all duration-300 dark:text-light-gray sm:group-hover:block xl:block">{description}</p> : <></>}
        </div>
      </div>
    </Link>
  )
}
