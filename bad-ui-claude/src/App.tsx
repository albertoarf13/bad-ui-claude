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
          onMouseEnter={() => setFlee({ x: (Math.random() - 0.5) * 420, y: (Math.random() - 0.5) * 280 })}
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

function LowBatteryToast() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(true)
      setTimeout(() => setVisible(false), 5000)
    }, 45000)
    return () => clearInterval(id)
  }, [])

  if (!visible) return null

  return (
    <div className="shake fixed top-4 right-4 z-[1002] rounded-md border-4 border-black bg-red-700 px-4 py-3 text-sm font-bold text-white shadow-2xl">
      🔋 Battery at 2%. This is a website. You do not need to worry about this.
    </div>
  )
}

function makeMathQuestion() {
  const a = 1 + Math.floor(Math.random() * 9)
  const b = 1 + Math.floor(Math.random() * 9)
  return { a, b, sum: a + b }
}

function CriticalErrorModal() {
  const [showing, setShowing] = useState(false)
  const [question, setQuestion] = useState(makeMathQuestion)
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowing(true), 35000)
    return () => clearTimeout(t)
  }, [])

  if (!showing) return null

  function trySubmit() {
    if (Number(answer) === question.sum) {
      setShowing(false)
      setAnswer('')
      setWrong(false)
    } else {
      setWrong(true)
      setQuestion(makeMathQuestion())
      setAnswer('')
    }
  }

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/90">
      <div className="siren-border w-96 rounded-md border-8 bg-white p-6 text-center shadow-2xl">
        <p className="mb-2 text-lg font-black text-red-600">⚠ CRITICAL SYSTEM ERROR ⚠</p>
        <p className="mb-4 text-xs text-gray-600">
          42 threats detected on this to-do list. Solve the security check to continue.
        </p>
        <p className="mb-2 text-sm font-bold">
          {question.a} + {question.b} = ?
        </p>
        <input
          autoFocus
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && trySubmit()}
          className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-center text-sm"
        />
        {wrong && (
          <p className="mb-2 text-xs font-bold text-red-600">Wrong. The threats have multiplied.</p>
        )}
        <button
          onClick={trySubmit}
          className="dodge w-full rounded-md bg-red-600 py-2 text-sm font-bold text-white"
        >
          Remove Threats
        </button>
      </div>
    </div>
  )
}

function PrizePopupTrap() {
  const [showing, setShowing] = useState(false)
  const [claimCount, setClaimCount] = useState(0)
  const [flee, setFlee] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const id = setInterval(() => setShowing(true), 60000)
    return () => clearInterval(id)
  }, [])

  if (!showing) return null

  return (
    <div className="fixed inset-0 z-[1004] flex items-center justify-center bg-black/70">
      <div className="w-80 rounded-md border-4 border-yellow-400 bg-gradient-to-br from-yellow-200 to-pink-200 p-6 text-center shadow-2xl">
        <p className="rainbow-text mb-3 text-xl font-black">
          🎉 YOU ARE VISITOR #{(1000000 + claimCount).toLocaleString()}! 🎉
        </p>
        <p className="mb-4 text-sm font-bold">You've won a FREE prize!</p>
        <button
          onMouseEnter={() =>
            setFlee({ x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 140 })
          }
          onClick={() => setClaimCount((c) => c + 1)}
          style={{ '--flee-x': `${flee.x}px`, '--flee-y': `${flee.y}px` } as React.CSSProperties}
          className="dodge-hard mb-2 w-full rounded-md bg-green-500 py-2 text-sm font-black text-white"
        >
          Claim Prize!!!
        </button>
        <button
          onClick={() => {
            setShowing(false)
            setClaimCount(0)
          }}
          className="text-[9px] text-gray-400 underline opacity-50"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}

const CANNED_SUPPORT_REPLIES = [
  'Thanks for reaching out! A representative will be with you in 47 minutes.',
  'Have you tried turning it off and on again?',
  "I'm sorry, I didn't understand that. Please rephrase.",
  'Your call is very important to us.',
  '🤖 beep boop. still not a real person.',
]

function LiveChatWidget() {
  const [open, setOpen] = useState(false)
  const [flee, setFlee] = useState({ x: 0, y: 0 })
  const [messages, setMessages] = useState<string[]>([CANNED_SUPPORT_REPLIES[0]])

  function sendCanned() {
    setMessages((m) => [...m, CANNED_SUPPORT_REPLIES[Math.floor(Math.random() * CANNED_SUPPORT_REPLIES.length)]])
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="dodge fixed bottom-4 left-20 z-[900] rounded-full border-4 border-black bg-green-500 px-3 py-3 text-xl shadow-xl"
        aria-label="Open live chat"
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-20 left-4 z-[900] w-64 rounded-md border-4 border-black bg-white p-3 text-xs shadow-2xl">
          <p className="mb-2 font-bold">Live Support Chat</p>
          <div className="mb-2 h-32 space-y-1 overflow-y-auto border border-gray-200 p-2">
            {messages.map((m, i) => (
              <p key={i} className="text-gray-700">
                {m}
              </p>
            ))}
          </div>
          <button onClick={sendCanned} className="dodge mb-2 w-full rounded bg-indigo-600 py-1 text-white">
            Ask a question
          </button>
          <button
            onMouseEnter={() =>
              setFlee({ x: (Math.random() - 0.5) * 280, y: (Math.random() - 0.5) * 180 })
            }
            onClick={() => setOpen(false)}
            style={{ '--flee-x': `${flee.x}px`, '--flee-y': `${flee.y}px` } as React.CSSProperties}
            className="dodge-hard w-full rounded bg-gray-200 py-1 text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </>
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
    <div style={{ perspective: '900px' }} className="invert-flash zoom-breathe h-screen overflow-hidden">
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
      <LowBatteryToast />
      <CriticalErrorModal />
      <PrizePopupTrap />
      <LiveChatWidget />
      {showNoRightClickToast && (
        <div className="shake fixed bottom-20 right-4 z-[1002] rounded-md border-4 border-black bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-2xl">
          Nice try. Right-click is disabled.
        </div>
      )}
    </div>
  )
}

export default App
