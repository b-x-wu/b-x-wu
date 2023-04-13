import Link from 'next/link'
import Image from 'next/image'

interface TitleLinkProps {
  title: string
  href: string
}

function TitleLink ({ title, href }: TitleLinkProps): JSX.Element {
  return (
        <Link
            href={href}
            className="group content-end hover:underline"
            target="_blank"
            rel="noreferrer noopener"
        >
            <span>{title}</span>
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/0/02/OOjs_UI_icon_link-rtl.svg"
                height={100}
                width={100}
                alt="Link"
                className="hidden duration-300 [transition-property:filter] dark:invert sm:inline sm:h-6 sm:w-7 sm:rotate-90 sm:align-text-bottom sm:opacity-10 sm:group-hover:opacity-30"
            >
            </Image>
        </Link>
  )
}

interface ResumeItemProps {
  title: string
  subtitle: string
  titleHref?: string
  subtitleHref?: string
  location?: string
  dateDescription?: string
  bullets?: readonly string[]
  hidden?: boolean
}

export default function ResumeItem ({ title, subtitle, titleHref, subtitleHref, location, dateDescription, bullets, hidden }: ResumeItemProps): JSX.Element {
  if (hidden != null && hidden) {
    return (<></>)
  }

  const bulletList = bullets == null
    ? <></>
    : <ul className="list-outside list-square pl-4 pt-2 font-light">
            {bullets.map((bullet, idx) =>
                <li key={idx}>
                    {bullet}
                </li>
            )}
        </ul>

  const titleElement = titleHref == null
    ? title
    : <TitleLink
        title={title}
        href={titleHref}
    />

  const subtitleElement = subtitleHref == null
    ? subtitle
    : <TitleLink
        title={subtitle}
        href={subtitleHref}
    />

  return (
        <div className="flex flex-col py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                <h3 className="text-lg font-medium">{titleElement}</h3>
                <span className="hidden sm:inline sm:text-right sm:font-light">{location}</span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                <h4 className="text-lg">{subtitleElement}</h4>
                <span className="inline text-right font-light">{dateDescription}</span>
            </div>
            {bulletList}
        </div>
  )
}
