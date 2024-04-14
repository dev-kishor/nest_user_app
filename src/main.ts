import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { documentConfig } from './config-codes';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ValidationExceptionFilter } from './filter/validation-exception.filter';
import { ResponseInterceptor } from './interceptor/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  // PreFix to all api endpoint means all point will start with localhost:port/api/vi
  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new ResponseInterceptor());

  // ======== Swagger Implementation ========
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);
  // ======== Swagger Implementation ========

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ======== this will throw error and will not allow to excute end point if anyone try to send extra payload from request ========
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // ======== this will throw error and will not allow to excute end point if anyone try to send extra payload from request ========

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());

  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT', 8080);
  await app.listen(port);
}

bootstrap();
