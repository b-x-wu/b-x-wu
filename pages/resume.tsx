import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

function ResumeItem({ title, subtitle, titleHref, subtitleHref, location, dateDescription, bullets, hidden }: ResumeItemProps) {
    if (hidden) {
        return (<></>)
    }

    const bulletList = bullets == null ? <></> :
        <ul className="list-square list-outside pl-4 pt-2 font-light">
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
            <div className="flex flex-wrap justify-between items-baseline gap-x-6">
                <h3 className="font-medium text-lg">{titleElement}</h3>
                <span className="hidden sm:inline sm:font-light sm:text-right">{location}</span>
            </div>
            <div className="flex flex-wrap justify-between items-baseline gap-x-6">
                <h4 className="text-lg">{subtitleElement}</h4>
                <span className="inline font-light text-right">{dateDescription}</span>
            </div>
            {bulletList}
        </div>
    )
}

export default function Resume() {
    const [full, setFull] = useState(false)

    return (
        <>
            <Head>
                <title>Resume | brucexwu</title>
                <meta name="description" content="Bruce X. Wu's Resume" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen">
                <div className="flex flex-col m-6 gap-y-4">
                    <section className="flex justify-between content-center">
                        {/* Controls */}
                        <Link
                            href={"/resume.pdf"}
                            aria-label="Download Resume"
                            target={"_blank"}
                            rel={"noreferrer noopener"}
                            className="transition-all duration-300 w-7 h-7 p-1 bg-gray-200 rounded-md ring-0 hover:ring-2"
                        >
                            <Image
                                src={"https://www.svgrepo.com/show/488905/download-2.svg"}
                                width={100}
                                height={100}
                                className=""
                                alt="Download Resume"
                            />
                        </Link>
                        <div className="justify-self-end pt-2 sm:pt-1 sm:self-center">
                            <label className="flex relative cursor-pointer gap-x-1">
                                <input type="checkbox" checked={full} onChange={(event) => setFull(!full)} className="sr-only peer"></input>
                                <div className="transition-all duration-300 w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                                <div className="transition-opacity duration-300 font-semibold opacity-10 peer-checked:opacity-70">Full</div>
                            </label>
                        </div>
                    </section>
                    <div className="flex flex-col p-6 gap-y-4 bg-gray-100 rounded-md">
                        <section className="flex justify-between">
                            {/* Introduction */}
                            <div className="flex flex-wrap gap-y-1 gap-x-2">
                                <h1 className="text-3xl font-bold">Bruce X. Wu</h1>
                                <span className="inline-block font-light self-end">(he/they)</span>
                            </div>
                        </section>
                        <section>
                            {/* Work Experience */}
                            <h2 className="text-2xl font-semibold">Work Experience</h2>
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
                                title="NYU Courant Undergraduate Math Department"
                                subtitle="Grader"
                                titleHref="https://math.nyu.edu/dynamic/undergrad/ba-cas/activities-research/work-opportunities-math-department/"
                                location="New York, NY"
                                dateDescription="Aug. 2021 - Dec. 2022"
                                bullets={[
                                    "Evaluated 110 assignments per week per semester with detailed feedback in the subjects of calculus, mathematical logic, and statistical analysis",
                                    "Compiled monthly reports on student performance based on aggregated grading data and presented trends in understanding to professors and peers"
                                ]}
                                hidden={!full}
                            />
                            <ResumeItem
                                title="NYU Residential Life and Housing Services"
                                subtitle="Resident Assistant"
                                titleHref="https://www.nyu.edu/students/student-information-and-resources/housing-and-dining/on-campus-living/staff/student-staff/faqs-and-timeline.html"
                                location="New York, NY"
                                dateDescription="Aug. 2021 - Dec. 2022"
                                bullets={[
                                    "Managed a floor of 40 residents with biweekly reports on community development and floor security",
                                    "Planned and hosted two events a month with an average turnout of 10 residents managing a budget of $400 per semester"
                                ]}
                                hidden={!full}
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
                            <ResumeItem
                                title="Huaxia Chinese School at Northampton Community College"
                                subtitle="Mathcounts Teacher"
                                location="Bethlehem, PA"
                                dateDescription="Aug. 2018 - May 2019"
                                titleHref="https://www.hxcs.org/HX_Branches/LehighValley/index.html"
                                bullets={[
                                    "Developed a curriculum of weekly classes preparing middle schoolers for math competitions resulting in 12% of students receiving recognition at loocal events",
                                    "Corresponded with parents through weekly newsletters about class logistics and class materials and through individual communication about student performance"
                                ]}
                                hidden={!full}
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
                                bullets={full ? [
                                    "GPA: 3.99",
                                    "Coursework: Causal Inference, Theory of Probability, Linear and Nonlinear Optimization, Applied Internet Technology, Operating Systems, Artificial Intelligence"
                                ] : undefined}
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
                                bullets={full ? [
                                    "Technologies used: Node.js, Express, React, MongoDB, TypeScript, Tailwind CSS, Google API, Next.js"
                                ] : undefined}
                            />
                            <ResumeItem
                                title="Create React Sandbox"
                                subtitle="A command-line tool to create lightweight React environments"
                                titleHref="https://www.npmjs.com/package/create-react-sandbox"
                                bullets={full ? [
                                    "Technologies used: Node.js, Webpack, Babel, React"
                                ] : undefined}
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
                                    <span className="font-light">Node.js, React, MongoDB, AWS, Docker, NumPy, SciPy, Figma, Git</span>
                                </div>
                                <div className="flex flex-col md:flex-row gap-x-2 items-baseline">
                                    <h3 className="font-medium text-lg">Foreign Language:</h3>
                                    <span className="font-light">Conversant Fluency in Mandarin, Basic Knowledge of French</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}