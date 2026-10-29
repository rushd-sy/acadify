import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const prometheusExporter = new PrometheusExporter({
  port: 9464,
  host: '0.0.0.0',
});

const sdk = new NodeSDK({
  metricReaders: [prometheusExporter],
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
