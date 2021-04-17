import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
    @Prop({required:true})
    clientType: string;

    @Prop({required:true})
    clientName: string;

    @Prop({required:true})
    os:string;

    @Prop({required:true})
    deviceType:string;

    @Prop({required:true, default:"unknown"})
    deviceBrand:string;

    @Prop({default:new Date()})
    date:Date;


}
export const DeviceSchema = SchemaFactory.createForClass(Device);