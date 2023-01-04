const http = require('http');
const uuid = require('uuid').v4;
const config = require('../config.json')[process.env.NODE_ENV || 'development'];

function createDefaultResourceForNewCitizen(citizen, callback) {
  const resourceData = JSON.stringify({
    resourceId: uuid(),
    citizenId: citizen.citizenId,
    name: 'National Identification Number',
    status: 'New',
  });
  const options = {
    hostname: config.serviceSettings.resourceAPISettings.hostname,
    port: config.serviceSettings.resourceAPISettings.port,
    path: config.serviceSettings.resourceAPISettings.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': resourceData.length,
    },
  };
  const request = http.request(
    options,
    (response) => {
      callback(null, response.statusCode);
    },
  );
  request.on('error', (err) => {
    console.error(`Error while creating default resource for a citizen ${err}`);
    callback(err, null);
  });
  request.write(resourceData);
  request.end();
}

function deleteAllResourcesOfCitizen(citizenId, callback) {
  const options = {
    hostname: config.serviceSettings.resourceAPISettings.hostname,
    port: config.serviceSettings.resourceAPISettings.port,
    path: `${config.serviceSettings.resourceAPISettings.path}?citizenId=${citizenId}`,
    method: 'DELETE',
  };
  const request = http.request(
    options,
    (response) => {
      callback(null, response.statusCode);
    },
  );
  request.on('error', (err) => {
    console.error(`Error while deleting all resources for a citizen ${err}`);
    callback(err, null);
  });
  request.end();
}

module.exports.createDefaultResourceForNewCitizen = createDefaultResourceForNewCitizen;
module.exports.deleteAllResourcesOfCitizen = deleteAllResourcesOfCitizen;
