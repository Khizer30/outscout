import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import type { NextFunction, Request, Response } from "express";

type HttpMetricLabels = {
  method: string;
  route: string;
  status_code: string;
};

type LabelledCounter = {
  inc(value?: number): void;
};

type LabelledHistogram = {
  observe(value: number): void;
};

type RequestCounterMetric = {
  labels(labels: HttpMetricLabels): LabelledCounter;
};

type RequestDurationMetric = {
  labels(labels: HttpMetricLabels): LabelledHistogram;
};

type InFlightRequestsMetric = {
  inc(value?: number): void;
  dec(value?: number): void;
};

@Injectable()
export class PrometheusMetricsMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric("http_requests_total")
    private readonly requestCounter: RequestCounterMetric,
    @InjectMetric("http_request_duration_seconds")
    private readonly requestDurationHistogram: RequestDurationMetric,
    @InjectMetric("http_requests_in_flight")
    private readonly inFlightRequestsGauge: InFlightRequestsMetric
  ) {}

  use(request: Request, response: Response, next: NextFunction) {
    if (this.isMetricsEndpoint(request)) {
      next();
      return;
    }

    const startedAt = process.hrtime.bigint();

    this.inFlightRequestsGauge.inc();

    response.on("finish", () => {
      const labels: HttpMetricLabels = {
        method: request.method,
        route: this.getRouteLabel(request),
        status_code: String(response.statusCode)
      };
      const durationInSeconds = Number(process.hrtime.bigint() - startedAt) / 1000000000;

      this.requestCounter.labels(labels).inc();
      this.requestDurationHistogram.labels(labels).observe(durationInSeconds);
      this.inFlightRequestsGauge.dec();
    });

    next();
  }

  private getRouteLabel(request: Request): string {
    const routePath = request.route?.path;

    if (typeof routePath !== "string") {
      return request.baseUrl || "unmatched";
    }

    if (routePath === "/") {
      return request.baseUrl || "/";
    }

    return `${request.baseUrl}${routePath}` || "/";
  }

  private isMetricsEndpoint(request: Request): boolean {
    return request.path === "/api/metrics";
  }
}
