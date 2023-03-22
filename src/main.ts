import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { join } from 'path';
import * as express from 'express';
import { SizeLimitInterceptor } from './interceptors/size-limit-interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { requestContextMiddleware } from '@medibloc/nestjs-request-context';
import { MyRequestContext } from './services/my-request-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  process.env.TZ = 'Etc/Universal';

  app.use(helmet());

  app.use(requestContextMiddleware(MyRequestContext));
  app.useGlobalInterceptors(new SizeLimitInterceptor(100000));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message:
            validationErrors[0].constraints[
              Object.keys(validationErrors[0].constraints)[0]
            ],
        });
      },
    }),
  );

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('dev APP API DOCUMENTATIONS')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
      },
      'access-key',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/doc', app, document);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
