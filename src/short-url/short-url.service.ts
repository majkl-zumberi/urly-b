import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from 'src/device/schema/device.schema';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { FormatShortUrl } from './dto/format-short-url.dto';
import { UpdateShortUrlDto } from './dto/update-short-url.dto';
import { ShortUrl, ShortUrlDocument } from './schema/shorturl.schema';

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectModel(ShortUrl.name) private shorturlModel:Model<ShortUrlDocument>,
    @InjectModel(Device.name) private deviceModel:Model<DeviceDocument>){}
  async create(createShortUrlDto: CreateShortUrlDto, deviceInfo:any) {
    const createdDeviceInfo= new this.deviceModel({
      clientType:deviceInfo.client.type || "unknown",
      clientName:deviceInfo.client.name || "unknown", 
      os:deviceInfo.os.name || "unknown",
      deviceType:deviceInfo.device.type || "unknown",
      deviceBrand:deviceInfo.device.brand || "unknown",
      date:new Date()
    });
    const createdDevice = await createdDeviceInfo.save();
    const createdShortUrl= new this.shorturlModel({
      ...createShortUrlDto,
      devices:createdDevice.id
    });
    try {
      return FormatShortUrl.formatShort(await createdShortUrl.save());
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  findAll() {
    return this.shorturlModel.find().populate('devices').exec();
  }

  async findOne(id: string,deviceInfo:any) {
    const urlByShort= await this.shorturlModel.findOne({shorturl:id})
    if(!urlByShort) throw new BadRequestException("link scaduto o non esistente!")
    console.log({urlByShort})
    urlByShort.clicks++
    const createdDeviceInfo= new this.deviceModel({
      clientType:deviceInfo.client.type || "unknown",
      clientName:deviceInfo.client.name || "unknown", 
      os:deviceInfo.os.name || "unknown",
      deviceType:deviceInfo.device.type || "unknown",
      deviceBrand:deviceInfo.device.brand || "unknown",
      date:new Date()
    });
    const createdDevice = await createdDeviceInfo.save();
    urlByShort.devices.push(createdDevice.id);
    urlByShort.save()
    return FormatShortUrl.formatRedirected(urlByShort)
  }

  update(id: number, updateShortUrlDto: UpdateShortUrlDto) {
    return this.shorturlModel.findByIdAndUpdate({_id:id},updateShortUrlDto,{new:true});
  }

  async remove(id: number) {
    return await this.shorturlModel.deleteOne({_id: id});
  }
}
