import { TransactionService } from 'src/common/services/transaction.service';
import { User, UserSchema } from 'src/users/schema/users.schema';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './todo.schema';
import { TodoService } from './todo.service';
import { Module } from '@nestjs/common';
import { LoggerSchema } from 'src/common/services/dblogger.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      { name: User.name, schema: UserSchema },
      { name:"dblogs", schema: LoggerSchema },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService, TransactionService],
})
export class TodoModule {}
