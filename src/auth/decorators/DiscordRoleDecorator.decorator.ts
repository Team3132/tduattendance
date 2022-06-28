import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'src/constants';

export const Roles = (roles: ROLES[]) => SetMetadata('roles', roles);
