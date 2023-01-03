/* eslint-disable no-param-reassign */
const express = require('express');
const resourceAPI = require('../services/resourceAPI');

function routes(Citizen) {
  const citizenRouter = express.Router();
  citizenRouter.route('/citizens')
    .post((req, res) => {
      const citizen = new Citizen(req.body);
      citizen.save();
      resourceAPI.createDefaultResourceForNewCitizen(citizen, (err, data) => {
        if (err) {
          console.log(`Error while creating default resource for new citizen ${err}`);
        } else {
          console.log(`Created default resource for new citizen ${data}`);
        }
      });
      return res.status(201).json(citizen);
    })
    .get((req, res) => {
      const query = {};
      if (req.query.givenName) {
        query.givenName = req.query.givenName;
      }
      if (req.query.surname) {
        query.surname = req.query.surname;
      }
      if (req.query.city) {
        query.city = req.query.city;
      }
      if (req.query.state) {
        query.state = req.query.state;
      }
      if (req.query.postalCode) {
        query.postalCode = req.query.postalCode;
      }
      if (req.query.country) {
        query.country = req.query.country;
      }
      Citizen.find(query, (err, citizens) => {
        if (err) {
          return res.send(err);
        }
        return res.json(citizens);
      });
    });
  citizenRouter.use('/citizens/:citizenId', (req, res, next) => {
    const query = { citizenId: req.params.citizenId };
    Citizen.find(query, (err, citizens) => {
      if (err) {
        return res.send(err);
      }
      if (citizens[0]) {
        [req.citizen] = citizens;
        return next();
      }
      return res.sendStatus(404);
    });
  });
  citizenRouter.route('/citizens/:citizenId')
    .get((req, res) => {
      res.json(req.citizen);
    })
    .patch((req, res) => {
      const { citizen } = req;
      // eslint-disable-next-line no-underscore-dangle
      if (req.body._id) {
        // eslint-disable-next-line no-underscore-dangle
        delete req.body._id;
      }
      if (req.body.citizenId) {
        delete req.body.citizenId;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        citizen[key] = value;
      });
      citizen.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(citizen);
      });
    })
    .delete((req, res) => {
      const { citizenId } = req.citizen;
      req.citizen.remove((err) => {
        if (err) {
          return res.send(err);
        }
        resourceAPI.deleteAllResourcesOfCitizen(citizenId, (error, statusCode) => {
          if (error) {
            console.log(`Error while deleting all resources of citizen ${error}`);
          } else {
            console.log(`Deleted all resources of citizen ${statusCode}`);
          }
        });
        return res.sendStatus(204);
      });
    });
  return citizenRouter;
}

module.exports = routes;
