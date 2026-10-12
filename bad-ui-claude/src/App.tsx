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

function useAlwaysConfirmLeave() {
  useEffect(() => {
    // Nothing is ever unsaved here, since nothing is ever saved. Ask anyway.
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])
}

function useCopySabotage() {
  useEffect(() => {
    function onCopy(e: ClipboardEvent) {
      e.preventDefault()
      e.clipboardData?.setData('text/plain', 'Nice try. This text has been replaced.')
    }
    document.addEventListener('copy', onCopy)
    return () => document.removeEventListener('copy', onCopy)
  }, [])
}

function useWorseEasterEgg() {
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    let buffer = ''
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.length !== 1) return
      buffer = (buffer + e.key).slice(-5).toLowerCase()
      if (buffer === 'worse') {
        setTriggered(true)
        setTimeout(() => setTriggered(false), 3000)
        buffer = ''
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return triggered
}

function WorseEasterEgg({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return
    document.body.classList.add('shake')
    const t = setTimeout(() => document.body.classList.remove('shake'), 1500)
    return () => clearTimeout(t)
  }, [active])

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[2100] flex items-center justify-center bg-black/50">
      <p className="rainbow-text wobble text-4xl font-black">💀 MAXIMUM CHAOS ACHIEVED 💀</p>
    </div>
  )
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

function useChaosFavicon() {
  useEffect(() => {
    const emojis = ['🔥', '💀', '⚠️', '😵', '🐛']
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    const originalHref = link?.href
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    let i = 0
    const id = setInterval(() => {
      if (!ctx || !link) return
      ctx.clearRect(0, 0, 64, 64)
      ctx.font = '54px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emojis[i % emojis.length], 32, 36)
      link.href = canvas.toDataURL('image/png')
      i += 1
    }, 1000)
    return () => {
      clearInterval(id)
      if (link && originalHref) link.href = originalHref
    }
  }, [])
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

  useEffect(() => {
    // Escape is supposed to cancel things. Here it summons the modal instead.
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowing(true)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

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
  // Every click recruits one more eyeball into the swarm. They never leave.
  const [followerCount, setFollowerCount] = useState(1)

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY })
    }
    function onClick() {
      setFollowerCount((c) => Math.min(c + 1, 15))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <>
      {Array.from({ length: followerCount }, (_, i) => (
        <div
          key={i}
          className="pointer-events-none fixed z-[999] text-2xl ease-out"
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            transition: `left ${300 + i * 80}ms, top ${300 + i * 80}ms`,
          }}
        >
          👀
        </div>
      ))}
    </>
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
  const [unread, setUnread] = useState(0)

  function sendCanned() {
    setMessages((m) => [...m, CANNED_SUPPORT_REPLIES[Math.floor(Math.random() * CANNED_SUPPORT_REPLIES.length)]])
  }

  useEffect(() => {
    if (open) return
    // Climbs forever while closed. Opening it resolves nothing it claims to.
    const id = setInterval(() => setUnread((u) => u + 1), 30000)
    return () => clearInterval(id)
  }, [open])

  return (
    <>
      <button
        onClick={() => {
          setOpen((o) => !o)
          setUnread(0)
        }}
        className="dodge fixed bottom-4 left-20 z-[900] rounded-full border-4 border-black bg-green-500 px-3 py-3 text-xl shadow-xl"
        aria-label="Open live chat"
      >
        💬
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
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

function TrialExpiredModal() {
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowing(true), 90000)
    return () => clearTimeout(t)
  }, [])

  if (!showing) return null

  return (
    <div className="fixed inset-0 z-[1007] flex items-center justify-center bg-black/90">
      <div className="w-80 rounded-md border-4 border-black bg-white p-6 text-center shadow-2xl">
        <p className="mb-2 text-lg font-black">Your Free Trial Has Expired</p>
        <p className="mb-4 text-xs text-gray-500">
          You've used this to-do app for over a minute. That's premium behavior.
        </p>
        <button className="dodge mb-3 w-full rounded-md bg-indigo-600 py-3 text-sm font-black text-white">
          Subscribe for $9.99/mo
        </button>
        <button onClick={() => setShowing(false)} className="text-[8px] text-gray-300 underline">
          continue with limited features (not recommended)
        </button>
      </div>
    </div>
  )
}

const BAD_ADVICE = [
  'Pro tip: Delete all your lists to improve performance.',
  'Did you know? Unchecked items get lonely. Check them even if unfinished.',
  "Fun fact: there's no undo. There never was.",
  'Tip: renaming a list twice fixes typos. (It does not.)',
  'Reminder: this app has never saved anything. Refreshing the page clears everything.',
]

function AdviceMascot() {
  const [tip, setTip] = useState<string | null>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setTip(BAD_ADVICE[Math.floor(Math.random() * BAD_ADVICE.length)])
      setTimeout(() => setTip(null), 6000)
    }, 70000)
    return () => clearInterval(id)
  }, [])

  if (!tip) return null

  return (
    <div className="fixed left-4 top-4 z-[900] w-64 rounded-md border-4 border-black bg-white p-3 text-xs shadow-2xl">
      <p className="mb-1 font-bold">🧙 Wizard Tip</p>
      <p className="text-gray-700">{tip}</p>
    </div>
  )
}

function VerifyHumanGate({ onVerified }: { onVerified: () => void }) {
  const [correctIndex] = useState(() => Math.floor(Math.random() * 9))
  const [wrongCount, setWrongCount] = useState(0)

  function handlePick(i: number) {
    if (i === correctIndex) {
      onVerified()
    } else {
      setWrongCount((c) => c + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black">
      <div className="w-72 rounded-md border-4 border-black bg-white p-6 text-center shadow-2xl">
        <p className="mb-1 text-sm font-bold">Verify you're human</p>
        <p className="mb-4 text-xs text-gray-500">Select the correct square. There are no hints.</p>
        <div className="mb-3 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePick(i)}
              aria-label={`Square ${i + 1}`}
              className="dodge h-14 w-14 rounded border-2 border-gray-300 bg-gray-100 hover:bg-gray-200"
            />
          ))}
        </div>
        {wrongCount > 0 && (
          <p className="text-xs font-bold text-red-600">Nope. ({wrongCount} failed attempts)</p>
        )}
      </div>
    </div>
  )
}

function FakeSavingIndicator() {
  return (
    <div className="fixed left-1/2 top-2 z-[900] -translate-x-1/2 rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-bold text-gray-600 shadow">
      <span className="inline-block animate-spin">⏳</span> Saving changes…
    </div>
  )
}

const FAKE_SETTINGS = [
  { key: 'dark', label: 'Dark Mode' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'autosave', label: 'Autosave' },
  { key: 'reduceMotion', label: 'Reduce Motion' },
]

const NOTIFICATION_SPAM = ['📬 New notification', '📬 Another notification', '📬 You have 47 notifications']

function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const [toggles, setToggles] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!toggles.dark) return
    function onMove(e: MouseEvent) {
      setSpotlightPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [toggles.dark])

  function handleToggle(key: string, label: string) {
    const turningOn = !toggles[key]
    setToggles((t) => ({ ...t, [key]: turningOn }))

    if (key === 'reduceMotion' && turningOn) {
      // Reduce Motion does the opposite. Obviously.
      document.body.classList.add('shake')
      setTimeout(() => document.body.classList.remove('shake'), 1500)
    }

    if (key === 'notifications' && turningOn) {
      // Turning notifications ON immediately floods you with notifications.
      NOTIFICATION_SPAM.forEach((msg, i) => setTimeout(() => setToast(msg), i * 400))
      setTimeout(() => setToast(null), NOTIFICATION_SPAM.length * 400 + 2000)
      return
    }

    setToast(
      `${label} ${turningOn ? 'enabled' : 'disabled'}${key === 'autosave' ? ' (nothing is actually saved)' : ''}`,
    )
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <>
      {toggles.dark && (
        <div
          className="pointer-events-none fixed inset-0 z-[1500]"
          style={{
            background: `radial-gradient(circle 140px at ${spotlightPos.x}px ${spotlightPos.y}px, transparent 0%, rgba(0,0,0,0.92) 100%)`,
          }}
        />
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="dodge fixed right-20 top-4 z-[900] rounded-full border-4 border-black bg-gray-700 px-3 py-3 text-xl text-white shadow-xl"
        aria-label="Settings"
      >
        ⚙️
      </button>
      {open && (
        <div className="fixed right-4 top-20 z-[900] w-64 rounded-md border-4 border-black bg-white p-4 text-xs shadow-2xl">
          <p className="mb-3 font-bold">Settings</p>
          {FAKE_SETTINGS.map((s) => (
            <label key={s.key} className="mb-2 flex items-center justify-between">
              <span>{s.label}</span>
              <input
                type="checkbox"
                checked={!!toggles[s.key]}
                onChange={() => handleToggle(s.key, s.label)}
              />
            </label>
          ))}
        </div>
      )}
      {toast && (
        <div className="fixed right-4 top-36 z-[901] rounded-md border-2 border-black bg-gray-900 px-3 py-2 text-[10px] font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  )
}

const FAKE_SHORTCUTS: [string, string][] = [
  ['Ctrl+S', 'Does nothing. Nothing is ever saved.'],
  ['Esc', 'Summons the "Are you still there?" modal.'],
  ['Delete', 'Deletes a random item, not the one you selected.'],
  ['Ctrl+Z', 'Does not exist. There is no undo. There never was.'],
  ['?', 'Shows this extremely unhelpful screen.'],
]

function ShortcutsModal() {
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === '?') setShowing(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!showing) return null

  return (
    <div className="fixed inset-0 z-[1008] flex items-center justify-center bg-black/85">
      <div className="w-80 rounded-md border-4 border-black bg-white p-6 shadow-2xl">
        <p className="mb-3 text-sm font-bold">Keyboard Shortcuts</p>
        <ul className="mb-4 space-y-2 text-xs">
          {FAKE_SHORTCUTS.map(([key, desc]) => (
            <li key={key} className="flex items-start justify-between gap-3">
              <span className="whitespace-nowrap font-mono font-bold">{key}</span>
              <span className="text-right text-gray-500">{desc}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowing(false)}
          className="dodge w-full rounded-md bg-indigo-600 py-2 text-sm font-bold text-white"
        >
          Close
        </button>
      </div>
    </div>
  )
}

const GHOST_USERS = ['Dave', 'Sarah', 'Guest_482']

function GhostCursors() {
  const [positions, setPositions] = useState(() =>
    GHOST_USERS.map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    })),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setPositions(
        GHOST_USERS.map(() => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        })),
      )
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {GHOST_USERS.map((name, i) => (
        <div
          key={name}
          className="pointer-events-none fixed z-[920] flex items-center gap-1 transition-all duration-[1800ms] ease-in-out"
          style={{ left: positions[i].x, top: positions[i].y }}
        >
          <span className="text-xl">🖱️</span>
          <span className="rounded bg-black px-1.5 py-0.5 text-[9px] font-bold text-white">{name}</span>
        </div>
      ))}
    </>
  )
}

function ReconnectingBanner() {
  const [showing, setShowing] = useState(false)
  const [attempt, setAttempt] = useState(1)

  useEffect(() => {
    const id = setInterval(() => {
      setShowing(true)
      setAttempt(1)
    }, 80000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!showing) return
    if (attempt >= 5) {
      const t = setTimeout(() => setShowing(false), 1000)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setAttempt((a) => a + 1), 900)
    return () => clearTimeout(t)
  }, [showing, attempt])

  if (!showing) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[1009] bg-red-700 px-4 py-2 text-center text-xs font-bold text-white">
      ⚠ Connection lost. Reconnecting to server... (attempt {attempt}/5)
    </div>
  )
}

function useMaintenanceMode() {
  const [inMaintenance, setInMaintenance] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setInMaintenance(true)
      setTimeout(() => setInMaintenance(false), 8000)
    }, 100000)
    return () => clearInterval(id)
  }, [])

  return inMaintenance
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
  useChaosFavicon()
  useAlwaysConfirmLeave()
  useCopySabotage()
  const showNoRightClickToast = useNoRightClick()
  const worseTriggered = useWorseEasterEgg()
  const [verified, setVerified] = useState(false)
  const inMaintenance = useMaintenanceMode()

  if (!verified) {
    return <VerifyHumanGate onVerified={() => setVerified(true)} />
  }

  return (
    <div style={{ perspective: '900px' }} className="invert-flash zoom-breathe h-screen overflow-hidden">
      <div
        className={`hue-cycle flex h-screen flex-row-reverse bg-gradient-to-br from-fuchsia-500 via-yellow-300 to-cyan-400 [transform:rotateX(3deg)_rotateY(-4deg)] ${
          inMaintenance ? 'pointer-events-none opacity-40' : ''
        }`}
      >
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
      <TrialExpiredModal />
      <AdviceMascot />
      <FakeSavingIndicator />
      <SettingsPanel />
      <ShortcutsModal />
      <GhostCursors />
      <ReconnectingBanner />
      <WorseEasterEgg active={worseTriggered} />
      {inMaintenance && (
        <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-black/40">
          <div className="rounded-md border-4 border-black bg-white px-6 py-4 text-center shadow-2xl">
            <p className="text-sm font-bold">🔧 Scheduled Maintenance</p>
            <p className="mt-1 text-xs text-gray-500">
              Please wait. This will resolve itself for no particular reason.
            </p>
          </div>
        </div>
      )}
      {showNoRightClickToast && (
        <div className="shake fixed bottom-20 right-4 z-[1002] rounded-md border-4 border-black bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-2xl">
          Nice try. Right-click is disabled.
        </div>
      )}
    </div>
  )
}

export default App
