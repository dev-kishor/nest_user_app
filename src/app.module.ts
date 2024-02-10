import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterModule } from './master/master.module';
import mongoose from 'mongoose';
import {
  DBLoggerService,
  LoggerSchema,
} from './common/services/dblogger.service';

@Module({
  imports: [
    MasterModule,
    MongooseModule.forFeature([{ name: 'dblogs', schema: LoggerSchema }]),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`],
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/user'),
  ],
  providers: [DBLoggerService],
})
export class AppModule {
  constructor(private readonly loggerService: DBLoggerService) {
    mongoose.set('debug', (collectionName, methodName, query, doc) => {
      const json_query = JSON.stringify(query);
      const json_doc = JSON.stringify(doc);
      const raw_query =
        `db.${collectionName}.${methodName}(` +
        json_query +
        ',' +
        json_doc +
        ')';
      loggerService.saveLoges(
        collectionName,
        methodName,
        json_query,
        json_doc,
        raw_query,
      );
    });
    // mongoose.set('debug',true);
  }
}
