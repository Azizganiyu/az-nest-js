import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class HelperService {
  generateRandomNumber(length = 6) {
    return (
      Math.random().toString(36).substring(2, length) +
      Math.random().toString(36).substring(2, length)
    );
  }
  generateReference() {
    return this.generateRandomNumber(21);
  }
  // generateRandomString(minLength = 0, acc = ''): any {
  //   if (acc.length <= minLength) {
  //     const str = Math.random().toString(36).slice(2);
  //     return this.generateRandomString(minLength, acc.concat(str));
  //   }
  //   return acc.slice(0, minLength);
  // }
  generateHash() {
    return uuid.v4();
  }
  // generateCode(length = 5) {
  //   const random = Math.floor(
  //     Math.pow(10, length - 1) +
  //       Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
  //   );
  //   return String(random);
  // }
  checkExpired(date) {
    if (!date) {
      return true;
    }
    const now = new Date();
    const expire = new Date(date);
    if (now.getTime() > expire.getTime()) {
      return true;
    }
    return false;
  }
  // generatePassword(length = 10) {
  //   const chars =
  //     '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   const passwordLength = length;
  //   let password = '';
  //   for (let i = 0; i <= passwordLength; i++) {
  //     const randomNumber = Math.floor(Math.random() * chars.length);
  //     password += chars.substring(randomNumber, randomNumber + 1);
  //   }
  //   return password;
  // }
  setDateFuture(seconds) {
    const time = new Date();
    time.setSeconds(time.getSeconds() + parseInt(seconds) + 5);
    return time;
  }
  // addToDate(date, seconds) {
  //   const time = new Date(date);
  //   time.setSeconds(time.getSeconds() + parseInt(seconds));
  //   return time;
  // }
  // getTimeRemaining(endtime) {
  //   const now = new Date();
  //   const expire = new Date(endtime);
  //   const total = expire.getTime() - now.getTime();
  //   const seconds = Math.floor((total / 1000) % 60);
  //   const minutes = Math.floor((total / 1000 / 60) % 60);
  //   const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  //   const days = Math.floor(total / (1000 * 60 * 60 * 24));
  //   return [total, days, hours, minutes, seconds];
  // }
}
