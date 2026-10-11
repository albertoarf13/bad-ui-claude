import { useState } from 'react'
import type { TodoList } from './types'

export function useTodoLists() {
  const [lists, setLists] = useState<TodoList[]>([])
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  const selectedList = lists.find((list) => list.id === selectedListId)

  function selectList(id: string) {
    setSelectedListId(id)
  }

  function addList(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = crypto.randomUUID()
    setLists((prev) => [...prev, { id, name: trimmed, items: [] }])
    setSelectedListId(id)
  }

  function renameList(id: string, name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    setLists((prev) =>
      prev.map((list) => (list.id === id ? { ...list, name: trimmed } : list)),
    )
  }

  function deleteList(id: string) {
    setLists((prev) => prev.filter((list) => list.id !== id))
    setSelectedListId((prev) => (prev === id ? null : prev))
  }

  function addItem(listId: string, title: string, description: string) {
    const trimmed = title.trim()
    if (!trimmed) return
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: [
                ...list.items,
                {
                  id: crypto.randomUUID(),
                  title: trimmed,
                  description: description.trim(),
                  completed: false,
                },
              ],
            }
          : list,
      ),
    )
  }

  function toggleItem(listId: string, itemId: string) {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item,
              ),
            }
          : list,
      ),
    )
  }

  function editItem(listId: string, itemId: string, title: string, description: string) {
    const trimmed = title.trim()
    if (!trimmed) return
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, title: trimmed, description: description.trim() }
                  : item,
              ),
            }
          : list,
      ),
    )
  }

  function deleteItem(listId: string, itemId: string) {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list,
      ),
    )
  }

  return {
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
  }
}
