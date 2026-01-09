import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByPhone(phone: string) {
    const user = await this.usersRepository.findByPhone(phone);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: { name: string; phone: string }) {
    const existing = await this.usersRepository.findByPhone(data.phone);

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    return this.usersRepository.createUser(data);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.deleteUser(id);

    return { message: 'User deleted successfully' };
  }
}
