import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { FormatShortUrl } from './dto/format-short-url.dto';
import { UpdateShortUrlDto } from './dto/update-short-url.dto';
import { ShortUrl, ShortUrlDocument } from './schema/shorturl.schema';

@Injectable()
export class ShortUrlService {
  constructor(@InjectModel(ShortUrl.name) private shorturlModel:Model<ShortUrlDocument>){}
  async create(createShortUrlDto: CreateShortUrlDto) {
    const createdShortUrl= new this.shorturlModel(createShortUrlDto);
    try {
      return FormatShortUrl.formatShort(await createdShortUrl.save());
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  findAll() {
    return this.shorturlModel.find();
  }

  async findOne(id: string) {
    const urlByShort= await this.shorturlModel.findOne({shorturl:id})
    console.log({urlByShort})
    urlByShort.clicks++
    urlByShort.save()
    return FormatShortUrl.formatRedirected(urlByShort)
  }

  update(id: number, updateShortUrlDto: UpdateShortUrlDto) {
    return `This action updates a #${id} shortUrl`;
  }

  remove(id: number) {
    return `This action removes a #${id} shortUrl`;
  }
}
