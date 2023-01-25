/* tracing.js */
// Require dependencies
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const config = require('../config.json')[process.env.NODE_ENV || 'development'];

const exporter = new TraceExporter({
  // If you are not in a GCP environment, you will need to provide your
  // service account key here. See the Authentication section below.
  // will export all resource attributes that start with "service."
  resourceFilter: /^service\./  
});

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'citizerve-citizenapi',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
  .then(() => { console.info('Tracing initialized'); })
  .catch((error) => console.error('Error initializing tracing', error));
