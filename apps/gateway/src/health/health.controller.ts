import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '@/core/logger';

@Controller('health')
@ApiTags('Health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly logger: LoggerService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Returns the health status of the API gateway',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
  })
  check() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime)}s`,
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      },
      service: 'gateway',
    };

    this.logger.log(`Health check: ${health.status}`, 'HealthController');
    return health;
  }

  @Get('readiness')
  @ApiOperation({ 
    summary: 'Readiness probe',
    description: 'Checks if the service is ready to accept traffic',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is ready',
  })
  readiness() {
    const memoryUsage = process.memoryUsage();
    const readiness = {
      status: 'ready',
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      },
    };

    this.logger.log(`Readiness check: ${readiness.status}`, 'HealthController');
    return readiness;
  }

  @Get('liveness')
  @ApiOperation({ 
    summary: 'Liveness probe',
    description: 'Checks if the service is alive',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is alive',
  })
  liveness() {
    const liveness = {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    };

    this.logger.debug(`Liveness check: ${liveness.status}`, 'HealthController');
    return liveness;
  }
}

