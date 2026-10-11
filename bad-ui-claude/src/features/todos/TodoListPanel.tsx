import { useState } from 'react'
import type { TodoList } from './types'
import { TodoItemRow } from './TodoItemRow'
import { EmptyState } from './EmptyState'

function AddItemForm({ onAdd }: { onAdd: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [armed, setArmed] = useState(false)

  function submit() {
    if (!title.trim()) return
    if (!armed) {
      setArmed(true)
      return
    }
    onAdd(title, description)
    setTitle('')
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
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          setArmed(false)
        }}
        placeholder="Add a task..."
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
  if (!list) {
    return (
      <main className="flex-1 overflow-y-auto p-6">
        <EmptyState message={hasNoLists ? 'Create a list to get started' : 'Select a list'} />
      </main>
    )
  }

  const shuffledItems = [...list.items].sort(() => Math.random() - 0.5)

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mb-3 overflow-hidden whitespace-nowrap border-2 border-black bg-yellow-300 py-1 text-xs font-bold">
        <span className="marquee-text">
          ⚠ ITEM ORDER IS NOT GUARANTEED AND NEVER WILL BE ⚠ PLEASE DO NOT RELY ON THIS APP FOR ANYTHING IMPORTANT ⚠
        </span>
      </div>
      <h2 className="mb-4 -skew-x-6 text-sm font-light italic text-gray-400">{list.name}</h2>
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
    </main>
  )
}
