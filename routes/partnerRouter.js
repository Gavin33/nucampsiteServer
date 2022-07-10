const express = require('express');
const Partner = require('../models/partner');
const authenticate = require('../authenticate');
const cors = require('./cors');

const partnerRouter = express.Router();
const okAndSend = require('./okAndSend');

partnerRouter
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .route('/')
  .get(cors.cors, (req, res, next) => {
    Partner.find()
      .then((partners) => okAndSend(res, partners))
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    // authenticate.verifyAdmin(),
    (req, res, next) => {
      Partner.create(req.body)
        .then((partner) => {
          console.log('Partner Created', partner);
          okAndSend(res, partner);
        })
        .catch((err) => next(err));
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.deleteMany()
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );
partnerRouter
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .route('/:partnerId')
  .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((response) => okAndSend(res, response))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for /partners/:partnerId');
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndUpdate(
        req.params.partnerId,
        { $set: req.body },
        { new: true }
      )
        .then((partner) => okAndSend(res, partner))
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );

module.exports = partnerRouter;
