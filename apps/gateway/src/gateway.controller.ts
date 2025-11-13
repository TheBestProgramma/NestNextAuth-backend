import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  @ApiOperation({ summary: 'API Information', description: 'Get API information and available endpoints' })
  @ApiResponse({ status: 200, description: 'API information' })
  getHello() {
    return {
      message: 'Welcome to NestNextAuth API Gateway',
      version: '1.0',
      endpoints: {
        documentation: '/api',
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          users: 'GET /auth/users',
        },
      },
    };
  }
}
