function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

var world = [];
var simplex = new SimplexNoise('seed');
var buildings = [];
var w = 1920;
var h = 960;

var dw = 1920;
var dh = 1080;
var app = new PIXI.Application({ width: dw, height: dh });

var chunk_container = new PIXI.Container();
app.stage.addChild(chunk_container);

var pixi_rect = new PIXI.Graphics();
pixi_rect.beginFill(0xffffff);
pixi_rect.drawRect(0, 0, 40, 40);
pixi_rect.x = 0;
pixi_rect.y = 0;
var rectTexture = pixi_rect.generateTexture();


var le_world = [];
var changables = [];


var cv = {
    buildings: undefined
};

function ease(a, b, t) {
    if (a == b || abs(a - b) < 0.001) return b;
    return a + (b - a) * t;
}

function initWorld() {
    for (var i = 0; i < world.length; i++) {
        world[i].init();
    }
}

function updateWorld(t) {

    for (var i = 0; i < le_world.length; i++) {
        le_world[i].reset();
    }
    for (var i = 0; i < world.length; i++) {
        world[i].update(t);
    }
    for (var i = 0; i < le_world.length; i++) {
        le_world[i].update();
        le_world[i].render(t);
    }
    for (var i = 0; i < world.length; i++) {
        world[i].render(world[i]);
    }
}

class Entity {
    constructor(vars, calculator, render) {
        this.render = render || this.default_render;
        this.calculator = calculator ? calculator(this) : undefined;
        this.RSIZE = 33;
        this.blocks = [];
        this.factor = {};
        this.noiseOffset = [
            random(-1, 1),
            random(-1, 1)
        ];
        this.decay = 0.89;
        this.variables = {
            position: [0, 0],
            rotation: 0,
            size: 1,
            radius: 150,
            distance_decay: 0
        };

        for (var i in vars) {
            this.variables[i] = vars[i];
        }

    }

    init() {
        for (var i = 0; i < le_world.length; i++) {
            var c = le_world[i];
            var d = dist(c.position[0], c.position[1], this.variables.position[0],
                this.variables.position[1]);
            this.blocks.push({
                r: d,
                block: c,
                decay:
                    pow(this.decay, d / 10)
            });
        }
        this.blocks.sort((a, b) => {
            return a.r - b.r;
        });
    }

    update(t) {
        this.calculator ? this.calculator(t) : 0;
        this.variables.radius += (simplex.noise3D(this.noiseOffset[0], this.noiseOffset[1], t) - 0.5) * 30;
        var target = 0;
        for (target = 0; target < this.blocks.length; target++) {
            if (this.blocks[target].r > this.variables.radius) {
                break;
            }
        }
        for (var i = 0; i < target; i++) {
            var b = this.blocks[i];
            var nz = (simplex.noise3D(this.noiseOffset[0] + b.block.position[1] / 1000, this.noiseOffset[1] + b.block.position[0] / 1000, t / 1) * 0.2 + 0.5);
            for (var j in this.factor) {
                b.block.aspects[j] += this.factor[j] * b.decay * nz;
            }
        }
    }

}


function render_building(t) {
    // t.default_render();

    cv.buildings.blendMode(BLEND);

    // selectedTab = 0;
    cv.buildings.push();
    cv.buildings.translate(this.variables.position[0], this.variables.position[1]);
    cv.buildings.fill(255, 100);
    cv.buildings.noStroke();
    cv.buildings.rectMode(CENTER);
    cv.buildings.rotate(radians(this.variables.rotation));
    cv.buildings.rect(0, 0, this.RSIZE, this.RSIZE);
    cv.buildings.pop();

}


function render_dynamic(t) {
    // t.default_render();

    cv.buildings.blendMode(BLEND);

    // selectedTab = 0;
    cv.buildings.push();
    cv.buildings.translate(this.variables.position[0], this.variables.position[1]);
    cv.buildings.fill(255);
    cv.buildings.noStroke();
    cv.buildings.rectMode(CENTER);
    cv.buildings.rotate(radians(this.variables.rotation));
    cv.buildings.rect(0, 0, this.RSIZE, this.RSIZE);
    cv.buildings.pop();

}


function e(v, c, r) {
    return new Entity(v, c, r);
}

function simple(f) {
    return round(f * 100) / 100;
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

        if (cur.id.startsWith('随意')) {
            console.log('woa');
            world.push(e({
                position: [np.x, np.y],
                rotation: r,
                name: j,
                dynamic: true
            }, undefined, render_dynamic));
            changables.push(world[world.length - 1]);
        } else {
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
    console.log("Init");
    initWorld();
}

var blockSize = 23;
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
        this.sprite.scale.x = 0.5;
        this.sprite.scale.y = 0.5;
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

        var rgb = hslToRgb(min(1, max(0, -val / 20)) + 0.5, 0.5, min(1, max(0, -val / 30)));


        var blue = 0;// (min(noise(this.position[0] / 1000, this.position[1] / 1000, t) * 255, 255)) & 255;
        // if (red > 50 || green > 50) {
        //     fill(red, green, 0);
        //     rect(this.position[0] - blockSize / 2 + 1,
        //         1 + this.position[1] - blockSize / 2, blockSize - 2, blockSize - 2);
        // }
        this.sprite.tint = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    }
}

function setup() {
    noStroke();
    cv.buildings = createGraphics(dw, dh);
    createCanvas(dw, dh);
    for (var y = 0; y < h / blockSize; y++) {
        for (var x = 0; x < w / blockSize; x++) {
            var q = new Chunk([x, y]);
            le_world.push(q);
        }
    }
    read_buildings();
}

function draw() {
    blendMode(BLEND);
    clear();

    cv.buildings.clear();
    // cv.buildings.fill(0);
    // cv.buildings.rect(0, 0, w, h);

    updateWorld(millis() / 1000);

    blendMode(ADD);
    image(cv.buildings, 0, 0);
}
document.body.appendChild(app.view);