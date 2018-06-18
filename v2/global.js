
var world = [];
var probe = 0;
var simplex = new SimplexNoise('seed');
var buildings = [];

var le_world = [];
var conv_world = [];
var changables = [];

var w = 1920;
var h = 960;

var config = {
    simulatorFps: 15,
    affector_range: 5,
    simulation_radius: 5,
    super_dilute: false,
    view: 'j',
    warning_threshold: 40,
    magnification: 0.5,
    touchZone: 1,
    linkZone: 3,
    lensMode: 1,
    showCriticalHint: false,
    showHeatHint: true,
    heatMapOpacityCap: 1,
    heatMode: 1 //0 = normal, 1 = high contrast
};

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

var app = new PIXI.Application({ width: dw, height: dh, antialias: true });

var pixi_rect = new PIXI.Graphics();
pixi_rect.beginFill(0xffffff);
pixi_rect.drawRect(0, 0, 40, 40);
pixi_rect.x = 0;
pixi_rect.y = 0;


var pixi_circle = new PIXI.Graphics();
pixi_circle.beginFill(0xffffff, 1);
pixi_circle.arc(0, 0, 500, 0, Math.PI * 2, false);
pixi_circle.endFill();

var pixi_stroke_circle = new PIXI.Graphics();
pixi_stroke_circle.lineStyle(10, 0xffffff);
pixi_stroke_circle.arc(0, 0, 500, 0, Math.PI * 2, false);



var rectTexture = pixi_rect.generateTexture();
var circleTexture = pixi_circle.generateTexture();
var circleStrokeTexture = pixi_circle.generateTexture();
var strokeTexture = PIXI.Texture.fromImage('assets/strokes.png')

document.body.appendChild(app.view);