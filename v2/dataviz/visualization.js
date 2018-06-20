var opennedSegs = undefined;
var myScores = {};
var avgScore;
var radarCanvas = undefined;

function initOverlays() {
    var q = 0;
    var icocb = () => {
        q++;
        if (q == Object.keys(mapper).length) {
            window.mapper = mapper;
            opennedSegs = {};
            for (var i in window.mapper) {
                opennedSegs[i] = 0;
            }
        }
    };
    var mapper = {
        ed: loadImage("assets/2x/edu.png", icocb),
        ec: loadImage("assets/2x/money.png", icocb),
        en: loadImage("assets/2x/rec.png", icocb),
        m: loadImage("assets/2x/health.png", icocb),
        h: loadImage("assets/2x/home.png", icocb),
        j: loadImage("assets/2x/user.png", icocb),
        t: loadImage("assets/2x/car.png", icocb),
    }
}


function updateOverlays(t) {
    if (!data || !data.computed || !window.mapper) return;
    clear();
    var scores = data.computed.score;
    var j = 0;
    for (var i in scores) {
        j += 0.1;
        myScores[i] = ease(myScores[i] || 0, scores[i] +
            noise(j, t / 1000) * 0.1
            , 0.01);
    }
    if (frameCount % 3 == 0) {
        drawRadar(1920 - 450, 1080 - 450, t);
    }
    if (!myScores['j']) return;
    blendMode(BLEND);
    drawCharts(t);

    if (radarCanvas) {
        image(radarCanvas, 1920 - 500, 1080 - 500);
    }
}


function drawRadar(x, y, t) {

    var w = 250;
    var h = 250;
    if (!radarCanvas) {
        radarCanvas = createGraphics(w * 2, h * 2);
    }
    radarCanvas.blendMode(BLEND);
    radarCanvas.background(0);
    radarCanvas.blendMode(ADD);
    // myScores = myScores || data.computed.score;
    var r = 1 * w / 2;
    var scores = data.computed.score;
    var keys = Object.keys(scores);
    var len = keys.length;
    var rd = PI * 2 / len;
    radarCanvas.push();

    radarCanvas.rectMode(CENTER);

    radarCanvas.translate(w, h);

    radarCanvas.fill(30, 40, 80, 70);
    radarCanvas.noStroke();
    radarCanvas.rect(0, 0, w, h);
    radarCanvas.fill(30, 40, 80, 100);
    radarCanvas.rect(0, 0, w * 1.6, h * 1.6);


    // ellipse(0, 0, w, h);
    var d = 0;
    var pts = [];
    var pts2 = [];
    radarCanvas.strokeWeight(3);
    radarCanvas.noStroke();
    var avg = 0;
    radarCanvas.colorMode(HSB, 255);
    for (var i in scores) {
        var rr = myScores[i] * 15 + 15;
        var x = sin(d) * r * min(1, max(0.2, myScores[i]));
        var y = cos(d) * r * min(1, max(0.2, myScores[i]));
        pts.push([x, y]);
        pts2.push([sin(d) * w / 2, cos(d) * h / 2]);
        d += rd;
        radarCanvas.stroke(255, 10);
        radarCanvas.fill(150, 120 + myScores[i] * 200, 70);
        avg += max(0, myScores[i]) / len;
        radarCanvas.ellipse(x, y, rr, rr);
        radarCanvas.fill(120, 120, 255);
        radarCanvas.noStroke();
        radarCanvas.ellipse(x, y, 8, 8);
    }
    radarCanvas.colorMode(RGB, 255);
    avgScore = avg;
    var avgSc = avgScore;
    avg *= r * 2;

    radarCanvas.beginShape();
    // noFill();
    radarCanvas.fill(0, 150, 255, 100);
    radarCanvas.stroke(255, 150);
    for (var i = 0; i < pts.length; i++) {
        radarCanvas.vertex(pts[i][0], pts[i][1]);
    }
    radarCanvas.endShape(CLOSE);


    radarCanvas.beginShape();
    // noFill();
    radarCanvas.fill(100, 30);
    radarCanvas.noStroke();
    for (var i = 0; i < pts2.length; i++) {
        radarCanvas.vertex(pts2[i][0], pts2[i][1]);
    }
    radarCanvas.endShape(CLOSE);


    radarCanvas.stroke(255, 30);
    radarCanvas.textSize(15);
    radarCanvas.strokeWeight(2);
    radarCanvas.textAlign(CENTER, CENTER);
    for (var i = 0; i < pts2.length; i++) {
        radarCanvas.stroke(255, 50);
        radarCanvas.line(pts[i][0], pts[i][1], pts2[i][0], pts2[i][1]);
        radarCanvas.fill(255, myScores[keys[i]] * 150 + 100);
        radarCanvas.noStroke();
        radarCanvas.text(explain(keys[i]) + " (" + keys[i].toUpperCase() + ")\n" + Math.round(myScores[keys[i]] * 100) + "%", pts2[i][0] * 1.15, pts2[i][1] * 1.15)
    }

    var segs = 50;
    radarCanvas.strokeWeight(2);
    radarCanvas.stroke(150, 255, 255);
    for (var i = 0; i < segs; i++) {
        var cur = (PI * 2 / segs) * i;
        var s = sin(cur) * 1.5;
        var c = cos(cur) * 1.5;
        var q = sin(t / 1000 + i / segs * PI * 10) * cos(t / 1000 + i / segs * PI * 5.6) * 10;
        radarCanvas.line((r - q) / 2 * s, (r - q) / 2 * c, (r / 2 + q) * s, (r / 2 + q) * c);
    }


    radarCanvas.fill(255, 150);
    radarCanvas.noStroke();

    radarCanvas.textSize(20);
    radarCanvas.textFont("monospace");
    radarCanvas.text(Math.round(avgSc * 100) + "%", 0, 0);



    radarCanvas.fill(255, 100);
    radarCanvas.textFont("monospace");
    radarCanvas.noStroke();
    radarCanvas.textSize(15);
    radarCanvas.textAlign(RIGHT, RIGHT);
    radarCanvas.text("[ GRAND VIEW ] > " + (avgSc * 100).toFixed(2) + "/100", w * 1.6 / 2 - 15, h * 1.6 / 2 - 15);


    radarCanvas.pop();
}


function drawCharts(t) {
    
    var keys = Object.keys(aggregated_computed_factors);

    push();
    var seg = 100;
    var openned = 200;
    translate(80, 80);
    fill(255, 10);
    stroke(255);
    imageMode(CENTER);
    for (var i in mapper) {
        rectMode(CENTER);
        opennedSegs[i] = ease(opennedSegs[i], view == i ? 1 : 0, 0.1);
        var kick = random(0, 1) < opennedSegs[i] ? 1 : 0;
        fill(255, 30 + 80 * kick)
        stroke(255, 255 * kick);
        strokeWeight(1 + 2 * opennedSegs[i])
        rect(0, 0, 80, 80);

        push();
        scale(0.3 + opennedSegs[i] * 0.05);
        image(mapper[i], 0, 0);
        pop();

        noStroke();
        fill(255, 150 + 100 * opennedSegs[i]);
        textSize(20);
        textFont("PingFang SC");
        textAlign(TOP, TOP);
        text(explain(i) + ` (${i.toUpperCase()})`, 60 + 10 * opennedSegs[i], -40);

        push();
        translate(60, 0);
        noStroke();
        rectMode(CORNER);
        fill(255, 30);
        rect(0, 0, 200, 8);
        noStroke();

        textAlign(CENTER, CENTER);
        textSize(13);

        if (myScores[i] > 0) {
            fill(150, 200, 255);
            rect(100, 2, 100 * (myScores[i]), 4);
            fill(255);
            text(" + " + (myScores[i] * 100).toFixed(2), 100 + 100 * (myScores[i]) / 2, 20);
        } else {
            fill(255, 59, 10);
            var w = 100 * (abs(myScores[i]));
            rect(100 - w, 2, w, 4);
            text(" - " + abs(myScores[i] * 100).toFixed(2), 100 - w / 2, 20);
        }
        pop();

        if(opennedSegs[i] > 0.8) {
            push();
            pop();
        }

        translate(0, opennedSegs[i] * openned + seg);
    }
    pop();

    if (frameCount % 100 == 0) {
        console.log(aggregated_view_factors);
    }
}