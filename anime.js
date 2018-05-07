// icons = [
//     ["交通", loadImage("./2x/car.png")],
//     ["教育", loadImage("./2x/edu.png")],
//     ["医疗", loadImage("./2x/health.png")],
//     ["居住", loadImage("./2x/home.png")],
//     ["经济", loadImage("./2x/money.png")],
//     ["环境", loadImage("./2x/rec.png")],
//     ["人口", loadImage("./2x/user.png")],
// ]

var mapping;
var zoom = 2; //
var w = 1920;
var h = 1080;
var rh = 2160;
var rw = 3840;
var buildings = [];



var probe_t = 0;
var probe = 0;

function render_building(t) {
    // t.default_render();

    outlineCanvas.blendMode(BLEND);

    // selectedTab = 0;

    push();
    if (1) {
        translate(this.variables.position[0], this.variables.position[1]);

        var d = dist(this.variables.position[0], this.variables.position[1], w / 2, h / 2) /
            1200;

        // fill(255, 5);
        // noFill();
        // fill(255, 1)
        // if (dist(mouseX, mouseY, this.variables.position[0], this.variables.position[1]) < 30) {
        // ellipse(0, 0, 150, 150);
        // }
        fill(255, 20);
        noStroke();
        rectMode(CENTER);
        rotate(radians(this.variables.rotation));
        rect(0, 0, this.RSIZE, this.RSIZE);

        noFill();
        stroke(255);
        //draw shell

        var rs = this.RSIZE;
        strokeWeight(1);
        if (abs(d - probe) < 0.2 && random(0.2) < abs(d - probe)) {

            noStroke();
            rectMode(CENTER);
            fill(200, 255, 255, abs(d - probe) / 0.2 * 255);
            rect(0, 0, this.RSIZE * abs(d - probe) / 0.2, this.RSIZE * abs(d - probe) / 0.2);
            stroke(255, abs(d - probe) / 0.2 * 255);


            for (var corner = 0; corner < 4; corner++) {
                rotate(PI / 2);
                beginShape();
                vertex(-rs / 2 + 3, -rs / 2 - 3);
                vertex(-rs / 2 - 3, -rs / 2 - 3);
                vertex(-rs / 2 - 3, -rs / 2 + 3);
                endShape();
            }
        }
    }
    pop();


    var tr = map(selectionClock, 0, 0.05, 0.0, 1);
    var rtr = random(1) > tr ? 0 : tr;

    if (mapping[selectedTab].indexOf(this.variables.name) >= 0) {
        push();
        translate(this.variables.position[0], this.variables.position[1]);

        // stroke(255);
        outlineCanvas.push();
        outlineCanvas.translate(this.variables.position[0], this.variables.position[1]);

        outlineCanvas.strokeWeight(1);
        var sn = sin(millis() / 500 + this.variables.position[0] / 10) * 0.5 + 0.5;
        outlineCanvas.stroke(255 * 0.5, 50, 0, sn * sn * sn * 60 * tr);
        outlineCanvas.noFill();
        if (selectedTab !== 2) {
            outlineCanvas.ellipse(0, 0, this.variables.radius * 2, this.variables.radius * 2);
        }
        // outlineCanvas.stroke(255, 150);
        // outlineCanvas.strokeWeight(3);
        outlineCanvas.stroke(255 * rtr);
        outlineCanvas.strokeWeight(1);
        outlineCanvas.line(30, -10, 40, -15);
        outlineCanvas.fill(255 * rtr);
        outlineCanvas.noStroke();
        outlineCanvas.text(this.variables.name, 48, -18);

        // var f = sin(millis() / 1000 + this.variables.position[0] / 10) * 0.5 + 0.5;
        // outlineCanvas.rotate(millis() / 500 + this.variables.position[0] / 100);

        // outlineCanvas.arc(0, 0, this.variables.radius * 2, this.variables.radius * 2, f * PI, f * PI + 0.2);
        outlineCanvas.pop();

        strokeWeight(1);

        fill(255, 100, 0, 255 * rtr);
        noStroke();
        rectMode(CENTER);
        rotate(radians(this.variables.rotation));
        rect(0, 0, this.RSIZE + 2, this.RSIZE + 2);

        stroke(255, 100, 0, rtr * 255);
        noFill();
        rect(0, 0, this.RSIZE + 5, this.RSIZE + 5);
        rect(0, 0, this.RSIZE + 15, this.RSIZE + 15);

        strokeWeight(2);
        stroke(255, 100 + (sin(millis() / 100 + this.variables.position[0] / 50) * 0.5 + 0.5) * 200);
        for (var corner = 0; corner < 4; corner++) {
            rotate(PI / 2);
            beginShape();
            vertex(-rs / 2 + 3, -rs / 2 - 3);
            vertex(-rs / 2 - 3, -rs / 2 - 3);
            vertex(-rs / 2 - 3, -rs / 2 + 3);
            endShape();
        }
        strokeWeight(1);
        pop();

        for (var i = 0; i < this.offering_out.length; i++) {
            var other = this.offering_out[i].other;
            outlineCanvas.noStroke(); //strokeWeight(3);
            // outlineCanvas.noStroke();
            // // var other = this.affected_cache[i]
            // var p = (millis() / 3000) % 1;
            // var dx = (other.variables.position[0] - this.variables.position[0]) * p;
            // var dy = (other.variables.position[1] - this.variables.position[1]) * p;
            // var dx2 = (other.variables.position[0] - this.variables.position[0]) * (p + 0.01);
            // var dy2 = (other.variables.position[1] - this.variables.position[1]) * (p + 0.01);
            // outlineCanvas.line(this.variables.position[0] + dx, this.variables.position[1] + dy,
            //     this.variables.position[0] + dx2, this.variables.position[1] + dy2)
            var sz = pow(0.5 + 0.5 * sin(millis() / 800 + other.variables.position[1] / 200), 2) * 50 + 5;
            // outlineCanvas.noFill();
            outlineCanvas.fill(10, 100 + sz * 3, 255, (255 - sz * 3) * rtr);
            outlineCanvas.ellipse(other.variables.position[0], other.variables.position[1], sz, sz);
        }

    }

    pop();
}

function read_buildings() {
    var all_buildings = document.querySelectorAll("#building_layout > rect, #building_layout > g > rect");
    for (var i = 0; i < all_buildings.length; i++) {
        var cur = all_buildings[i];
        var x = parseFloat(cur.getAttribute("x"));
        var y = parseFloat(cur.getAttribute("y"));
        var ctm = cur.getCTM();
        var r = decomposeMatrix(ctm).rotation;
        var p = building_layout.createSVGPoint();
        p.x = x + 33 / 2;
        p.y = y + 33 / 2;
        var np = p.matrixTransform(ctm);
        np.x *= 1;
        np.y *= 1;
        buildings.push({
            x: np.x,
            y: np.y,
            r: r
        })
        if (cur.id.trim() == "") continue;
        for (var j in scores) {
            if (cur.id.startsWith(j)) {
                world.push(e({
                    position: [np.x, np.y],
                    rotation: r,
                    name: j,
                }, scores[j], render_building));

                break;
            }
        }
    }
}

var cars = [];
function updateCars() {
    carCanvas.rectMode(CENTER);
    carCanvas.noStroke();

    carCanvas.fill(0, 10);
    carCanvas.rect(w / 2, h / 2, 10000, 10000);
    if (random(1) > 0.9) {
        //new car
        var elems = document.querySelectorAll("#roads_main > *");
        var e = elems[floor(random(0, elems.length))];
        var done = false;
        for (var i = 0; i < cars.length; i++) {
            if (cars[i] == null) {
                cars[i] = ({
                    elem: e,
                    speed: random(1, 2) / 500.0,
                    pos: 0
                });
                done = true;
                break;
            }
        }
        if (!done) {
            cars.push({
                elem: e,
                speed: random(1, 2) / 1000.0,
                pos: 0
            });
        }
    }

    for (var i = 0; i < cars.length; i++) {
        if (cars[i] && cars[i].pos < 1) {
            cars[i].pos += cars[i].speed;
            carCanvas.push();
            var pth = cars[i].elem;
            var len = pth.getTotalLength();
            var cur = len * cars[i].pos;
            var point = pth.getPointAtLength(cur);
            var point2 = pth.getPointAtLength(cur - 0.01);

            var y = point.y - point2.y;
            var x = point.x - point2.x;
            var q = atan2(y, x);

            // noStroke();
            carCanvas.translate(point.x / 2, point.y / 2);
            // ellipse(0, 0, 5, 5);
            // fill(255, (sin(millis() / 100) * 0.5 + 0.5) * 255);
            // noStroke();
            // ellipse(0, 0, 5, 5);
            carCanvas.rotate(q);
            carCanvas.fill(255, 150, 10, ((sin(millis() / 300) * 0.2 + 0.7) * 255));
            carCanvas.rect(0, 0, 6, 2);
            carCanvas.fill(255);
            carCanvas.rect(3, 0, 6, 2);

            if (random(0, 1) > 0.5 + 0.5 * sin(millis() / 300)) {
                var sc = (0.5 + (sin(millis() / 300) % 1));
                // endShape(CLOSE);
                stroke(255, 100);
                noFill();
                ellipse(point.x / 2, point.y / 2, 33 + sc, 33 + sc);
            }
            carCanvas.pop();
        }
        else {
            cars[i] = null;
        }
    }
}

var selectedTab = 0;
var selectionClock = 0;

var grass;
var water;
var grassBg;

var maoxi_stroke;
var maoxi;
var maoxiBg;

var carCanvas;
var outlineCanvas;

var glow;

var cur_canvas;

var icons;

function setup() {
    read_buildings();
    initWorld();
    cur_canvas = createCanvas(3840 / zoom, 2160 / zoom);
    grassBg = createGraphics(w, h);
    maoxiBg = createGraphics(w, h);
    outlineCanvas = createGraphics(w, h);
    carCanvas = createGraphics(w, h);
    glow = createGraphics(w, h);
    glow.background(100);

    icons = [
        //["交通", loadImage("./2x/car.png")],
        ["教育", loadImage("./2x/edu.png")],
        ["医疗", loadImage("./2x/health.png")],
        ["居住", loadImage("./2x/home.png")],
        ["经济", loadImage("./2x/money.png")],
        //["环境", loadImage("./2x/rec.png")],
        //["人口", loadImage("./2x/user.png")],
    ]

    mapping = [
        ["S1", "S2", "S3", "E1", "E2"],
        ["H1", "H2", "H3"],
        ["M1", "M2", "M3"],
        ["C1", "C2", "C3", "B1", "B2", "T", "N2", "N3"],
    ];

    frameRate(60);
    smooth(7);

    grass = loadImage("PINGAN_MAP_ASSETS/GRASS-01.png", () => {
    });
    water = loadImage("PINGAN_MAP_ASSETS/WATER-01.png", () => {
    });
    maoxi = loadImage("PINGAN_MAP_ASSETS/maoxi.png", () => {
    });
    maoxi_stroke = loadImage("PINGAN_MAP_ASSETS/ROAD LINE-01.png", () => {
    });

    grassBg.background(0);
}

function renderTabs() {
    fill(0);
    noStroke();
    rect(0, h - 100, w, 100);
    translate(25, h - 87);
    for (var i = 0; i < icons.length; i++) {
        stroke(255, (-sin(millis() / 400 + i / 2) * 0.5 + 0.5) * 100);
        fill((sin(millis() / 400 + i / 2) * 0.5 + 0.5) * 50);
        if (selectedTab == i) {
            fill(255, random(1) > map(selectionClock, 0, 0.05, 0.0, 1) ? 0 : map(selectionClock, 0, 0.05, 0.0, 255));
        }
        ellipse(35, 35, 80, 80);
        if (selectedTab == i) {
            stroke(0, 0, 0, (0.5 + 0.5 * sin(millis() / 200) * 100) + 100);
            strokeWeight(2);
            noFill();
            arc(35, 35, 72, 72, HALF_PI, HALF_PI + PI * 2 * (1 - selectionClock));
            strokeWeight(1);
        }
        imageMode(CENTER);
        push();
        translate(35, 28);
        scale(0.4);
        if (selectedTab == i) {
            tint(0);
        }
        image(icons[i][1], 0, 0);
        pop();
        textAlign(CENTER, CENTER);
        fill(255);
        if (selectedTab == i) {
            fill(0);
        }
        noStroke()
        text(icons[i][0], 35, 60);
        imageMode(NORMAL);

        translate(90, 0);
    }
}

function draw() {
    outlineCanvas.fill(0);
    outlineCanvas.rect(0, 0, w, h);
    background(0);
    probe_t = (pow((millis() / 6000) % 1, 2))
    probe = min(1, map(probe_t, 0, 0.3, 0, 1));
    if (grass && water) {
        grassBg.push();
        grassBg.blendMode(BLEND);
        grassBg.background(0);
        grassBg.image(grass, 0, 0, w, h);
        grassBg.blendMode(MULTIPLY);
        grassBg.background(0, 120, 120, 255);
        grassBg.blendMode(BLEND);
        grassBg.image(water, 0, 0, w, h);
        grassBg.blendMode(MULTIPLY);
        grassBg.background(0, 50, 100, 255);
        grassBg.blendMode(BLEND);
        grassBg.pop();
    }

    glow.push();
    glow.rectMode(CENTER);
    glow.noStroke();
    glow.fill(50, 30);
    glow.rect(w / 2, h / 2, w, h);
    glow.translate(w / 2, h / 2 - 50);
    glow.strokeWeight(30);

    var sc = probe * 5;
    glow.stroke(150, 255, 255);
    glow.noFill();
    glow.scale(sc, sc)
    glow.rotate(radians(millis() / 10));
    glow.ellipse(0, 0, 600, 600);
    glow.pop();


    if (maoxi && maoxi_stroke) {
        maoxiBg.push();
        maoxiBg.blendMode(BLEND);
        maoxiBg.image(maoxi, 0, 0, w, h);
        maoxiBg.blendMode(MULTIPLY);
        maoxiBg.image(glow, 0, 0);
        maoxiBg.pop();
    }

    image(grassBg, 0, 0);
    blendMode(ADD);
    image(maoxiBg, 0, 0);
    // image(glow, 0, 0);
    blendMode(BLEND);


    var step = 30;
    for (var x = 0; x < w; x += step) {
        for (var y = 0; y < h; y += step) {
            var projectedX = x * zoom;
            var projectedY = y * zoom;
            //var pa = grass.pixels[(projectedX + projectedY * 3841) * 4 + 2];
            //if (pa == 0) continue;
            var s = step;
            var n = noise(x / 1000, y / 1000, millis() / 3000);
            var _n = n;
            n = round(n * 5) / 5 * 50;
            // if (_n < 0.3) continue;
            // if(_n < 0.6) {
            strokeWeight(n / 100 + 0.5);
            //(0.5 + 0.5 * sin(millis() / 300 + x / 100)) * 255
            stroke(255, n);
            noFill();
            rect(x, y, s, s);
            // line(x - s / 2, y, x + s / 2, y);
            // } else {
            //     grassBg.fill(20, n * 10, n * 5, (0.5 + 0.5 * sin(millis() / 300 + x / 100)) * 255);
            //     grassBg.noStroke();
            //     grassBg.rect(x, y, s - 1, s - 1);
            // }
            // if (n2 > 0.2) {
            //     grassBg.stroke(0, 255, 150);
            //     grassBg.rect(x, y, s - 1, s - 1);
            // }
        }
    }


    updateCars();

    blendMode(ADD);
    image(carCanvas, 0, 0);


    blendMode(BLEND);


    push();
    translate(0, 15);
    updateWorld();
    pop();

    blendMode(ADD);
    image(outlineCanvas, 0, 0);

    blendMode(BLEND);

    push();
    renderTabs();
    pop();


    selectionClock += 0.003;
    if (selectionClock > 1) {
        selectionClock = 0;
        selectedTab++;
        selectedTab = selectedTab % mapping.length;
    }

    // rectMode(CENTER);
    // for (var b = 0; b < buildings.length; b++) {
    //     push();
    //     var x = buildings[b].x;
    //     var y = buildings[b].y;
    //     translate(x, y);
    //     rotate(radians(buildings[b].r));
    //     // translate(33 / 2, 33 / 2);
    //     // fill();
    //     fill(255, pow(noise(x / 100, y / 100 + millis() / 3000, millis() / 500), 3) * 255)
    //     scale(pow(noise(x / 100, y / 100 + millis() / 3000, millis() / 500), 3) * 0.5 + 0.5);
    //     rect(0, 0, 33, 33);
    //     pop();
    // }

}