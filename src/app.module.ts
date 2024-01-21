import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterModule } from './master/master.module';

@Module({
  imports: [
    MasterModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`],
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/user'),
  ],
})
export class AppModule {}
