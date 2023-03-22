import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { HelperService } from 'src/services/helper/helper.service';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './session/session.service';
import * as DeviceDetector from 'device-detector-js';

@Injectable()
export class AuthService {
  constructor(
    private _user: UserService,
    private jwtService: JwtService,
    private _helper: HelperService,
    private configService: ConfigService,
    private _session: SessionService,
  ) {}

  async loginUser(user: User, headers) {
    const userAgent = headers['user-agent'];
    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);
    const accessToken = this.getCookieWithJwtAccessToken(user);
    await this._session.save(user, accessToken, device);
    return {
      user: user,
      access_token: accessToken,
    };
  }

  async validateUser(email: string, userpassword: string): Promise<any> {
    const user = await this._user.findUserWithEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or Password 1');
    }
    if (await bcrypt.compare(userpassword, user.password)) {
      return user;
    }
    throw new BadRequestException('Invalid email or Password 2');
  }

  getCookieWithJwtAccessToken(
    user: User,
    isSecondFactorAuthenticated = false,
    role = 'user',
  ) {
    const payload = { user: user.id, isSecondFactorAuthenticated, role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.secret'),
    });
    return token;
  }
}
