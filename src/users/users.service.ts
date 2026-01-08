import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(phone: string, name?: string) {
    const existing = await this.usersRepository.findByPhone(phone);

    if (existing) {
      throw new BadRequestException('User with this phone already exists');
    }

    return this.usersRepository.createUser(phone, name);
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async listUsers() {
    return this.usersRepository.listUsers();
  }
}
