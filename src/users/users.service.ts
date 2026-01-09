import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Cria um usuário garantindo que o telefone não exista.
   */
  async createUser(dto: CreateUserDto) {
    const existing = await this.usersRepository.findByPhone(dto.phone);

    if (existing) {
      throw new ConflictException('User with this phone already exists');
    }

    return this.usersRepository.create(dto);
  }

  /**
   * Busca um usuário pelo ID.
   */
  async getUserById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Lista todos os usuários.
   */
  async listUsers() {
    return this.usersRepository.findAll();
  }

  /**
   * Deleta um usuário pelo ID.
   */
  async deleteUser(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete(id);

    return {
      success: true,
    };
  }

  /**
   * Método auxiliar usado pelo módulo de tasks:
   * tenta buscar por ID; se não achar, tenta por telefone.
   */
  async getUserByIdOrPhone(value: string) {
    // tenta por ID
    const byId = await this.usersRepository.findById(value);
    if (byId) return byId;

    // tenta por telefone
    const byPhone = await this.usersRepository.findByPhone(value);
    if (byPhone) return byPhone;

    return null;
  }
}
