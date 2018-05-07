var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var UserAccount = require('../models/userAccount');
var Transaction = require('../models/transaction');
var auth = require('../middlewares/auth');
var ibanGenerator = require('iban-generator');

//SIGN ACCOUNT
router.post('/signup', function(req, res) {
   var userAccount = new UserAccount();
   userAccount.idAccount = idAccount.randomNumber();
   userAccount.name = req.body.name;
   userAccount.surname = req.body.surname;
   userAccount.email = req.body.email;
   userAccount.password = bcrypt.hashSync(req.body.password, 10);
   userAccount.iban = iban.randomNumber();

   userAccount.save(function(err, accountCreated) {
       if (err) return res.status(400).json(err);
       res.status(201).json(accountCreated);
   })
})

//LOGIN ACCOUNT
router.post('/login', function(req, res) {
    UserAccount.findOne({idAccount: req.body.idAccount}, function(err, userAccont){
        if (userAccount === null) {
            return res.status(404).json({message: 'Account not found'})
        } else if (bcrypt.compareSync(req.body.password, userAccount.password)) {
            var token = jwt.encode(userAccont.id, auth.secret);
            return res.json({token: token});
        } else {
            return res.status(401).json({message: 'Password not valid'});
        }
    })
})

//SHOW ACCOUNT-DATA
router.get('/me', auth.verify, function(req, res, next) {
    res.json(req.userAccount);
});

//DO Transaction
router.post('/doTransaction', auth.verify, doTransaction.isIbanExisting, doTransaction.haveCredit,function(req, res) {
    var transaction = new Transaction();
    transaction.userAccont= req.userAccount._id;
    transaction.beneficiary= req.beneficiary._id;
    transaction.amount= req.body.amount;

    req.userAccont.balance = parseInt(req.userAccount.balance) - parseInt(req.body.amount);
    req.beneficiary.balance = parseInt(req.beneficiary.balance) + parseInt(req.body.amount);

    req.userAccount.save();
    req.beneficiary.save();

    transaction.save(function(err, transactionDone) {
        if (err) return res.status(400).json(err);
        res.status(201).json(transactionDone);
    })
})

module.exports = router;
