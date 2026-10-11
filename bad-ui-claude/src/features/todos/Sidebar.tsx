import { useEffect, useState } from 'react'
import type { TodoList } from './types'

function DeleteCaptchaModal({
  listName,
  onConfirm,
  onCancel,
}: {
  listName: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    // The slider slowly slides back down, because trust is for suckers.
    const id = setInterval(() => {
      setValue((v) => (v >= 100 ? 100 : Math.max(0, v - 4)))
    }, 200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (value >= 100) onConfirm()
  }, [value, onConfirm])

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/80">
      <div className="w-80 rounded-md border-4 border-black bg-white p-6 text-center shadow-2xl">
        <p className="mb-1 text-sm font-bold">Delete "{listName}"?</p>
        <p className="mb-4 text-xs text-gray-500">Drag all the way to the right to confirm. Don't let go.</p>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full"
        />
        <button
          onClick={onCancel}
          className="dodge mt-4 w-full rounded-md bg-gray-200 py-2 text-sm font-bold text-gray-700"
        >
          Never mind
        </button>
      </div>
    </div>
  )
}

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
        className="w-full rounded-md border-4 border-dashed border-pink-500 px-3 py-2 text-sm"
      />
    )
  }

  return (
    <div
      onClick={onSelect}
      style={{ transform: `rotate(${(list.name.length % 5) - 2}deg)` }}
      className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer ${
        isSelected ? 'bg-yellow-100 text-gray-700 font-medium' : 'text-gray-700 hover:bg-yellow-50'
      }`}
    >
      <span className="truncate">{list.name}</span>
      <span className="flex items-center gap-1 opacity-0 transition-opacity duration-1000 delay-700 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            startRename()
          }}
          className="dodge rounded p-1 text-[9px] text-gray-300 hover:text-gray-500"
          aria-label="Rename list"
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="dodge rounded p-1 text-lg font-bold text-red-600 hover:text-red-700"
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
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null)

  function commitAdd() {
    if (newName.trim()) onAdd(newName)
    setNewName('')
    setIsAdding(false)
  }

  return (
    <aside className="breathe flex flex-shrink-0 flex-col border-l-8 border-yellow-300 bg-fuchsia-700 p-4">
      <h1 className="wobble rainbow-text mb-4 text-3xl font-black uppercase tracking-widest font-serif drop-shadow-[2px_2px_0_black]">My Lists</h1>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {lists.map((list) => (
          <SidebarRow
            key={list.id}
            list={list}
            isSelected={list.id === selectedListId}
            onSelect={() => onSelect(list.id)}
            onRename={(name) => onRename(list.id, name)}
            onDelete={() => setPendingDelete({ id: list.id, name: list.name })}
          />
        ))}
      </div>
      {pendingDelete && (
        <DeleteCaptchaModal
          listName={pendingDelete.name}
          onConfirm={() => {
            onDelete(pendingDelete.id)
            setPendingDelete(null)
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
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
          className="mt-2 w-full rounded-md border-4 border-dashed border-pink-500 px-3 py-2 text-sm"
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="dodge mt-2 rounded-md px-3 py-2 text-left text-[8px] text-indigo-300 opacity-40 hover:bg-indigo-50"
        >
          + New list
        </button>
      )}
    </aside>
  )
}
