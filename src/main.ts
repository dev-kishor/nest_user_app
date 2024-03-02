import { ValidationExceptionFilter } from './filter/validation-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { documentConfig } from './config-codes';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ======== Swagger Implementation ========
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);
  // ======== Swagger Implementation ========

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalPipes(
    // this will not throw error and will not allow to excute end point if anyone try to end extra payload from request
    new ValidationPipe({
      transform: true,
      whitelist:true,
      forbidNonWhitelisted:true
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());

  // PreFix to all api endpoint means all point will start with localhost:port/api/vi
  // app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT', 8080);
  await app.listen(port);
}
bootstrap();
