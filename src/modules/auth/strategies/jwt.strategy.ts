import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { HelperService } from 'src/services/helper/helper.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private jwt: JwtService,
    private _user: UserService,
    configService: ConfigService,
    private _session: SessionService,
    private _helper: HelperService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //secretOrKey: configService.get<string>('auth.secret'),
      secretOrKeyProvider: async (request, jwtToken, done) => {
        this._session.token = jwtToken;
        done(null, configService.get<string>('auth.secret'));
      },
    });
  }

  async validate(payload: any): Promise<any> {
    let user = null;
    console.log(payload.user);
    try {
      user = await this._user.findOne(payload.user);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('user not found');
    }
    if (!user.status) {
      throw new UnauthorizedException('user is not active');
    }
    await this._session.validateSession();
    if (!user.two_factor_authentication) {
      return {
        ...payload,
        ...user,
      };
    }
    if (payload.isSecondFactorAuthenticated) {
      return {
        ...payload,
        ...user,
      };
    }
  }
}
