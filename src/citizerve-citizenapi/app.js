const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const openTelemetry = require('@opentelemetry/sdk-node');
const metrics = require('./monitoring/metrics');
const chaos = require('./chaos/chaos');
const config = require('./config.json')[process.env.NODE_ENV || 'development'];

const app = express();

const environment = process.env.NODE_ENV || 'development';
let mongoConnectionString = null;

if (environment === 'kubernetes' || environment === 'eks') {
  mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
} else {
  mongoConnectionString = config.mongoDbSettings.connectionString;
}

const db = mongoose.connect(mongoConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Citizerve',
});

const Citizen = require('./models/citizenModel');
const citizenRouter = require('./routes/citizenRouter')(Citizen);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(responseTime((req, res, time) => {
  if (req?.route?.path) {
    const currentSpan = openTelemetry.api.trace.getSpan(openTelemetry.api.context.active());
    metrics.apiResponseLatencyMetric.record(
      time,
      {
        app: 'citizerve-citizenapi',
        method: req.method,
        path: req.route.path,
        status: res.statusCode,
      },
      {
        traceId: currentSpan.spanContext().traceId,
        spanId: currentSpan.spanContext().spanId,
      },
    );
    metrics.apiRequestCountMetric.add(
      1,
      {
        app: 'citizerve-citizenapi',
        method: req.method,
        path: req.route.path,
        status: res.statusCode,
      },
      {
        traceId: currentSpan.spanContext().traceId,
        spanId: currentSpan.spanContext().spanId,
      },
    );

    console.info(`API call: ${req.method} ${req.route.path} ${res.statusCode} responded in ${time}ms`);
  }
}));

app.use(chaos.induceMemoryLeak);
app.use(chaos.induceSNATPoolExhaustion);

app.use('/api', citizenRouter);

app.listen(config.appSettings.port, () => {
  console.info(`Running on port ${config.appSettings.port}`);
  metrics.startNodePlatformMetricsServer();
});
