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

const TOS_SECTIONS = [
  'Section 1: By creating a list, you agree that this to-do app is allowed to be this annoying.',
  'Section 2: You will not blame us for any scrambled list names.',
  'Section 3: Checkboxes reserve the right to flee from your cursor at any time.',
  'Section 4: "Undo" is a figure of speech, not a feature.',
  'Section 5: Item order was never, and will never be, guaranteed.',
  'Section 6: Advertisements may appear between your to-do items. This is normal.',
  'Section 7: Your free trial expires whenever we feel like it.',
  'Section 8: The wizard mascot is not a licensed productivity consultant.',
  'Section 9: Clicking the wrong list is a feature, not a bug.',
  'Section 10: Nothing in this app is ever actually saved. We just say "Saving…" forever.',
  'Section 11: Right-clicking is a privilege this app has revoked.',
  'Section 12: Escape does not mean escape.',
  'Section 13: You cannot skip this. You must scroll. All the way.',
  'Section 14: You have reached the bottom. The button below is now real.',
]

function TermsOfServiceWall({ onAgree }: { onAgree: () => void }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
      setScrolledToBottom(true)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90">
      <div className="flex max-h-[80vh] w-96 flex-col rounded-md border-4 border-black bg-white p-6 shadow-2xl">
        <p className="mb-2 text-sm font-bold">Terms of Service</p>
        <div
          onScroll={handleScroll}
          className="mb-4 flex-1 overflow-y-auto border border-gray-300 p-3 text-[10px] text-gray-500"
        >
          {TOS_SECTIONS.map((section) => (
            <p key={section} className="mb-3">
              {section}
            </p>
          ))}
        </div>
        <button
          disabled={!scrolledToBottom}
          onClick={onAgree}
          className={`w-full rounded-md py-2 text-sm font-bold ${
            scrolledToBottom ? 'bg-indigo-600 text-white' : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
        >
          I Agree
        </button>
      </div>
    </div>
  )
}

function scrambleSlightly(name: string) {
  // Renaming is a privilege, not a right. One random typo, every time.
  if (name.length < 2) return name
  const chars = name.split('')
  const i = Math.floor(Math.random() * (chars.length - 1))
  ;[chars[i], chars[i + 1]] = [chars[i + 1], chars[i]]
  return chars.join('')
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
    onRename(scrambleSlightly(draftName))
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
  const [showTos, setShowTos] = useState(false)
  const [tosAccepted, setTosAccepted] = useState(false)
  const [listToast, setListToast] = useState<{ name: string; phase: 'confirm' | 'restoring' | 'kidding' } | null>(
    null,
  )
  const [listArmed, setListArmed] = useState(false)

  function commitAdd() {
    if (!newName.trim()) return
    if (!listArmed) {
      setListArmed(true)
      return
    }
    onAdd(newName)
    setNewName('')
    setIsAdding(false)
    setListArmed(false)
  }

  function handleNewListClick() {
    if (tosAccepted) {
      setIsAdding(true)
    } else {
      setShowTos(true)
    }
  }

  function handleConfirmDeleteList() {
    if (!pendingDelete) return
    onDelete(pendingDelete.id)
    setListToast({ name: pendingDelete.name, phase: 'confirm' })
    setPendingDelete(null)
    setTimeout(() => {
      setListToast((t) => (t?.phase === 'confirm' ? null : t))
    }, 5000)
  }

  function handleUndoListClick() {
    // The undo button restores nothing. It just makes you wait to find out.
    setListToast((t) => (t ? { ...t, phase: 'restoring' } : t))
    setTimeout(() => {
      setListToast((t) => (t ? { ...t, phase: 'kidding' } : t))
      setTimeout(() => setListToast(null), 2500)
    }, 1500)
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
            onSelect={() => {
              // One in five clicks lands on a different list entirely. Keeps you alert.
              if (lists.length > 1 && Math.random() < 0.2) {
                const others = lists.filter((l) => l.id !== list.id)
                onSelect(others[Math.floor(Math.random() * others.length)].id)
              } else {
                onSelect(list.id)
              }
            }}
            onRename={(name) => onRename(list.id, name)}
            onDelete={() => setPendingDelete({ id: list.id, name: list.name })}
          />
        ))}
      </div>
      {pendingDelete && (
        <DeleteCaptchaModal
          listName={pendingDelete.name}
          onConfirm={handleConfirmDeleteList}
          onCancel={() => setPendingDelete(null)}
        />
      )}
      {listToast && (
        <div className="dodge fixed bottom-36 right-4 z-50 flex items-center gap-3 rounded-md border-4 border-black bg-gray-900 px-4 py-3 text-xs font-bold text-white shadow-2xl">
          {listToast.phase === 'confirm' && (
            <>
              <span>"{listToast.name}" deleted.</span>
              <button onClick={handleUndoListClick} className="rounded bg-white px-2 py-1 text-gray-900">
                Undo
              </button>
            </>
          )}
          {listToast.phase === 'restoring' && <span>Restoring "{listToast.name}"...</span>}
          {listToast.phase === 'kidding' && <span>Just kidding. Lists cannot be restored.</span>}
        </div>
      )}
      {isAdding ? (
        <input
          autoFocus
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value)
            setListArmed(false)
          }}
          onBlur={commitAdd}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitAdd()
            if (e.key === 'Escape') {
              setNewName('')
              setIsAdding(false)
              setListArmed(false)
            }
          }}
          placeholder={listArmed ? 'Press Enter again to confirm' : 'List name'}
          className={`mt-2 w-full rounded-md border-4 border-dashed px-3 py-2 text-sm ${
            listArmed ? 'border-red-500' : 'border-pink-500'
          }`}
        />
      ) : (
        <button
          onClick={handleNewListClick}
          className="dodge mt-2 rounded-md px-3 py-2 text-left text-[8px] text-indigo-300 opacity-40 hover:bg-indigo-50"
        >
          + New list
        </button>
      )}
      {showTos && (
        <TermsOfServiceWall
          onAgree={() => {
            setTosAccepted(true)
            setShowTos(false)
            setIsAdding(true)
          }}
        />
      )}
    </aside>
  )
}
