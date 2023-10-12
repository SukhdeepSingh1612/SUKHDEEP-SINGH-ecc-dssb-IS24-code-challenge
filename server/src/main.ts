import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { initStore } from "./product/data/store";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  
  
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
  });

  
  const config = new DocumentBuilder()
    .setTitle('Api Docs')
    .setDescription('Api Docs')
    .setVersion('1.0')
    .build();

  
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/api-docs', app, document);

  await initStore();
  await app.listen(3000);
}
bootstrap();
