var Transaction = require('../models/Transaction');
var UserAccount = require('../models/UserAccount');


var isIbanExisting = function(req, res, next) {
  UserAccount.findOne({iban: req.body.iban}, function(err, userAccount){
      if (userAccount === null) {
          return res.status(404).json({message: 'Iban not exist'})
      }  else {
        req.beneficiary= userAccount;
        next();
      }
  })
}


var haveCredit = function(req, res, next) {
      if (userAccount.balance < transaction.amount) {
          return res.status(409).json({message: 'Insufficient money'})
      }  else {
        next();
      }
  }


module.exports.haveCredit = haveCredit;
module.exports.isIbanExisting = isIbanExisting;
