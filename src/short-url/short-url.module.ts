import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from 'src/device/schema/device.schema';
import { ShortUrl, ShortUrlSchema } from './schema/shorturl.schema';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: ShortUrl.name, schema: ShortUrlSchema },
      { name: Device.name, schema: DeviceSchema },
    ])
  ],
  controllers: [ShortUrlController],
  providers: [ShortUrlService]
})
export class ShortUrlModule {}
