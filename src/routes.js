const express = require('express');

const UserController = require('./controllers/UserController');
const CreditcardController = require('./controllers/CreditcardController');
const SessionController = require('./controllers/SessionController');
const TotemController = require('./controllers/TotemController');

const routes = express.Router();

routes.post('/sessions', SessionController.create);


routes.get('/users', UserController.index);
routes.post('/users', UserController.create);

routes.get('/creditcard', CreditcardController.index);
routes.post('/creditcard', CreditcardController.create);
routes.delete('/creditcard/:id', CreditcardController.delete);

routes.get('/totems', TotemController.index);
routes.post('/totems', TotemController.create);

module.exports = routes;