interface ProgressBarProps {
  currentProgress: number
  maxProgress: number
}

export default function ProgressBar (props: ProgressBarProps): JSX.Element {
  const progressPercent = Math.max(0, Math.min(1, props.currentProgress / props.maxProgress)) * 100
  return (
    <>
      <div className='flex h-6 w-full items-center justify-center rounded-xl bg-light-gray'>
        <div className='flex h-4 w-[calc(100%-8px)] flex-row gap-x-0'>
          <div className='h-full rounded-lg bg-dim-gray' style={{ width: `${progressPercent}%` }}></div>
          <div className='h-full' style={{ width: `${100 - progressPercent}%` }}></div>
        </div>
      </div>
    </>
  )
}
