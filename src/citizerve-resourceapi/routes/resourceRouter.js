/* eslint-disable no-param-reassign */
const express = require('express');

function routes(Resource) {
  const resourceRouter = express.Router();
  resourceRouter.route('/resources')
    .post((req, res) => {
      const resource = new Resource(req.body);
      resource.save();
      return res.status(201).json(resource);
    })
    .get((req, res) => {
      const query = {};
      if (req.query.citizenId) {
        query.citizenId = req.query.citizenId;
      }
      if (req.query.name) {
        query.name = req.query.name;
      }
      if (req.query.status) {
        query.status = req.query.status;
      }
      Resource.find(query, (err, resources) => {
        if (err) {
          return res.send(err);
        }
        return res.json(resources);
      });
    })
    .delete((req, res) => {
      if (req.query.citizenId) {
        const query = { citizenId: req.query.citizenId };
        Resource.deleteMany(query, (err, countDeleted) => {
          if (err) {
            return res.send(err);
          }
          return res.sendStatus(204);
        });
      } else {
        return res.sendStatus(404);
      }
    });
  resourceRouter.use('/resources/:resourceId', (req, res, next) => {
    const query = { resourceId: req.params.resourceId };
    Resource.find(query, (err, resources) => {
      if (err) {
        return res.send(err);
      }
      if (resources[0]) {
        [req.resource] = resources;
        return next();
      }
      return res.sendStatus(404);
    });
  });
  resourceRouter.route('/resources/:resourceId')
    .get((req, res) => {
      res.json(req.resource);
    })
    .patch((req, res) => {
      const { resource } = req;
      // eslint-disable-next-line no-underscore-dangle
      if (req.body._id) {
        // eslint-disable-next-line no-underscore-dangle
        delete req.body._id;
      }
      if (req.body.resourceId) {
        delete req.body.resourceId;
      }
      if (req.body.citizenId) {
        delete req.body.citizenId;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        resource[key] = value;
      });
      resource.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(resource);
      });
    })
    .delete((req, res) => {
      req.resource.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });
  return resourceRouter;
}

module.exports = routes;
