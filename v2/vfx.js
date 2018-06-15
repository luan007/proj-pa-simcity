function initVfx() {

    //cars
    {
        var cars = [];
        window.updateCars = function () {
            var carCanvas = cv.cars;
            carCanvas.rectMode(CENTER);
            carCanvas.noStroke();
            carCanvas.fill(0, 10);
            carCanvas.rect(w / 2, h / 2, 10000, 10000);
            if (random(1) > 0.95) {
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
    }

    //grass and sorts
    {
        let gwLoad = 0;
        grass = loadImage("assets/GRASS-01.png", () => {
            gwLoad++;
        });
        water = loadImage("assets/WATER-01.png", () => {
            gwLoad++;
        });
        maoxi = loadImage("assets/maoxi.png", () => {
            gwLoad++;
        });
        maoxi_stroke = loadImage("assets/ROAD LINE-01.png", () => {
            gwLoad++;
        })
        road = loadImage("assets/ROAD-01.png", () => {
            gwLoad++;
        })
        var updated = false;
        window.updateGrass = function () {
            probe_t = (pow((millis() / 6000) % 1, 2))
            probe = min(1, map(probe_t, 0, 0.3, 0, 1));

            let grassBg = cv.grass;
            let glow = cv.glow;
            let background = cv.background;
            if (gwLoad == 5 && !updated) {
                grassBg.clear();
                grassBg.blendMode(BLEND);
                grassBg.background(0);
                grassBg.image(grass, 0, 0, dw, dh);
                grassBg.blendMode(MULTIPLY);
                grassBg.background(0, 120, 120, 255);
                grassBg.blendMode(BLEND);
                grassBg.image(water, 0, 0, dw, dh);
                grassBg.blendMode(MULTIPLY);
                grassBg.background(0, 50, 100, 255);
                grassBg.blendMode(BLEND);
                grassBg.tint(0, 50, 100, 154);
                grassBg.image(road, 0, 0, dw, dh);
                updated = true;
            }
            if (gwLoad == 5) {
                //glow
                glow.push();
                glow.rectMode(CENTER);
                glow.noStroke();
                glow.fill(50, 30);
                glow.rect(dw / 2, dh / 2, dw, dh);
                glow.translate(dw / 2, dh / 2 - 50);
                glow.strokeWeight(30);
                var sc = probe * 5;
                glow.stroke(150, 255, 255);
                glow.noFill();
                glow.scale(sc, sc)
                // glow.rotate(radians(millis() / 10));
                glow.ellipse(0, 0, 600, 600);
                glow.pop();

                background.push();
                background.blendMode(BLEND);
                background.image(maoxi, 0, 0, dw, dh);
                background.blendMode(MULTIPLY);
                background.image(glow, 0, 0);
                background.pop();
            }
        }
    }

}