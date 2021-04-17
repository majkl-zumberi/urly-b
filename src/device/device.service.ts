import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device, DeviceDocument } from './schema/device.schema';

@Injectable()
export class DeviceService {
  constructor(@InjectModel(Device.name) private deviceModel:Model<DeviceDocument>){}
  create(createDeviceDto: CreateDeviceDto) {
    const createdDevice= new this.deviceModel(createDeviceDto);
    try {
      return createdDevice.save();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  findAll() {
    return this.deviceModel.find();
  }

  findOne(id: number) {
    return this.deviceModel.findOne({_id:id});
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return this.deviceModel.findByIdAndUpdate({_id:id},updateDeviceDto,{new:true});
  }

  async remove(id: number) {
    return await this.deviceModel.deleteOne({_id: id});
  }
}
