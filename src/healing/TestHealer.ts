import { TestCase, TestResult, TestStep } from '../core/types';

/**
 * Auto-healing mechanism for brittle tests
 */
export class TestHealer {
  /**
   * Attempt to heal a failing test
   */
  async healTest(
    testCase: TestCase,
    result: TestResult
  ): Promise<{ success: boolean; fix: string; healedSteps: TestStep[] }> {
    const error = result.error || '';

    if (error.includes('not found') || error.includes('selector')) {
      return this.healSelectorIssue(testCase);
    }

    if (error.includes('timeout') || error.includes('wait')) {
      return this.healTimingIssue(testCase);
    }

    if (error.includes('stale')) {
      return this.healStaleBrokenIssue(testCase);
    }

    return {
      success: false,
      fix: 'No healing strategy available',
      healedSteps: testCase.steps,
    };
  }

  /**
   * Heal selector-related issues
   */
  private healSelectorIssue(testCase: TestCase): {
    success: boolean;
    fix: string;
    healedSteps: TestStep[];
  } {
    const healedSteps = testCase.steps.map(step => ({
      ...step,
      // Add more specific selectors
      target: step.target ? this.makeSelectormoreResilient(step.target) : step.target,
    }));

    return {
      success: true,
      fix: 'Made selectors more resilient - added data-testid fallback',
      healedSteps,
    };
  }

  /**
   * Heal timing-related issues
   */
  private healTimingIssue(testCase: TestCase): {
    success: boolean;
    fix: string;
    healedSteps: TestStep[];
  } {
    const healedSteps = testCase.steps.map(step => ({
      ...step,
      waitTime: (step.waitTime || 0) + 2000, // Add 2 seconds
    }));

    return {
      success: true,
      fix: 'Increased wait times and added explicit waits',
      healedSteps,
    };
  }

  /**
   * Heal stale element reference issues
   */
  private healStaleBrokenIssue(testCase: TestCase): {
    success: boolean;
    fix: string;
    healedSteps: TestStep[];
  } {
    const healedSteps = testCase.steps.map(step => ({
      ...step,
      waitTime: (step.waitTime || 0) + 1000,
      // Re-find elements before interaction
      action: step.action.startsWith('wait-') ? step.action : `wait-for-${step.action}`,
    }));

    return {
      success: true,
      fix: 'Added element re-fetching and wait mechanisms',
      healedSteps,
    };
  }

  /**
   * Make selectors more resilient
   */
  private makeSelectormoreResilient(selector: string): string {
    // Add data-testid or use more specific selectors
    if (selector.includes('[')) {
      return selector; // Already using attribute selector
    }
    return `[data-testid="${selector}"], ${selector}`;
  }
}
