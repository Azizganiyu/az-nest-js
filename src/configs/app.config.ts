import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV,
  serverUrl: process.env.APP_SERVER_URL,
}));
