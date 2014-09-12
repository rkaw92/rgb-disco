/**
 * Base constructor for all PWM controller implementations.
 * @abstract
 */
function PWMController(){
	throw new Error('PWMController is an abstract constructor and may not be called. Please use an actual implementation instead!');
}

PWMController.prototype.enable = function enable(){};

PWMController.prototype.disable = function disable(){};

PWMController.prototype.setPulseWidth = function setPulseWidth(pulseFraction){};

PWMController.prototype.getPulseWidth = function getPulseWidth(){};

module.exports.PWMController = PWMController;