var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8988);

var display = io.of("/display");

io.on('connection', function (socket) {
    socket.on("pack", function (data) {
        display.emit("pack", data);
    });
});


var p = '/dev/cu.wchusbserial1460';

var SerialPort = require('serialport');
var port = new SerialPort(p, {
    baudRate: 115200
});

var buf = "";
port.on('data', function (data) {
    buf += data.toString();
    if (buf.indexOf("\n") >= 0) {
        var half = buf.split("\n")[0].trim();
        console.log(half);
        buf = buf.split("\n")[1].trim();
        if (parseInt(half.split("- ")[1]) < 20) {
            var radio = parseInt(half.split(",")[0].split(" ")[1])
            io.emit("id", {
                radio: radio,
                position: parseInt(half.split(" ")[7]),
                ago: parseInt(half.split("- ")[1])
            });
        }
    }
});

// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message);
})