import { ApiProperty } from '@nestjs/swagger';

export class AuthStatusDto {
  @ApiProperty()
  isAuthenticated: boolean;
}
