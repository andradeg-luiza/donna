import { BadRequestException, PipeTransform } from '@nestjs/common';

export class PhonePipe implements PipeTransform {
  transform(value: string) {
    if (!/^\d{10,11}$/.test(value)) {
      throw new BadRequestException('Invalid phone number');
    }
    return value;
  }
}
