var chunk_container = new PIXI.Container();
var conv_container = new PIXI.Container();

app.stage.addChild(conv_container);
app.stage.addChild(chunk_container);

var touchSelectors = [];
class TouchSelection {
    constructor() {
        this.position = [0, 0];
        this.active = false;
        this.activeEase = 0;
        this.linked = [];
        this.breathe = 0;
        this.seed = random(1000);
        this.breathe_speed = 1.5;
        this.score = 0;
        this.selected = [];
    }

    render(t) {

        this.breathe = (sin(t * this.breathe_speed + this.seed) * 0.5 + 0.5) * 0.3 + 1;
        this.activeEase = ease(this.activeEase, this.active ? 1 : 0, 0.2);

        if (this.activeEase < 0.01) return;

        // if (random(this.activeEase) < 0.3) {
        //     return;
        // }

        // cv.overlay.strokeCap(SQUARE);
        cv.overlay.blendMode(ADD);
        if (config.lensMode == 0) {
            var s = (config.touchZone * 2 + 1) * blockSize * this.activeEase;
            cv.overlay.push();
            cv.overlay.stroke(255, 100);
            cv.overlay.noFill();
            // cv.overlay.fill(255, 20);
            cv.overlay.rectMode(CENTER);
            cv.overlay.rect(this.position[0], this.position[1], s * 0.5, s * 0.5);
            cv.overlay.strokeWeight(1);
            cv.overlay.stroke(255, 100);
            cv.overlay.line(0, this.position[1] - s / 2, dw, this.position[1] - s / 2);
            cv.overlay.line(0, this.position[1] + s / 2, dw, this.position[1] + s / 2);
            cv.overlay.line(this.position[0] - s / 2, 0, this.position[0] - s / 2, dh);
            cv.overlay.line(this.position[0] + s / 2, 0, this.position[0] + s / 2, dh);
            cv.overlay.pop();
            var avg = 0;
            for (var i = 0; i < this.selected.length; i++) {
                avg += this.selected[i].val;
            }
            avg /= this.selected.length;

            cv.overlay.push();
            cv.overlay.blendMode(BLEND);
            cv.overlay.noStroke();
            cv.overlay.translate(this.position[0] - (config.touchZone * 1 + 1) * blockSize + blockSize / 2, this.position[1])
            // cv.overlay.fill(255, this.activeEase * 255);
            cv.overlay.fill(150, this.activeEase * 255);
            cv.overlay.textAlign(LEFT, CENTER);
            cv.overlay.textSize(20);
            if(avg > 0) {
                cv.overlay.fill(40, 150, 255, this.activeEase * 255);
            } else {
                cv.overlay.fill(255, 100, 33, this.activeEase * 255);
            }
            cv.overlay.textFont("Monospace");
            cv.overlay.textSize(16);
            cv.overlay.text((avg > 0 ? "+" : "") + avg.toFixed(2), 5, (config.touchZone * 1 + 1) * blockSize);

            cv.overlay.textFont("PingFang SC");
            cv.overlay.textSize(12);
            cv.overlay.text("" + explain(config.view), 5, (config.touchZone * 1 + 1) * blockSize + 20);
            cv.overlay.pop();

        }
        else if (config.lensMode == 1) {
            var link = (config.linkZone * 2 + 1) * blockSize * this.activeEase;

            cv.overlay.noStroke();
            cv.overlay.fill(255, 30);
            cv.overlay.ellipse(this.position[0], this.position[1], 150 * this.activeEase * this.breathe, 150 * this.activeEase * this.breathe);

            cv.overlay.noFill();
            cv.overlay.stroke(40, 150, 255, 100);
            cv.overlay.strokeWeight(5);
            cv.overlay.ellipse(this.position[0], this.position[1], link * 2, link * 2);
            cv.overlay.strokeWeight(1);
            cv.overlay.stroke(40, 150, 255, 255);

            var computedWeight = 0;
            cv.overlay.textAlign(CENTER, CENTER);
            cv.overlay.textSize(9);
            cv.overlay.textFont("PingFang SC");

            for (var i = 0; i < this.linked.length; i++) {
                let target = this.linked[i];
                computedWeight += target.computedFactors[config.view];
                if (target.computedFactors[config.view] < 0) {
                    cv.overlay.stroke(255, 100, 33, this.activeEase * 255);
                } else {
                    cv.overlay.stroke(40, 150, 255, this.activeEase * 255);
                }
                var vec = createVector(target.variables.position[0] - this.position[0]
                    , target.variables.position[1] + 33 / 2 - this.position[1]);
                cv.overlay.strokeWeight(1);
                cv.overlay.line(this.position[0], this.position[1], vec.x + this.position[0], vec.y + this.position[1])

                cv.overlay.push();
                cv.overlay.translate(this.position[0] + vec.x / 2,
                    this.position[1] + vec.y / 2);
                if (target.computedFactors[config.view] < 0) {
                    cv.overlay.fill(255, 100, 33, this.activeEase * 255);
                } else {
                    cv.overlay.fill(40, 150, 255, this.activeEase * 255);
                }
                cv.overlay.text(
                    (target.computedFactors[config.view] > 0 ? '+' : '') +
                    target.computedFactors[config.view].toFixed(2), 0, 0);
                cv.overlay.noStroke();
                cv.overlay.pop();

                var heading = vec.heading();
                var mag = vec.mag();

                cv.overlay.strokeWeight(max(0, 10 - mag / 30) + 1);
                cv.overlay.arc(this.position[0], this.position[1], link * 0.5, link * 0.5, heading - 0.2, heading + 0.2);
            }

            var targetScore = ((abs(computedWeight))) / this.linked.length * (computedWeight > 0 ? 1 : -1);
            this.score = ease(this.score, targetScore, 0.2);
            cv.overlay.strokeWeight(3);
            if (this.score > 0) {
                let score = min(1, max(0, abs(this.score)));
                cv.overlay.arc(this.position[0], this.position[1], link * 0.6, link * 0.6, 0, abs(score) * PI * 2);
            } else {
                let score = min(1, max(0, abs(this.score)));
                cv.overlay.stroke(255, 100, 33, this.activeEase * 255);
                cv.overlay.arc(this.position[0], this.position[1], link * 0.6, link * 0.6, 0, abs(score) * PI * 2);
            }

            cv.overlay.push();
            cv.overlay.blendMode(BLEND);
            cv.overlay.noStroke();
            cv.overlay.translate(this.position[0], this.position[1] + 10)
            // cv.overlay.fill(255, this.activeEase * 255);
            cv.overlay.fill(100, 200, 255, this.activeEase * 255);
            cv.overlay.textAlign(CENTER, CENTER);
            cv.overlay.textSize(14);
            cv.overlay.textFont("PingFang SC");
            cv.overlay.text("" + explain(config.view), 0, 70);
            cv.overlay.textSize(12);
            var prob = problem(config.view, computedWeight);
            if (prob) {
                cv.overlay.fill(255, 100, 33, this.activeEase * 255);
                cv.overlay.text("[!] " + explain(prob), 0, 90);
            }
            cv.overlay.pop();

        }
    }

    update() {

        if (this.linked.length > 0) {
            this.linked = [];
        }

        if (!this.active) {
            return;
        }

        if (config.lensMode == 1) {
            for (var i = 0; i < world.length; i++) {
                if (world[i].computedFactors && world[i].computedFactors[config.view] &&
                    dist(world[i].variables.position[0], world[i].variables.position[1] + 33 / 2,
                        this.position[0], this.position[1]) < (config.linkZone * 2 + 1) * blockSize) {
                    world[i].highlit = true;
                    this.linked.push(world[i]);
                }
            }
        }
    }
}

var blockSize = 30;
class Chunk {
    constructor(position) {
        this.counter = 0;
        this.position = [
            position[0] * blockSize + blockSize / 2,
            position[1] * blockSize + blockSize / 2
        ];
        this.id = chunks.positions.length;
        chunks.positions.push(this.position);
        this.aspectEase = {};
        this.sprite = new PIXI.Sprite(rectTexture);
        chunk_container.addChild(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.73;
        this.sprite.scale.y = 0.73;
        this.sprite.position.x = this.position[0];
        this.sprite.position.y = this.position[1];
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
        this.val = 0;
        this.targetColor = [0, 0, 0];
        this.color = [0, 0, 0];
        this.targetOpacity = 0;
    }
    reset() {
        // this.counter = 0;
        // for (var i in this.aspects) {
        //     this.aspects[i] = 0;
        // }
    }
    update(t) {
        this.aspects = computed.aspects[this.id] || {};
        // for(var i in this.aspects) {
        //     this.aspectEase[i] = this.aspectEase[i] || 0;
        // }
        // for (var i in this.aspectEase) {
        //     this.aspectEase[i] = ease(
        //         this.aspectEase[i] || 0, this.aspects[i] || 0, 0.2
        //     )
        // }
        this.target = (this.aspects[config.view] || 0)
            + simplex.noise3D(this.position[0] / 100 + t, this.position[1] / 100 - t, t) * 0.5 - 0.2;
        this.target /= map(config.magnification, 0, 1, 1, 5);

        if (!config.showHeatHint && !this.selected) {
            this.target = 1.0;
        }
        this.val = ease(this.val, this.target, 0.2);


    }
    render(t) {
        var val = this.val;
        var green = min((max(val, 0) * 15), 255) & 255;
        var red = min((max(-val, 0) * 15), 255) & 255;
        var op = min(config.heatMapOpacityCap, abs(val / 20));


        var rgb;
        if (config.heatMode == 0) {
            rgb = hslToRgb(0.6, 0.5 + op * 0.5, 0.7 * op);
            if (val < 0) {
                rgb = hslToRgb(0, 0.5 + op * 0.5, 0.7 * op);
            }
        } else {
            var op = min(config.heatMapOpacityCap, abs(val / 2));
            if (val < 0) {
                rgb = hslToRgb(0.2 - min(0.2, abs(val) / 8), 1, min(0.3, abs(val) / 15));
            } else {
                rgb = hslToRgb(0.6 - abs(val) / 100, 1, min(0.3, abs(val) / 15));
            }
        }
        if (this.selected) {
            op = 1;

            rgb = hslToRgb(0.6, 0.5 + op * 0.5, 0.7 * op);
            if (val < 0) {
                rgb = hslToRgb(0, 0.5 + op * 0.5, 0.7 * op);
            }
            
        }
        this.targetOpacity = op;
        var blue = 0;
        // (min(noise(this.position[0] / 1000, this.position[1] / 1000, t) * 255, 255)) & 255;
        // if (red > 50 || green > 50) {
        //     fill(red, green, 0);
        //     rect(this.position[0] - blockSize / 2 + 1,
        //         1 + this.position[1] - blockSize / 2, blockSize - 2, blockSize - 2);
        // }

        this.sprite.alpha = ease(this.sprite.alpha, op, 0.1);
        this.targetColor = rgb;
        this.color[0] = ease(this.color[0], this.targetColor[0], 0.2);
        this.color[1] = ease(this.color[1], this.targetColor[1], 0.2);
        this.color[2] = ease(this.color[2], this.targetColor[2], 0.2);
        this.sprite.tint = (this.color[0] << 16) + (this.color[1] << 8) + this.color[2];

    }
}

var convSize = 60;
class ConvFilter {
    constructor(position, radius) {
        this.cached_mates = [];
        this.position = [
            position[0] * convSize + convSize / 2,
            position[1] * convSize + convSize / 2
        ];
        this.aspects = {};
        this.aspectEase = {};
        this.sprite = new PIXI.Sprite(strokeTexture);
        chunk_container.addChild(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.4;
        this.sprite.scale.y = 0.4;
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
        this.sprite.position.x = this.position[0];
        this.sprite.position.y = this.position[1];

        for (var i = 0; i < le_world.length; i++) {
            if (dist(this.position[0], this.position[1], le_world[i].position[0], le_world[i].position[1]) < radius) {
                this.cached_mates.push(i);
            }
        }
        this.target = 0;
        this.val = 0;
    }
    reset() {
        for (var i in this.aspects) {
            this.aspects[i] = 0;
        }
    }
    update(t) {
        for (var i = 0; i < this.cached_mates.length; i++) {
            let cur = le_world[this.cached_mates[i]];
            for (var j in cur.aspects) {
                this.aspects[j] = this.aspects[j] || 0;
                this.aspects[j] += cur.aspects[j];
            }
        }
        for (var i in this.aspects) {
            this.aspectEase[i] = ease(
                this.aspectEase[i] || 0, this.aspects[i], 0.2
            )
        }
        this.target = (this.aspects[config.view] || 0)
            + simplex.noise3D(this.position[0] / 100 + t, this.position[1] / 100 - t, t) * 0.5 - 0.2;
        this.target /= map(config.magnification, 0, 1, 1, 5);
        this.target = this.target < (-config.warning_threshold / map(config.magnification, 0, 1, 1, 2)) ? -10 : 0;

        if (!config.showCriticalHint) {
            this.target = 0;
        }

        this.val = ease(this.val, this.target, 0.2);
    }
    render(t) {


        var val = this.val;

        // val = val < -config.warning_threshold ? -10 : 0;

        var green = min((max(val, 0) * 15), 255) & 255;
        var red = min((max(-val, 0) * 15), 255) & 255;

        var rgb = hslToRgb(min(1, max(0, -val / 20)) + 0.5, 0.8, min(1, max(0, -val / 30)));
        var blue = 0;

        // (min(noise(this.position[0] / 1000, this.position[1] / 1000, t) * 255, 255)) & 255;
        // if (red > 50 || green > 50) {
        //     fill(red, green, 0);
        //     rect(this.position[0] - blockSize / 2 + 1,
        //         1 + this.position[1] - blockSize / 2, blockSize - 2, blockSize - 2);
        // }
        this.sprite.alpha = this.sprite.opacity = -val / 10;
        this.sprite.tint = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];

    }
}

var le_world_size = {
    w: w / blockSize,
    h: h / blockSize
};

function initChunks() {
    for (var y = 0; y < h / blockSize; y++) {
        for (var x = 0; x < w / blockSize; x++) {
            var q = new Chunk([x, y]);
            le_world.push(q);
        }
    }
    for (var y = 0; y < h / convSize; y++) {
        for (var x = 0; x < w / convSize; x++) {
            var q = new ConvFilter([x, y], 50);
            conv_world.push(q);
        }
    }
}

function resetChunks() {
    for (var i = 0; i < le_world.length; i++) {
        le_world[i].reset();
    }
    for (var i = 0; i < conv_world.length; i++) {
        conv_world[i].reset();
    }
    cv.overlay.clear();
}

function setSelected(x, y, t) {
    if (x >= 0 && y >= 0 && x < le_world_size.w && y < le_world_size.h) {
        le_world[x + y * le_world_size.w].selected = true;
        t.selected.push(le_world[x + y * le_world_size.w]);
    }
}

function updateChunks(t) {

    for (var i = 0; i < le_world.length; i++) {
        le_world[i].selected = false;
    }

    for (var i = 0; i < touchSelectors.length; i++) {
        touchSelectors[i].active = false;
    }

    for (var i = 0; i < touches.length; i++) {
        if(touches[i].y > 960) continue;
        touchSelectors[i] = touchSelectors[i] || new TouchSelection();
        touchSelectors[i].position[0] = touches[i].x;
        touchSelectors[i].position[1] = touches[i].y;
        touchSelectors[i].active = true;
        if (config.lensMode == 0) {
            if (touchSelectors[i].selected.length > 0) {
                touchSelectors[i].selected = [];
            }
            var p = {
                x: touches[i].x,
                y: touches[i].y
            };
            // console.log(p);
            p.x /= blockSize;
            p.y /= blockSize;
            p.x = Math.round(p.x - 0.5);
            p.y = Math.round(p.y - 0.5);
            for (var x = -config.touchZone; x <= config.touchZone; x++) {
                for (var y = -config.touchZone; y <= config.touchZone; y++) {
                    setSelected(x + p.x, y + p.y, touchSelectors[i])
                }
            }
        }
    }

    for (var i = 0; i < le_world.length; i++) {
        le_world[i].update(t);
        le_world[i].render(t);

    }
    for (var i = 0; i < conv_world.length; i++) {
        conv_world[i].update(t);
        conv_world[i].render(t);
    }

    for (var i = 0; i < touchSelectors.length; i++) {
        touchSelectors[i].update(t);
        touchSelectors[i].render(t);
    }
}
