var when = require('when');
var node = require('when/node');
var whenKeys = require('when/keys');
var fs = require('fs');
var LinuxPWMController = require('./LinuxPWMController').LinuxPWMController;

/**
 * Control a set of Linux PWMs for setting colors on a LED strip.
 * @constructor
 * @param {Object} [options]
 */
function RGBController(options){
	options = options || {};
	var paths = options.paths || {};
	var redPath = paths.red || 'red';
	var greenPath = paths.green || 'green';
	var bluePath = paths.blue || 'blue';
	var period = Number(options.period || 4000000);
	
	var redPWM = new LinuxPWMController(redPath, period);
	var greenPWM = new LinuxPWMController(greenPath, period);
	var bluePWM = new LinuxPWMController(bluePath, period);
	
	var currentColors;
	
	this.initialize = function initialize(){
		return when.all([
			redPWM.enable(),
			greenPWM.enable(),
			bluePWM.enable()
		]).then(function(){
			return whenKeys.all({
				red: redPWM.getPulseWidth(),
				green: greenPWM.getPulseWidth(),
				blue: bluePWM.getPulseWidth()
			});
		}).then(function(initialRGB){
			currentColors = initialRGB;
		});
	};
	
	this.setColor = function setColor(red, green, blue){
		return when.all([
			redPWM.setPulseWidth(red),
			greenPWM.setPulseWidth(green),
			bluePWM.setPulseWidth(blue)
		]).then(function(){
			currentColors = {
				red: red,
				green: green,
				blue: blue
			};
		});
	};
	
	this.getColor = function getColor(){
		return currentColors;
	};
}

var controller = new RGBController();
controller.initialize().done(function(){
	var server = require('http').createServer(function(req, res){
		node.call(fs.readFile, __dirname + '/client.html').done(function(clientFile){
			res.writeHead(200);
			res.end(clientFile);
		}, function(error){
			res.writeHead(500);
			res.end(String(error));
		});
	});
	var io = require('socket.io')(server);

	io.on('connection', function(socket){
		socket.emit('colorSet', controller.getColor());
		socket.on('color', function(colorData){
			console.log('color:', colorData);
			controller.setColor(colorData.red, colorData.green, colorData.blue);
		});
	});

	server.listen(9844);
	console.log('Listening on port 9844');
});