import { ApiProperty } from '@nestjs/swagger';

/**
 * Base API Response DTO
 */
export class BaseResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ example: 'Operation successful', required: false })
  message?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  timestamp?: string;
}

/**
 * Error Response DTO
 */
export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Error message' })
  message: string;

  @ApiProperty({ example: 'ERROR_CODE', required: false })
  error?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp: string;
}

