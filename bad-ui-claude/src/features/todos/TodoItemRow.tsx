import { useState } from 'react'
import type { TodoItem } from './types'

const FAKE_DESCRIPTION_LIMIT = 50

export function TodoItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: TodoItem
  onToggle: () => void
  onEdit: (title: string, description: string) => void
  onDelete: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(item.title)
  const [draftDescription, setDraftDescription] = useState(item.description)
  const [checkboxFlee, setCheckboxFlee] = useState({ x: 30, y: -20 })
  const [likes, setLikes] = useState(0)

  function startEdit() {
    setDraftTitle(item.title)
    setDraftDescription(item.description)
    setIsEditing(true)
  }

  function save() {
    onEdit(draftTitle, draftDescription)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 border-b-2 border-dashed border-orange-400 py-2 last:border-0">
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <textarea
          value={draftDescription}
          onChange={(e) => setDraftDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <p
          className={`text-[10px] font-bold ${
            draftDescription.length > FAKE_DESCRIPTION_LIMIT ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          {/* This limit isn't real. Nothing stops you from saving anyway. */}
          {FAKE_DESCRIPTION_LIMIT - draftDescription.length} characters remaining
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="dodge rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="dodge rounded-md px-3 py-1.5 text-[10px] text-gray-400 hover:bg-gray-100"
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-3 border-b-2 border-dashed border-orange-400 py-2 last:border-0">
      <span className="flex items-center gap-1 opacity-0 transition-opacity duration-1000 delay-700 group-hover:opacity-100">
        <button
          onClick={() => setLikes((l) => l + 1)}
          title="Does nothing for anyone. Purely decorative."
          className="rounded p-1 text-xs text-gray-400 hover:text-pink-500"
          aria-label="Like this task"
        >
          👍 {likes}
        </button>
        <button
          onClick={startEdit}
          title="Good luck catching this button"
          className="dodge rounded p-1 text-xs text-gray-400 hover:text-gray-700"
          aria-label="Edit item"
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          title="No confirmation. You'll just have to trust yourself."
          className="dodge rounded p-1 text-xs text-gray-400 hover:text-red-600"
          aria-label="Delete item"
        >
          ✕
        </button>
      </span>
      <div className="flex-1">
        <p className={item.completed ? 'wobble text-red-600 font-bold uppercase' : 'text-gray-900'}>
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
        )}
      </div>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={onToggle}
        onMouseEnter={() =>
          setCheckboxFlee({ x: (Math.random() - 0.5) * 320, y: (Math.random() - 0.5) * 220 })
        }
        style={{
          accentColor: 'white',
          '--flee-x': `${checkboxFlee.x}px`,
          '--flee-y': `${checkboxFlee.y}px`,
        } as React.CSSProperties}
        className="dodge-hard mt-3 h-4 w-4 rounded border-white text-white opacity-20"
      />
    </div>
  )
}
