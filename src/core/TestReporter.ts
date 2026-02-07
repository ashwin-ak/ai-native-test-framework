import { TestResult, TestAnalytics } from './types';

/**
 * Test result reporting and export
 */
export class TestReporter {
  private results: TestResult[] = [];

  /**
   * Add test result
   */
  addResult(result: TestResult): void {
    this.results.push(result);
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(title: string = 'Test Report'): string {
    const passCount = this.results.filter(r => r.status === 'passed').length;
    const failCount = this.results.filter(r => r.status === 'failed').length;
    const skipCount = this.results.filter(r => r.status === 'skipped').length;
    const successRate = this.results.length > 0 
      ? ((passCount / this.results.length) * 100).toFixed(2) 
      : 0;

    const rows = this.results.map(r => `
      <tr>
        <td>${r.testName}</td>
        <td><span class="status ${r.status}">${r.status.toUpperCase()}</span></td>
        <td>${r.duration}ms</td>
        <td>${r.attempts}</td>
        <td>${r.healed ? 'Yes' : 'No'}</td>
        <td>${r.error || '-'}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
          .status { padding: 5px 10px; border-radius: 3px; font-weight: bold; }
          .status.passed { background: #4CAF50; color: white; }
          .status.failed { background: #f44336; color: white; }
          .status.skipped { background: #FFC107; color: white; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #333; color: white; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="summary">
          <h2>Summary</h2>
          <p>Total Tests: ${this.results.length}</p>
          <p>Passed: <span style="color: green;">${passCount}</span></p>
          <p>Failed: <span style="color: red;">${failCount}</span></p>
          <p>Skipped: <span style="color: orange;">${skipCount}</span></p>
          <p>Success Rate: ${successRate}%</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Attempts</th>
              <th>Healed</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * Generate JSON report
   */
  generateJSONReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      passedTests: this.results.filter(r => r.status === 'passed').length,
      failedTests: this.results.filter(r => r.status === 'failed').length,
      skippedTests: this.results.filter(r => r.status === 'skipped').length,
      results: this.results,
    };
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export results to file
   */
  exportToFile(filepath: string, format: 'html' | 'json' = 'json'): void {
    const fs = require('fs');
    const content = format === 'html' 
      ? this.generateHTMLReport() 
      : this.generateJSONReport();
    fs.writeFileSync(filepath, content);
  }

  /**
   * Get results summary
   */
  getSummary() {
    return {
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      skipped: this.results.filter(r => r.status === 'skipped').length,
      healed: this.results.filter(r => r.healed).length,
    };
  }
}
