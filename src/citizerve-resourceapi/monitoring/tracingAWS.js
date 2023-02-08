const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor} = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
//const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { AWSXRayPropagator } = require('@opentelemetry/propagator-aws-xray');
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray');

const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const config = require('../config.json')[process.env.NODE_ENV || 'development'];

//const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
//const { AwsInstrumentation } = require('opentelemetry-instrumentation-aws-sdk');

const _resource = Resource.default().merge(new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'citizerve-resourceapi',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV  
    }));

//const _traceExporter = new OTLPTraceExporter({ url: `${config.monitoringSettings.tracesEndpoint}/v1/traces` });
const _traceExporter = new OTLPTraceExporter();
const _spanProcessor = new BatchSpanProcessor(_traceExporter);

const _tracerConfig = {
    idGenerator: new AWSXRayIdGenerator(),
}

const sdk = new opentelemetry.NodeSDK({
    textMapPropagator: new AWSXRayPropagator(),
    instrumentations: [
        getNodeAutoInstrumentations()
    ],
    resource: _resource,
    spanProcessor: _spanProcessor,
    traceExporter: _traceExporter,
});
sdk.configureTracerProvider(_tracerConfig, _spanProcessor);

// this enables the API to record telemetry
sdk.start()
    .then(() => { console.info('Tracing initialized'); })
    .catch((error) => console.error('Error initializing tracing', error));

// (function () {
//     const sdk = new opentelemetry.NodeSDK({
//         textMapPropagator: new AWSXRayPropagator(),
//         metricReader: _metricReader,
//         instrumentations: [
//             getNodeAutoInstrumentations()
//             //new HttpInstrumentation(),
//             // new AwsInstrumentation({
//             //     suppressInternalInstrumentation: true
//             // }),
//         ],
//         resource: _resource,
//         spanProcessor: _spanProcessor,
//         traceExporter: _traceExporter,
//     });
//     sdk.configureTracerProvider(_tracerConfig, _spanProcessor);
    
//     // this enables the API to record telemetry
//     sdk.start(); 
    
//     // gracefully shut down the SDK on process exit
//     process.on('SIGTERM', () => {
//     sdk.shutdown()
//       .then(() => console.log('Tracing terminated'))
//       .catch((error) => console.log('Error terminating tracing', error))
//       .finally(() => process.exit(0));
//     });
// })();

//module.exports = { nodeSDKBuilder };
