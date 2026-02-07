/**
 * Test scheduling and execution planning
 */
export interface ScheduledTest {
  id: string;
  testNames: string[];
  schedule: string; // cron expression or frequency
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export class TestScheduler {
  private schedules: Map<string, ScheduledTest> = new Map();

  /**
   * Schedule a test or suite to run at specific times
   */
  scheduleTest(
    testId: string,
    testNames: string[],
    schedule: string,
    enabled: boolean = true
  ): void {
    const scheduled: ScheduledTest = {
      id: testId,
      testNames,
      schedule,
      enabled,
      nextRun: this.calculateNextRun(schedule),
    };
    this.schedules.set(testId, scheduled);
  }

  /**
   * Calculate next run time based on schedule
   */
  private calculateNextRun(schedule: string): Date {
    // Simplified implementation
    const now = new Date();
    switch (schedule) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Get all due tests
   */
  getDueTests(): ScheduledTest[] {
    const now = new Date();
    return Array.from(this.schedules.values()).filter(
      s => s.enabled && s.nextRun && s.nextRun <= now
    );
  }

  /**
   * Mark test as run
   */
  markAsRun(testId: string): void {
    const scheduled = this.schedules.get(testId);
    if (scheduled) {
      scheduled.lastRun = new Date();
      scheduled.nextRun = this.calculateNextRun(scheduled.schedule);
    }
  }

  /**
   * Get schedule status
   */
  getSchedules(): ScheduledTest[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Disable schedule
   */
  disableSchedule(testId: string): void {
    const scheduled = this.schedules.get(testId);
    if (scheduled) {
      scheduled.enabled = false;
    }
  }

  /**
   * Enable schedule
   */
  enableSchedule(testId: string): void {
    const scheduled = this.schedules.get(testId);
    if (scheduled) {
      scheduled.enabled = true;
    }
  }
}
