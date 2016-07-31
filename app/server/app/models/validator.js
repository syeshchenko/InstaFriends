function Validator() {}

Validator.prototype.VALIDATION_ERROR_STRING = "Validation Error: ";

Validator.prototype.state = {
    isValid: true,
    message: ""
}

Validator.prototype.setState = function(state, errorMessage) {
    this.state.isValid = state;
    this.state.message = this.VALIDATION_ERROR_STRING + errorMessage;
}

module.exports = Validator;