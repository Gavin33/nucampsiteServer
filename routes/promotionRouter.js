const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion');
const okAndSend = require('./okAndSend');
const authenticate = require('../authenticate');
const cors = require('./cors');

promotionRouter
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, cors.cors, (req, res, next) => {
    Promotion.find()
      .then((promotions) => okAndSend(res, promotions))
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.create(req.body)
        .then((promotion) => {
          console.log('Promotion Created', promotion);
          okAndSend(res, promotion);
        })
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res) => {
      res.statusCode = 403;
      res.end('PUT operation not supported on /promotions');
    }
  )
  .delete(
    cors.corsWithOptions,
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.deleteMany()
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );
promotionRouter
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .route('/:promotionId')
  .get(cors.cors, cors.cors, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((response) => okAndSend(res, response))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for /promotions/:promotionId');
  })
  .put(
    cors.corsWithOptions,
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.findByIdAndUpdate(
        req.params.promotionId,
        { $set: req.body },
        { new: true }
      )
        .then((promotion) => okAndSend(res, promotion))
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Promotion.findByIdAndDelete(req.params.promotionId)
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );

module.exports = promotionRouter;
