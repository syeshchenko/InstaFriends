var Validator = require('./validator');

function SocialMedia(req) {
    this.validator = new Validator();
    this.populateModel(req);
}

SocialMedia.prototype.populateModel = function (req) {
    var missingParams = [];
    
    if (!req.body) {
        missingParams.push("userId", "socialMediaType");
    } else {
        if (!req.body.userId) {
            missingParams.push('userId');
        }
        if (!req.body.socialMediaType) {
            missingParams.push('socialMediaType');
        }
    }

    if (missingParams.length) {
        this.validator.setState(false, missingParams.toString() + " are not supplied");
    } else {
        this.userId = req.body.userId;
        this.socialMediaType = req.body.socialMediaType;
        this.validator.setState(true);
    }
}

module.exports = SocialMedia;


