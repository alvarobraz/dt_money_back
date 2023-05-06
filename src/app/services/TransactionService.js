const Transaction = require('../models/Transaction');

module.exports = {

  async get(
    filter,
    sort,
    page, 
    limit,
    pages
  ) {

    try {
      
      const transactionSearch = await Transaction
      .find(filter)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit))
      .sort(sort)
      .collation({
        locale : "pt"
      })
      
      const  transactionCount = await Transaction
      .find(filter)

      const countTransactionSearch = await  transactionCount.length;

      const pagesFloat = (Number(countTransactionSearch)/limit);
      pagesFloat_a     = pagesFloat.toString();
      pagesFloat_a     = pagesFloat_a.split('.')
      pagesFloat_      = parseInt(pagesFloat_a[0])

      if(pagesFloat_a[1] && pagesFloat_a[1] >= 1) {

        pages = pagesFloat_;
          
      }
      else {

        pages =   pagesFloat                          

      }

      return {
        transactionSearch,
        total: countTransactionSearch,
        page,
        limit,
        pages
      }

    } catch (error) {
        console.log(error)
      return json({ error });

    }
  
  },


}