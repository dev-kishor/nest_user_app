import { Module } from '@nestjs/common';
import { TodoModule } from 'src/todo/todo.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TodoModule,
    UsersModule,
  ],

})
export class MasterModule {}
