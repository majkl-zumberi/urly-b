import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { ShortUrlModule } from './short-url/short-url.module';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb://localhost/urly',
        useNewUrlParser: true
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    WinstonModule,
    ShortUrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;
  constructor(private _configService: ConfigService) {
    AppModule.port = this._configService.get('PORT');
    console.log('AppModule.port', AppModule.port);
  }
}
