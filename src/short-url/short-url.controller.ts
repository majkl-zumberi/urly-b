import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { UpdateShortUrlDto } from './dto/update-short-url.dto';
import { ShortUrlService } from './short-url.service';

@Controller('short-url')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post()
  create(@Body() createShortUrlDto: CreateShortUrlDto) {
    return this.shortUrlService.create(createShortUrlDto);
  }

  @Get()
  findAll() {
    return this.shortUrlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shortUrlService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShortUrlDto: UpdateShortUrlDto) {
    return this.shortUrlService.update(+id, updateShortUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shortUrlService.remove(+id);
  }
}
