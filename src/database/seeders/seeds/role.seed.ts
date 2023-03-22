import { Role } from 'src/modules/role/entities/role.entity';
import { ISeeder } from '../seed.interface';

const values: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
  },
  {
    id: 'user',
    name: 'User',
  },
];

export const RoleSeed: ISeeder = {
  table: 'role',
  data: values,
};
