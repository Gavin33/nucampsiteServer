const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');
const okAndSend = require('./okAndSend');
const user = require('../models/user');

const favoriteRouter = express.Router();

favoriteRouter
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .route('/')
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('User')
      .populate('Campsite')
      .then((response) => {
        okAndSend(res, response);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorites) => {
        if (favorites) {
          req.body.forEach((campsite) => {
            if (!favorites.campsites.includes(campsite._id)) {
              favorites.campsites.push(campsite);
            }
          });
          return favorites;
        } else {
          return Favorite.create({ user: req.user._id, campsites: req.body });
        }
      })
      .then((favorites) => favorites.save())
      .then((favorites) => okAndSend(res, favorites))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorites) => {
        if (favorites) {
          okAndSend(res, favorites);
        } else {
          res.statusCode(200);
          res.setHeader('Content-type', 'text/plain');
          res.end('You do not have any favorites to delete');
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .route('/:campsiteId')
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/:campsiteId');
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorites) => {
        console.log(favorites);
        if (!favorites) {
          return Favorite.create({
            user: req.user._id,
            campsites: req.params.campsiteId,
          });
        } else if (favorites.campsites.includes(req.params.campsiteId)) {
          res.statusCode = 200;
          res.setHeader('Content-type', 'text/plain');
          res.end('That campsite is already in the list of favorites!');
        }
        favorites.campsites.push(req.params.campsiteId);
        return favorites;
      })
      .then((favorites) => favorites.save())
      .then((favorites) => okAndSend(res, favorites))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/:campsiteId');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //   Find the favorites schema of the user
    Favorite.findOne({ user: req.user._id })
      .then((favorites) => {
        // Find the specified campsite in the user's favorites
        if (favorites.campsites.includes(req.params.campsiteId)) {
          console.log(
            favorites.campsites.splice(
              favorites.campsites.indexOf(req.params.campsiteId),
              1
            )
          );
          favorites.campsites = favorites.campsites.splice(
            favorites.campsites.indexOf(req.params.campsiteId)
          );
          return favorites;
        } else {
          res.statusCode = 200;
          res.setHeader('Content-type', 'text/plain');
          res.end('There are no favorites to delete!');
        }
      })
      .then((favorites) => favorites.save())
      .then((favorites) => okAndSend(res, favorites))
      .catch((err) => next(err));
  });
module.exports = favoriteRouter;
