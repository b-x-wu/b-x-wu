import Link from 'next/link'
import Image from 'next/image'

interface ContactButtonProps {
  platform: string
  href: string
  imageSrc: string
}

export default function ContactButton ({ platform, href, imageSrc }: ContactButtonProps): JSX.Element {
  return (
    <Link
      href={href}
      aria-label={platform}
      target="_blank"
      rel="noreferrer noopener"
      className="h-6 w-6"
    >
      <Image
        src={imageSrc}
        width={100}
        height={100}
        alt={platform}
        className="h-full w-full object-contain opacity-70 transition-all duration-300 dark:invert"
      />
    </Link>
  )
}
