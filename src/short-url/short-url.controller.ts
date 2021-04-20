import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/core/enums/role.enum';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { CreateShortUrlSlugDto } from './dto/create-short-url-slug.dto';
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
    return this.shortUrlService.create(createShortUrlDto,device);
  }

  @Post('slug')
  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  createWithSlug(@Body() createShortUrlSlugDto: CreateShortUrlSlugDto, @Req() request) {
    const deviceDetector = new DeviceDetector();
    const userAgent = request.headers['user-agent'];
    const device = deviceDetector.parse(userAgent);
    return this.shortUrlService.createWithSlug(createShortUrlSlugDto,device);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.shortUrlService.findAll();
  }

  @Get('limit/:limit')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getlimited(@Param('limit') limit: string) {
    return this.shortUrlService.getlimited(+limit);
  }

  @Get('statistics')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  statistics() {
    return this.shortUrlService.statistics();
  }

  @Get('statistics/devices')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  statisticsDevices() {
    return this.shortUrlService.statisticsDevices();
  }

  @Get('statistics/shortened')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  totalshortened() {
    return this.shortUrlService.totalshortened();
  }

  @Get('statistics/clicks')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  totalclicks() {
    return this.shortUrlService.totalclicks();
  }

  @Get('statistics/devices/mostused')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  mostuseddevice() {
    return this.shortUrlService.mostUsedDevice();
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
    await this.shortUrlService.remove(id);
    return null;
  }
}
