import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const metricReader = new PrometheusExporter({
  port: 9464,
  endpoint: '/metrics',
});

export const otelSDK = new NodeSDK({
  metricReaders: [metricReader],
  instrumentations: [getNodeAutoInstrumentations()],
});

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .catch()
    .then(() => console.log('OTel SDK shut down successfully'));
});
