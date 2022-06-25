const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion');
const okAndSend = require('./okAndSend');

promotionRouter
  .route('/')
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => okAndSend(res, promotions))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log('Promotion Created', promotion);
        okAndSend(res, promotion);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete((req, res, next) => {
    Promotion.deleteMany()
      .then((response) => okAndSend(res, response))
      .catch((err) => next(err));
  });
promotionRouter
  .route('/:promotionId')
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((response) => okAndSend(res, response))
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for /promotions/:promotionId');
  })
  .put((req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      { $set: req.body },
      { new: true }
    )
      .then((promotion) => okAndSend(res, promotion))
      .catch((err) => next(err));
  })
  .delete((req, res) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
      .then((response) => okAndSend(res, response))
      .catch((err) => next(err));
  });

module.exports = promotionRouter;
