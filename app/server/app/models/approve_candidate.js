var Validator = require('./validator');

function ApproveCandidate(req) {
    this.validator = new Validator();
    this.populateModel(req);
}

ApproveCandidate.prototype.populateModel = function(req) {
    if (req.body && req.body.approvedUserId) {
        this.approvedUserId = req.body.approvedUserId;
        this.validator.setState(true);
    } else {
        this.validator.setState(false, "approvedUserId is not supplied");
    }
}

module.exports = ApproveCandidate;


