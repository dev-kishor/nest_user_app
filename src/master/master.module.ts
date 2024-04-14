import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TodoModule } from 'src/todo/todo.module';
import { UsersModule } from 'src/users/users.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    AuthModule,
    TodoModule,
    UsersModule,
    ProfileModule
  ],

})
export class MasterModule {}
