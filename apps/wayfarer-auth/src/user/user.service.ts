import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { HttpResponse, UserEntity, RegisterDto } from '@wayfarer/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByUserName(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async registerUser(registerDto: RegisterDto): Promise<any> {
    const { username, password } = registerDto;

    // Check if the user already exists
    const existingUser = await this.findByUserName(username);
    if (existingUser) {
      throw new RpcException({
        code: GrpcStatus.ALREADY_EXISTS,
        message: 'Username already in use',
      });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.insert(user);
    return HttpResponse.success({}, 'User registered successfully');
  }
}
