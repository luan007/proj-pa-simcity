var touchless_pixi_container = new PIXI.Container();

app.stage.addChild(touchless_pixi_container);

var radios = {};
socket.on('id', function (data) {
    var radio = data.radio;
    radios[radio] = radios[radio] || {};
    radios[radio].ago = data.ago;
    radios[radio].timeStamp = Date.now() - data.ago;
    radios[radio].position = data.position;
    newHit = true;
});

class time_modulator {
    constructor(id, size, prep) {
        this.b = 0;
        this.size = size;
        this.id = id;
        this.linked = undefined;
        var p = this.id % 255;
        var dataItems = [255];
        var prep = prep;
        var parity = 0;

        this.sprite = new PIXI.Sprite(rectTexture);
        this.sprite.scale.x = 2.8;
        this.sprite.scale.y = 2.8;
        this.sprite.position.x = size[0];
        this.sprite.position.y = size[1];
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
        touchless_pixi_container.addChild(this.sprite);

        for (var i = 0; i < 7; i++) {
            var j = ((p & (1 << i)) > 0) ? 1 : 0;
            prep.push(j);
            parity += (j == 1 ? 1 : 0);
        }
        prep.push(parity % 2 == 0 ? 1 : 0);
        console.log(prep);
        for (var i = 0; i < prep.length; i++) {
            if (prep[i] == 2) {
                dataItems.push(0);
                dataItems.push(0);
                dataItems.push(0);
                dataItems.push(255);
            }
            if (prep[i] == 1) {
                dataItems.push(0);
                dataItems.push(0);
                dataItems.push(255);
            }
            if (prep[i] == 0) {
                dataItems.push(0);
                dataItems.push(255);
            }
        }
        this.trueLength = dataItems.length;
        for (var i = 0; i < 500; i++) {
            dataItems.push(0);
        }
        this.dataItems = dataItems;
        this.b = Math.round(Math.random() * dataItems.length);
        this.b = 100 - Math.round(dist(1920 / 2, 960 / 2, size[0] + 120 / 2, size[1] + 120 / 2) / 10);
    }
    render() {
        if (this.activated) {
            this.b = this.b % this.trueLength;
            if(Date.now() - radios[this.radioId].timeStamp > 5000) {
                this.activated = false;
            }
        } else {
            this.b = this.b % this.dataItems.length;
        }
        for (var i in radios) {
            if (radios[i].position == this.id
                && (Date.now() - radios[i].timeStamp) < 5000) { //13 = magic..
                this.activated = true;
                this.radioId = i;
            } else {
            }
        }
        if (this.linked) {
            this.linked.variables.activated = this.activated;
            this.linked.variables.radio = this.radioId;
        }
        if (this.b <= this.dataItems.length) {
            var bit = this.b % this.dataItems.length;
            if (this.dataItems[this.b] > 0) {
                this.sprite.tint = 0xffffff;
                this.sprite.alpha = 0.2;
            } else {
                this.sprite.tint = 0;
                this.sprite.alpha = 0;
            }
        }
        // if (this.activated) {
        //     this.sprite.tint = 0xff0000;
        //     this.sprite.alpha = 0.9;
        // }
        this.b++;
    }
}

var vmodulators = [];
function initTouchless() {
    var id = 0;
    for (var y = 0; y < 960; y += 120) {
        for (var x = 0; x < 1920; x += 120) {
            var m = new time_modulator(id++, [x, y, 120, 120], [2, 2, 2]);
            vmodulators.push(m);
            world.push(e({
                position: [x + 60, y + 40],
                rotation: 0,
                dynamic: true,
                name: 'C2',
            }, undefined, render_building));
            changables.push(world[world.length - 1]);
            m.linked = world[world.length - 1];
        }
    }
}

function updateTouchless() {
    for (var i = 0; i < vmodulators.length; i++) {
        vmodulators[i].render();
    }
}

// function setup() {
//     createCanvas(1920, 1080);
//     frameRate(60);

//     var rd = [];
//     var d = 0;
//     for (var y = 0; y < 960; y += 160) {
//         for (var x = 0; x <= 1920; x += 160) {
//         }
//     }
//     rd = rd.sort((a, b) => {
//         return Math.random() > 0.5;
//     });

//     var q = 0;
//     var id = 5;
//     for (var y = 0; y < 960; y += 120) {
//         for (var x = 0; x <= 1920; x += 120) {
//             var m = new time_modulator(id++, [x, y, 120, 120], [2, 2, 2]);
//             vmodulators.push(m);
//         }
//     }
//     console.log(id);
//     // for (var i = 0; i < 1080; i += 30) {
//     //     var m = new time_modulator(Math.round(i / 30) + 70, [0, i, 1920, 30], [2, 2, 2]);
//     //     m.b = q++;
//     //     vmodulators.push(m);
//     // }
// }

// function draw() {
//     background(0, 40, 70);
//     for (var i = 0; i < vmodulators.length; i++) {
//         vmodulators[i].render();
//     }
// }
