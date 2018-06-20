
var world = [];
var probe = 0;
var simplex = new SimplexNoise('seed');
var buildings = [];

var global = {};

var le_world = [];
var conv_world = [];
var changables = [];

var w = 1920;
var h = 960;

var _explain = {
    en: {
        j: "JOB",
        m: "MEDICARE",
        t: "TRAFFIC",
        h: "HOUSING",
        i: "INCOME",
        ed: "EDUCATION",
        ec: "ECONOMY",
        en: "ENVIRONMENT",
        hp: "HOUSE-PRICE",


        j_err: "INSUFFICENT JOB OPPORTUNITY",
        m_err: "INSUFFICENT MEDICAL RESOURCE",
        t_err: "TRAFFIC INEFFICIENCY",
        h_err: "INSUFFICENT HOUSING",
        i_err: "AVG INCOME TOO LOW",
        ed_err: "INSUFFICENT EDUCATION RESOURCE",
        ec_err: "LOW ECONOMIC VALUE",
        en_err: "ENVIROMENTAL ISSUES",
        hp_err: "POTENTIALLY IN-BALANCED HOUSE-PRICE",
    },
    cn: {
        j_err: "区域就业机会不足",
        m_err: "区域医疗资源不足",
        t_err: "平均交通压力较高",
        h_err: "区域住房资源可能存在问题",
        i_err: "区域平均收入过低",
        ed_err: "区域教育资源不足",
        ec_err: "区域产值低于均值",
        en_err: "环境压力较大",
        hp_err: "区域性住房成本问题",

        j: "就业",
        m: "医疗",
        t: "交通",
        h: "住房",
        i: "收入",
        ed: "教育",
        ec: "经济",
        en: "环境",
        hp: "地产"
    }
};

function explain(t) {
    return _explain[config.lang][t];
}

var config = {
    simulatorFps: 15,
    affector_range: 10,
    simulation_radius: 10,
    super_dilute: false,
    view: 'j',
    warning_threshold: 40,
    magnification: 0.5,
    touchZone: 1,
    linkZone: 3,
    lensMode: 0,
    showCriticalHint: false,
    showHeatHint: true,
    heatMapOpacityCap: 1,
    heatMode: 0, //0 = normal, 1 = high contrast,
    touchless_timeout: 5000,
    lang: 'cn'
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


setInterval(() => {
    socket.emit("pack", {
        computed: computed,
        condensed: condensed,
        config: config,
        chunks: chunks
    });
}, 1000);
