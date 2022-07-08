import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScancodeService } from './scancode.service';
import { CreateScancodeDto } from './dto/create-scancode.dto';
import { UpdateScancodeDto } from './dto/update-scancode.dto';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';

@Controller('scancode')
export class ScancodeController {
  constructor(private readonly scancodeService: ScancodeService) {}

  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() createScancodeDto: CreateScancodeDto,
  ) {
    return this.scancodeService.createScancode({
      ...createScancodeDto,
      user: {
        connect: {
          id: userId,
        },
      },
    });
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.scancodeService.scancodes({
      where: {
        userId,
      },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.scancodeService.deleteScancode({ code: id, userId });
  }
}
