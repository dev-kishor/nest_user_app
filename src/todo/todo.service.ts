import { TransactionService } from '../common/services/transaction.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { LoggerSchema } from '../common/services/dblogger.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo, TodoDocument } from './todo.schema';
import { Connection, Model } from 'mongoose';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('dblogs') private loggerModel: Model<typeof LoggerSchema>,
    @InjectConnection() private readonly connection: Connection,
    private readonly transactionService: TransactionService,
    private readonly configService:ConfigService
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<any> {
    try {
      const newTodo = await this.todoModel.create(createTodoDto);
      return newTodo;
    } catch (error) {
      throw new HttpException('Forbiddens', HttpStatus.FORBIDDEN);
    }
  }

  async findAll() {
    try {
      const allTodo = await this.todoModel.find({}).exec();
      return allTodo;
    } catch (error) {
      throw new Error(`Failed ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const todoById = await this.todoModel.findById(id, { todo: 1 }).exec();
      return todoById;
    } catch (error) {
      throw new Error(`Failed ${error.message}`);
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.todoModel.findById(id);
      if (!todo) {
        return null;
      }
      todo.set(updateTodoDto);
      todo.updatedDate = new Date();
      const updatedTodo = await todo.save();
      return updatedTodo;
    } catch (error) {
      throw new Error(`Failed ${error.message}`);
    }
  }

  async runTran(): Promise<string> {
    try {
      const result = await this.transactionService.runTransaction(
        async (model) => {
          let chnge_text = 'Test 50000';
          await model[0].findByIdAndUpdate('65ad0c2f4ae93152564fcff9', {
            todo: chnge_text,
          });
          await model[1].findByIdAndUpdate('65a53904be9bdbdf60cc56bf', {
            name: chnge_text,
          });
          return 'Transaction completed successfully';
        },
        [this.todoModel, this.userModel],
      );
      return result;
    } catch (error) {
      console.error('Error in transaction:', error);
      throw new Error('Transaction failed');
    }
  }

  async getRelease(): Promise<string> {
    try {
      const logs = await this.loggerModel.find({}, { raw: 1, _id: 0 }).exec();
      const logFile = this.configService.get("DB_LOG_FILE")
      const stream = fs.createWriteStream(logFile);
      logs.forEach((log: any) => {
        stream.write(JSON.stringify(log.raw) + '\n');
      });
      stream.end();
      return logFile; 
    } catch (error) {
      throw new Error(`Failed ${error.message}`);
    }
  }
}
