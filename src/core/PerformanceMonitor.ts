import { TestResult } from './types';

/**
 * Performance monitoring and metrics collection
 */
export interface PerformanceMetric {
  testName: string;
  durations: number[];
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  standardDeviation: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();

  /**
   * Record test execution time
   */
  recordMetric(testName: string, duration: number): void {
    const metric = this.metrics.get(testName);
    
    if (!metric) {
      this.metrics.set(testName, {
        testName,
        durations: [duration],
        averageDuration: duration,
        minDuration: duration,
        maxDuration: duration,
        standardDeviation: 0,
      });
    } else {
      metric.durations.push(duration);
      this.updateMetric(metric);
    }
  }

  /**
   * Update metric calculations
   */
  private updateMetric(metric: PerformanceMetric): void {
    const { durations } = metric;
    
    metric.minDuration = Math.min(...durations);
    metric.maxDuration = Math.max(...durations);
    metric.averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    // Calculate standard deviation
    const variance = durations.reduce((sum, d) => 
      sum + Math.pow(d - metric.averageDuration, 2), 0
    ) / durations.length;
    metric.standardDeviation = Math.sqrt(variance);
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get metric for specific test
   */
  getMetric(testName: string): PerformanceMetric | undefined {
    return this.metrics.get(testName);
  }

  /**
   * Identify slow tests
   */
  getSlowTests(threshold: number = 5000): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(
      m => m.averageDuration > threshold
    );
  }

  /**
   * Identify flaky tests (high standard deviation)
   */
  getFlakyTests(threshold: number = 2000): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(
      m => m.standardDeviation > threshold
    );
  }

  /**
   * Get average performance across all tests
   */
  getAveragePerformance(): number {
    if (this.metrics.size === 0) return 0;
    
    const total = Array.from(this.metrics.values()).reduce(
      (sum, m) => sum + m.averageDuration, 0
    );
    return total / this.metrics.size;
  }

  /**
   * Export performance data
   */
  exportMetrics(filepath: string): void {
    const fs = require('fs');
    const data = Array.from(this.metrics.values());
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }
}
