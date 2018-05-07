var userAccount = require('../models/UserAccount');
var jwt = require('jwt-simple');
var secret = 'xxx';


var verify = function(req, res, next) {
    if (req.query.token === undefined) return res.status(401).json({message:'Unothorized'})
    var id = jwt.decode(req.query.token, secret);
    UserAccount.findById(id, function(err, userAccount) {
        if (err) return res.status(500).json({message: err});
        req.userAccount = userAccount;
        next();
    })
}

module.exports.verify = verify;
module.exports.secret = secret;
