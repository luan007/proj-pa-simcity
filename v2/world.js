//changables[3].calculator = template.c.bind(changables[3], 150)

var building_container = new PIXI.Container();
app.stage.addChild(building_container);

class Entity {
    constructor(vars, calculator, render) {
        this.render = render || this.default_render;
        this.calculator = calculator ? calculator(this) : undefined;
        this.RSIZE = 33;
        this.blocks = [];
        this.id = condensed.allFactors.length;
        condensed.allFactors.push({});
        this.factor = condensed.allFactors[condensed.allFactors.length - 1];
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
            distance_decay: this.decay,
            noiseOffset: this.noiseOffset
        };
        for (var i in vars) {
            this.variables[i] = vars[i];
        }
        condensed.worldConfigs.push(this.variables);



        this._group = new PIXI.Container();
        this._group.position.x = this.variables.position[0];
        this._group.position.y = this.variables.position[1] + this.RSIZE / 2;

        this._rotator = new PIXI.Container();
        this._rotator.rotation = (this.variables.rotation % 180) / 360 * PI * 2;

        this.sprite = new PIXI.Sprite(rectTexture);
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
        this.csprite = new PIXI.Sprite(circleTexture);
        this.title = new PIXI.Text(this.variables.name, {
            fontFamily: 'PingFang SC',
            fontSize: 10,
            fill: 0xffffff,
            align: 'left'
        });

        this.title.position.y = -30;

        chunk_container.addChild(this._group);
        this._group.addChild(this._rotator);
        this._rotator.addChild(this.csprite);
        this._rotator.addChild(this.sprite);
        this._rotator.addChild(this.title);

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.82;
        this.sprite.scale.y = 0.82;
        this.sprite.alpha = 0.1;

        this.csprite.anchor.x = 0.5;
        this.csprite.anchor.y = 0.5;
        this.csprite.scale.x = 0.12;
        this.csprite.scale.y = 0.12;
        this.cache = [];
        this.highlit = false;

        this.csprite.blendMode = PIXI.BLEND_MODES.ADD;


        if (this.variables.dynamic == true) {
            this._group.visible = false;
            this.sprite.scale.x = 1.82;
            this.sprite.scale.y = 1.82;
            this.title.position.y = -50;
            this.title.position.x = -35;
            this.title.text = "PLANNED > "
            this.sprite.visible = false;
        }
    }

    init() {

        // for (var i = 0; i < world.length; i += 1) {
        //     window.lineCount = window.lineCount || 0;
        //     var line = new PIXI.Graphics();
        //     line.lineStyle(1, 0xffffff)
        //         .moveTo(this.variables.position[0], this.variables.position[1] + this.RSIZE / 2)
        //         .lineTo(world[i].variables.position[0], world[i].variables.position[1] + this.RSIZE / 2);
        //     this._lines.addChild(line);
        // }

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
        this.computedFactors = undefined;
        this.viewedFactorEase = 0;
    }

    update(t) {

        if (this.variables.dynamic) {
            this._group.visible = this.variables.activated;
            if (this.variables.activated && moveableScores[this.variables.radio]) {
                moveableScores[this.variables.radio][0].call(this, [moveableScores[this.variables.radio][1]]);
            } else {
                //clear factors
                for (var i in this.factor) {
                    this.factor[i] = 0;
                }
            }
        }


        this.calculator ? this.calculator(t) : 0;
        this.variables.radius += (simplex.noise3D(this.noiseOffset[0], this.noiseOffset[1], t) - 0.5) * 30;
        this.computedFactors = computed.world ? computed.world[this.id] : undefined;

        // var target = 0;
        // for (target = 0; target < this.blocks.length; target++) {
        //     if (this.blocks[target].r > this.variables.radius) {
        //         break;
        //     }
        // }
        // for (var i = 0; i < target; i++) {
        //     var b = this.blocks[i];
        //     var nz = (simplex.noise3D(this.noiseOffset[0] + b.block.position[1] / 1000, this.noiseOffset[1] + b.block.position[0] / 1000, t / 1) * 0.2 + 0.5);
        //     for (var j in this.factor) {
        //         b.block.aspects[j] += this.factor[j] * b.decay * nz;
        //     }
        // }

        if (!this.computedFactors) return;

        var raw = this.computedFactors[config.view];
        var curFactor = abs(raw) || 0;

        if (this.highlit) {
            curFactor = curFactor;
        } else {
            curFactor = 0;
        }

        this.viewedFactorEase = ease(this.viewedFactorEase, min(0.3, sqrt(curFactor) / 10), 0.1);
        this.csprite.scale.x =
            this.csprite.scale.y = this.viewedFactorEase;

        this.csprite.alpha = min(0.2, this.viewedFactorEase);
        if (raw > 0) {
            this.csprite.tint = 0xeeefff;
        } else if (raw < 0) {
            this.csprite.tint = 0xff3300;
        }

        this.sprite.alpha = max(0.9, abs(this.viewedFactorEase) * 0.3);

        var d = dist(this.variables.position[0], this.variables.position[1], dw / 2, dh / 2) /
            1200;
        if (this.factor[config.view] > 0) {
            // this.sprite.alpha = this.sprite.opacity = 0.;
            this.sprite.tint = 0x0099ff;
            // this.sprite.alpha = 0.5;
        } else if (this.factor[config.view] < 0) {
            this.sprite.tint = 0xff9900;
            // this.sprite.alpha = Math.min(1.0, abs(this.factor[config.view]));
            // this.sprite.alpha = this.sprite.opacity = 0.6;
            // this.sprite.tint = PIXI.utils.rgb2hex([100 * abs(this.factor[config.view]) + 50, (0), 0]);
        } else {
            this.sprite.tint = 0x222222;
        }
        this.title.opacity = this.title.alpha = random(0.4) < abs(d - probe) ? 1 : 0.8;

        if (abs(d - probe) < 0.2 && random(0.4) < abs(d - probe)) {
            this.sprite.tint = 0xffffff;
            this.sprite.alpha = 0.5;
        }


        this.highlit = false; //recycle!
    }
}

//renderers
{
    function render_building_bk(t) {
        return;

        var d = dist(this.variables.position[0], this.variables.position[1], dw / 2, dh / 2) /
            1200;
        // // t.default_render();
        cv.buildings.blendMode(BLEND);
        cv.buildings.push();
        cv.buildings.translate(this.variables.position[0], this.variables.position[1] + 12);
        // cv.buildings.fill(255, 180, 0);
        // // cv.buildings.stroke(255);

        // cv.buildings.push();
        // cv.buildings.translate(30, -20);
        // cv.buildings.fill(255);
        // cv.buildings.noStroke();
        // cv.buildings.text("test", 0, 0);
        // cv.buildings.pop();

        cv.buildings.rectMode(CENTER);
        cv.buildings.rotate(radians(this.variables.rotation) % PI);
        cv.buildings.noFill();
        cv.buildings.stroke(255, 100);

        if (this.factor[config.view] > 0) {
            cv.buildings.fill(0, 150, 255 * abs(this.factor[config.view]), 100);
        } else if (this.factor[config.view] < 0) {
            cv.buildings.fill(255 * abs(this.factor[config.view]), 50, 0, 100);
        }

        cv.buildings.rect(0, 0, this.RSIZE, this.RSIZE);


        // if(this.factor[config.view] > 0) {
        //     let r = this.factor[config.view] * 30;
        //     cv.buildings.noFill();
        //     cv.buildings.stroke(0, 150, 255, 100);
        //     cv.buildings.strokeWeight(10);
        //     cv.buildings.ellipse(0, 0, r, r);
        // }

        cv.buildings.push();
        cv.buildings.translate(-this.RSIZE / 2, -this.RSIZE / 2 - 3);
        cv.buildings.fill(255, random(0.4) < abs(d - probe) ? 255 : 200);
        cv.buildings.noStroke();
        cv.buildings.text(this.variables.name, 0, 0);
        cv.buildings.pop();

        //draw shell
        var rs = this.RSIZE;
        cv.buildings.strokeWeight(1);
        if (abs(d - probe) < 0.2 && random(0.4) < abs(d - probe)) {
            cv.buildings.noStroke();
            cv.buildings.rectMode(CENTER);
            cv.buildings.fill(200, 255, 255, abs(d - probe) / 0.2 * 255);
            cv.buildings.rect(0, 0, this.RSIZE * abs(d - probe) / 0.2, this.RSIZE * abs(d - probe) / 0.2);
            cv.buildings.stroke(255, abs(d - probe) / 0.2 * 255);
            for (var corner = 0; corner < 4; corner++) {
                cv.buildings.rotate(PI / 2);
                cv.buildings.beginShape();
                cv.buildings.vertex(-rs / 2 + 3, -rs / 2 - 3);
                cv.buildings.vertex(-rs / 2 - 3, -rs / 2 - 3);
                cv.buildings.vertex(-rs / 2 - 3, -rs / 2 + 3);
                cv.buildings.endShape();
            }
        }
        cv.buildings.pop();
    }


    function render_building(t) {

        // var d = dist(this.variables.position[0], this.variables.position[1], dw / 2, dh / 2) /
        //     1200;
        // if (this.factor[config.view] > 0) {
        //     // this.sprite.alpha = this.sprite.opacity = 0.;
        //     this.sprite.tint = 0xffffff;
        //     this.sprite.alpha = 0.5;
        // } else if (this.factor[config.view] < 0) {
        //     this.sprite.tint = 0xff3311;
        //     this.sprite.alpha = Math.min(1.0, abs(this.factor[config.view]));
        //     // this.sprite.alpha = this.sprite.opacity = 0.6;
        //     // this.sprite.tint = PIXI.utils.rgb2hex([100 * abs(this.factor[config.view]) + 50, (0), 0]);
        // }
        // this.title.opacity = this.title.alpha = random(0.4) < abs(d - probe) ? 1 : 0.8;

        // if (abs(d - probe) < 0.2 && random(0.4) < abs(d - probe)) {
        //     this.sprite.tint = 0xffffff;
        //     this.sprite.alpha = 1;
        // }
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
        cv.buildings.rect(0, this.RSIZE, this.RSIZE);
        cv.buildings.pop();

    }
}

//world
{
    var names = {};
    function initWorld() {
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

            if (cur.attributes["data-name"]) {
                names[cur.attributes["data-name"].value.trim().replace(" ", "")] = 1;
            }
            if (cur.id.startsWith('随意')) {
                // world.push(e({
                //     position: [np.x, np.y],
                //     rotation: r,
                //     name: j,
                //     dynamic: true
                // }, undefined, render_dynamic));
                // changables.push(world[world.length - 1]);
            } else {
                for (var j in scores) {
                    if (cur.id.startsWith(j)) {
                        world.push(e({
                            position: [np.x, np.y],
                            rotation: r,
                            name: j,
                            displayName: cur.id
                        }, scores[j], render_building));
                        break;
                    }
                }
            }
        }
    }

    function loadWorld() {
        for (var i = 0; i < world.length; i++) {
            world[i].init();
        }
    }


    var last = Date.now();
    function updateWorld(t) {
        for (var i = 0; i < world.length; i++) {
            world[i].update(t);
        }
        if (!simulator.busy && Date.now() - last > (1000 / config.simulatorFps)) { //limit simulator to 15fps
            simulator.busy = true;
            simulator.heatMap([condensed, chunks, t, config]).then((dt) => {
                // var cur = Date.now() - last;
                last = Date.now();
                // console.log(1000 / cur);
                // var restored = JSON.parse(pako.inflate(dt, { to: 'string' }));
                computed.aspects = dt.aspects;
                computed.world = dt.world;
                computed.score = dt.score;
                for (var i = 0; i < computed.aspects.length; i++) {
                    for (var j in computed.aspects[i]) {
                        computed.aspects[i][j] /= 10;
                    }
                }
                simulator.busy = false;
            });
        }
        // if (!simulator2.busy) {
        //     simulator2.globalSimulation([condensed]).then((d) => {
        //         //tick
        //         // var cur = Date.now() - last;
        //         // last = Date.now();
        //         // console.log(1000 / cur);
        //         computed.world = d;
        //         simulator2.busy = false;
        //     });
        // }
    }

    function renderWorld(t) {
        for (var i = 0; i < world.length; i++) {
            world[i].render(world[i]);
        }
    }

}