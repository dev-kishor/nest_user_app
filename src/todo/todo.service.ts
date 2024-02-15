import {
  HttpException,
  HttpStatus,
  Injectable,
  UploadedFile,
} from '@nestjs/common';
import { TransactionService } from '../common/services/transaction.service';
import { LoggerSchema } from '../common/services/dblogger.service';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo, TodoDocument } from './todo.schema';
import { ConfigService } from '@nestjs/config';
import { Connection, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import * as fs from 'fs';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('dblogs') private loggerModel: Model<typeof LoggerSchema>,
    @InjectConnection() private readonly connection: Connection,
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
  ) {}

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

  async getAllLogsInFile(): Promise<string> {
    try {
      const logs = await this.loggerModel.find({}, { raw: 1, _id: 0 }).exec();
      const logFile = this.configService.get('DB_LOG_FILE');
      const stream = fs.createWriteStream(logFile);
      logs.forEach((log: any) => {
        stream.write(log.raw + '\n');
      });
      stream.end();
      return logFile;
    } catch (error) {
      throw new Error(`Failed ${error.message}`);
    }
  }

  async readLogFileAndDumpIntoDB(@UploadedFile() file: Express.Multer.File) {
    const fileBuffer = file.buffer.toString('utf-8');
    const queries = fileBuffer
      .split('\n')
      .filter((query) => query.trim() !== '');

    for (const query of queries) {
      console.log(query);
      const collection = query.split('.')[1];
      const [method] = query.split('.')[2].split('(');
      const [operation] = query.split('(')[1].split(')');

      try {
        switch (method) {
          case 'insertOne':
            const document = JSON.parse(
              query.split('insertOne(')[1].slice(0, -4),
            );
            await this.todoModel.create(document);
            break;
          case 'updateOne':
            const [filterStr, updateStr] = operation.split('},{');
            let filter = JSON.parse(filterStr + '}');
            const update = JSON.parse('{' + updateStr);
            if (filter._id) {
              filter._id = new ObjectId(filter._id);
            }
            await this.todoModel.updateOne(filter, { $set: update });
            break;
          default:
            throw new Error('Unsupported operation type: ' + method);
        }
      } catch (error) {
        console.error('Error executing operation:', error);
        throw new Error(error);
      }
    }
  }

  async create(createTodoDto: CreateTodoDto): Promise<any> {
    let session = await this.connection.startSession();
    session.startTransaction();
    try {
      const newTodo = await this.todoModel.create(createTodoDto);
      this.updateTodoDataIntoUser(newTodo);
      await session.commitTransaction();
      return newTodo
    } catch (error) {
      console.log('error occur===>', error);

      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  private async updateTodoDataIntoUser(savedObj: any) {
    try {
      const { userId, _id: todoId } = savedObj;
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error(`User not found with id ${userId}`);
      }
      user.todoIds.push(todoId);
      await user.save();
    } catch (error) {
      throw new Error(`Failed ${error}`);
    }
  }
}

// async create(createTodoDto: CreateTodoDto): Promise<any> {
//   try {
//     const result = await this.transactionService.runTransaction(async () => {
//       const newTodo = await this.todoModel.create(createTodoDto);
//       this.updateTodoDataIntoUser(newTodo);
//       return newTodo;
//     }, []);
//     return result;
//   } catch (error) {
//     throw new HttpException('Forbiddens', HttpStatus.FORBIDDEN);
//   }
// }

// private async updateTodoDataIntoUser(savedObj: any) {
//   try {
//     const { userId, _id: todoId } = savedObj;
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new Error(`User not found with id ${userId}`);
//     }
//     user.todoIds.push(todoId);
//     await user.save();
//   } catch (error) {
//     throw new Error(`Failed ${error}`);
//   }
// }

// async create(createTodoDto: CreateTodoDto): Promise<any> {
//   try {
//     const newTodo = await this.todoModel.create(createTodoDto);
//     this.updateTodoDataIntoUser(newTodo);
//     return newTodo;
//   } catch (error) {
//     throw new HttpException('Forbiddens', HttpStatus.FORBIDDEN);
//   }
// }

// private async updateTodoDataIntoUser(savedObj: any) {
//   try {
//     const { userId, _id: todoId } = savedObj;
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new Error(`User not found with id ${userId}`);
//     }
//     user.todoIds.push(todoId);
//     await user.save();
//   } catch (error) {
//     throw new Error(`Failed ${error}`);
//   }
// }
