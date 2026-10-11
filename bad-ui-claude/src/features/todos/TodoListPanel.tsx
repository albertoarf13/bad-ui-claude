import { useEffect, useRef, useState } from 'react'
import type { TodoList } from './types'
import { TodoItemRow } from './TodoItemRow'
import { EmptyState } from './EmptyState'

function NagBanner() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (visible) return
    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [visible])

  if (!visible) return null

  return (
    <div className="dodge fixed bottom-4 right-4 z-50 w-56 rounded-md border-4 border-black bg-lime-300 p-3 text-xs font-bold shadow-xl">
      🍪 This site uses cookies. (It doesn't. We just like asking.)
      <button
        onClick={() => setVisible(false)}
        className="dodge mt-2 block w-full rounded bg-black py-1 text-white"
      >
        Whatever
      </button>
    </div>
  )
}

function AdInterstitial({ onSkip }: { onSkip: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  return (
    <div className="fixed inset-0 z-[1006] flex items-center justify-center bg-black">
      <div className="w-96 rounded-md border-4 border-yellow-400 bg-gradient-to-br from-indigo-700 to-purple-800 p-8 text-center text-white shadow-2xl">
        <p className="mb-2 text-xs uppercase tracking-widest text-yellow-300">Advertisement</p>
        <p className="wobble mb-4 text-2xl font-black">BUY NOW!! 70% OFF!!</p>
        <p className="mb-6 text-sm text-indigo-200">You added 3 whole to-do items. Here's an ad for that.</p>
        {secondsLeft > 0 ? (
          <p className="text-xs text-gray-300">Skip in {secondsLeft}...</p>
        ) : (
          <button
            onClick={onSkip}
            className="dodge rounded-md bg-white px-4 py-2 text-sm font-bold text-gray-900"
          >
            Skip Ad ✕
          </button>
        )}
      </div>
    </div>
  )
}

function FakeViewerBadge() {
  const [count, setCount] = useState(() => 1 + Math.floor(Math.random() * 4))

  useEffect(() => {
    const id = setInterval(() => setCount(1 + Math.floor(Math.random() * 6)), 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <p className="mb-2 text-[10px] font-bold uppercase text-gray-400">
      👀 {count} {count === 1 ? 'person' : 'people'} viewing this list right now
    </p>
  )
}

function ScrollToBottomButton({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <button
      onClick={() =>
        targetRef.current?.scrollTo({ top: targetRef.current.scrollHeight, behavior: 'smooth' })
      }
      className="dodge fixed bottom-4 left-4 z-40 rounded-full border-2 border-black bg-white px-3 py-2 text-xs font-bold shadow-lg"
    >
      ↑ Scroll to top
    </button>
  )
}

const CONFETTI_EMOJI = ['🎉', '✨', '🎊', '⭐', '💥']

type ConfettiPiece = { id: number; left: number; delay: number; duration: number; emoji: string }

function generateConfettiPieces(): ConfettiPiece[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    emoji: CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)],
  }))
}

function ConfettiBurst({ pieces }: { pieces: ConfettiPiece[] }) {
  if (pieces.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[1005] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece text-2xl"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}

const ROGUE_AUTOCORRECT_WORDS = ['banana', 'SKIBIDI', 'potato', 'mungo', 'quack', 'spaghetti']

function AddItemForm({ onAdd }: { onAdd: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('')
  const [displayTitle, setDisplayTitle] = useState('')
  const [description, setDescription] = useState('')
  const [armed, setArmed] = useState(false)

  function handleTitleChange(value: string) {
    setArmed(false)
    // "Autocorrect": occasionally overwrites what you typed. Not a bug.
    if (value.length > title.length && Math.random() < 0.12) {
      const rogue = ROGUE_AUTOCORRECT_WORDS[Math.floor(Math.random() * ROGUE_AUTOCORRECT_WORDS.length)]
      setTitle(rogue)
      setTimeout(() => setDisplayTitle(rogue), 400)
      return
    }
    setTitle(value)
    setTimeout(() => setDisplayTitle(value), 400)
  }

  function submit() {
    if (!title.trim()) return
    if (!armed) {
      setArmed(true)
      return
    }
    onAdd(title, description)
    setTitle('')
    setDisplayTitle('')
    setDescription('')
    setArmed(false)
  }

  return (
    <div className="mb-4 flex gap-2">
      <input
        value={description}
        onChange={(e) => {
          setDescription(e.target.value)
          setArmed(false)
        }}
        placeholder="Description (optional)"
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        value={displayTitle}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Add a task..."
        title="What you type appears ~400ms later. This is intentional."
        className="w-16 rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <button
        onClick={submit}
        className={`dodge rounded-md border border-gray-200 px-3 py-2 text-sm ${
          armed ? 'bg-red-600 text-white' : 'bg-white text-white hover:bg-indigo-600 hover:text-white'
        }`}
      >
        {armed ? 'Really?!' : 'Add'}
      </button>
    </div>
  )
}

export function TodoListPanel({
  list,
  hasNoLists,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
}: {
  list: TodoList | undefined
  hasNoLists: boolean
  onAddItem: (title: string, description: string) => void
  onToggleItem: (itemId: string) => void
  onEditItem: (itemId: string, title: string, description: string) => void
  onDeleteItem: (itemId: string) => void
}) {
  const [switching, setSwitching] = useState(false)
  const [undoToast, setUndoToast] = useState<string | null>(null)
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])
  const [itemsAddedCount, setItemsAddedCount] = useState(0)
  const [showAd, setShowAd] = useState(false)
  const lastListId = useRef<string | undefined>(undefined)
  const mainRef = useRef<HTMLDivElement>(null)

  function handleAddItem(title: string, description: string) {
    onAddItem(title, description)
    setConfettiPieces(generateConfettiPieces())
    setTimeout(() => setConfettiPieces([]), 2500)
    const next = itemsAddedCount + 1
    setItemsAddedCount(next)
    if (next % 3 === 0) setShowAd(true)
  }

  function handleDeleteItem(itemId: string, title: string) {
    onDeleteItem(itemId)
    setUndoToast(title)
    setTimeout(() => setUndoToast((current) => (current === title ? null : current)), 4000)
  }

  function handleUndoClick() {
    // "Undo" doesn't restore the deleted item. It never did. Instead it
    // just toggles a random remaining item, because closure is a myth.
    if (list && list.items.length > 0) {
      const randomItem = list.items[Math.floor(Math.random() * list.items.length)]
      onToggleItem(randomItem.id)
    }
    setUndoToast(null)
  }

  useEffect(() => {
    const prev = lastListId.current
    lastListId.current = list?.id
    if (prev !== undefined && prev !== list?.id) {
      setSwitching(true)
      const t = setTimeout(() => setSwitching(false), 650)
      return () => clearTimeout(t)
    }
  }, [list?.id])

  function reverseScroll(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    if (Math.random() < 0.08) {
      e.currentTarget.scrollTop = 0
      return
    }
    e.currentTarget.scrollTop -= e.deltaY
  }

  if (!list || switching) {
    return (
      <main ref={mainRef} onWheel={reverseScroll} className="flex-1 overflow-y-auto p-6">
        <EmptyState
          message={switching ? 'Loading… (this is fake, there was no reason to wait)' : hasNoLists ? 'Create a list to get started' : 'Select a list'}
        />
        <NagBanner />
      </main>
    )
  }

  const shuffledItems = [...list.items].sort(() => Math.random() - 0.5)

  return (
    <main ref={mainRef} onWheel={reverseScroll} className="flex-1 overflow-y-auto p-6">
      <div className="mb-3 overflow-hidden whitespace-nowrap border-2 border-black bg-yellow-300 py-1 text-xs font-bold">
        <span className="marquee-text">
          ⚠ ITEM ORDER IS NOT GUARANTEED AND NEVER WILL BE ⚠ PLEASE DO NOT RELY ON THIS APP FOR ANYTHING IMPORTANT ⚠
        </span>
      </div>
      <h2 className="glitch mb-4 -skew-x-6 text-sm font-light italic text-gray-400">{list.name}</h2>
      <FakeViewerBadge />
      <AddItemForm onAdd={handleAddItem} />
      {list.items.length === 0 ? (
        <EmptyState message="No items yet — add your first one above" />
      ) : (
        <div>
          {shuffledItems.map((item) => (
            <TodoItemRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onEdit={(title, description) => onEditItem(item.id, title, description)}
              onDelete={() => handleDeleteItem(item.id, item.title)}
            />
          ))}
        </div>
      )}
      <NagBanner />
      <ScrollToBottomButton targetRef={mainRef} />
      <ConfettiBurst pieces={confettiPieces} />
      {showAd && <AdInterstitial onSkip={() => setShowAd(false)} />}
      {undoToast && (
        <div className="dodge fixed bottom-20 right-4 z-50 flex items-center gap-3 rounded-md border-4 border-black bg-gray-900 px-4 py-3 text-xs font-bold text-white shadow-2xl">
          <span>"{undoToast}" deleted.</span>
          <button onClick={handleUndoClick} className="rounded bg-white px-2 py-1 text-gray-900">
            Undo
          </button>
        </div>
      )}
    </main>
  )
}
