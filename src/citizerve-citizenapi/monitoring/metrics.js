const express = require('express');
const client = require('prom-client');
const config = require('../config.json')[process.env.NODE_ENV || 'development'];

const metricsApp = express();

const apiResponseTimeHistogram = new client.Histogram({
  name: 'api_response_time_duration_milliseconds',
  help: 'API response time in milliseconds',
  labelNames: ['method', 'route', 'statusCode'],
});

function startMetricsServer() {
  const register = new client.Registry();
  register.setDefaultLabels({ app: 'citizerve-citizenapi' });
  register.registerMetric(apiResponseTimeHistogram);
  client.collectDefaultMetrics({ register });

  metricsApp.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    return res.send(await register.metrics());
  });

  metricsApp.listen(config.monitoringSettings.metricsPort, () => {
    console.log(`Metrics server running on port ${config.monitoringSettings.metricsPort}`);
  });
}

module.exports.apiResponseTimeHistogram = apiResponseTimeHistogram;
module.exports.startMetricsServer = startMetricsServer;
