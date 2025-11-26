/**
 * Environment configuration
 * Validates and exports environment variables
 */

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export const environment = {
  nodeEnv: (process.env.NODE_ENV || Environment.Development) as Environment,
  isDevelopment: process.env.NODE_ENV === Environment.Development,
  isProduction: process.env.NODE_ENV === Environment.Production,
  isTest: process.env.NODE_ENV === Environment.Test,
};

/**
 * Validates required environment variables
 */
export function validateEnvironment(): void {
  const required = ['MONGODB_URI', 'JWT_SECRET'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}

