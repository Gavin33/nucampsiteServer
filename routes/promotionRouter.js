const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion');
const okAndSend = require('./okAndSend');
const authenticate = require('../authenticate');

promotionRouter
  .route('/')
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => okAndSend(res, promotions))
      .catch((err) => next(err));
  })
  .post(
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
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.deleteMany()
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );
promotionRouter
  .route('/:promotionId')
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((response) => okAndSend(res, response))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported for /promotions/:promotionId');
  })
  .put(
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
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      Promotion.findByIdAndDelete(req.params.promotionId)
        .then((response) => okAndSend(res, response))
        .catch((err) => next(err));
    }
  );

module.exports = promotionRouter;
