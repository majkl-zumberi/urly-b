import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortUrlModule } from './short-url/short-url.module';
@Module({
  imports: [
    ShortUrlModule,
    MongooseModule.forRoot('mongodb://localhost/urly')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
