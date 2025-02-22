import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpResponse } from '@wayfarer/common';
import { User } from './user.entity';
import { RegisterDto } from './register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findByUserName(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async registerUser(registerDto: RegisterDto): Promise<any> {
    const { username, password } = registerDto;

    // Check if the user already exists
    const existingUser = await this.findByUserName(username);
    if (existingUser) {
      throw new ConflictException('Username already in use');
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = this.userRepository.create({ username, password: hashedPassword });
    await this.userRepository.insert(user);
     return HttpResponse.success({}, 'User registered successfully');
  }
}
