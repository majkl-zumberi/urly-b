import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as shortid from 'shortid';

export type ShortUrlDocument = ShortUrl & Document;

@Schema()
export class ShortUrl {
    @Prop({required:true})
    fullurl: string;

    @Prop({default:shortid.generate})
    shorturl:string;

    @Prop({default:0})
    clicks:number;
}
export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);