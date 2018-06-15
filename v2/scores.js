var R = function (r) {
    return r * config.affector_range;
}


/**
 * h: housing
 * t: traffic
 * ec: economy
 * j: job
 * m: medicare
 * i: income
 * hp: house-price
 * ed: education
 * en: environment
 */


var template = {
    c: function (size) { //commercial
        this.variables.radius = R(5 + size * 10);
        this.factor["h"] = -1 * size;
        this.factor["t"] = -0.1 * size;
        this.factor["ec"] = +1 + 3 * size;
        this.factor["j"] = -1 - 3 * size;
        this.factor["m"] = -0.01 * size;
        this.factor["en"] = -0.1 * size * size;
        this.factor["i"] = -0.5 + size * 0.2;
        this.factor["hp"] = 0.4 * size;
    },
    e: function (size) { //ed
        this.variables.radius = R(5 + size * 10);
        this.factor["h"] = -3 * size;
        this.factor["i"] = 1 + size * 2;
        this.factor["m"] = -0.5 * size;
        this.factor["en"] = +0.5 * size * size;
        this.factor["t"] = -0.3 * size;
        this.factor["hp"] = 2 * size;
        this.factor["ec"] = 3 * size; //30亿
        this.factor["ed"] = 2 * size;
        this.factor["j"] = -1 - 2 * log(size);
    },
    b: function (size) { //biz
        this.variables.radius = R(2 + size * 10);
        this.factor["h"] = -5 * size;
        this.factor["i"] = 1 + log(size) * 2;
        this.factor["m"] = -0.7 * size; //10%
        this.factor["t"] = -0.6 * size; //10%
        this.factor["hp"] = 1.2 * size; //10%
        this.factor["en"] = -0.3;
        this.factor["ec"] = 5 * size * size;
        this.factor["j"] = -2 - 5 * log(size);
    },
    t: function (size) { //tech
        this.variables.radius = R(3 + size * 10);
        this.factor["i"] = 2 + log(size) * 5;
        this.factor["h"] = -0.5 * size; //人
        this.factor["m"] = -0.2 * size; //10%
        this.factor["t"] = -0.2 * size; //10%
        this.factor["hp"] = 1 * size; //10%
        this.factor["en"] = +1.1 * size * size;
        this.factor["ec"] = 5 * size * size;
        this.factor["j"] = -3 - 2 * log(size);
    },
    m: function (size) { //HOUSE!
        this.variables.radius = R(10 + size * 5);
        this.factor["m"] = -0.5 * size; //10%
        this.factor["t"] = -0.8 * size; //10%
        this.factor["ed"] = -0.3 * size;
        this.factor["en"] = -0.1 * size * size;
        this.factor["j"] = 3 * size;
        this.factor["h"] = size * 2;
        this.factor["hp"] = 1 / ((size) + 1); //10%
    },
    h: function (size) { //hospital!
        this.variables.radius = R(10 + size * 5);
        this.factor["m"] = 1.2 * size; //10%
        this.factor["j"] = -2 * size;
        this.factor["t"] = -0.3 * size; //10%
        this.factor["h"] = -0.2 * size;
    },
    s: function (size) { //schoool!        
        this.variables.radius = R(2 + size * 5);
        this.factor["ed"] = 1.3 * size * size; //10%
        this.factor["j"] = -0.5 * size;
        this.factor["t"] = -0.2 * size; //10%
        this.factor["h"] = -0.1 * size;
        this.factor["hp"] = 2 * size; //10%
    },
    n: function (size) { //special    
        this.variables.radius = R(3 + size * 5);
        this.factor["ec"] = 0.5 * size;
        this.factor["j"] = -1 * size;
        this.factor["t"] = -0.1 * size; //10%
        this.factor["h"] = -0.3 * size;
        this.factor["en"] = -2 * size;
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