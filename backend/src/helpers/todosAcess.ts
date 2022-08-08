import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')
// TODO: Implement the dataLayer logic
export class TodoAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todoTable = process.env.TODOS_TABLE) {
    }
  
    async getAllTodos(): Promise<TodoItem[]> {
      logger.info('Getting all todos');
      const result = await this.docClient.scan({
        TableName: this.todoTable
      }).promise()
  
      const items = result.Items   
      return items as TodoItem[]
    }

    async updateAttachment(userId: String, todoId: String, url: String) {
      logger.info('call TodosAccess.updateAttachment');
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
      logger.info('call TodosAccess.updateTodo');
      await this.docClient.update({
        TableName: this.todoTable,
        Key: {userId: userId,  todoId: todoId},
        UpdateExpression: 'set #todo_name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: { ':name': updateTodoRequest.name, ':dueDate': updateTodoRequest.dueDate,':done': updateTodoRequest.done },
        ExpressionAttributeNames: { "#todo_name": "name" }
      }).promise()
      
      const todoUpdate: TodoUpdate = {
        ...updateTodoRequest
      }

      return todoUpdate
    }

    async deleteTodo(todoId: String, userId: String) {
      logger.info('call TodosAccess.deleteTodo' + todoId, userId);
      var params = {
          TableName: this.todoTable,
          Key: {
              userId: userId,
              todoId: todoId
          }
      };

      await this.docClient.delete(params, function (err, data) {
          if (err) console.log(err);
          else console.log(data);
      })
      logger.info('delete todo done');
    }

    async findByUserId(userId: String, sortBy: string, scanIndexForward: boolean): Promise<TodoItem[]> {
      logger.info('call TodosAccess.findByUserId');
      
      const params: any = {
        TableName: this.todoTable,
        KeyConditionExpression: '#todo_userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        ExpressionAttributeNames: { "#todo_userId": "userId" },
        IndexName: sortBy,
        ScanIndexForward : scanIndexForward
      }

      logger.info('call TodosAccess.findByUserId params' + JSON.stringify(params));
      const result = await this.docClient.query(params).promise()
      const items = result.Items
      return items as TodoItem[]
    }
  }
  
  function createDynamoDBClient() {
    // if (process.env.IS_OFFLINE) {
    //   console.log('Creating a local DynamoDB instance')
    //   return new XAWS.DynamoDB.DocumentClient({
    //     region: 'localhost',
    //     endpoint: 'http://localhost:8000'
    //   })
    // }
  
    return new XAWS.DynamoDB.DocumentClient()
  }