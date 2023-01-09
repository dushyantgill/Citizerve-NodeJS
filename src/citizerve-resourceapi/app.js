const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const metrics = require('./monitoring/metrics');
const chaos = require('./chaos/chaos');
const config = require('./config.json')[process.env.NODE_ENV || 'development'];

const app = express();

const db = mongoose.connect(config.mongoDbSettings.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Citizerve',
});

const Resource = require('./models/resourceModel');
const resourceRouter = require('./routes/resourceRouter')(Resource);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(responseTime((req, res, time) => {
  if (req?.route?.path) {
    metrics.apiResponseTimeHistogram
      .labels(req.method, req.route.path, res.statusCode)
      .observe(time);
    console.info(`API call: ${req.method} ${req.route.path} ${res.statusCode} responded in ${time}ms`);
  }
}));

app.use(chaos.induceLatency);
app.use('/api', resourceRouter);

app.listen(config.appSettings.port, () => {
  console.info(`Running on port ${config.appSettings.port}`);
  metrics.startMetricsServer();
});
