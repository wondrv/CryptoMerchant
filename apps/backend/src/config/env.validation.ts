import * as Joi from 'joi';

export const AppConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(4000),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  APP_URL: Joi.string().uri().required(),
  API_URL: Joi.string().uri().required(),
  ENABLE_SWAGGER: Joi.boolean().default(false),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000).default(60000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().min(1).default(100),
  TRON_MOCK_CONFIRMATIONS: Joi.number().default(2),
  ETHEREUM_MOCK_CONFIRMATIONS: Joi.number().default(3),
  WALLET_ENCRYPTION_KEY: Joi.string().length(32).required()
});
