import { User } from 'src/modules/user/entities/user.entity';
import { ISeeder } from '../seed.interface';

const values: User[] = [
  {
    first_name: 'Dev',
    last_name: 'Admin',
    email: 'admin@dev.com',
    password: '$2b$10$8.cGi0jwixByxODiYP2b2uCwN3ujasPUD/0RuS3L68AX.RidTq7mO',
    address: 'dev city',
    roleId: 'admin',
  },
];

export const AdminSeed: ISeeder = {
  table: 'user',
  data: values,
};
