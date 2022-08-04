import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the dataLayer logic
export class TodoAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todoTable = process.env.TODOS_TABLE) {
    }
  
    async getAllTodos(): Promise<TodoItem[]> {
      console.log('Getting all todos')
  
      const result = await this.docClient.scan({
        TableName: this.todoTable
      }).promise()
  
      const items = result.Items   
      return items as TodoItem[]
    }

    async updateAttachment(userId: String, todoId: String, url: String) {
      await this.docClient.update({
        TableName: this.todoTable,
        Key: {userId: userId,  todoId: todoId },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: { ':url': url }
      }).promise()
    }
  
    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
      await this.docClient.put({
        TableName: this.todoTable,
        Item: todoItem
      }).promise()
  
      return todoItem
    }

    async updateTodo(userId: String, todoId: String, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {
      await this.docClient.update({
        TableName: this.todoTable,
        Key: {userId: userId,  todoId: todoId},
        UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: { ':name': updateTodoRequest.name, ':dueDate': updateTodoRequest.dueDate,':done': updateTodoRequest.done },
      }).promise()
      
      const todoUpdate: TodoUpdate = {
        ...updateTodoRequest
      }

      return todoUpdate
    }

    async deleteTodo(todoId: String, userId: String) {
      await this.docClient.delete({
        TableName: this.todoTable,
        Key: {userId: userId,  todoId: todoId }
      })
    }

    async findByUserId(userId: String): Promise<TodoItem[]> {
      const result = await this.docClient.query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId }
      }).promise()
  
      const items = result.Items   
      return items as TodoItem[]
    }
  }
  
  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }