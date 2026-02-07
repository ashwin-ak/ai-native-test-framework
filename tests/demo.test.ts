import { TestFramework } from '../src';

/**
 * Example usage of the AI-Native Test Framework
 */
async function main() {
  console.log('🚀 Starting AI-Native Test Framework Demo...\n');

  // Initialize the framework
  const framework = new TestFramework({
    enableAutoHealing: true,
    enablePatternDetection: true,
  });

  console.log('📝 Generating test cases...');
  const testCases = await framework.generateTestCases(
    'Test user login and dashboard navigation',
    'cypress',
    3
  );

  console.log(`✅ Generated ${testCases.length} test cases\n`);
  testCases.forEach(tc => console.log(`  - ${tc.name}`));

  console.log('\n🏃 Running all tests...');
  const results = await framework.runAllTests();

  console.log('\n📊 Test Results:');
  results.forEach(result => {
    const icon = result.status === 'passed' ? '✅' : '❌';
    console.log(`  ${icon} ${result.testName} (${result.status}) - ${result.duration}ms`);
  });

  console.log('\n📈 Analytics:');
  const analytics = framework.getAnalytics();
  console.log(`  Total Tests: ${analytics.totalTests}`);
  console.log(`  Passed: ${analytics.passedTests}`);
  console.log(`  Failed: ${analytics.failedTests}`);
  console.log(`  Success Rate: ${(analytics.successRate * 100).toFixed(2)}%`);
  console.log(`  Healed Tests: ${analytics.healedTests}`);
  console.log(`  Avg Duration: ${analytics.averageDuration.toFixed(2)}ms`);

  if (analytics.commonFailures.length > 0) {
    console.log('\n🔍 Common Failure Patterns:');
    analytics.commonFailures.slice(0, 3).forEach(pattern => {
      console.log(`  - ${pattern.pattern}`);
      console.log(`    Frequency: ${pattern.frequency}`);
      console.log(`    Root Cause: ${pattern.rootCause}`);
      console.log(`    Suggestion: ${pattern.suggestion}`);
    });
  }

  console.log('\n✨ Demo complete!');
}

main().catch(console.error);
