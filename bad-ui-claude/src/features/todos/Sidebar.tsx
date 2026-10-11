import { useState } from 'react'
import type { TodoList } from './types'

function SidebarRow({
  list,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: {
  list: TodoList
  isSelected: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onDelete: () => void
}) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState(list.name)

  function startRename() {
    setDraftName(list.name)
    setIsRenaming(true)
  }

  function commitRename() {
    onRename(draftName)
    setIsRenaming(false)
  }

  if (isRenaming) {
    return (
      <input
        autoFocus
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commitRename()
          if (e.key === 'Escape') setIsRenaming(false)
        }}
        className="w-full rounded-md border border-indigo-400 px-3 py-2 text-sm focus:outline-none"
      />
    )
  }

  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer ${
        isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="truncate">{list.name}</span>
      <span className="flex gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            startRename()
          }}
          className="rounded p-1 text-gray-400 hover:text-gray-700"
          aria-label="Rename list"
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="rounded p-1 text-gray-400 hover:text-red-600"
          aria-label="Delete list"
        >
          ✕
        </button>
      </span>
    </div>
  )
}

export function Sidebar({
  lists,
  selectedListId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}: {
  lists: TodoList[]
  selectedListId: string | null
  onSelect: (id: string) => void
  onAdd: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')

  function commitAdd() {
    if (newName.trim()) onAdd(newName)
    setNewName('')
    setIsAdding(false)
  }

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white p-4">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">My Lists</h1>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {lists.map((list) => (
          <SidebarRow
            key={list.id}
            list={list}
            isSelected={list.id === selectedListId}
            onSelect={() => onSelect(list.id)}
            onRename={(name) => onRename(list.id, name)}
            onDelete={() => {
              if (window.confirm(`Delete "${list.name}" and all its items?`)) {
                onDelete(list.id)
              }
            }}
          />
        ))}
      </div>
      {isAdding ? (
        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={commitAdd}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitAdd()
            if (e.key === 'Escape') {
              setNewName('')
              setIsAdding(false)
            }
          }}
          placeholder="List name"
          className="mt-2 w-full rounded-md border border-indigo-400 px-3 py-2 text-sm focus:outline-none"
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-2 rounded-md px-3 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50"
        >
          + New list
        </button>
      )}
    </aside>
  )
}
