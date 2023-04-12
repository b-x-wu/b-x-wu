import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import ResumeItem from '../components/resumeItem'
import { Toggle } from '../components/toggle'

export default function Resume (): JSX.Element {
  const [full, setFull] = useState(false)

  return (
        <>
            <Head>
                <title>Resume | brucexwu</title>
                <meta name="description" content="Bruce X. Wu's Resume" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="mx-auto max-w-6xl pb-36">
                <div className="m-6 flex flex-col gap-y-4">
                    <section className="flex content-center justify-between">
                        {/* Controls */}
                        <Link
                            href="/resume.pdf"
                            aria-label="Download Resume"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="h-7 w-7 rounded-md bg-lighter-blue p-1 ring-0 transition-all duration-300 hover:ring-2"
                        >
                            <Image
                                src="https://www.svgrepo.com/show/488905/download-2.svg"
                                width={100}
                                height={100}
                                className=""
                                alt="Download Resume"
                            />
                        </Link>
                        <div className="justify-self-end pt-2 sm:self-center sm:pt-1">
                            <Toggle
                                toggleCondition={full}
                                handleToggle={(event) => { setFull(!full) }}
                                untoggledSymbol={{ type: 'text', text: 'Condensed' }}
                                toggledSymbol={{ type: 'text', text: 'Full' }}
                            />
                        </div>
                    </section>
                    <div className="flex flex-col gap-y-4 rounded-md bg-lighter-blue p-6">
                        <section className="flex justify-between">
                            {/* Introduction */}
                            <div className="flex flex-wrap gap-y-1 gap-x-2">
                                <h1 className="text-3xl font-bold">Bruce X. Wu</h1>
                                <span className="inline-block self-end font-light">(he/they)</span>
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
                                  'Created a web app with a back end written in Java and a front-end written in React using Typescript all served with AWS CloudWatch',
                                  'Delivered a 30-minute demo presentation to 20 clients and composed a three-page wiki article detailing the service for future developers'
                                ]}
                            />
                            <ResumeItem
                                title="NYU University Learning Center"
                                subtitle="Learning Assistant"
                                titleHref="https://www.nyu.edu/students/academic-services/undergraduate-advisement/academic-resource-center/tutoring-and-learning.html"
                                location="New York, NY"
                                dateDescription="Jan. 2021 - Dec. 2022"
                                bullets={[
                                  'Instructed 260 students per semester in one-on-one and group sessions in topics such as algorithms, data structures, mathematical logic, and linear algebra',
                                  'Developed internal tooling with a team of 4 in an Agile workflow and composed 12 pages of documentation on API usage and further development steps'
                                ]}
                            />
                            <ResumeItem
                                title="NYU Courant Undergraduate Math Department"
                                subtitle="Grader"
                                titleHref="https://math.nyu.edu/dynamic/undergrad/ba-cas/activities-research/work-opportunities-math-department/"
                                location="New York, NY"
                                dateDescription="Aug. 2021 - Dec. 2022"
                                bullets={[
                                  'Evaluated 110 assignments per week per semester with detailed feedback in the subjects of calculus, mathematical logic, and statistical analysis',
                                  'Compiled monthly reports on student performance based on aggregated grading data and presented trends in understanding to professors and peers'
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
                                  'Managed a floor of 40 residents with biweekly reports on community development and floor security',
                                  'Planned and hosted two events a month with an average turnout of 10 residents managing a budget of $400 per semester'
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
                                  'Oversaw a 5-person team through the development of a 9 week-long undergraduate level data science curriculum about applying NumPy, Pandas, and Scikit-learn to digital humanities',
                                  'Directed a 5 week-long, 6-person focus group on the curriculum and converted collected feedback into deliverables'
                                ]}
                            />
                            <ResumeItem
                                title="Huaxia Chinese School at Northampton Community College"
                                subtitle="Mathcounts Teacher"
                                location="Bethlehem, PA"
                                dateDescription="Aug. 2018 - May 2019"
                                titleHref="https://www.hxcs.org/HX_Branches/LehighValley/index.html"
                                bullets={[
                                  'Developed a curriculum of weekly classes preparing middle schoolers for math competitions resulting in 12% of students receiving recognition at loocal events',
                                  'Corresponded with parents through weekly newsletters about class logistics and class materials and through individual communication about student performance'
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
                                bullets={full
                                  ? [
                                      'GPA: 3.99',
                                      'Coursework: Causal Inference, Theory of Probability, Linear and Nonlinear Optimization, Applied Internet Technology, Operating Systems, Artificial Intelligence'
                                    ]
                                  : undefined}
                            />
                        </section>
                        <section>
                            {/* Projects */}
                            <h2 className="text-2xl font-semibold">Projects</h2>
                            <ResumeItem
                                title="brucexwu.com"
                                subtitle="This website"
                                titleHref='/'
                                bullets={['Technologies used: Next.js Express, TypeScript, React, Tailwind CSS']}
                                hidden={!full}
                            />
                            <ResumeItem
                                title="ULC Schedule Maker V2"
                                subtitle="A web app that aggregates tutoring schedules"
                                titleHref='https://github.com/ulcnyu/ulc-schedule-maker-v2/tree/polish'
                                bullets={full
                                  ? [
                                      'Technologies used: Node.js, Express, React, MongoDB, TypeScript, Tailwind CSS, Google API, Next.js'
                                    ]
                                  : undefined}
                            />
                            <ResumeItem
                                title="Twit-Scraper"
                                subtitle="A free, open-source Twitter API alternative"
                                titleHref='https://github.com/bruce-x-wu/twit-scraper'
                                bullets={['Technologies used: Node.js Express, TypeScript, Pupetteer, Jest, GitHub Actions, Railway, Nixpacks']}
                                hidden={!full}
                            />
                            <ResumeItem
                                title="Create React Sandbox"
                                subtitle="A command-line tool to create lightweight React environments"
                                titleHref="https://www.npmjs.com/package/create-react-sandbox"
                                bullets={full
                                  ? [
                                      'Technologies used: Node.js, Webpack, Babel, React'
                                    ]
                                  : undefined}
                            />
                            <ResumeItem
                                title="Palette Hacker"
                                subtitle="A Chrome extension for swapping website color palettes"
                                titleHref='https://github.com/bruce-x-wu/twit-scraper'
                                bullets={['Technologies used: Chrome Content Scripts, MongoDB, Express']}
                                hidden={!full}
                            />
                            <ResumeItem
                                title="Web Effect Rack"
                                subtitle="A web-based Pure Data effect interface"
                                titleHref='https://github.com/bruce-x-wu/twit-scraper'
                                bullets={['Technologies used: Node.js, Express, Pure Data']}
                                hidden={!full}
                            />
                        </section>
                        <section>
                            {/* Skills */}
                            <h2 className="text-2xl font-semibold">Skills</h2>
                            <div className="flex flex-col gap-y-2 py-4">
                                <div className="flex flex-col items-baseline gap-x-2 md:flex-row">
                                    <h3 className="text-lg font-medium">Programming:</h3>
                                    <span className="font-light">JavaScript, TypeScript, Java, Python, C, C++, Bash</span>
                                </div>
                                <div className="flex flex-col items-baseline gap-x-2 md:flex-row">
                                    <h3 className="text-lg font-medium">Frameworks and Software:</h3>
                                    <span className="font-light">Node.js, React, MongoDB, AWS, Docker, NumPy, SciPy, Figma, Git</span>
                                </div>
                                <div className="flex flex-col items-baseline gap-x-2 md:flex-row">
                                    <h3 className="text-lg font-medium">Foreign Language:</h3>
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
