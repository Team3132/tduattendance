import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prismaService: PrismaService) {}

  createAttendance(data: Prisma.AttendanceCreateInput) {
    return this.prismaService.attendance.create({
      data,
    });
  }

  attendances(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AttendanceWhereUniqueInput;
    where?: Prisma.AttendanceWhereInput;
    orderBy?: Prisma.AttendanceOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.attendance.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  attendance(attendanceWhereUniqueInput: Prisma.AttendanceWhereUniqueInput) {
    return this.prismaService.rSVP.findUnique({
      where: attendanceWhereUniqueInput,
    });
  }

  firstAttendance(rsvpWhereFirstInput: Prisma.AttendanceWhereInput) {
    return this.prismaService.attendance.findFirst({
      where: rsvpWhereFirstInput,
    });
  }

  upsertAttendance(params: {
    where: Prisma.AttendanceWhereUniqueInput;
    create: Prisma.AttendanceCreateInput;
    update: Prisma.AttendanceUpdateInput;
  }) {
    const { where, update, create } = params;
    return this.prismaService.attendance.upsert({
      where,
      create,
      update,
    });
  }

  updateAttendance(params: {
    where: Prisma.AttendanceWhereUniqueInput;
    data: Prisma.AttendanceUpdateInput;
  }) {
    const { data, where } = params;
    return this.prismaService.attendance.update({
      data,
      where,
    });
  }

  deleteAttendance(where: Prisma.AttendanceWhereUniqueInput) {
    return this.prismaService.attendance.delete({ where });
  }
}
