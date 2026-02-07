/**
 * Test data and fixtures management
 */
export class TestDataManager {
  private testData: Map<string, any> = new Map();
  private fixtures: Map<string, any> = new Map();

  /**
   * Add test data
   */
  addTestData(key: string, data: any): void {
    this.testData.set(key, data);
  }

  /**
   * Get test data
   */
  getTestData(key: string): any {
    return this.testData.get(key);
  }

  /**
   * Add fixture (reusable test setup)
   */
  addFixture(name: string, fixture: any): void {
    this.fixtures.set(name, fixture);
  }

  /**
   * Get fixture
   */
  getFixture(name: string): any {
    return this.fixtures.get(name);
  }

  /**
   * Generate test data set
   */
  generateTestDataSet(template: any, count: number): any[] {
    const dataSet: any[] = [];
    for (let i = 0; i < count; i++) {
      const data = { ...template };
      // Add variation based on index
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
          data[key] = `${data[key]}_${i}`;
        }
      });
      dataSet.push(data);
    }
    return dataSet;
  }

  /**
   * Import test data from file
   */
  importFromFile(filepath: string, format: 'json' | 'csv' = 'json'): void {
    const fs = require('fs');
    const content = fs.readFileSync(filepath, 'utf-8');
    
    if (format === 'json') {
      const data = JSON.parse(content);
      Object.entries(data).forEach(([key, value]) => {
        this.testData.set(key, value);
      });
    }
  }

  /**
   * Export test data
   */
  exportToFile(filepath: string, format: 'json' | 'csv' = 'json'): void {
    const fs = require('fs');
    const data = Object.fromEntries(this.testData);
    
    if (format === 'json') {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    }
  }

  /**
   * Clear test data
   */
  clearTestData(): void {
    this.testData.clear();
  }

  /**
   * Get all test data keys
   */
  getKeys(): string[] {
    return Array.from(this.testData.keys());
  }
}
