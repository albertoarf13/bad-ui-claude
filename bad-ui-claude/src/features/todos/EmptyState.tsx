export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-yellow-300 blink">
      {message}
    </div>
  )
}
