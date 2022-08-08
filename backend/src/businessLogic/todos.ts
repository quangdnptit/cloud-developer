import * as uuid from 'uuid'

import { TodoAccess } from '../helpers/todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const todoAccess = new TodoAccess()
const logger = createLogger('businessTodos')

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function findTodosByUserId(userId: string, sortBy: string, scanIndexForward: boolean): Promise<TodoItem[]> {
  logger.info('calling businessTodos.findTodosByUserId with userid: ' + userId );
  return todoAccess.findByUserId(userId, sortBy, scanIndexForward)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  logger.info('calling businessTodos.createTodo with userid: ' + userId);
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
  logger.info('calling businessTodos.deleteTodo with userid: ' + userId + 'and todoId:' + todoId);
  return await todoAccess.deleteTodo(todoId, userId)
}

export async function updateAttachment(userId: string, todoId: string, attachmentUrl: string): Promise<string> {
   logger.info('call businessTodos.updateAttachment: ' + userId + "," + todoId + "'and attachmentUrl:'" + attachmentUrl);
   todoAccess.updateAttachment(userId, todoId, attachmentUrl)
   return attachmentUrl
}

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {
  logger.info('calling businessTodos.updateTodo with userid: ' + userId + 'and todoId:' + todoId);
  return todoAccess.updateTodo(userId, todoId, updateTodoRequest)
}

