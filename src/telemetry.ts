import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { containerDetector } from "@opentelemetry/resource-detector-container";

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
  // export OTEL_RESOURCE_ATTRIBUTES="service.name=user-service,service.version=2.1.0"
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "ts-app",
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  resourceDetectors: [containerDetector],
  traceExporter: new OTLPTraceExporter({
    url:
      "http://otel-collector:4318/v1/traces",
  }),

  instrumentations: [
    // getNodeAutoInstrumentations may not support fastify 
    getNodeAutoInstrumentations(),
  ],
});


export async function startTelemetry() {
  await sdk.start();
}