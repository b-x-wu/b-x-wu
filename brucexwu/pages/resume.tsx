import Head from "next/head";

interface ResumeItemProps {
    title: string
    subtitle: string
    location?: string
    dateDescription?: string
    bullets?: readonly string[]
}

function ResumeItem({ title, subtitle, location, dateDescription, bullets }: ResumeItemProps) {
    const bulletList = bullets == null ? <></> :
        <ul className="list-[square] list-outside pl-4 pt-1 font-light">
            {bullets.map((bullet, idx) => 
                <li key={idx}>
                    {bullet}
                </li>
            )}
        </ul>
    
    return (
        <div className="flex flex-col py-4 group">
            <div className="flex justify-between">
                <h3 className="font-medium text-lg">{title}</h3>
                <span className="hidden sm:inline sm:font-light">{location}</span>
            </div>
            <div className="flex justify-between">
                <h4 className="text-lg">{subtitle}</h4>
                <span className="hidden sm:inline sm:font-light">{dateDescription}</span>
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
                <div className="flex flex-col m-6 p-6 gap-y-4 bg-gray-100">
                    <section>
                        {/* Introduction */}
                        <div className="flex flex-col gap-y-1 sm:flex-row sm:gap-x-1 sm:items-baseline">
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
                            location="Tempe, AZ"
                            dateDescription="June 2022 - Aug. 2022"
                            bullets={[
                                "Created a web app with a back end written in Java and a front-end written in React using Typescript all served with AWS CloudWatch",
                                "Delivered a 30-minute demo presentation to 20 clients and composed a three-page wiki article detailing the service for future developers"
                            ]}
                        />
                    </section>
                    <section>
                        {/* Skills */}
                        <h2 className="text-2xl font-semibold">Skills</h2>
                    </section>
                    <section>
                        {/* Education */}
                        <h2 className="text-2xl font-semibold">Education</h2>
                    </section>
                    <section>
                        {/* Projects */}
                        <h2 className="text-2xl font-semibold">Projects</h2>
                    </section>
                </div>
            </main>
        </>
    )
}