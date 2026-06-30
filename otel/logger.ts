import pino from "pino";

import {
  context,
  trace,
} from "@opentelemetry/api";

import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
  BatchLogRecordProcessor,
  createLoggerConfigurator 
} from '@opentelemetry/sdk-logs';

import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

import { resourceFromAttributes } from "@opentelemetry/resources";

import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

// export function toSeverity(level: number) {
//   switch (level) {
//     case 10:
//       return SeverityNumber.TRACE;
//     case 20:
//       return SeverityNumber.DEBUG;
//     case 30:
//       return SeverityNumber.INFO;
//     case 40:
//       return SeverityNumber.WARN;
//     case 50:
//       return SeverityNumber.ERROR;
//     case 60:
//       return SeverityNumber.FATAL;
//     default:
//       return SeverityNumber.UNSPECIFIED;
//   }
// }

// Optional and only needed to see the internal diagnostic logging (during development)
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const logExporter = new OTLPLogExporter({
  url: 'http://otel-collector:4318/v1/logs',
});

const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "ts-app",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  loggerConfigurator: createLoggerConfigurator([
    {
      pattern: '*', // Match all loggers
      config: {
        minimumSeverity: SeverityNumber.DEBUG, // Only DEBUG, INFO, WARN, ERROR, and FATAL logs
      }
    }
  ]),
  processors: [
    new BatchLogRecordProcessor(logExporter),
    // new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()) // use for console testing
  ],
});

logs.setGlobalLoggerProvider(loggerProvider);

// Reuse loggers where possible. getLogger() may be expensive, especially when
// scopeAttributes are provided, so avoid calling it on hot paths.
// In elastic mean: {scope.name:example,	scope.version:1.0.0}
export const otelLogger = logs.getLogger('example', '1.0.0');

function emitToOpenTelemetry(args: any[]) {
  let message = "";
  let attributes = {};

  if (typeof args[0] === "string") {
    message = args[0];
  }

  else {
    attributes = args[0];
    message = args[1];
  }

  // const span = trace.getSpan(context.active());
  // const ctx = span?.spanContext();
  const customContext = context.active();
  otelLogger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "INFO",
    body: message,
    attributes,
    context: customContext
  });
}

// If only use logger no initial telemetry, then it will lost span_id and trace_id
export const logger = pino({
  level: "info",

  // mixin() {
  //   const span =
  //     trace.getSpan(context.active());

  //   if (!span) {
  //     return {};
  //   }

  //   const ctx = span.spanContext();

  //   return {
  //     trace_id: ctx.traceId,
  //     span_id: ctx.spanId,
  //   };
  // },

  hooks: {
    logMethod(args, method) {
      emitToOpenTelemetry(args);
      method.apply(this, args)
    }
  },

  transport: {
    targets: [{
      target: 'pino-pretty', // Send pretty logs to the console
      options: { colorize: true },
      level: 'info'
    }]

  },
});