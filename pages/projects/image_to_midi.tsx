import { useState } from 'react'
import FunctionTextInput from '../../components/image-to-midi/functionTextInput'
import { ImageInput } from '../../components/image-to-midi/imageInput'
import { MidiManager } from '../../components/image-to-midi/midiManager'
import { type Base64String, type ConsoleMessage } from '../../types/image_to_midi'
import { Console } from '../../components/image-to-midi/console'
import Link from 'next/link'

export default function ImageToMidi (): JSX.Element {
  const [image, setImage] = useState<Base64String | undefined>(undefined)
  const [functionText, setFunctionText] = useState<string | undefined>(undefined)
  const [consoleMessage, setConsoleMessage] = useState<ConsoleMessage | undefined>(undefined)

  return (
    <div className='flex flex-col gap-y-12 py-12'>
      <Console consoleMessage={consoleMessage} clearConsoleMessage={() => { setConsoleMessage(undefined) }} />
      <div className='mx-auto flex w-[60%] flex-col gap-y-10'>
        <h1 className='w-full text-center text-4xl font-bold'><span className='text-[#F33]'>Image</span><span className='text-[#3F3]'> to </span><span className='text-[#33F]'>MIDI</span></h1>
        <div className='flex flex-col gap-y-4'>
          <p className='leading-loose'>
            Image to MIDI is a generative computer music tool that takes an image and maps each pixel&apos;s RGBA value and position to a note represented in MIDI. Users can write their own functions
            depending on how they want each pixel to be interpretted. So far, I&apos;ve used this app to make some unique, albeit questionable ambient music, but with some time and creativity,
            other creative applications should be possible.
          </p>
          <p className='leading-loose'>
            To use, upload an image, either through a url or file, whose size is <span className='font-bold'>less than 4 MB</span>. Then, modify the example <span className='bg-dim-gray p-[1px] font-mono'>pixelToMidiNote</span> function
            so that each pixel&apos;s attributes are transformed into your desired MIDI note. Documentation on pixel and MIDI note attributes are given below.
            Return values from the function that are not <span className='bg-dim-gray p-[1px] font-mono'>MidiNote</span>s will be skipped in the conversion. Also note that there is a <span className='font-bold'>5 second time limit</span> for function runtime;
            individual pixel conversions that take longer than this will be skipped.
          </p>
          <p className='leading-loose'>
            After hitting the &ldquo;Convert to Midi&rdquo; button, the program will construct the MIDI file from up to 10,000 randomly sampled pixels which will be available to download
            when conversion is complete.
          </p>
        </div>
      </div>
      <div className='mx-auto flex w-[80%] flex-col gap-y-10'>
        <h2 className='p-2 text-center text-2xl'>Documentation</h2>
        <div className='flex flex-col gap-y-4'>
          <h3 className='w-fit bg-light-gray px-1 font-mono text-xl font-bold text-darkest-blue transition-all duration-300 dark:bg-dim-gray/50 dark:text-glacier'>Pixel</h3>
          <div className='flex flex-col gap-y-4 sm:flex-row sm:gap-x-6'>
            <div className='flex w-full flex-col gap-y-3 sm:w-6/12'>
              <div className='pt-1'>Attributes</div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>red</span><span className='text-xs leading-5'>integer between 0 and 255 inclusive</span></div>
                <p className='leading-loose'>
                  The red value of the pixel.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>green</span><span className='text-xs leading-5'>integer between 0 and 255 inclusive</span></div>
                <p className='leading-loose'>
                  The green value of the pixel.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>blue</span><span className='text-xs leading-5'>integer between 0 and 255 inclusive</span></div>
                <p className='leading-loose'>
                  The blue value of the pixel.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>alpha</span><span className='text-xs leading-5'>integer between 0 and 255 inclusive</span></div>
                <p className='leading-loose'>
                  The alpha value of the pixel, or the pixel&apos;s level of opacity. 0 is completely transparent, and 255 is completely opaque.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>x</span><span className='text-xs leading-5'>non-negative integer</span></div>
                <p className='leading-loose'>
                  The zero-indexed x coordinate of the pixel. Values range from zero to the pixel width of the image minus one with zero representing a pixel on the left border and the width minus one representing a pixel on the right.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>y</span><span className='text-xs leading-5'>non-negative integer</span></div>
                <p className='leading-loose'>
                  The zero-indexed y coordinate of the pixel. Values range from zero to the pixel height of the image minus one with zero representing a pixel on the top border and the height minus one representing a pixel on the bottom.
                </p>
              </div>
            </div>
            <div className='flex h-fit w-full flex-col gap-y-0 bg-lighter-blue/90 transition-all duration-300 dark:bg-darkest-blue/90 sm:sticky sm:top-24 sm:max-h-72 sm:w-6/12'>
              <div className='w-full bg-light-gray py-2 px-3 text-darkest-blue transition-all duration-300 dark:bg-dim-gray/50 dark:text-glacier'>
                Example
              </div>
              <div className='w-full whitespace-pre-wrap p-3 font-mono text-sm text-darkest-blue transition-all duration-300 dark:text-glacier'>
{`{
  "red": 255,
  "green": 0,
  "blue": 125,
  "alpha": 200,
  "x": 0,
  "y": 100
}`}
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-y-4'>
          <h3 className='w-fit bg-light-gray px-1 font-mono text-xl font-bold text-darkest-blue transition-all duration-300 dark:bg-dim-gray/50 dark:text-glacier'>MidiNote</h3>
          <div className='flex flex-col gap-y-4 sm:flex-row sm:gap-x-6'>
            <div className='flex w-full flex-col gap-y-3 sm:w-6/12'>
              <div className='pt-1'>Attributes</div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>start</span><span className='text-xs leading-5'>non-negative number</span></div>
                <p className='leading-loose'>
                  The start time of the note in seconds. When less than zero, the note will not be present in the final MIDI file.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>duration</span><span className='text-xs leading-5'>positive number</span></div>
                <p className='leading-loose'>
                  The duration of the note in seconds. When non-positive, the note will not be present in the final MIDI file.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>pitch</span><span className='text-xs leading-5'>integer between 0 and 127 inclusive</span></div>
                <p className='leading-loose'>
                  The numeric pitch value of the note. Zero corresponds to C-1 and 127 corresponds to G9. A complete guide to corresponding notes can be found <Link className='font-bold hover:underline' href="https://studiocode.dev/resources/midi-middle-c/" target='_blank' rel='noreferrer'>here</Link>. Values below zero will be rounded up to zero, and values above 127 will be rounded down to 127.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>velocity</span><span className='text-xs leading-5'>number between 0 and 1 inclusive</span></div>
                <p className='leading-loose'>
                  The velocity of the note, normalized to be between zero and one. Typically, velocity corresponds to how forcefully a note is played with zero representing with no force and one representing maximum force.
                </p>
              </div>
              <hr />
              <div className='flex flex-col text-sm'>
                <div className='flex flex-row gap-x-2 py-2'><span className='font-mono font-semibold'>track</span><span className='text-xs leading-5'>non-negative integer (optional)</span></div>
                <p className='leading-loose'>
                  The zero indexed track number to place the note on. Defaults to zero, the first track.
                </p>
              </div>
            </div>
            <div className='flex h-fit w-full flex-col gap-y-0 bg-lighter-blue/90 transition-all duration-300 dark:bg-darkest-blue/90 sm:sticky sm:top-24 sm:max-h-72 sm:w-6/12'>
              <div className='w-full bg-light-gray py-2 px-3 text-darkest-blue transition-all duration-300 dark:bg-dim-gray/50 dark:text-glacier'>
                Example
              </div>
              <div className='w-full whitespace-pre-wrap p-3 font-mono text-sm text-darkest-blue transition-all duration-300 dark:text-glacier'>
{`{
  "start": 0,
  "duration": 1,
  "pitch": 70,
  "velocity": 1,
  "track": 0
}`}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col space-y-8 px-12'>
        <div className='flex flex-col space-y-12 lg:flex-row lg:space-x-8 lg:space-y-0'>
          <FunctionTextInput setFunctionText={setFunctionText} />
          <ImageInput setImage={setImage} setConsoleMessage={setConsoleMessage} />
        </div>
        {image == null || functionText == null ? <></> : <MidiManager image={image} functionText={functionText} setConsoleMessage={setConsoleMessage} />}
      </div>
    </div>
  )
}
