interface ProgressBarProps {
  currentProgress: number
  maxProgress: number
}

export default function ProgressBar (props: ProgressBarProps): JSX.Element {
  const progressPercent = Math.max(0, Math.min(1, props.currentProgress / props.maxProgress)) * 100
  return (
    <div className="flex flex-row gap-x-8">
      <div className='flex h-6 w-full items-center justify-center bg-lighter-blue transition-all duration-300 dark:bg-darkest-blue'>
        <div className='flex h-4 w-[calc(100%-8px)] flex-row gap-x-0'>
          <div className='h-full bg-darkest-blue opacity-70 transition-colors duration-300 dark:bg-glacier' style={{ width: `${progressPercent}%` }}></div>
          <div className='h-full' style={{ width: `${100 - progressPercent}%` }}></div>
        </div>
      </div>
      <div className="w-8 text-right">{Math.round(progressPercent)}%</div>
    </div>
  )
}
