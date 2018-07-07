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
        image(radarCanvas, 1920 - 500, 1080 - 800);
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


var eased_aggregated_computed_factors = {};

function drawCharts(t) {

    var keys = Object.keys(aggregated_computed_factors);
    var max_val = 0;
    var min_val = 0;

    var id = 0;
    keys = keys.map(n => {
        id += 0.01;
        eased_aggregated_computed_factors[n] = ease(
            (eased_aggregated_computed_factors[n] || 0) + (noise(id, t / 1000) - 0.5) * 1,
            aggregated_computed_factors[n],
            0.1
        )
        max_val = max(eased_aggregated_computed_factors[n], max_val);
        min_val = min(eased_aggregated_computed_factors[n], min_val);
        return {
            k: n,
            v: eased_aggregated_computed_factors[n]
        };
    }).sort((a, b) => {
        return -a.v + b.v;
    });
    openned = -1;
    var targetY = 0;
    push();
    var seg = 100;
    var openned = 0;
    translate(80, 240);
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
        translate(0, seg);
        if (view == i) {
            openned = targetY;
        }
        targetY += seg;
    }
    openned += 240 - 80;
    pop();
    if (openned != -1) {
        blendMode(BLEND);
        var p2x = 40;
        var p2y = openned + 80;
        push();
        translate(300, 0);
        fill(0);
        ellipse(p2x, p2y, 15, 15);
        stroke(255);
        noFill();

        var ext = 50;
        var offset = 0;
        var partitions = -1;
        for (var i = 0; i < keys.length; i++) {
            if (abs(keys[i].v) < 10) continue;

            var p1x = 150;

            var alpha = abs(keys[i].v) + 180;

            if (keys[i].v > 0 && partitions != 0) {
                partitions = 0;
                fill(50, 150, 255);
                noStroke();
                textSize(18);
                textAlign(LEFT, CENTER);
                text("[ 正面因子 ]", p1x, offset + 50);
                offset += 40;
            } else if (keys[i].v < 0 && partitions != 1) {
                partitions = 1;
                fill(255, 50, 0);
                noStroke();
                textSize(18);
                textAlign(LEFT, CENTER);
                text("[ 负面因子 ]", p1x, offset + 50);
                offset += 40;
            }



            blendMode(ADD);
            if (keys[i].v > 0) {
                stroke(50 + keys[i].v * 0.2, keys[i].v + 120, keys[i].v * 50 + 200, alpha);
            } else {
                stroke(255, 255 - min(255, abs(keys[i].v) * 10), 0, alpha);
            }
            noFill();
            strokeWeight(min(5, sqrt(abs(keys[i].v) / 10)));
            var p1y = 40 + offset;
            offset += 70;
            var dy = (p2y - p1y) / 8
            var dx = -(p2x - p1x) / 2.5
            beginShape();
            curveVertex(p2x, p2y + 3);
            curveVertex(p2x, p2y + 3);
            curveVertex(p2x + dx, p2y - dy);
            curveVertex(p1x - dx, p1y + 15 + dy);
            curveVertex(p1x + 10, p1y + 15);
            curveVertex(p1x + 10, p1y + 15);
            endShape();

            blendMode(ADD);
            noStroke();

            if (keys[i].v > 0) {
                fill(50 + keys[i].v * 0.2, keys[i].v + 120, keys[i].v * 50 + 200, alpha);
            } else {
                fill(255, 255 - min(255, abs(keys[i].v) * 10), 0, alpha);
            }
            textAlign(LEFT, TOP);
            textSize(12);
            
            textFont("monospace");
            rect(p1x + 50, p1y + 25, min(300, abs(keys[i].v)), 3);
            fill(100, alpha);
            rect(p1x + 50, p1y + 30, aggregated_view_rs[keys[i].k] / total_rs * 300, 3);
            
            noStroke();
            fill(255, 100);
            text("AREA: " + (aggregated_view_rs[keys[i].k] / total_rs * 100).toFixed(0) + "%", p1x + 53 + aggregated_view_rs[keys[i].k] / total_rs * 300, p1y + 28);
            blendMode(BLEND);

            if (keys[i].v > 0) {
                stroke(50 + keys[i].v * 0.2, keys[i].v + 120, keys[i].v * 50 + 200, alpha);
            } else {
                stroke(255, 255 - min(255, abs(keys[i].v) * 10), 0, alpha);
            }
            fill(0);
            strokeWeight(1 + sqrt(abs(keys[i].v)) / 5);
            rect(p1x, p1y, 30, 30);


            if (keys[i].v > 0) {
                fill(50 + keys[i].v * 0.2, keys[i].v + 120, keys[i].v * 50 + 200, alpha);
            } else {
                fill(255, 255 - min(255, abs(keys[i].v) * 10), 0, alpha);
            }

            noStroke();
            var name = keys[i].k;
            for (var j in data.names) {
                if (j.startsWith(keys[i].k)) {
                    name = j;
                    break;
                }
            }
            textSize(20);
            textFont("monospace");
            text(name + " " + ((keys[i].v) > 0 ? "+" : "") + (keys[i].v).toFixed(2), p1x + 50, p1y - 3);
            noFill();


        }
        blendMode(BLEND);
        stroke(255);
        strokeWeight(3);
        fill(0);
        rect(p2x - 15 / 2, p2y - 15 / 2, 15, 15);
        // line(500, 80, 40, openned + 80);
        pop();
    }


    if (frameCount % 100 == 0) {
        console.log(keys);
    }
}