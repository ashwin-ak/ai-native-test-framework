/**
 * Comprehensive test logging system
 */
export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  testName?: string;
  message: string;
  metadata?: Record<string, any>;
}

export class TestLogger {
  private logs: LogEntry[] = [];
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';
  private filepath?: string;

  constructor(logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info', filepath?: string) {
    this.logLevel = logLevel;
    this.filepath = filepath;
  }

  /**
   * Log debug message
   */
  debug(message: string, testName?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      this.addLog('debug', testName, message, metadata);
    }
  }

  /**
   * Log info message
   */
  info(message: string, testName?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      this.addLog('info', testName, message, metadata);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, testName?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      this.addLog('warn', testName, message, metadata);
    }
  }

  /**
   * Log error message
   */
  error(message: string, testName?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      this.addLog('error', testName, message, metadata);
    }
  }

  /**
   * Check if should log based on level
   */
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  /**
   * Add log entry
   */
  private addLog(
    level: 'debug' | 'info' | 'warn' | 'error',
    testName: string | undefined,
    message: string,
    metadata?: Record<string, any>
  ): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      testName,
      message,
      metadata,
    };
    
    this.logs.push(entry);
    this.printLog(entry);
    
    if (this.filepath) {
      this.appendToFile(entry);
    }
  }

  /**
   * Print log to console
   */
  private printLog(entry: LogEntry): void {
    const prefix = `[${entry.timestamp.toISOString()}] [${entry.level.toUpperCase()}]${entry.testName ? ` [${entry.testName}]` : ''}`;
    console.log(`${prefix} ${entry.message}`, entry.metadata || '');
  }

  /**
   * Append log to file
   */
  private appendToFile(entry: LogEntry): void {
    try {
      const fs = require('fs');
      const line = `${entry.timestamp.toISOString()} | ${entry.level.toUpperCase()} | ${entry.testName || 'N/A'} | ${entry.message}\n`;
      fs.appendFileSync(this.filepath!, line);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Get logs for specific test
   */
  getLogsForTest(testName: string): LogEntry[] {
    return this.logs.filter(l => l.testName === testName);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: string): LogEntry[] {
    return this.logs.filter(l => l.level === level);
  }

  /**
   * Export logs to file
   */
  exportLogs(filepath: string): void {
    const fs = require('fs');
    const content = this.logs.map(l => 
      `${l.timestamp.toISOString()} | ${l.level.toUpperCase()} | ${l.testName || 'N/A'} | ${l.message}`
    ).join('\n');
    fs.writeFileSync(filepath, content);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Set log level
   */
  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }
}
