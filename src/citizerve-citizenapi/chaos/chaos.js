/* eslint-disable no-inner-declarations */
const http = require('http');
const chaosConfig = require('./chaos.json');

function induceMemoryLeak(req, res, next) {
  let thing = null;
  if (req.method === 'POST' && req.body.citizenId === '3b42e011-3491-4018-a893-e0e7c9755fbd') {
    function leakMemory() {
      let originalThing = thing;
      function unused() {
        if (originalThing) { console.info('Leaking memory ...'); }
      }
      thing = {
        longStr: new Array(10000000).join('*'),
        someMethod: function () {
          console.info('Leaking memory ...');
        }
      };
      console.info('Leaking memory ...');
    };
    setInterval(leakMemory, 1000);
    console.info('Chaos inducing memory leak');
    next();
  } else {
    next();
  }
}

function induceSNATPoolExhaustion(req, res, next) {
  if (req.method === 'POST' && req.body.citizenId === '16a8efb0-e616-418b-b8fd-4222244db739') {
    function consumeSNAT(website) {
      const options = {
        hostname: website,
        port: 80,
        method: 'GET',
      };
      const request = http.request(
        options,
        () => {},
      );
      console.info(`Calling ${website} ...`);
      request.on('error', (err) => {
        console.error(`Error while calling ${website}: ${err}`);
      });
      request.end();
    }

    console.info('Exhausting SNAT pool ...');
    const website = chaosConfig.domains[Math.floor(Math.random() * 250)];
    setInterval(() => consumeSNAT(website), 100);

    next();
  } else {
    next();
  }
}

module.exports.induceMemoryLeak = induceMemoryLeak;
module.exports.induceSNATPoolExhaustion = induceSNATPoolExhaustion;
