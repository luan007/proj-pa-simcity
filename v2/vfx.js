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
                            pos: 0,
                            id: random(0, 1),
                        });
                        done = true;
                        break;
                    }
                }
                if (!done) {
                    cars.push({
                        id: random(0, 1),
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
        global.cars = cars;
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

    //bar and buttons 
    {
        let icos = 0;
        var eased_scores = {};
        function icocb() {
            icos++;
        }
        var mapper = {
            ed: loadImage("assets/2x/edu.png", icocb),
            ec: loadImage("assets/2x/money.png", icocb),
            en: loadImage("assets/2x/rec.png", icocb),
            m: loadImage("assets/2x/health.png", icocb),
            h: loadImage("assets/2x/home.png", icocb),
            j: loadImage("assets/2x/user.png", icocb),
            t: loadImage("assets/2x/car.png", icocb),
        }
        window.mapper = mapper;
        window.updateBars = function (t) {
            if (icos != Object.keys(mapper).length || !computed.score) {
                return;
            }
            for (var i in computed.score) {
                eased_scores[i] = eased_scores[i] || 0;
                eased_scores[i] = ease(eased_scores[i], computed.score[i], 0.01);
            }
            cv.bars.push();
            cv.bars.fill(0);
            cv.bars.noStroke();
            cv.bars.rect(0, 0, 1920, 1080 - 960);
            cv.bars.imageMode(CENTER);
            cv.bars.translate(60, 0);
            cv.bars.strokeWeight(3);

            var baseX = 60;
            for (var i in mapper) {
                // cv.bars.noFill();
                var h = max(-1, min(eased_scores[i], 1));
                cv.bars.fill(255, config.view == i ? 100 : 30);
                cv.bars.rect(-30, 20, 60, 80);
                if (button(baseX - 30, 960 + 20, 60, 80)) {
                    config.view = i;
                }
                if (h < 0) {
                    cv.bars.fill(255, 50, 30, 200);
                } else {
                    cv.bars.fill(20, 150, 255, 200);
                }
                cv.bars.rect(-30, 20 + 80 * (1 - abs(h)), 60, 80 * abs(h));
                cv.bars.fill(255);
                cv.bars.push();
                cv.bars.translate(0, (1080 - 960) / 2 - 6);
                cv.bars.scale(0.25);
                cv.bars.image(mapper[i], 0, 0);
                cv.bars.pop();
                cv.bars.textSize(12);
                cv.bars.fill(255, 150);
                cv.bars.textAlign(CENTER, CENTER);
                cv.bars.text(explain(i), 0, (1080 - 960) / 2 + 20);


                if (config.view == i) {
                    cv.bars.stroke(255, config.view == i ? 255 : 0);
                    cv.bars.noFill();
                    cv.bars.rect(-30, 20, 60, 80);
                    cv.bars.noStroke();
                }

                cv.bars.translate(70, 0);
                baseX += 70;

            }
            cv.bars.pop();

            cv.bars.push();
            cv.bars.translate(550, 8);
            cv.bars.textSize(15);
            if (eased_scores[config.view] < 0) {
                cv.bars.fill(255, 50, 30, 200);
            } else {
                cv.bars.fill(20, 150, 255, 200);
            }
            cv.bars.textAlign(LEFT, CENTER);
            cv.bars.text(explain(config.view), 0, (1080 - 960) / 2 - 28);
            cv.bars.textSize(35);
            cv.bars.text((eased_scores[config.view].toFixed(3) * 100).toFixed(1) + "%", 0, (1080 - 960) / 2 + 5);
            cv.bars.pop();


            config.super_dilute = toggle("宏观\n模式", 750, 3, 60, 70, config.super_dilute);

            config.showHeatHint = toggle("启用\n热区", 750 + 100, 3, 60, 70, config.showHeatHint);
            config.heatMode = (toggle_tiny("HEAT\nMAP", 820 + 100, 3, 50, 70, config.heatMode));

            var _mag = toggle_tiny("AMP\n增强", 880 + 100, 3, 50, 70, config.magnification !== 0.5);
            if (!_mag) {
                config.magnification = 0.5;
            } else {
                config.magnification = 0.1;
            }

            config.showCriticalHint = toggle("优化\n提示", 880 + 200, 3, 60, 70, config.showCriticalHint);
            config.warning_threshold = toggle_tiny("灵敏度\n高", 880 + 70 + 200, 3, 50, 70, config.warning_threshold == 5) ? 5 : config.warning_threshold;
            config.warning_threshold = toggle_tiny("灵敏度\n中", 880 + 70 * 2 + 200, 3, 50, 70, config.warning_threshold == 30) ? 30 : config.warning_threshold;
            config.warning_threshold = toggle_tiny("灵敏度\n低", 880 + 70 * 3 + 200, 3, 50, 70, config.warning_threshold == 40) ? 40 : config.warning_threshold;


            // config.lensMode = toggle_z12(config.lensMode == 1 ? "透镜\n关系分析" : "透镜\n区块洞察", 880 + 70 * 3 + 100 + 200, 3, 80, 70, config.lensMode == 0) ? 0 : 1;

            // if (config.lensMode == 1) {
            //     config.linkZone = toggle_z12(config.linkZone == 3 ? "建筑\n关系" : "街区\n关系", 880 + 70 * 4 + 20 + 100 + 200, 3, 60, 70, config.linkZone == 3) ? 3 : 5;
            // } else {
            //     config.touchZone = toggle_z12(config.touchZone == 1 ? "2KM" : "10KM", 880 + 70 * 4 + 20 + 100 + 200, 3, 60, 70, config.touchZone == 1) ? 1 : 5;
            // }

            // config.showCriticalHint = toggle("决策\n提示", 830, 3, 70, 70, config.showCriticalHint);


        }
    }

    //Leap operations
    {
        window.updateLeap = function (t) {
            if (!config.enableLeap) { return; }
            var c = cv.overlay;
            if (hands_pos.length > 0) {
                c.fill(255, 255, 255 - hands_pos[3] * 255);
                c.ellipse(hands_pos[0] + 1920 / 2, hands_pos[1] + 960 / 2, 30 * hands_pos[2], 30 * hands_pos[2]);
            }
        }
    }
}

function toggle(s, x, y, w, h, selected) {
    cv.bars.push();
    cv.bars.translate(x, y);
    cv.bars.fill(255, 150);
    cv.bars.textSize(15);
    cv.bars.textAlign(LEFT, CENTER);
    // cv.bars.text("AI 分析", 0, (1080 - 960) / 2 - 28);

    cv.bars.fill(255, selected ? 255 : 30);
    cv.bars.textSize(15);
    cv.bars.textAlign(CENTER, CENTER);
    cv.bars.text(s, 0, (1080 - 960) / 2 - 5);

    cv.bars.rectMode(CENTER);
    cv.bars.stroke(255, selected ? 255 : 30);
    cv.bars.strokeWeight(3);
    cv.bars.fill(255, 10);
    cv.bars.rect(0, (1080 - 960) / 2 - y, w, h);
    cv.bars.noStroke();
    if (!selected) {
        cv.bars.fill(100, 255);
    } else {
        cv.bars.fill(255, 150, 0, 255);
    }
    cv.bars.rect(0, 82, 10, 2);
    cv.bars.rectMode(0);
    cv.bars.pop();
    if (button(x - w / 2, y + 960, w, h)) {
        return !selected;
    }
    return selected;
}

function toggle_z12(s, x, y, w, h, selected) {
    cv.bars.push();
    cv.bars.translate(x, y);
    cv.bars.fill(255, 150);
    cv.bars.textSize(15);
    cv.bars.textAlign(LEFT, CENTER);
    // cv.bars.text("AI 分析", 0, (1080 - 960) / 2 - 28);

    cv.bars.fill(255, 255);
    cv.bars.textSize(15);
    cv.bars.textAlign(CENTER, CENTER);
    cv.bars.text(s, 0, (1080 - 960) / 2 - 5);

    cv.bars.rectMode(CENTER);
    cv.bars.stroke(255, 255);
    cv.bars.strokeWeight(3);
    cv.bars.fill(255, 10);
    cv.bars.rect(0, (1080 - 960) / 2 - y, w, h);
    cv.bars.noStroke();
    if (selected == 0) {
        cv.bars.fill(255, 150, 0, 255);
    } else {
        cv.bars.fill(130, 255);
    }
    cv.bars.rect(-5, 82, 10, 2);
    if (selected == 1) {
        cv.bars.fill(255, 150, 0, 255);
    } else {
        cv.bars.fill(130, 255);
    }
    cv.bars.rect(5, 82, 10, 2);
    cv.bars.rectMode(0);
    cv.bars.pop();
    if (button(x - w / 2, y + 960, w, h)) {
        return !selected;
    }
    return selected;
}


function toggle_tiny(s, x, y, w, h, selected) {
    cv.bars.push();
    cv.bars.translate(x, y);

    cv.bars.fill(255, selected ? 255 : 30);
    cv.bars.textSize(12);
    cv.bars.textAlign(CENTER, CENTER);
    cv.bars.text(s, 0, (1080 - 960) / 2 - 5);

    cv.bars.rectMode(CENTER);
    cv.bars.stroke(0, 150, 255, selected ? 150 : 30);
    cv.bars.strokeWeight(3);
    cv.bars.fill(0, 150, 255, 10);
    cv.bars.rect(0, (1080 - 960) / 2 - y, w, h);
    cv.bars.noStroke();
    if (!selected) {
        cv.bars.fill(100, 150);
    } else {
        cv.bars.fill(0, 150, 255, 150);
    }
    cv.bars.rect(0, 82, 10, 2);
    cv.bars.rectMode(0);
    cv.bars.pop();
    if (button(x - w / 2, y + 960, w, h)) {
        return !selected;
    }
    return selected;
}

function mouseReleased() {
    global.shot = Date.now();
}