function induceLatency(req, res, next) {
  if (req.method === 'POST' && req.body.citizenId === 'ba95f09a-df81-4b08-981e-6d413de64949') {
    const latency = Math.floor(Math.random() * 5 + 5);
    console.info(`Chaos inducing latency of ${latency} seconds`);
    setTimeout(next, latency * 1000);
  } else {
    next();
  }
}

module.exports.induceLatency = induceLatency;
