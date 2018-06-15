
var world = [];
var simplex = new SimplexNoise('seed');
var buildings = [];

var le_world = [];
var conv_world = [];
var changables = [];

var w = 1920;
var h = 960;

var condensed = {
    allFactors: [],
    worldConfigs: []
};

var chunks = {
    positions: []
};

var computed = {
    aspects: []
};

var dw = 1920;
var dh = 1080;

var app = new PIXI.Application({ width: dw, height: dh });

var pixi_rect = new PIXI.Graphics();
pixi_rect.beginFill(0xffffff);
pixi_rect.drawRect(0, 0, 40, 40);
pixi_rect.x = 0;
pixi_rect.y = 0;
var rectTexture = pixi_rect.generateTexture();

document.body.appendChild(app.view);