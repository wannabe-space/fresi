import { cn } from '~/lib/ui'

export function BgVideo({
  className,
  ...props
}: React.ComponentProps<'video'>) {
  return (
    <video
      muted
      autoPlay
      poster="/images/poster.jpg"
      loop
      className={cn(
        '[filter:hue-rotate(185deg)_brightness(0.3)] dark:[filter:hue-rotate(185deg)_brightness(0.2)] bg-green object-cover object-top',
        className,
      )}
      {...props}
    >
      <source src="/bg.mkv" type="video/mp4" />
    </video>
  )
}
