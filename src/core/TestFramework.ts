import { TestCase, TestResult, TestConfig, TestAnalytics } from './types';
import { AITestGenerator } from '../ai/TestGenerator';
import { TestHealer } from '../healing/TestHealer';
import { PatternDetector } from './PatternDetector';

/**
 * Main test framework orchestrator
 */
export class TestFramework {
  private config: TestConfig;
  private testCases: Map<string, TestCase> = new Map();
  private testResults: TestResult[] = [];
  private aiGenerator: AITestGenerator;
  private testHealer: TestHealer;
  private patternDetector: PatternDetector;

  constructor(config: TestConfig = {}) {
    this.config = {
      maxRetries: 3,
      timeout: 30000,
      enableAutoHealing: true,
      enablePatternDetection: true,
      ...config,
    };

    this.aiGenerator = new AITestGenerator(config.apiKey);
    this.testHealer = new TestHealer();
    this.patternDetector = new PatternDetector();
  }

  /**
   * Generate test cases using AI
   */
  async generateTestCases(
    description: string,
    framework: 'cypress' | 'puppeteer' | 'selenium' | 'playwright' = 'cypress',
    count: number = 5
  ): Promise<TestCase[]> {
    const generatedCases = await this.aiGenerator.generateTests(
      description,
      framework,
      count
    );
    
    generatedCases.forEach(testCase => {
      this.testCases.set(testCase.id, testCase);
    });

    return generatedCases;
  }

  /**
   * Run a specific test case
   */
  async runTest(testId: string): Promise<TestResult> {
    const testCase = this.testCases.get(testId);
    if (!testCase) {
      throw new Error(`Test case ${testId} not found`);
    }

    let result: TestResult | null = null;
    let attempts = 0;

    for (attempts = 1; attempts <= (this.config.maxRetries || 3); attempts++) {
      try {
        result = await this.executeTest(testCase, attempts);
        
        if (result.status === 'passed') {
          break;
        }

        // Try auto-healing
        if (this.config.enableAutoHealing && attempts < (this.config.maxRetries || 3)) {
          const healed = await this.testHealer.healTest(testCase, result);
          if (healed.success) {
            result.healed = true;
            result.suggestedFix = healed.fix;
            testCase.steps = healed.healedSteps;
            continue;
          }
        }
      } catch (error) {
        result = {
          testId,
          testName: testCase.name,
          status: 'failed',
          duration: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
          attempts,
        };
      }
    }

    if (!result) {
      result = {
        testId,
        testName: testCase.name,
        status: 'failed',
        duration: 0,
        error: 'Test failed after all retries',
        timestamp: new Date(),
        attempts,
      };
    }

    this.testResults.push(result);
    return result;
  }

  /**
   * Execute a test (placeholder for actual implementation)
   */
  private async executeTest(testCase: TestCase, attempt: number): Promise<TestResult> {
    const startTime = Date.now();
    
    // Simulate test execution
    const passed = Math.random() > 0.3 || attempt > 1; // 70% failure on first attempt
    const duration = Date.now() - startTime;

    return {
      testId: testCase.id,
      testName: testCase.name,
      status: passed ? 'passed' : 'failed',
      duration,
      timestamp: new Date(),
      attempts: attempt,
      error: passed ? undefined : 'Element not found',
    };
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    for (const testId of this.testCases.keys()) {
      const result = await this.runTest(testId);
      results.push(result);
    }

    return results;
  }

  /**
   * Get analytics and failure patterns
   */
  getAnalytics(): TestAnalytics {
    const patterns = this.patternDetector.detectPatterns(this.testResults);
    
    const passedTests = this.testResults.filter(r => r.status === 'passed').length;
    const failedTests = this.testResults.filter(r => r.status === 'failed').length;
    const skippedTests = this.testResults.filter(r => r.status === 'skipped').length;
    const healedTests = this.testResults.filter(r => r.healed).length;

    return {
      totalTests: this.testResults.length,
      passedTests,
      failedTests,
      skippedTests,
      successRate: this.testResults.length > 0 ? passedTests / this.testResults.length : 0,
      averageDuration: this.testResults.reduce((sum, r) => sum + r.duration, 0) / this.testResults.length || 0,
      commonFailures: patterns,
      healedTests,
    };
  }

  /**
   * Get all test cases
   */
  getTestCases(): TestCase[] {
    return Array.from(this.testCases.values());
  }

  /**
   * Get test results
   */
  getResults(): TestResult[] {
    return this.testResults;
  }
}
