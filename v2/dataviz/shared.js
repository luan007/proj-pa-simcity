function random(min, max){
    min = min || 0;
    max = max || 1;
    return Math.random() * (max - min) + min;
}

var circle_texture = new THREE.TextureLoader().load("./assets/normal-circle@2x.png");
var circle_stroke_texture = new THREE.TextureLoader().load("./assets/stroke-circle@2x.png");

var grid_texture = new THREE.TextureLoader().load("./assets/grid.png");
var road_texture = new THREE.TextureLoader().load("./assets/maoxi copy.png");
var roadline_texture = new THREE.TextureLoader().load("./assets/ROAD-01.png");
var water_texture = new THREE.TextureLoader().load("./assets/WATER-01.png");

var probe = 0;

grid_texture.wrapS = THREE.RepeatWrapping;
grid_texture.wrapT = THREE.RepeatWrapping;
grid_texture.repeat.set( 1920 / 100, 960 / 100 );


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
    lang: 'cn'
};
