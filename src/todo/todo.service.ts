import { TransactionService } from '../common/services/transaction.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo, TodoDocument } from './todo.schema';
import { Connection, Model } from 'mongoose';
@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly transactionService: TransactionService,
  ) {}
  create(createTodoDto: CreateTodoDto): any {
    try {
      const newTodo = this.todoModel.create(createTodoDto);
      return newTodo;
    } catch (error) {
      throw new HttpException('Forbiddens', HttpStatus.FORBIDDEN);
    }
  }
  findAll() {
    try {
      const allTodo = this.todoModel.find({});
      return allTodo;
    } catch (error) {
      throw new Error(`Failed ${error.message}`);
    }
  }
  findOne(id: number) {
    try {
      const todoById = this.todoModel.findById({ id });
      return todoById;
    } catch (error) {
      throw new Error(`Failed ${error.message}`);
    }
  }
  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.todoModel.findById(id);
      if (!todo) {
        // Handle not found scenario
        return null;
      }
      // Update the document
      todo.set(updateTodoDto);
      todo.updatedDate = new Date(); // Set updatedDate manually
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
}
