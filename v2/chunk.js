var chunk_container = new PIXI.Container();
var conv_container = new PIXI.Container();

app.stage.addChild(conv_container);
app.stage.addChild(chunk_container);

var blockSize = 30;
class Chunk {
    constructor(position) {
        this.counter = 0;
        this.position = [
            position[0] * blockSize + blockSize / 2,
            position[1] * blockSize + blockSize / 2
        ];
        this.aspects = {};
        this.aspectEase = {};
        this.sprite = new PIXI.Sprite(rectTexture);
        chunk_container.addChild(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.7;
        this.sprite.scale.y = 0.7;
        this.sprite.position.x = this.position[0];
        this.sprite.position.y = this.position[1];
    }
    reset() {
        this.counter = 0;
        for (var i in this.aspects) {
            this.aspects[i] = 0;
        }
    }
    update() {
        for (var i in this.aspects) {
            this.aspectEase[i] = ease(
                this.aspectEase[i] || 0, this.aspects[i], 0.2
            )
        }
    }
    render(t) {
        var val = this.aspectEase[window.asp] || 0;

        var green = min((max(val, 0) * 15), 255) & 255;
        var red = min((max(-val, 0) * 15), 255) & 255;

        var rgb = hslToRgb(0.6, 0.8, min(0.2, max(0, val / 20)));
        if(val < 0) {
            rgb = hslToRgb(0, 0.8, min(0.2, max(0, -val / 20)));
        }
        var blue = 0;

        // (min(noise(this.position[0] / 1000, this.position[1] / 1000, t) * 255, 255)) & 255;
        // if (red > 50 || green > 50) {
        //     fill(red, green, 0);
        //     rect(this.position[0] - blockSize / 2 + 1,
        //         1 + this.position[1] - blockSize / 2, blockSize - 2, blockSize - 2);
        // }
        this.sprite.tint = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
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
        this.sprite = new PIXI.Sprite(rectTexture);
        // chunk_container.addChild(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 1.4;
        this.sprite.scale.y = 1.4;
        this.sprite.position.x = this.position[0];
        this.sprite.position.y = this.position[1];

        for (var i = 0; i < le_world.length; i++) {
            if (dist(this.position[0], this.position[1], le_world[i].position[0], le_world[i].position[1]) < radius) {
                this.cached_mates.push(i);
            }
        }
    }
    reset() {
        for (var i in this.aspects) {
            this.aspects[i] = 0;
        }
    }
    update() {
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
    }
    render(t) {
        var val = this.aspectEase[window.asp] || 0;
        
        val = val < -30 ? -10 : 0;

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
        this.sprite.tint = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    }
}

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
}

function updateChunks(t) {
    for (var i = 0; i < le_world.length; i++) {
        le_world[i].update();
        le_world[i].render(t);
    }
    for (var i = 0; i < conv_world.length; i++) {
        conv_world[i].update();
        conv_world[i].render(t);
    }
}