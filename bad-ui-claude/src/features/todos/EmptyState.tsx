import { useEffect, useState } from 'react'

const SNARKY_SUBTITLES = [
  'There\'s nothing here. There was never anything here.',
  'Still empty. Still your fault.',
  'The void stares back.',
  "Add something. Or don't. We don't care.",
  'This space intentionally left empty, mockingly.',
]

export function EmptyState({ message }: { message: string }) {
  const [subtitle, setSubtitle] = useState(
    () => SNARKY_SUBTITLES[Math.floor(Math.random() * SNARKY_SUBTITLES.length)],
  )
  const [jitter, setJitter] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const id = setInterval(() => {
      setSubtitle(SNARKY_SUBTITLES[Math.floor(Math.random() * SNARKY_SUBTITLES.length)])
      setJitter({ x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 20 })
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-2 text-center transition-transform duration-700"
      style={{ transform: `translate(${jitter.x}px, ${jitter.y}px)` }}
    >
      <p className="blink text-xs uppercase tracking-widest text-yellow-300">{message}</p>
      <p className="text-[10px] text-gray-400">{subtitle}</p>
    </div>
  )
}
