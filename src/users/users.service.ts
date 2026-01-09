import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { TasksRepository } from '../tasks/tasks.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async createUser(data: CreateUserDto) {
    return this.usersRepository.createUser(data);
  }

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

  async deleteUser(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete tasks first (safe delete)
    await this.tasksRepository.deleteTasksByUserId(id);

    // Delete user
    await this.usersRepository.deleteUser(id);

    return { message: 'User deleted successfully' };
  }
}
