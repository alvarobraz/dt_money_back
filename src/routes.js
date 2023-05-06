const express = require('express');
const routes = express.Router();

const TransactionsController = require('./app/controllers/TransactionsController');

routes.post(
  "/transactions",
  TransactionsController.store
);

routes.get(
  "/transactions", 
  TransactionsController.get
);

routes.get(
  "/transactions/:id",
  TransactionsController.show
);

routes.get(
  "/transactionssummary",
  TransactionsController.summary
);

// routes.put(
//   "/transactions/:id",
//   TransactionsController.update
// );

// routes.delete(
//   "/transactions/:id",
//   TransactionsController.destroy
// );

module.exports = routes;
