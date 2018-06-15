var R = function (r) {
    return r * 4;
}

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