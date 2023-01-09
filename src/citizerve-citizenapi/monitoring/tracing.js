const opentelemetry = require('@opentelemetry/sdk-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { ConsoleSpanExporter, BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'citizerve-citizenapi',
  }),
);
const provider = new NodeTracerProvider({ resource });
const exporter = new ConsoleSpanExporter();
const processor = new BatchSpanProcessor(exporter);
// provider.addSpanProcessor(processor);

provider.register();

const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
  .then(() => { console.log('Tracing initialized'); })
  .catch((error) => console.log('Error initializing tracing', error));
