

var simulator = cw({
    heatMap: function (data, cb) {
        importScripts('./libraries/quicknoise.js');
        // var simplex = new SimplexNoise('seed');
        var time = data[2];
        var positions = data[1].positions;
        var factors = data[0].allFactors;
        var vars = data[0].worldConfigs;
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
        }
        cb(aspects);
    }
});

var simulator2 = cw({
    globalSimulation: function (data, cb) {
        var dt = [];
        /**
         * var condensed = {
                allFactors: [],
                worldConfigs: []
            };
         * 
         */

        for (var i = 0; i < data.allFactors.length; i++) {
            for (var j = i + 1; j < data.allFactors.length; j++) {
                dt.push(i + j);
            }
        }
        cb(dt);
    }
});