var nodefn = require('when/node');
var fs = require('fs');


/**
 * A PWM controller prototype for controlling a Linux PWM-class device, as exposed by /sys/class/pwm/*
 * Requires the device to expose the following writable files: enable, period, duty_cycle.
 * @constructor
 * @extends RGBController
 * @param {string} path The VFS path to the PWM device. Usually something like "/sys/class/pwm/pwmchip0/pwm1".
 */
function LinuxPWMController(path, period){
	this.path = path;
	this.period = period;
	this.periodFile = this.path + '/period';
	this.dutyCycleFile = this.path + '/duty_cycle';
	this.enableFile = this.path + '/enable';
}

function write(path, data){
	return nodefn.call(fs.writeFile, path, data, { encoding: 'ascii' });
}

function partial(functionToBind){
	var args = Array.prototype.slice.call(arguments, 1);
	args.unshift(undefined);
	return functionToBind.bind.apply(functionToBind, args);
}

LinuxPWMController.prototype.enable = function enable(){
	return write(this.periodFile, String(this.period)).then(partial(write, this.enableFile, '1'));
};

LinuxPWMController.prototype.disable = function disable(){
	return write(this.enableFile, '0');
};

LinuxPWMController.prototype.setPulseWidth = function setPulseWidth(pulseFraction){
	var dutyCycle = Math.round(pulseFraction * this.period);
	return write(this.dutyCycleFile, String(dutyCycle));
};

LinuxPWMController.prototype.getPulseWidth = function getPulseWidth(){
	var period = this.period;
	return nodefn.call(fs.readFile, this.dutyCycleFile).then(function(dutyCycle){
		return Number(dutyCycle) / period;
	});
};

module.exports.LinuxPWMController = LinuxPWMController;