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

var R = function(r) {
    return r * 20;
}

var scores = {
    "C1": function() { //京客隆
        var size = this.variables.size;
        this.variables.radius = R(5) 
        this.needs["housing"] = 500; //人
        this.needs["traffic"] = 0.1; //10%
        this.offerings["economy"] = 500; //万
        this.offerings["job"] = 200;
    },
    "C2": function() { //酒店
        var size = this.variables.size;
        this.variables.radius = R(7) 
        this.needs["housing"] = 1000; //人
        this.needs["medicare"] = 0.1; //10%
        this.needs["traffic"] = 0.1; //10%
        this.offerings["economy"] = 2000; //万
        this.offerings["job"] = 300;
    },
    "C3": function() { //SKP
        var size = this.variables.size;
        this.variables.radius = R(10) 
        this.needs["housing"] = 3000; //人
        this.needs["medicare"] = 0.3; //10%
        this.needs["traffic"] = 0.5; //10%
        this.needs["housePrice"] = 0.01; //10%
        this.offerings["economy"] = 150000; //15亿
        this.offerings["job"] = 2000;
    },
    "E1": function() { //科研机构
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
    "E2": function() { //大学
        var size = this.variables.size;
        this.variables.radius = R(15) 
        this.needs["housing"] = 2000; //人
        this.needs["medicare"] = 0.5; //10%
        this.needs["traffic"] = 0.5; //10%
        this.needs["housePrice"] = 0.1; //10%
        this.offerings["education"] = 5;
        this.offerings["job"] = 2000;
    },
    "B1": function() { //写字楼
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
    "B2": function() { //公司总部
        var size = this.variables.size;
        this.variables.radius = R(10) 
        this.needs["housing"] = 50000; //人
        this.needs["medicare"] = 0.7; //10%
        this.needs["traffic"] = 0.7; //10%
        this.needs["housePrice"] = 0.3; //10%
        this.offerings["economy"] = 1000000;
        this.offerings["job"] = 30000;
    },
    "T": function() { //高新技术
        var size = this.variables.size;
        this.variables.radius = R(3) 
        this.needs["housing"] = 2000; //人
        this.needs["medicare"] = 0.2; //10%
        this.needs["traffic"] = 0.05; //10%
        this.needs["housePrice"] = 0.01; //10%
        this.offerings["economy"] = 500000;
        this.offerings["job"] = 1000;
    },
    "M1": function() { //贫民窟
        var size = this.variables.size;
        this.variables.radius = R(6) 
        this.needs["medicare"] = 0.2; //10%
        this.needs["traffic"] = 0.2; //10%
        this.needs["job"] = 800;
        this.offerings["housePrice"] = 0.05;
        this.offerings["housing"] = 1000;
    },
    "M2": function() { //白领窟
        var size = this.variables.size;
        this.variables.radius = R(20) 
        this.needs["medicare"] = 0.5; //10%
        this.needs["traffic"] = 0.8; //10%
        this.needs["education"] = 2;
        this.needs["job"] = 5000;
        this.offerings["housePrice"] = 0.1;
        this.offerings["housing"] = 10000;
    },
    "M3": function() { //别墅
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
    "H1": function() { //医院
        var size = this.variables.size;
        this.variables.radius = R(5) 
        this.offerings["medicare"] = 0.5; //10%
        this.offerings["job"] = 1000;
        this.needs["traffic"] = 0.2; //10%
        this.needs["housing"] = 800;
    },
    "H2": function() { //医院2
        var size = this.variables.size;
        this.variables.radius = R(10) 
        this.offerings["medicare"] = 2; //10%
        this.offerings["job"] = 3000;
        this.needs["traffic"] = 0.4; //10%
        this.needs["housing"] = 2000;
    },
    "H3": function() { //医院3
        var size = this.variables.size;
        this.variables.radius = R(15) 
        this.offerings["medicare"] = 4; //10%
        this.offerings["job"] = 5000;
        this.needs["traffic"] = 0.7; //10%
        this.needs["housing"] = 3000;
    },
    "S1": function() { //幼儿园
        var size = this.variables.size;
        this.variables.radius = R(4) 
        this.offerings["education"] = 0.5; //10%
        this.offerings["job"] = 200;
        this.needs["traffic"] = 0.3; //10%
        this.needs["housing"] = 100;
    },
    "S2": function() { //小学
        var size = this.variables.size;
        this.variables.radius = R(6) 
        this.offerings["education"] = 1.3; //10%
        this.offerings["job"] = 1000;
        this.needs["traffic"] = 0.5; //10%
        this.needs["housing"] = 500;
    },
    "S3": function() { //中学
        var size = this.variables.size;
        this.variables.radius = R(8) 
        this.offerings["education"] = 2; //10%
        this.offerings["job"] = 1500;
        this.needs["traffic"] = 0.6; //10%
        this.needs["housing"] = 700;
    },
    "N1": function() { //废物处理厂
        var size = this.variables.size;
        this.variables.radius = R(8) 
        this.offerings["job"] = 500;
        this.offerings["economy"] = 10000;
        this.needs["traffic"] = 0.1; //10%
        this.needs["housing"] = 200;
        this.needs["environment"] = 0.5;
    },
    "N2": function() { //仓库
        var size = this.variables.size;
        this.variables.radius = R(8) 
        this.offerings["economy"] = 50000;
        this.offerings["job"] = 1000;
        this.needs["traffic"] = 0.1; //10%
        this.needs["housing"] = 800;
        this.needs["environment"] = 0.1;
    },
    "N3": function() { //轻工业
        var size = this.variables.size;
        this.variables.radius = R(8) 
        this.offerings["economy"] = 80000;
        this.offerings["job"] = 5000;
        this.needs["traffic"] = 0.2; //10%
        this.needs["housing"] = 2000;
        this.needs["environment"] = 0.3;
    },
};