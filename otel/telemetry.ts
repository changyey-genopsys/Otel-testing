import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";

import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

import {
  OTLPTraceExporter,
} from "@opentelemetry/exporter-trace-otlp-http";

import {
  getNodeAutoInstrumentations,
} from "@opentelemetry/auto-instrumentations-node";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "ts-app",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  traceExporter: new OTLPTraceExporter({
    url:
      "http://otel-collector:4318/v1/traces",
  }),

  instrumentations: [
    // getNodeAutoInstrumentations may not support fastify 
    // need https://www.npmjs.com/package/@fastify/otel
    getNodeAutoInstrumentations(),
  ],
});

export async function startTelemetry() {
  await sdk.start();
}