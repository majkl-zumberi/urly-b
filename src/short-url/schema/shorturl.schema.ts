import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as shortid from 'shortid';
import * as mongoose from 'mongoose';
import { Device } from '../../device/schema/device.schema';
export type ShortUrlDocument = ShortUrl & Document;

@Schema()
export class ShortUrl {
    @Prop({required:true})
    fullurl: string;

    @Prop({default:shortid.generate})
    shorturl:string;

    @Prop({default:0})
    clicks:number;

    @Prop({
        type: [{ type: [mongoose.Schema.Types.ObjectId], ref: 'Device' }],
        required: false,
      })
    devices: [Device];
}
export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
ShortUrlSchema.set('toJSON', { virtuals: true });