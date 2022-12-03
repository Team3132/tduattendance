import { Module } from '@nestjs/common';
import { AuthenticatorGateway } from './authenticator.gateway';
import { AuthenticatorService } from './authenticator.service';

@Module({
  providers: [AuthenticatorGateway, AuthenticatorService],
  exports: [AuthenticatorService],
})
export class AuthenticatorModule {}
