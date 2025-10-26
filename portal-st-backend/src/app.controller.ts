import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { LoginDto } from '../src/auth/dto/login.dto';
import { RegisterDto } from '../src/auth/dto/register.dto';

@Controller('auth')  // ← IMPORTANTE: Sem o /api aqui
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('📝 POST /auth/register', registerDto.email);
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('🔐 POST /auth/login', loginDto.email);
    return this.authService.login(loginDto);
  }
}