import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { UpdateShortUrlDto } from './dto/update-short-url.dto';
import { ShortUrlService } from './short-url.service';
import DeviceDetector = require("device-detector-js")
@Controller('short-url')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post()
  create(@Body() createShortUrlDto: CreateShortUrlDto, @Req() request) {
    const deviceDetector = new DeviceDetector();
    const userAgent = request.headers['user-agent'];
    const device = deviceDetector.parse(userAgent);
    console.log({device})
    return this.shortUrlService.create(createShortUrlDto,device);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.shortUrlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request) {
    const deviceDetector = new DeviceDetector();
    const userAgent = request.headers['user-agent'];
    const device = deviceDetector.parse(userAgent);
    console.log({device})
    return this.shortUrlService.findOne(id,device);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(@Param('id') id: string, @Body() updateShortUrlDto: UpdateShortUrlDto) {
    return this.shortUrlService.update(+id, updateShortUrlDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: string) {
    await this.shortUrlService.remove(+id);
    return null;
  }
}
