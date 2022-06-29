import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createAttendanceDto: CreateAttendanceDto) {
    return this.prismaService.attendance.create({ data: createAttendanceDto });
  }

  findAll() {
    return this.prismaService.attendance.findMany();
  }

  findOne(id: string) {
    return this.prismaService.attendance.findUnique({ where: { id } });
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return this.prismaService.attendance.update({
      where: { id },
      data: updateAttendanceDto,
    });
  }

  remove(id: string) {
    return this.prismaService.attendance.delete({ where: { id } });
  }
}
