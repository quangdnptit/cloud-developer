import * as uuid from 'uuid'

import { TodoAccess } from '../helpers/todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function findTodosByUserId(userId: string): Promise<TodoItem[]> {
  return todoAccess.findTodoByUserId(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<TodoItem> {
  return await todoAccess.createTodo(todoId: todoId)
}

