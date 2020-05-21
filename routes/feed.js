const express = require('express');
const routes = express.Router();
const feed = require('../controller/feed');
const {body,check} = require('express-validator/check');
const isauth = require('../middleware/tokenValid');
routes.get('/feeds',isauth.auth,feed.getFeeds);
routes.get('/status/:userId',isauth.auth,feed.getStatus);
routes.put('/status/:userId',
body('status').trim().isLength({min:6}),
isauth.auth,feed.updateStatus);
routes.get('/feeds/:postId',isauth.auth,feed.getFeedById);
routes.post('/feed',
body('title').trim().isLength({min:6}),
body('content').trim().isLength({min:6}),
body('image').isEmpty(),
isauth.auth,
feed.postFeed);
routes.put('/feeds/:postId',
body('title').trim().isLength({min:6}),
body('content').trim().isLength({min:6}),
body('image').isEmpty(),
isauth.auth,
feed.updateFeed);
routes.delete('/feeds/:postId',isauth.auth,feed.deleteFeed);
module.exports = routes;