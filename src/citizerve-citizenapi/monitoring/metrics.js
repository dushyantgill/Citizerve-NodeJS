const express = require('express');
const client = require('prom-client');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { MeterProvider } = require('@opentelemetry/sdk-metrics');

const config = require('../config.json')[process.env.NODE_ENV || 'development'];

const nodePlatformMetricsApp = express();
function startNodePlatformMetricsServer() {
  const register = new client.Registry();
  register.setDefaultLabels({ app: 'citizerve-citizenapi' });
  client.collectDefaultMetrics({ register });

  nodePlatformMetricsApp.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    return res.send(await register.metrics());
  });

  nodePlatformMetricsApp.listen(config.monitoringSettings.nodePlatformMetricsPort, () => {
    console.log(`Node platform metrics server running on port ${config.monitoringSettings.nodePlatformMetricsPort}`);
  });
}

const options = { port: config.monitoringSettings.appOTelMetricsPort, startServer: true };
const exporter = new PrometheusExporter(
  options,
  () => { console.info(`App OTel metrics server running on port ${config.monitoringSettings.appOTelMetricsPort}`); },
);
const meterProvider = new MeterProvider();
meterProvider.addMetricReader(exporter);
const meter = meterProvider.getMeter('api-metrics-golden-signal');

const apiRequestCountMetric = meter.createCounter('api_request_count', {
  labelKeys: ['app', 'method', 'path', 'status'],
  description: 'Counts number of api requests',
});
const apiResponseLatencyMetric = meter.createHistogram('api_response_latency_milliseconds', {
  labelKeys: ['app', 'method', 'path', 'status'],
  description: 'Records latency of api response',
  unit: 'milliseconds',
});

module.exports.apiRequestCountMetric = apiRequestCountMetric;
module.exports.apiResponseLatencyMetric = apiResponseLatencyMetric;
module.exports.startNodePlatformMetricsServer = startNodePlatformMetricsServer;
