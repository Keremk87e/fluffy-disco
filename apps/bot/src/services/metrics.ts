export interface MetricsSink {
  increment(name: string, labels?: Record<string, string>): void;
}

export class LoggingMetricsSink implements MetricsSink {
  increment(name: string, labels?: Record<string, string>): void {
    const payload = { metric: name, labels };
    process.emit('kanbal.metric', payload);
  }
}
