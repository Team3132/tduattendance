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
  ConflictException,
} from '@nestjs/common';
import { ScancodeService } from './scancode.service';
import { CreateScancodeDto } from './dto/create-scancode.dto';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SessionGuard } from 'src/auth/guard/session.guard';
import { Scancode } from './entities/scancode.entity';
import { Prisma } from '@prisma/client';

@ApiTags('Scancode')
@UseGuards(SessionGuard)
@ApiCookieAuth()
@Controller('scancode')
export class ScancodeController {
  constructor(private readonly scancodeService: ScancodeService) {}

  @Post()
  @ApiCreatedResponse({ type: Scancode })
  async create(
    @GetUser('id') userId: Express.User['id'],
    @Body() createScancodeDto: CreateScancodeDto,
  ) {
    try {
      const response = await this.scancodeService.createScancode({
        ...createScancodeDto,
        user: {
          connect: {
            id: userId,
          },
        },
      });
      return response;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Scancode already exists');
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  @ApiOkResponse({ type: [Scancode] })
  @Get()
  findAll(@GetUser('id') userId: Express.User['id']) {
    return this.scancodeService.scancodes({
      where: {
        userId,
      },
    });
  }

  @ApiOkResponse({ type: Scancode })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: Express.User['id'],
  ) {
    const scancode = await this.scancodeService.scancode({ code: id });
    if (scancode.userId !== userId) {
      throw new ForbiddenException();
    }
    return this.scancodeService.deleteScancode({ code: id });
  }
}
