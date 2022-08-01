import * as uuid from 'uuid'

import { TodoAccess } from '../helpers/todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function findTodosByUserId(userId: string): Promise<TodoItem[]> {
  return todoAccess.findByUserId(userId)
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
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function deleteTodo(
  todoId: string,
  userId: string
) {
  return await todoAccess.deleteTodo(todoId, userId)
}

export async function updateAttachment(userId: string, todoId: string, attachmentUrl: string): Promise<string> {
   todoAccess.updateAttachment(userId, todoId, attachmentUrl)
   return attachmentUrl
}

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {
  return todoAccess.updateTodo(userId, todoId, updateTodoRequest)
}

