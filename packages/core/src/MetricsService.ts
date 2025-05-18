/**
 * @public
 * Interface for a metrics service.
 * Provides methods for incrementing counters, setting gauges, and recording timings.
 */
export interface MetricsService {
  /**
   * Increments a counter metric.
   * @param metricName - The name of the metric.
   * @param value - Optional. The value to increment by (defaults to 1).
   * @param tags - Optional. Key-value pairs for tagging the metric.
   */
  increment(
    metricName: string,
    value?: number,
    tags?: Record<string, string>,
  ): void;

  /**
   * Sets a gauge metric to a specific value.
   * @param metricName - The name of the metric.
   * @param value - The value to set the gauge to.
   * @param tags - Optional. Key-value pairs for tagging the metric.
   */
  gauge(metricName: string, value: number, tags?: Record<string, string>): void;

  /**
   * Records a timing metric.
   * @param metricName - The name of the metric.
   * @param durationMs - The duration in milliseconds.
   * @param tags - Optional. Key-value pairs for tagging the metric.
   */
  timing(
    metricName: string,
    durationMs: number,
    tags?: Record<string, string>,
  ): void;
}
