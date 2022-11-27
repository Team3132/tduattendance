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
  ApiOperation,
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

  /**
   * Create Scancode
   * @returns {Scancode}
   */
  @Post()
  @ApiOperation({
    summary: 'Get a scancode by code',
    operationId: 'getScancode',
  })
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

  /**
   * Get a list of all scancodes for the signed in user
   * @returns {Scancode[]}
   */
  @ApiOkResponse({ type: [Scancode] })
  @ApiOperation({
    summary: 'Get a list of all scancodes for the signed in user',
    operationId: 'getScancodes',
  })
  @Get()
  findAll(@GetUser('id') userId: Express.User['id']) {
    return this.scancodeService.scancodes({
      where: {
        userId,
      },
    });
  }

  /**
   * Delete a scancode by code
   * @returns {Scancode}
   */
  @ApiOkResponse({ type: Scancode })
  @ApiOperation({
    summary: 'Delete a scancode by code',
    operationId: 'deleteScancode',
  })
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
