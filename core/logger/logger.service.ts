import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  error(message: string, context?: string, trace?: string) {
    this.logger.error(message, trace, context || 'Application');
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context || 'Application');
  }

  log(message: string, context?: string) {
    this.logger.log(message, context || 'Application');
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context || 'Application');
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context || 'Application');
  }
}

