import { TestResult } from './types';

/**
 * Notification service for test alerts
 */
export class NotificationService {
  private webhooks: Map<string, string> = new Map();
  private emailRecipients: Set<string> = new Set();

  /**
   * Register webhook for notifications
   */
  registerWebhook(name: string, url: string): void {
    this.webhooks.set(name, url);
  }

  /**
   * Add email recipient for notifications
   */
  addEmailRecipient(email: string): void {
    this.emailRecipients.add(email);
  }

  /**
   * Remove email recipient
   */
  removeEmailRecipient(email: string): void {
    this.emailRecipients.delete(email);
  }

  /**
   * Send notification on test failure
   */
  async notifyOnFailure(result: TestResult): Promise<void> {
    if (result.status === 'failed') {
      const message = this.formatFailureMessage(result);
      await Promise.all([
        this.sendWebhook(message),
        this.sendEmail(message, result),
      ]);
    }
  }

  /**
   * Send test summary notification
   */
  async notifySummary(summary: any): Promise<void> {
    const message = this.formatSummaryMessage(summary);
    await Promise.all([
      this.sendWebhook(message),
      this.sendEmail(message, summary),
    ]);
  }

  /**
   * Format failure message
   */
  private formatFailureMessage(result: TestResult): string {
    return `
      ❌ Test Failed: ${result.testName}
      Status: ${result.status}
      Duration: ${result.duration}ms
      Attempts: ${result.attempts}
      Error: ${result.error || 'N/A'}
      Healed: ${result.healed ? 'Yes' : 'No'}
      Time: ${result.timestamp.toISOString()}
    `;
  }

  /**
   * Format summary message
   */
  private formatSummaryMessage(summary: any): string {
    return `
      📊 Test Summary
      Total: ${summary.total}
      Passed: ${summary.passed}
      Failed: ${summary.failed}
      Skipped: ${summary.skipped}
      Success Rate: ${((summary.passed / summary.total) * 100).toFixed(2)}%
    `;
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(message: string): Promise<void> {
    for (const [name, url] of this.webhooks) {
      try {
        // Mock webhook send - in production would use HTTP client
        console.log(`[Webhook: ${name}] ${message}`);
      } catch (error) {
        console.error(`Failed to send webhook to ${name}:`, error);
      }
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(message: string, data: any): Promise<void> {
    if (this.emailRecipients.size > 0) {
      try {
        // Mock email send - in production would use email service
        console.log(`[Email to ${Array.from(this.emailRecipients).join(', ')}] ${message}`);
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    }
  }

  /**
   * Get registered webhooks
   */
  getWebhooks(): string[] {
    return Array.from(this.webhooks.keys());
  }

  /**
   * Get email recipients
   */
  getEmailRecipients(): string[] {
    return Array.from(this.emailRecipients);
  }
}
