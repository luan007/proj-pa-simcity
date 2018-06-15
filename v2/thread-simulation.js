

var simulator = cw({
    heatMap: function (data, callback) {

        importScripts('./libraries/pako.js');
        importScripts('./libraries/quicknoise.js');

        var time = data[2];
        var positions = data[1].positions;
        var factors = data[0].allFactors;
        var vars = data[0].worldConfigs;
        var config = data[3];
        var dt = [];

        for (var i = 0; i < factors.length; i++) {
            for (var j = i + 1; j < factors.length; j++) {
                dt[i] = dt[i] || {};
                dt[j] = dt[j] || {};
                var a = factors[i];
                var b = factors[j];
                var ca = vars[i];
                var cb = vars[j];
                var p1 = ca.position;
                var p2 = cb.position;
                var decay1 = ca.distance_decay * 0.5;
                var decay2 = cb.distance_decay * 0.5;
                var totalDecay = (decay1 + decay2);
                var dist = Math.sqrt(
                    (p1[0] - p2[0]) * (p1[0] - p2[0]) +
                    (p1[1] - p2[1]) * (p1[1] - p2[1]));
                var dc = Math.pow(totalDecay, dist / 10);
                //weird sigmoid
                dc = 1 + 1 / (-1 - Math.pow(Math.E, 5 * (1 - dc)));

                var effectiveness = Math.max(0.1, 1 + 1 / (-1 - Math.pow(Math.E, 1 - 0.003 * dist)));

                for (var k in a) {
                    //detect polarization
                    dt[i][k] = dt[i][k] || a[k];
                    if (!b[k]) {
                        continue;
                    }
                    dt[j][k] = dt[j][k] || b[k];

                    //dillute

                    if ((a[k] > 0 && b[k] < 0) || (b[k] > 0 && a[k] < 0)) {
                        //good
                        var dfac = Math.abs(a[k]) + Math.abs(b[k]);
                        var apart = 1 - 0.1 * (Math.abs(a[k]) / dfac) * effectiveness;
                        var bpart = 1 - 0.1 * (Math.abs(b[k]) / dfac) * effectiveness;
                        dt[j][k] *= bpart;
                        dt[i][k] *= apart;
                    }
                }
            }
        }
        // console.log("go");
        if (config.super_dilute) {
            factors = dt;
        }

        // var simplex = new SimplexNoise('seed');
        var aspects = [];
        for (var t = 0; t < positions.length; t++) {
            aspects.push({
                check: 0
            });
        }
        for (var t = 0; t < positions.length; t++) { //all blocks
            for (var i = 0; i < factors.length; i++) { //all world stuff
                var radius = vars[i].radius;
                var p1 = vars[i].position;
                var p2 = positions[t];
                var d = Math.sqrt(
                    (p1[0] - p2[0]) * (p1[0] - p2[0]) +
                    (p1[1] - p2[1]) * (p1[1] - p2[1]));
                if (d > radius) {
                    continue;
                }
                aspects[t].check += 1;
                var nz = (quickNoise.noise(vars[i].noiseOffset[0] + p2[1] / 1000, vars[i].noiseOffset[1] + p2[0] / 1000, time / 1) * 0.2 + 0.5);
                for (var j in factors[i]) {
                    aspects[t][j] = aspects[t][j] || 0;
                    aspects[t][j] += factors[i][j] * nz * Math.pow(vars[i].distance_decay, d / 10);
                    // b.block.aspects[j] += this.factor[j] * b.decay * nz;
                }
            }
            for (var j in aspects[t]) {
                aspects[t][j] = Math.round(aspects[t][j] * 10);
            }
        }

        // cb(LZString.compress(JSON.stringify(aspects)));
        // var binaryString = pako.deflate(JSON.stringify(aspects), { to: 'string' });
        // cb(binaryString);
        callback({
            aspects: aspects,
            world: dt
        });
    }
});

var simulator2 = cw({
    globalSimulation: function (data, callback) {
        data = data[0];
        var dt = [];
        var sum = {};
        /**
         * var condensed = {
                allFactors: [],
                worldConfigs: []
            };
         * 
         */
        for (var i = 0; i < data.allFactors.length; i++) {
            for (var j = i + 1; j < data.allFactors.length; j++) {
                dt[i] = dt[i] || {};
                dt[j] = dt[j] || {};
                var a = data.allFactors[i];
                var b = data.allFactors[j];
                var ca = data.worldConfigs[i];
                var cb = data.worldConfigs[j];
                var p1 = ca.position;
                var p2 = cb.position;
                var decay1 = ca.distance_decay * 0.5;
                var decay2 = cb.distance_decay * 0.5;
                var totalDecay = (decay1 + decay2);
                var dist = Math.sqrt(
                    (p1[0] - p2[0]) * (p1[0] - p2[0]) +
                    (p1[1] - p2[1]) * (p1[1] - p2[1]));
                var dc = Math.pow(totalDecay, dist / 10);
                //weird sigmoid
                // dc = 1 + 1 / (-1 - Math.pow(Math.E, 10 * dc));
                for (var k in a) {
                    //detect polarization
                    dt[i][k] = dt[i][k] || a[k];
                    if (!b[k]) {
                        continue;
                    }
                    dt[j][k] = dt[j][j] || b[k];
                    if ((a[k] > 0 && b[k] < 0) || (b[k] > 0 && a[k] < 0)) {
                        //good
                        dt[i][k] *= (1 - dc);
                    }
                }
            }
        }
        return callback(dt);
    }
});