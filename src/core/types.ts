/**
 * Core type definitions for the test framework
 */

export interface TestConfig {
  apiKey?: string;
  maxRetries?: number;
  timeout?: number;
  enableAutoHealing?: boolean;
  enablePatternDetection?: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  expectedResults: string[];
  generatedAt?: Date;
  lastModified?: Date;
  metadata?: Record<string, any>;
}

export interface TestStep {
  action: string;
  target?: string;
  value?: string;
  waitTime?: number;
}

export interface TestResult {
  testId: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  stackTrace?: string;
  timestamp: Date;
  attempts: number;
  healed?: boolean;
  suggestedFix?: string;
}

export interface FailurePattern {
  pattern: string;
  frequency: number;
  occurrences: TestResult[];
  rootCause?: string;
  suggestion?: string;
}

export interface TestAnalytics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  successRate: number;
  averageDuration: number;
  commonFailures: FailurePattern[];
  healedTests: number;
}
