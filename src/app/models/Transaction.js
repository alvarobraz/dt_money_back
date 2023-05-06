const mongoose = require("mongoose");
//BASE Transaction

const TransactionSchema = new mongoose.Schema({   

  description: { type: String, required: true },

  type: { type: String, enum: ['income', 'outcome'], required: true },

  category: { type: String, required: true },

  price: { type: Number, required: true }

}, { timestamps: {} });


module.exports = mongoose.model('transaction', TransactionSchema);