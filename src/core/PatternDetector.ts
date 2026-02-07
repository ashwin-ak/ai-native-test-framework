import { TestResult, FailurePattern } from './types';

/**
 * Detects patterns in test failures
 */
export class PatternDetector {
  /**
   * Detect common failure patterns from test results
   */
  detectPatterns(results: TestResult[]): FailurePattern[] {
    const errorMap = new Map<string, TestResult[]>();

    // Group errors by message
    results.forEach(result => {
      if (result.error) {
        const key = this.extractPattern(result.error);
        if (!errorMap.has(key)) {
          errorMap.set(key, []);
        }
        errorMap.get(key)!.push(result);
      }
    });

    // Convert to patterns and sort by frequency
    const patterns: FailurePattern[] = Array.from(errorMap.entries())
      .map(([pattern, occurrences]) => ({
        pattern,
        frequency: occurrences.length,
        occurrences,
        rootCause: this.analyzeRootCause(pattern, occurrences),
        suggestion: this.generateSuggestion(pattern),
      }))
      .sort((a, b) => b.frequency - a.frequency);

    return patterns;
  }

  /**
   * Extract the core pattern from an error message
   */
  private extractPattern(error: string): string {
    // Remove timestamps, IDs, and other variable content
    return error
      .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z/g, '[TIMESTAMP]')
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[UUID]')
      .replace(/\b\d+\b/g, '[NUMBER]')
      .substring(0, 100); // Truncate to first 100 chars
  }

  /**
   * Analyze the root cause of a pattern
   */
  private analyzeRootCause(pattern: string, occurrences: TestResult[]): string {
    if (pattern.includes('not found') || pattern.includes('timeout')) {
      return 'Flaky selector or timing issue';
    }
    if (pattern.includes('permission') || pattern.includes('unauthorized')) {
      return 'Authentication/authorization issue';
    }
    if (pattern.includes('network') || pattern.includes('connection')) {
      return 'Network connectivity issue';
    }
    return 'Unknown root cause';
  }

  /**
   * Generate a suggestion for fixing the pattern
   */
  private generateSuggestion(pattern: string): string {
    if (pattern.includes('not found')) {
      return 'Use more resilient selectors (data-testid, accessibility attributes)';
    }
    if (pattern.includes('timeout')) {
      return 'Increase timeout or add explicit waits for element visibility';
    }
    if (pattern.includes('permission')) {
      return 'Verify correct credentials and permissions are used in test setup';
    }
    return 'Review test steps and application behavior';
  }
}
