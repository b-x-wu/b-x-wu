import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

interface ResumeItemProps {
    title: string
    subtitle: string
    titleHref?: string
    subtitleHref?: string
    location?: string
    dateDescription?: string
    bullets?: readonly string[]
}

function ResumeItem({ title, subtitle, titleHref, subtitleHref, location, dateDescription, bullets }: ResumeItemProps) {
    const bulletList = bullets == null ? <></> :
        <ul className="list-[square] list-outside pl-4 pt-2 font-light">
            {bullets.map((bullet, idx) =>
                <li key={idx}>
                    {bullet}
                </li>
            )}
        </ul>

    const titleLinkElement = (title: string, href: string) =>
        <Link
            href={href}
            className="hover:underline content-end group"
            target={"_blank"}
            rel={"noreferrer noopener"}
        >
            <span className="text-sky-700 sm:text-current">{title}</span>
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/0/02/OOjs_UI_icon_link-rtl.svg"
                height={100}
                width={100}
                alt="Link"
                className="hidden sm:inline sm:h-6 sm:w-7 sm:rotate-90 sm:opacity-10 sm:align-text-bottom sm:group-hover:opacity-30"
            >
            </Image>
        </Link>

    const titleElement = titleHref == null ? title : titleLinkElement(title, titleHref)

    const subtitleElement = subtitleHref == null ? subtitle : titleLinkElement(subtitle, subtitleHref)

    return (
        <div className="flex flex-col py-4">
            <div className="flex justify-between sm:items-baseline sm:gap-x-4">
                <h3 className="font-medium text-lg">{titleElement}</h3>
                <span className="hidden sm:inline sm:font-light sm:text-right">{location}</span>
            </div>
            <div className="flex justify-between sm:items-baseline sm:gap-x-4">
                <h4 className="text-lg">{subtitleElement}</h4>
                <span className="hidden sm:inline sm:font-light sm:text-right">{dateDescription}</span>
            </div>
            <div className="sm:hidden">
                <span className="font-light">{dateDescription}</span>
            </div>
            {bulletList}
        </div>
    )
}

export default function Resume() {
    return (
        <>
            <Head>
                <title>Resume | brucexwu</title>
                <meta name="description" content="Resume for Bruce X. Wu" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen">
                <div className="flex flex-col m-6 p-6 gap-y-4 bg-gray-100 rounded-md">
                    <section>
                        {/* Introduction */}
                        <div className="flex flex-col gap-y-1 sm:flex-row sm:gap-x-2 sm:items-baseline">
                            <h1 className="text-3xl font-bold">Bruce X. Wu</h1>
                            <span className="inline-block font-light">(he/they)</span>
                        </div>
                    </section>
                    <section>
                        {/* Work Experience */}
                        <h2 className="text-2xl font-semibold">Work Experience</h2>
                        <ResumeItem
                            title="NYU University Learning Center"
                            subtitle="Learning Assistant"
                            titleHref="https://www.nyu.edu/students/academic-services/undergraduate-advisement/academic-resource-center/tutoring-and-learning.html"
                            location="New York, NY"
                            dateDescription="Jan. 2021 - Dec. 2022"
                            bullets={[
                                "Instructed 260 students per semester in one-on-one and group sessions in topics such as algorithms, data structures, mathematical logic, and linear algebra",
                                "Developed internal tooling with a team of 4 in an Agile workflow and composed 12 pages of documentation on API usage and further development steps"
                            ]}
                        />
                        <ResumeItem
                            title="Amazon"
                            subtitle="Software Development Engineering Intern"
                            titleHref="https://www.amazon.com/"
                            location="Tempe, AZ"
                            dateDescription="June 2022 - Aug. 2022"
                            bullets={[
                                "Created a web app with a back end written in Java and a front-end written in React using Typescript all served with AWS CloudWatch",
                                "Delivered a 30-minute demo presentation to 20 clients and composed a three-page wiki article detailing the service for future developers"
                            ]}
                        />
                        <ResumeItem
                            title="Bit Project"
                            subtitle="Program Co-Director"
                            titleHref="https://www.bitproject.org/"
                            location="Remote"
                            dateDescription="Feb. 2021 - July 2021"
                            bullets={[
                                "Oversaw a 5-person team through the development of a 9 week-long undergraduate level data science curriculum about applying NumPy, Pandas, and Scikit-learn to digital humanities",
                                "Directed a 5 week-long, 6-person focus group on the curriculum and converted collected feedback into deliverables"
                            ]}
                        />
                    </section>
                    <section>
                        {/* Education */}
                        <h2 className="text-2xl font-semibold">Education</h2>
                        <ResumeItem
                            title="New York University"
                            subtitle="BA in Mathematics and Computer Science, Minor in Data Science"
                            location="New York, NY"
                            dateDescription="Dec. 2022"
                        />
                    </section>
                    <section>
                        {/* Projects */}
                        <h2 className="text-2xl font-semibold">Projects</h2>
                        {/* TODO: eventually these will link to blog posts */}
                        <ResumeItem
                            title="ULC Schedule Maker V2"
                            subtitle="A web app that aggregates tutoring schedules"
                            titleHref="https://ulc-schedule-maker-v2-production.up.railway.app/login"
                        />
                        <ResumeItem
                            title="Our Soundtrack"
                            subtitle="A web app that merges group Spotify listening preferences"
                            titleHref="https://github.com/bruce-x-wu/our-soundtrack"
                        />
                    </section>
                    <section>
                        {/* Skills */}
                        <h2 className="text-2xl font-semibold">Skills</h2>
                        <div className="flex flex-col py-4 gap-y-2">
                            <div className="flex flex-col md:flex-row gap-x-2 items-baseline">
                                <h3 className="font-medium text-lg">Programming:</h3>
                                <span className="font-light">JavaScript, TypeScript, Java, Python, C, C++, Bash</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-x-2 items-baseline">
                                <h3 className="font-medium text-lg">Frameworks and Software:</h3>
                                <span className="font-light">Node.js, React, MongoDB, AWS, NumPy, SciPy, Figma, Git</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-x-2 items-baseline">
                                <h3 className="font-medium text-lg">Foreign Language:</h3>
                                <span className="font-light">Conversant Fluency in Mandarin, Basic Knowledge of French</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}