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

function AddItemForm({ onAdd }: { onAdd: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('')
  const [displayTitle, setDisplayTitle] = useState('')
  const [description, setDescription] = useState('')
  const [armed, setArmed] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    setArmed(false)
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
  const lastListId = useRef<string | undefined>(undefined)
  const mainRef = useRef<HTMLDivElement>(null)

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
      <AddItemForm onAdd={onAddItem} />
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
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </div>
      )}
      <NagBanner />
    </main>
  )
}
