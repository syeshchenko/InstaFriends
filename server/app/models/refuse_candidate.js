var Validator = require('./validator');

function RefuseCandidate(req) {
    this.validator = new Validator();
    this.populateModel(req);
}

RefuseCandidate.prototype.populateModel = function(req) {
    if (req.body && req.body.refusedUserId) {
        this.refusedUserId = req.body.refusedUserId;
        this.validator.setState(true);
    } else {
        this.validator.setState(false, "refusedUserId is not supplied");
    }
}

module.exports = RefuseCandidate;


