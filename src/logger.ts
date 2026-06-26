import pino from "pino";

import {
  context,
  trace,
} from "@opentelemetry/api";

export const logger = pino({
  level: "info",

  mixin() {
    const span =
      trace.getSpan(context.active());

    if (!span) {
      return {};
    }

    const ctx = span.spanContext();

    return {
      trace_id: ctx.traceId,
      span_id: ctx.spanId,
    };
  },

  transport: {
    targets: [{
      target: "pino-opentelemetry-transport",

      options: {
        otlpEndpoint:
          "http://otel-collector:4318/v1/logs",

        resourceAttributes: {
          "service.name":
            "typescript-backend",

          "service.version":
            "1.0.0",
        },
      },
    }, {
      target: 'pino-pretty', // Send pretty logs to the console
      options: { colorize: true },
      level: 'info'
    }]

  },
});