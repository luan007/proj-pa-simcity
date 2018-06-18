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
    }

    render() {
        this.activeEase = ease(this.activeEase, this.active ? 1 : 0, 0.2);
        // if (random(this.activeEase) < 0.3) {
        //     return;
        // }
        var s = (config.touchZone * 2 + 1) * blockSize * this.activeEase;
        cv.overlay.push();
        cv.overlay.fill(255, 20);
        cv.overlay.stroke(255, 100);
        cv.overlay.strokeWeight(2);
        cv.overlay.rectMode(CENTER);
        cv.overlay.rect(this.position[0], this.position[1], s, s);
        cv.overlay.pop();


        var link = (config.touchZone * 3 + 1) * blockSize * this.activeEase;

        cv.overlay.push();
        cv.overlay.noFill();
        cv.overlay.stroke(40, 150, 255, 100);
        cv.overlay.strokeWeight(3);
        cv.overlay.ellipse(this.position[0], this.position[1], link * 2, link * 2);
        cv.overlay.pop();
    }

    update() {

        if (this.linked.length > 0) {
            this.linked = [];
        }
        
        if (!this.active) {
            return;
        }

        for (var i = 0; i < world.length; i++) {
            if (dist(world[i].variables.position[0], world[i].variables.position[1] + 33 / 2,
                this.position[0], this.position[1]) < (config.touchZone * 3 + 1) * blockSize) {
                world[i].highlit = true;
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
        this.sprite.scale.x = 0.82;
        this.sprite.scale.y = 0.82;
        this.sprite.position.x = this.position[0];
        this.sprite.position.y = this.position[1];
        this.val = 0;
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
        this.val = ease(this.val, this.target, 0.2);


    }
    render(t) {
        var val = this.val;
        var green = min((max(val, 0) * 15), 255) & 255;
        var red = min((max(-val, 0) * 15), 255) & 255;
        var op = min(0.5, abs(val / 5));
        var rgb = hslToRgb(0.6, 0.7, 0.3);
        if (val < 0) {
            rgb = hslToRgb(0, 0.2, 0.3);
        }
        var blue = 0;
        // (min(noise(this.position[0] / 1000, this.position[1] / 1000, t) * 255, 255)) & 255;
        // if (red > 50 || green > 50) {
        //     fill(red, green, 0);
        //     rect(this.position[0] - blockSize / 2 + 1,
        //         1 + this.position[1] - blockSize / 2, blockSize - 2, blockSize - 2);
        // }
        this.sprite.alpha = this.sprite.opacity = op;
        this.sprite.tint = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];

        if (this.selected) {
            this.sprite.alpha = this.sprite.opacity = 1;
        }
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

function setSelected(x, y) {
    if (x >= 0 && y >= 0 && x < le_world_size.w && y < le_world_size.h) {
        le_world[x + y * le_world_size.w].selected = true;
    }
}

function updateChunks(t) {

    // for (var i = 0; i < le_world.length; i++) {
    //     le_world[i].selected = false;
    // }

    for (var i = 0; i < touchSelectors.length; i++) {
        touchSelectors[i].active = false;
    }

    for (var i = 0; i < touches.length; i++) {

        touchSelectors[i] = touchSelectors[i] || new TouchSelection();
        touchSelectors[i].position[0] = touches[i].x;
        touchSelectors[i].position[1] = touches[i].y;
        touchSelectors[i].active = true;
        // var p = {
        //     x: touches[i].x,
        //     y: touches[i].y
        // };
        // console.log(p);
        // p.x /= blockSize;
        // p.y /= blockSize;
        // p.x = Math.round(p.x - 0.5);
        // p.y = Math.round(p.y - 0.5);
        // for (var x = -config.touchZone; x <= config.touchZone; x++) {
        //     for (var y = -config.touchZone; y <= config.touchZone; y++) {
        //         setSelected(x + p.x, y + p.y)
        //     }
        // }
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