import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ScancodeService } from './scancode.service';
import { CreateScancodeDto } from './dto/create-scancode.dto';
import { UpdateScancodeDto } from './dto/update-scancode.dto';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { Scancode } from './entities/scancode.entity';

@ApiTags('Scancode')
@UseGuards(SessionGuard)
@ApiCookieAuth()
@Controller('scancode')
export class ScancodeController {
  constructor(private readonly scancodeService: ScancodeService) {}

  @Post()
  @ApiCreatedResponse({ type: Scancode })
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

  @ApiOkResponse({ type: [Scancode] })
  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.scancodeService.scancodes({
      where: {
        userId,
      },
    });
  }

  @ApiOkResponse({ type: Scancode })
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser('id') userId: string) {
    const scancode = await this.scancodeService.scancode({ code: id });
    if (scancode.userId !== userId) {
      throw new ForbiddenException();
    }
    return this.scancodeService.deleteScancode({ code: id });
  }
}
