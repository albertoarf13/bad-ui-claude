import { useTodoLists } from './features/todos/useTodoLists'
import { Sidebar } from './features/todos/Sidebar'
import { TodoListPanel } from './features/todos/TodoListPanel'

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

  return (
    <div className="flex h-screen bg-gray-50">
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
  )
}

export default App
