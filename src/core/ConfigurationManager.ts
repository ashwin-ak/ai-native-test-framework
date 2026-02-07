/**
 * Environment and configuration management
 */
export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiEndpoint: string;
  timeout: number;
  retries: number;
  parallel: boolean;
  headless: boolean;
  env: Record<string, string>;
}

export class ConfigurationManager {
  private configs: Map<string, EnvironmentConfig> = new Map();
  private currentEnvironment: string = 'development';

  constructor() {
    // Setup default environments
    this.setupDefaults();
  }

  /**
   * Setup default environment configurations
   */
  private setupDefaults(): void {
    this.addConfig('development', {
      name: 'development',
      baseUrl: 'http://localhost:3000',
      apiEndpoint: 'http://localhost:3000/api',
      timeout: 30000,
      retries: 3,
      parallel: false,
      headless: false,
      env: {},
    });

    this.addConfig('staging', {
      name: 'staging',
      baseUrl: 'https://staging.example.com',
      apiEndpoint: 'https://staging.example.com/api',
      timeout: 30000,
      retries: 2,
      parallel: true,
      headless: true,
      env: { LOG_LEVEL: 'info' },
    });

    this.addConfig('production', {
      name: 'production',
      baseUrl: 'https://example.com',
      apiEndpoint: 'https://example.com/api',
      timeout: 60000,
      retries: 5,
      parallel: true,
      headless: true,
      env: { LOG_LEVEL: 'error' },
    });
  }

  /**
   * Add or update configuration
   */
  addConfig(environment: string, config: EnvironmentConfig): void {
    this.configs.set(environment, config);
  }

  /**
   * Get configuration for environment
   */
  getConfig(environment?: string): EnvironmentConfig | undefined {
    return this.configs.get(environment || this.currentEnvironment);
  }

  /**
   * Set current environment
   */
  setEnvironment(environment: string): void {
    if (!this.configs.has(environment)) {
      throw new Error(`Environment '${environment}' not configured`);
    }
    this.currentEnvironment = environment;
  }

  /**
   * Get current environment
   */
  getCurrentEnvironment(): string {
    return this.currentEnvironment;
  }

  /**
   * Get all configured environments
   */
  getEnvironments(): string[] {
    return Array.from(this.configs.keys());
  }

  /**
   * Load configuration from file
   */
  loadFromFile(filepath: string): void {
    const fs = require('fs');
    const content = fs.readFileSync(filepath, 'utf-8');
    const configs = JSON.parse(content);
    
    Object.entries(configs).forEach(([env, config]) => {
      this.addConfig(env, config as EnvironmentConfig);
    });
  }

  /**
   * Override configuration value
   */
  override(environment: string, key: string, value: any): void {
    const config = this.configs.get(environment);
    if (config) {
      (config as any)[key] = value;
    }
  }
}
