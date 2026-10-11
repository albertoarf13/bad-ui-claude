import { useEffect, useState } from 'react'
import { useTodoLists } from './features/todos/useTodoLists'
import { Sidebar } from './features/todos/Sidebar'
import { TodoListPanel } from './features/todos/TodoListPanel'

function useAnnoyingTitle() {
  useEffect(() => {
    const original = document.title
    let flipped = false
    const id = setInterval(() => {
      document.title = flipped ? original : '⚠️ COME BACK ⚠️'
      flipped = !flipped
    }, 1000)
    return () => {
      clearInterval(id)
      document.title = original
    }
  }, [])
}

function useClickBeep() {
  useEffect(() => {
    const ctx = new AudioContext()
    let clickCount = 0
    function beep() {
      clickCount += 1
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      // Gets higher-pitched with every single click, forever. Never resets.
      osc.frequency.value = Math.min(660 + clickCount * 35, 5000)
      gain.gain.value = 0.04
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    }
    document.addEventListener('click', beep)
    return () => document.removeEventListener('click', beep)
  }, [])
}

function useNoRightClick() {
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      e.preventDefault()
      setShowToast(true)
      setTimeout(() => setShowToast(false), 1800)
    }
    document.addEventListener('contextmenu', onContextMenu)
    return () => document.removeEventListener('contextmenu', onContextMenu)
  }, [])

  return showToast
}

function AreYouStillThereModal() {
  const [showing, setShowing] = useState(false)
  const [flee, setFlee] = useState({ x: 40, y: -30 })

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>
    function resetIdleTimer() {
      if (showing) return
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setShowing(true), 20000)
    }
    resetIdleTimer()
    window.addEventListener('mousemove', resetIdleTimer)
    window.addEventListener('keydown', resetIdleTimer)
    return () => {
      clearTimeout(idleTimer)
      window.removeEventListener('mousemove', resetIdleTimer)
      window.removeEventListener('keydown', resetIdleTimer)
    }
  }, [showing])

  if (!showing) return null

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/80">
      <div className="w-72 rounded-md border-4 border-black bg-white p-6 text-center shadow-2xl">
        <p className="mb-4 text-sm font-bold">Are you still there?</p>
        <button
          onMouseEnter={() => setFlee({ x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 160 })}
          onClick={() => setShowing(false)}
          style={{ '--flee-x': `${flee.x}px`, '--flee-y': `${flee.y}px` } as React.CSSProperties}
          className="dodge-hard rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
        >
          I'm here!
        </button>
      </div>
    </div>
  )
}

function FakeUpdateModal() {
  const [showing, setShowing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const trigger = setInterval(() => {
      setShowing(true)
      setProgress(0)
    }, 25000)
    return () => clearInterval(trigger)
  }, [])

  useEffect(() => {
    if (!showing) return
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setShowing(false)
          return 0
        }
        return p + 4
      })
    }, 100)
    return () => clearInterval(tick)
  }, [showing])

  if (!showing) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70">
      <div className="w-80 rounded-md border-4 border-black bg-gray-100 p-6 text-center shadow-2xl">
        <p className="mb-3 text-sm font-bold">Installing Important Update</p>
        <p className="mb-4 text-xs text-gray-500">Please do not close this tab. There is no reason for this.</p>
        <div className="h-4 w-full overflow-hidden rounded border border-gray-400 bg-white">
          <div
            className="h-full bg-indigo-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      className="pointer-events-none fixed z-[999] text-2xl transition-all duration-500 ease-out"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
    >
      👀
    </div>
  )
}

function App() {
  const {
    lists,
    selectedList,
    selectedListId,
    selectList,
    addList,
    renameList,
    deleteList,
    addItem,
    toggleItem,
    editItem,
    deleteItem,
  } = useTodoLists()

  useAnnoyingTitle()
  useClickBeep()
  const showNoRightClickToast = useNoRightClick()

  return (
    <div style={{ perspective: '900px' }} className="invert-flash h-screen overflow-hidden">
      <div className="hue-cycle flex h-screen flex-row-reverse bg-gradient-to-br from-fuchsia-500 via-yellow-300 to-cyan-400 [transform:rotateX(3deg)_rotateY(-4deg)]">
        <Sidebar
          lists={lists}
          selectedListId={selectedListId}
          onSelect={selectList}
          onAdd={addList}
          onRename={renameList}
          onDelete={deleteList}
        />
        <TodoListPanel
          list={selectedList}
          hasNoLists={lists.length === 0}
          onAddItem={(title, description) =>
            selectedList && addItem(selectedList.id, title, description)
          }
          onToggleItem={(itemId) => selectedList && toggleItem(selectedList.id, itemId)}
          onEditItem={(itemId, title, description) =>
            selectedList && editItem(selectedList.id, itemId, title, description)
          }
          onDeleteItem={(itemId) => selectedList && deleteItem(selectedList.id, itemId)}
        />
      </div>
      <CursorFollower />
      <FakeUpdateModal />
      <AreYouStillThereModal />
      {showNoRightClickToast && (
        <div className="shake fixed bottom-20 right-4 z-[1002] rounded-md border-4 border-black bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-2xl">
          Nice try. Right-click is disabled.
        </div>
      )}
    </div>
  )
}

export default App
