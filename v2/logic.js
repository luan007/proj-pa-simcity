//经济／人口／医疗／教育／房产／环保／交通

//人口 - 居住／就业

//经济建筑：?居住 ?医疗 ?教育 ?房产 ?交通 ?环保 +经济 +就业
//文教建筑：?居住 ?医疗 ?房产 ?交通 +教育 +就业 +经济
//办公建筑：?居住 ?医疗 ?房产 ?交通 ?环保 +经济 +就业
//高薪企业：?居住 ?医疗 +经济 +就业
//居住:    ?医疗 ?教育 ?交通 +居住 +房产
//工业:    ?环保 ?居住 ?医疗 ?交通 +经济 +就业
//医院:    ?交通 +医疗 +就业
//学校:    ?居住 ?医疗 ?交通 +教育 +就业
//环保:    +环保

var R = function (r) {
    return r * 4;
}

var scores_old = {
    "C1": function () { //京客隆
        var size = this.variables.size;
        this.variables.radius = R(5)
        this.needs["housing"] = 500; //人
        this.needs["traffic"] = 0.1; //10%
        this.offerings["economy"] = 500; //万
        this.offerings["job"] = 200;
    },
    "C2": function () { //酒店
        var size = this.variables.size;
        this.variables.radius = R(7)
        this.needs["housing"] = 1000; //人
        this.needs["medicare"] = 0.1; //10%
        this.needs["traffic"] = 0.1; //10%
        this.offerings["economy"] = 2000; //万
        this.offerings["job"] = 300;
    },
    "C3": function () { //SKP
        var size = this.variables.size;
        this.variables.radius = R(10)
        this.needs["housing"] = 3000; //人
        this.needs["medicare"] = 0.3; //10%
        this.needs["traffic"] = 0.5; //10%
        this.needs["housePrice"] = 0.01; //10%
        this.offerings["economy"] = 150000; //15亿
        this.offerings["job"] = 2000;
    },
    "E1": function () { //科研机构
        var size = this.variables.size;
        this.variables.radius = R(5)
        this.needs["housing"] = 1000; //人
        this.needs["medicare"] = 0.5; //10%
        this.needs["traffic"] = 0.1; //10%
        this.needs["housePrice"] = 0.01; //10%
        this.offerings["economy"] = 300000; //30亿
        this.offerings["education"] = 0.1;
        this.offerings["job"] = 1000;
    },
    "E2": function () { //大学
        var size = this.variables.size;
        this.variables.radius = R(15)
        this.needs["housing"] = 2000; //人
        this.needs["medicare"] = 0.5; //10%
        this.needs["traffic"] = 0.5; //10%
        this.needs["housePrice"] = 0.1; //10%
        this.offerings["education"] = 5;
        this.offerings["job"] = 2000;
    },
    "B1": function () { //写字楼
        var size = this.variables.size;
        this.variables.radius = R(7)
        this.needs["housing"] = 30000; //人
        this.needs["medicare"] = 0.7; //10%
        this.needs["traffic"] = 0.5; //10%
        this.needs["housePrice"] = 0.1; //10%
        this.needs["environment"] = 0.1;
        this.offerings["economy"] = 500000;
        this.offerings["job"] = 20000;
    },
    "B2": function () { //公司总部
        var size = this.variables.size;
        this.variables.radius = R(10)
        this.needs["housing"] = 50000; //人
        this.needs["medicare"] = 0.7; //10%
        this.needs["traffic"] = 0.7; //10%
        this.needs["housePrice"] = 0.3; //10%
        this.offerings["economy"] = 1000000;
        this.offerings["job"] = 30000;
    },
    "T": function () { //高新技术
        var size = this.variables.size;
        this.variables.radius = R(3)
        this.needs["housing"] = 2000; //人
        this.needs["medicare"] = 0.2; //10%
        this.needs["traffic"] = 0.05; //10%
        this.needs["housePrice"] = 0.01; //10%
        this.offerings["economy"] = 500000;
        this.offerings["job"] = 1000;
    },
    "M1": function () { //贫民窟
        var size = this.variables.size;
        this.variables.radius = R(6)
        this.needs["medicare"] = 0.2; //10%
        this.needs["traffic"] = 0.2; //10%
        this.needs["job"] = 800;
        this.offerings["housePrice"] = 0.05;
        this.offerings["housing"] = 1000;
    },
    "M2": function () { //白领窟
        var size = this.variables.size;
        this.variables.radius = R(20)
        this.needs["medicare"] = 0.5; //10%
        this.needs["traffic"] = 0.8; //10%
        this.needs["education"] = 2;
        this.needs["job"] = 5000;
        this.offerings["housePrice"] = 0.1;
        this.offerings["housing"] = 10000;
    },
    "M3": function () { //别墅
        var size = this.variables.size;
        this.variables.radius = R(8)
        this.needs["medicare"] = 0.5; //10%
        this.needs["traffic"] = 0.01; //10%
        this.needs["education"] = 1;
        this.needs["job"] = 500;
        this.needs["housePrice"] = 0.1;
        this.offerings["housing"] = 3000;
        this.offerings["economy"] = 10000;
    },
    "H1": function () { //医院
        var size = this.variables.size;
        this.variables.radius = R(5)
        this.offerings["medicare"] = 0.5; //10%
        this.offerings["job"] = 1000;
        this.needs["traffic"] = 0.2; //10%
        this.needs["housing"] = 800;
    },
    "H2": function () { //医院2
        var size = this.variables.size;
        this.variables.radius = R(10)
        this.offerings["medicare"] = 2; //10%
        this.offerings["job"] = 3000;
        this.needs["traffic"] = 0.4; //10%
        this.needs["housing"] = 2000;
    },
    "H3": function () { //医院3
        var size = this.variables.size;
        this.variables.radius = R(15)
        this.offerings["medicare"] = 4; //10%
        this.offerings["job"] = 5000;
        this.needs["traffic"] = 0.7; //10%
        this.needs["housing"] = 3000;
    },
    "S1": function () { //幼儿园
        var size = this.variables.size;
        this.variables.radius = R(4)
        this.offerings["education"] = 0.5; //10%
        this.offerings["job"] = 200;
        this.needs["traffic"] = 0.3; //10%
        this.needs["housing"] = 100;
    },
    "S2": function () { //小学
        var size = this.variables.size;
        this.variables.radius = R(6)
        this.offerings["education"] = 1.3; //10%
        this.offerings["job"] = 1000;
        this.needs["traffic"] = 0.5; //10%
        this.needs["housing"] = 500;
    },
    "S3": function () { //中学
        var size = this.variables.size;
        this.variables.radius = R(8)
        this.offerings["education"] = 2; //10%
        this.offerings["job"] = 1500;
        this.needs["traffic"] = 0.6; //10%
        this.needs["housing"] = 700;
    },
    "N1": function () { //废物处理厂
        var size = this.variables.size;
        this.variables.radius = R(8)
        this.offerings["job"] = 500;
        this.offerings["economy"] = 10000;
        this.needs["traffic"] = 0.1; //10%
        this.needs["housing"] = 200;
        this.needs["environment"] = 0.5;
    },
    "N2": function () { //仓库
        var size = this.variables.size;
        this.variables.radius = R(8)
        this.offerings["economy"] = 50000;
        this.offerings["job"] = 1000;
        this.needs["traffic"] = 0.1; //10%
        this.needs["housing"] = 800;
        this.needs["environment"] = 0.1;
    },
    "N3": function () { //轻工业
        var size = this.variables.size;
        this.variables.radius = R(8)
        this.offerings["economy"] = 80000;
        this.offerings["job"] = 5000;
        this.needs["traffic"] = 0.2; //10%
        this.needs["housing"] = 2000;
        this.needs["environment"] = 0.3;
    },
};


var template = {
    c: function (size) { //commercial
        this.variables.radius = R(5 + size * 10);
        this.factor["housing"] = -1 * size;
        this.factor["traffic"] = -0.1 * size;
        this.factor["economy"] = +1 + 3 * size;
        this.factor["job"] = -1 - 3 * size;
        this.factor["medicare"] = -0.01 * size;
        this.factor["environment"] = -0.1 * size * size;
        this.factor["income"] = -0.5 + size * 0.2;
        this.factor["housePrice"] = 0.4 * size;
    },
    e: function (size) { //education
        this.variables.radius = R(5 + size * 10);
        this.factor["housing"] = -3 * size;
        this.factor["income"] = 1 + size * 2;
        this.factor["medicare"] = -0.5 * size;
        this.factor["environment"] = +0.5 * size * size;
        this.factor["traffic"] = -0.3 * size;
        this.factor["housePrice"] = 2 * size;
        this.factor["economy"] = 3 * size; //30亿
        this.factor["education"] = 2 * size;
        this.factor["job"] = -1 - 2 * log(size);
    },
    b: function (size) { //biz
        this.variables.radius = R(2 + size * 10);
        this.factor["housing"] = -5 * size;
        this.factor["income"] = 1 + log(size) * 2;
        this.factor["medicare"] = -0.7 * size; //10%
        this.factor["traffic"] = -0.6 * size; //10%
        this.factor["housePrice"] = 1.2 * size; //10%
        this.factor["environment"] = -0.3;
        this.factor["economy"] = 5 * size * size;
        this.factor["job"] = -2 - 5 * log(size);
    },
    t: function (size) { //tech
        this.variables.radius = R(3 + size * 10);
        this.factor["income"] = 2 + log(size) * 5;
        this.factor["housing"] = -0.5 * size; //人
        this.factor["medicare"] = -0.2 * size; //10%
        this.factor["traffic"] = -0.2 * size; //10%
        this.factor["housePrice"] = 1 * size; //10%
        this.factor["environment"] = +1.1 * size * size;
        this.factor["economy"] = 5 * size * size;
        this.factor["job"] = -3 - 2 * log(size);
    },
    m: function (size) { //HOUSE!
        this.variables.radius = R(10 + size * 5);
        this.factor["medicare"] = -0.5 * size; //10%
        this.factor["traffic"] = -0.8 * size; //10%
        this.factor["education"] = -0.3 * size;
        this.factor["environment"] = -0.1 * size * size;
        this.factor["job"] = 3 * size;
        this.factor["housing"] = size * 2;
        this.factor["housePrice"] = 1 / ((size) + 1); //10%
    },
    h: function (size) { //hospital!
        this.variables.radius = R(10 + size * 5);
        this.factor["medicare"] = 1.2 * size; //10%
        this.factor["job"] = -2 * size;
        this.factor["traffic"] = -0.3 * size; //10%
        this.factor["housing"] = -0.2 * size;
    },
    s: function (size) { //schoool!        
        this.variables.radius = R(2 + size * 5);
        this.factor["education"] = 1.3 * size * size; //10%
        this.factor["job"] = -0.5 * size;
        this.factor["traffic"] = -0.2 * size; //10%
        this.factor["housing"] = -0.1 * size;
        this.factor["housePrice"] = 2 * size; //10%
    },
    n: function (size) { //special    
        this.variables.radius = R(3 + size * 5);
        this.factor["economy"] = 0.5 * size;
        this.factor["job"] = -1 * size;
        this.factor["traffic"] = -0.1 * size; //10%
        this.factor["housing"] = -0.3 * size;
        this.factor["environment"] = -2 * size;
    }
};


var scores = {
    "C1": (q) => { return template.c.bind(q, 1) },
    "C2": (q) => { return template.c.bind(q, 2) },
    "C3": (q) => { return template.c.bind(q, 4) },
    "E1": (q) => { return template.e.bind(q, 1) },
    "E2": (q) => { return template.e.bind(q, 3) },
    "B1": (q) => { return template.b.bind(q, 1) },
    "B2": (q) => { return template.b.bind(q, 4) },
    "T": (q) => { return template.t.bind(q, 2) },
    "M1": (q) => { return template.m.bind(q, 2) },
    "M2": (q) => { return template.m.bind(q, 5) },
    "M3": (q) => { return template.m.bind(q, 0.2) },
    "H1": (q) => { return template.h.bind(q, 1) },
    "H2": (q) => { return template.h.bind(q, 3) },
    "H3": (q) => { return template.h.bind(q, 5) },
    "S1": (q) => { return template.s.bind(q, 1) },
    "S2": (q) => { return template.s.bind(q, 3) },
    "S3": (q) => { return template.s.bind(q, 5) },
    "N1": (q) => { return template.n.bind(q, 1) },
    "N2": (q) => { return template.n.bind(q, 3) },
    "N3": (q) => { return template.n.bind(q, 6) },
};