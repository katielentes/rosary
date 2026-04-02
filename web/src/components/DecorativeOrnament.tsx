export function DecorativeOrnament({ subtle }: { subtle?: boolean }) {
  return (
    <p
      className={`ornament ${subtle ? 'ornament--subtle' : ''}`}
      aria-hidden="true"
    >
      ˚₊‧꒰ა ♱ ໒꒱ ‧₊˚
    </p>
  )
}
