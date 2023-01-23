/* tracing.js */
// Require dependencies
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const config = require('../config.json')[process.env.NODE_ENV || 'development'];

const exporter = new OTLPTraceExporter({ url: `${config.monitoringSettings.tracesEndpoint}/v1/traces` });
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'citizerve-resourceapi',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
  .then(() => { console.info('Tracing initialized'); })
  .catch((error) => console.error('Error initializing tracing', error));
