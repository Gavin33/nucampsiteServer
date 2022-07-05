const express = require('express');
const Partner = require('../models/partner');
const authenticate = require('../authenticate');

const partnerRouter = express.Router();
const okAndSend = require('./okAndSend');

partnerRouter
  .route('/')
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => okAndSend(res, partners))
      .catch((err) => next(err));
  })
  .post(
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
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.deleteMany()
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );
partnerRouter
  .route('/:partnerId')
  .get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((response) => okAndSend(res, response))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for /partners/:partnerId');
  })
  .put(
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
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );

module.exports = partnerRouter;
