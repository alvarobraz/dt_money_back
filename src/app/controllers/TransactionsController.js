require("dotenv/config");
const Transaction = require('../models/Transaction');
const TransactionService = require('../services/TransactionService')

module.exports = {

  async store(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();
      const requiredFields = ['description', 'type', 'category', 'price'];
      for (const field of requiredFields) {
        console.log(requiredFields.length)
        if (!req.body[field]) {
          return res.status(400).send({ error: `Campo obrigatório ausente: ${field}` });
        }
      }

      const createTransaction = await Transaction.create([req.body], { session });
      await session.commitTransaction();
      return res.json(createTransaction)

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  },

  async get(req, res) {

    // console.log(req.query)
    try {

      const { 
        _sort,
        _order,
        name,
        page,
        limit
      } = req.query;

      filter = {}
      if(_sort === 'createdAt' && _order === 'desc') {
        sort = {
          createdAt: -1
        }
      }

      function diacriticSensitiveRegex(string = '') {
        return string
        .replace(/a/g, '[a,á,à,ä,â,ã]')
        .replace(/A/g, '[A,Á,À,Ä,Â,Ã]')
        .replace(/e/g, '[e,é,ë,è,ê,ẽ]')
        .replace(/E/g, '[E,É,È,Ê,Ẽ]')
        .replace(/i/g, '[i,í,ï,ì]')
        .replace(/I/g, '[I,Í,Ì]')
        .replace(/o/g, '[o,ó,ö,ò,ô]')
        .replace(/O/g, '[O,Ó,Ò,Ô]')
        .replace(/u/g, '[u,ü,ú,ù]')
        .replace(/U/g, '[U,Ü,Ú,Ù]')
        .replace(/c/g, '[c,ç]')
        .replace(/C/g, '[C,Ç]'); 
      }

      if(name !== undefined && name !== '') {
        filter ={
          ...filter, 
          $or: [
            { description: new RegExp(diacriticSensitiveRegex(name),'i') },
            // { price: new RegExp(diacriticSensitiveRegex(name),'i') },
            { category: new RegExp(diacriticSensitiveRegex(name),'i') },
            { type: new RegExp(diacriticSensitiveRegex(name),'i') }
          ]
        }
      }

      const TransactionSearch = await TransactionService
      .get(filter, _sort, Number(page), Number(limit))
  
      // const TransactionSearch =  await Transaction.find().sort({createdAt:-1})

      return res.json(TransactionSearch)

    } catch (error) {
      return res.status(400).json({ error });
    }
     
  },

  async show(req, res) {

    try {

      const TransactionsGetOne = await Transaction.findOne({ _id: req.params.id })
      return res.json(TransactionsGetOne)

    } catch (error) {
      return res.status(400).json({ error });
    }

  },

  async update(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();

      if (req.body.description !== undefined) {
        const description = req.body.description.trim().toLowerCase();
        const searchTransactions = await Transaction.findOne({
          description: { $regex: new RegExp(`^${description}$`, 'i') },
          _id: { $ne: req.params.id }
        });
      
        if (searchTransactions) {
          return res.status(400).send({
            error: `Já existe uma transação com este nome!`
          });
        }
      }

      await Transaction.updateOne({ _id: req.params.id }, req.body, { session })
      await session.commitTransaction();
      return res.json({ message: "Transação alterada!" })

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);;
    }
    session.endSession();

  },

  async destroy(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();

      await Transaction.deleteOne({ _id: req.params.id })
      await session.commitTransaction();
      return res.status(204).send({ message: `A transação foi deletada!` });

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  }

}
