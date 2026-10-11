import { useState } from 'react'
import type { TodoItem } from './types'

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
      <div className="flex flex-col gap-2 border-b border-gray-100 py-2 last:border-0">
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          value={draftDescription}
          onChange={(e) => setDraftDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-3 border-b border-gray-100 py-2 last:border-0">
      <input
        type="checkbox"
        checked={item.completed}
        onChange={onToggle}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600"
      />
      <div className="flex-1">
        <p className={item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}>
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
        )}
      </div>
      <span className="flex gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={startEdit}
          className="rounded p-1 text-gray-400 hover:text-gray-700"
          aria-label="Edit item"
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          className="rounded p-1 text-gray-400 hover:text-red-600"
          aria-label="Delete item"
        >
          ✕
        </button>
      </span>
    </div>
  )
}
