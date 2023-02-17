// Require dependencies
const { AzureMonitorTraceExporter } = require('@azure/monitor-opentelemetry-exporter');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const config = require('../config.json')[process.env.NODE_ENV || 'development'];

// Create an exporter instance.
const exporter = new AzureMonitorTraceExporter({
    connectionString: process.env.APP_INSIGHTS_CONNECTION_STRING || config.monitoringSettings.appInsightsConnectionString,
});

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
