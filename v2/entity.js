var world = [];

function initWorld() {
    for (var i = 0; i < world.length; i++) {
        world[i].calculateNeedsAndOfferings(world[i]);
    }
    for (var i = 0; i < world.length; i++) {
        world[i].init();
    }
}

function updateWorld() {
    for (var i = 0; i < world.length; i++) {
        world[i].calculateNeedsAndOfferings(world[i]);
    }

    for (var i = 0; i < world.length; i++) {
        world[i].update();
    }

    for (var i = 0; i < world.length; i++) {
        world[i].render(world[i]);
    }
}

class Entity {

    constructor(vars, calc, render) {

        this.calculateNeedsAndOfferings = calc;
        this.render = render || this.default_render;
        this.RSIZE = 33;
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

        this.needs = {};
        this.offerings = {};


        this.offerings_left = {};

        // this.needs_parties = {};
        this.offering_out = [];

        // this.net_needs = {};
        // this.net_offerings = {};

        this.affected_cache = [];
        this.distance_cache = [];
    }

    init() {
        this.updateAffectCache();
        this.calculateNeedsAndOfferings();
    }

    updateAffectCache() {
        this.affected_cache = [];
        this.distance_cache = [];
        var pos = this.variables.position;
        for (var i = 0; i < world.length; i++) {
            if (world[i] == this) continue;
            var pos2 = world[i].variables.position;
            if (dist(pos[0], pos[1], pos2[0], pos2[1]) < this.variables.radius) {
                this.affected_cache.push(world[i]);
                this.distance_cache.push(dist(pos[0], pos[1], pos2[0], pos2[1]));
            }
        }
    }

    update() {
        this.offering_out = [];
        for (var i in this.offerings) {
            this.offerings_left[i] = this.offerings[i];
        }
        var iterations = 0;
        while (true) {
            var nearByNeeds = {};

            for (var j = 0; j < this.affected_cache.length; j++) {
                var others = this.affected_cache[j];
                for (var i in others.needs) {
                    if (!this.offerings_left[i] || this.offerings_left[i] <= 0 || others.needs[i] <= 0) {
                        continue;
                    }
                    nearByNeeds[i] = nearByNeeds[i] || {
                        value: 0,
                        count: 0,
                        avg: 0
                    };
                    if (others.needs[i] > 0) {
                        nearByNeeds[i].value += others.needs[i];
                        nearByNeeds[i].count += 1;
                    }
                    //calculate nearby needs
                }
            }

            if (Object.keys(nearByNeeds).length == 0) break;


            for (var i in nearByNeeds) {
                nearByNeeds[i].value = min(nearByNeeds[i].value, this.offerings[i]); //max out with offering
                nearByNeeds[i].avg = nearByNeeds[i].value / nearByNeeds[i].count;
                nearByNeeds[i].avg = min(this.offerings_left[i], nearByNeeds[i].avg);
            }


            for (var j = 0; j < this.affected_cache.length; j++) {
                var others = this.affected_cache[j];
                for (var i in others.needs) {
                    if (this.offerings_left[i] > 0 && others.needs[i] > 0) {
                        var out = min(this.offerings_left[i], min(others.needs[i], nearByNeeds[i].avg));
                        this.offerings_left[i] -= out;
                        others.needs[i] -= out / (1 + this.distance_cache[j] * this.variables.distance_decay);
                        // this.offering_out[others] = this.offering_out[others] || {};
                        var found = false;
                        for (var t = 0; t < this.offering_out.length; t++) {
                            var cur = this.offering_out[t];
                            if (cur.others == others && cur.offer == i) {
                                cur.value += out;
                                cur.percentage = cur.value / this.offerings[i];
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            this.offering_out.push({
                                other: others,
                                offer: i,
                                value: out,
                                percentage: out / this.offerings[i]
                            })
                        }
                    }
                }
            }

            if (iterations++ > 10) {
                console.log(this);
                break;
            }

        }

    }

    default_render() {
        
        push();
        translate(this.variables.position[0], this.variables.position[1]);
        stroke(255, 30);
        noFill();
        if (dist(mouseX, mouseY, this.variables.position[0], this.variables.position[1]) < 30) {
            ellipse(0, 0, this.variables.radius * 2, this.variables.radius * 2);
        }
        fill(255);
        noStroke();
        rectMode(CENTER);
        rotate(radians(this.variables.rotation));
        rect(0, 0, this.RSIZE, this.RSIZE);
        pop();

        // for (var i = 0; i < this.offering_out.length; i++) {
        //     var other = this.offering_out[i].other;
        //     stroke(255, 150 * this.offering_out[i].percentage);
        //     // var other = this.affected_cache[i]
        //     line(this.variables.position[0], this.variables.position[1],
        //         other.variables.position[0], other.variables.position[1])
        // }

        if (dist(mouseX, mouseY, this.variables.position[0], this.variables.position[1]) < 30 || this.show_info) {
            // for (var i = 0; i < this.affected_cache.length; i++) {
            //     stroke(255, 150);
            //     var other = this.affected_cache[i]
            //     line(this.variables.position[0], this.variables.position[1],
            //         other.variables.position[0], other.variables.position[1])
            // }
            push();
            translate(this.variables.position[0] + 25, this.variables.position[1]);
            fill(255, 255, 20);
            noStroke();
            text(this.variables.name, 0, 0);
            translate(0, 15);

            for (var i in this.offerings_left) {
                fill(0, 255, 20);
                noStroke();
                text(i + "=" + simple(this.offerings_left[i]), 0, 0);
                translate(0, 15);
            }

            for (var i in this.needs) {
                fill(255, 100, 20);
                noStroke();
                text(i + "=" + simple(this.needs[i]), 0, 0);
                translate(0, 15);
            }
            pop();
        }
    }
}

function e(v, c, r) {
    return new Entity(v, c, r);
}

function simple(f) {
    return round(f * 100) / 100;
}