export interface TodoItem {
  id: string
  title: string
  description: string
  completed: boolean
}

export interface TodoList {
  id: string
  name: string
  items: TodoItem[]
}
