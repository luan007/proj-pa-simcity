var simplex = new SimplexNoise('SEED');


var viewContainer = new THREE.Group();


var worldContainer = new THREE.Group();
var chunkContainer = new THREE.Group();

viewContainer.add(worldContainer);
viewContainer.add(chunkContainer);


viewContainer.rotation.x = 0.4;
viewContainer.position.y = 30;

scene.add(viewContainer);


var chunk_road_plane = new THREE.PlaneGeometry(1920, 960);
var chunk_road_mat = new THREE.MeshBasicMaterial({
    map: roadline_texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    color: new THREE.Color(0.4, 0.6, 0.9),
    alphaTest: 0.5
});

var chunk_road_mesh = new THREE.Mesh(chunk_road_plane, chunk_road_mat);
chunkContainer.add(chunk_road_mesh);

chunk_road_mesh.position.z = 10;

var chunk_water_mat = new THREE.MeshBasicMaterial({
    map: water_texture,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(0, 0.5, 1.0),
    alphaTest: 0.01,
    // metalness: 1,
    // roughness: 0.3
});

var chunk_water_mesh = new THREE.Mesh(chunk_road_plane, chunk_water_mat);
chunkContainer.add(chunk_water_mesh);

chunk_water_mesh.position.z = -130;

// var chunk_grids_geo = new THREE.PlaneGeometry(1920, 960);
// var chunk_grids_mat = new THREE.MeshBasicMaterial({
//     map: grid_texture,
//     color: new THREE.Color(1, 0, 0),
//     // opacity: 0.5,
//     // transparent: true,
//     // blending: THREE.AdditiveBlending
// });

// var chunk_grids = new THREE.Mesh(chunk_grids_geo, chunk_grids_mat);
// chunkContainer.add(chunk_grids);
// chunk_grids.position.z = -100;

var chunk_lines_material = new THREE.LineBasicMaterial({
    color: 0x77eeff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
});
var chunk_lines = new THREE.Geometry();
//build those lines
var grid_size = 120;
for (var x = -1920 / 2; x <= 1920 / 2; x += grid_size) {
    var zz = 0;
    for (var z = 0; z < 50; z += 10) {
        zz += z;
        chunk_lines.vertices.push(new THREE.Vector3(x, -960 / 2, -zz));
        chunk_lines.vertices.push(new THREE.Vector3(x, 960 / 2, -zz));
    }
}
for (var y = -960 / 2; y <= 960 / 2; y += grid_size) {
    var zz = 0;
    for (var z = 0; z < 50; z += 10) {
        zz += z;
        chunk_lines.vertices.push(new THREE.Vector3(1920 / 2, y, -zz));
        chunk_lines.vertices.push(new THREE.Vector3(-1920 / 2, y, -zz));
    }
}
var chunk_grids = new THREE.LineSegments(chunk_lines, chunk_lines_material);
chunkContainer.add(chunk_grids);
chunk_grids.position.z = -50;



var chunkVerts = new THREE.Geometry();
var chunkVerts2 = new THREE.Geometry();
for (var i = 0; i < 2048; i++) {
    chunkVerts.vertices.push(new THREE.Vector3(0, 0, 0));
    chunkVerts.colors.push(new THREE.Color(1, 1, 1));
    chunkVerts2.vertices.push(new THREE.Vector3(0, 0, 0));
    chunkVerts2.colors.push(new THREE.Color(1, 1, 1));
}

var chunkMat = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    // blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    size: 13,
    depthTest: false,
    opacity: 0.1,
    map: circle_texture
});

var chunkMat_core = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    size: 4,
    depthTest: false,
    opacity: 1,
    map: circle_texture
});

var chunkPS = new THREE.Points(chunkVerts, chunkMat);
var chunkPS2 = new THREE.Points(chunkVerts2, chunkMat_core);
chunkContainer.add(chunkPS);
chunkContainer.add(chunkPS2);

var gs = 0.15;

chunkContainer.scale.x = gs;
chunkContainer.scale.y = gs;
chunkContainer.scale.z = gs;
chunkContainer.position.y = -50;

chunkContainer.rotation.x = -Math.PI / 2;

var world = [];
var chunks = [];




class Entity {
    constructor() {

    }
    update() {

    }
}

var chunkGeom = new THREE.BoxGeometry(5, 5, 5);
var chunkMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0.15,
    transparent: true,
    blending: THREE.AdditiveBlending
});




var view = "j";

var chunk_index = 0;
class Chunk {
    constructor() {
        this.group = new THREE.Group();
        // this.geo = chunkGeom;
        // this.mat = chunkMat.clone();
        // this.mat.color = new THREE.Color(0.2, 0.4, 1);
        // this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.index = chunk_index++;
        this.geo2 = chunkGeom;
        this.mat2 = chunkMat;
        this.mesh2 = new THREE.Mesh(this.geo2, this.mat2);
        // this.group.add(this.mesh);
        // this.group.add(this.mesh2);
        this.mesh2.scale.x = this.mesh2.scale.y = 3;
        chunkContainer.add(this.group);
        this.val = 0;
        this.val2 = 0;
    }
    update(t) {
        this.group.position.x = (this.position[0] - 1920 / 2);
        this.group.position.y = (this.position[1] - 960 / 2);
        chunkVerts.vertices[this.index].x = this.group.position.x;
        chunkVerts.vertices[this.index].y = this.group.position.y;
        chunkVerts2.vertices[this.index].x = this.group.position.x;
        chunkVerts2.vertices[this.index].y = this.group.position.y;
        var target = this.aspects[view] + simplex.noise3D(
            this.group.position.y / 100,
            this.group.position.x / 100,
            t / 3000
        ) * 2;
        var prevVal = this.val;
        this.val = ease(this.val, target, 0.1);
        this.val2 = ease(this.val2, target, 0.04);
        chunkVerts.vertices[this.index].z = Math.abs(this.val * 10);
        chunkVerts2.vertices[this.index].z = Math.abs(this.val2 * 10);
        // this.mesh.position.z = Math.abs(this.val * 10);
        // this.mesh.scale.x = this.mesh.scale.z = this.mesh.scale.y = Math.abs(this.val / 20) + 1;
        // this.mat.opacity = Math.abs(this.val / 20) + 0.3;
        // if (this.val < 0 && prevVal >= 0) {
        //     chunkVerts.colors[this.index] = new THREE.Color(1, 0.4, 0);
        // } else if (this.val > 0 && prevVal <= 0) {
        //     chunkVerts.colors[this.index] = new THREE.Color(0.2, 0.4, 1);
        // }
        chunkVerts.colors[this.index] = new THREE.Color(0.1 - this.val, 0.8 + this.val / 5, 1 + this.val);
        chunkVerts2.colors[this.index].setHSL(
            0.5 + this.val2 / 50, 0.3, Math.abs(this.val2) / 30 + 0.1
        );

        this.mesh2.position.z = 0;
    }
}

//world
{
    function updateWorld(t) {
        //loaded stuff - lets add stuff
        if (world.length < data.condensed.worldConfigs.length) {
            console.log("Building World..");
            for (var i = world.length; i < data.condensed.worldConfigs.length; i++) {
                var e = new Entity();
                world[i] = e;
            }
            console.log("World Updated.");
        }
        for (var i = 0; i < world.length; i++) {
            world[i].variables = data.condensed.worldConfigs[i];
            world[i].factors = data.condensed.allFactors[i];
            world[i].computed = data.computed.world[i];

            world[i].update(t);
        }
    }

    function updateChunks(t) {
        chunkContainer.rotation.z += 0.001;
        //loaded stuff - lets add stuff
        if (chunks.length < data.chunks.positions.length) {
            console.log("Building Chunks..");
            for (var i = chunks.length; i < data.chunks.positions.length; i++) {
                var c = new Chunk();
                chunks[i] = c;
            }
            console.log("Chunks Updated.");
        }
        for (var i = 0; i < chunks.length; i++) {
            chunks[i].aspects = data.computed.aspects[i];
            chunks[i].position = data.chunks.positions[i];
            chunks[i].update(t);
        }

        chunkVerts.verticesNeedUpdate = true;
        chunkVerts.colorsNeedUpdate = true;
        chunkVerts2.verticesNeedUpdate = true;
        chunkVerts2.colorsNeedUpdate = true;
    }
}



//cars
{
    var carsContainer = new THREE.Group();
    chunkContainer.add(carsContainer);
    var cars = [];

    var cars_geoms = [];
    var TAIL_LEN = 5;
    function allocateCar() {
        var o = undefined;
        if (cars_geoms.length > 0) {
            var o = cars_geoms.pop();
        } else {
            var geo = new THREE.Geometry();
            var mat = new THREE.LineBasicMaterial({
                // color: new THREE.Color(1, 1, 1),
                blending: THREE.AdditiveBlending,
                vertexColors: true
            });
            for (var i = 0; i < TAIL_LEN; i++) {
                geo.vertices.push(new THREE.Vector3(0, 0, 0));
                var c = 1 - i / TAIL_LEN;
                geo.colors.push(new THREE.Color(c, c, c));
            }
            var lines = new THREE.Line(geo, mat);
            o = {
                geo: geo,
                mat: mat,
                mesh: lines,
                z: Math.random() * 300 + 10
            };
            carsContainer.add(lines);
        }
        // o.geo.vertices = [];
        o.mesh.visible = true;
        o.z = o.ztarget = Math.random() * 300 + 10
        o.init = true;
        return o;
    }

    function releaseCar(o) {
        o.mesh.visible = false;
        cars_geoms.push(o);
    }

    function updateCars() {
        if (random(0, 1) > 0.95) {
            //new car
            var elems = document.querySelectorAll("#roads_main > *");
            var e = elems[Math.floor(random(0, elems.length))];
            var done = false;
            for (var i = 0; i < cars.length; i++) {
                if (cars[i] == null) {
                    cars[i] = ({
                        elem: e,
                        speed: random(1, 2) / 500.0,
                        pos: 0,
                        obj: allocateCar()
                    });

                    done = true;
                    break;
                }
            }
            if (!done) {

                cars.push({
                    elem: e,
                    speed: random(1, 2) / 1000.0,
                    pos: 0,
                    obj: allocateCar()
                });
            }
        }
        for (var i = 0; i < cars.length; i++) {
            if (cars[i] && cars[i].pos < 1.3) {
                if(Math.random() < 0.001) {
                    cars[i].obj.ztarget = Math.random() * 300 + 10;
                }
                cars[i].obj.z = ease(cars[i].obj.z, cars[i].obj.ztarget, 0.01);
                cars[i].pos += cars[i].speed;
                var pth = cars[i].elem;
                var len = pth.getTotalLength();
                var cur = len * Math.min(1, cars[i].pos);
                var point = pth.getPointAtLength(cur);
                var point2 = pth.getPointAtLength(cur - 0.01);

                var y = point.y - point2.y;
                var x = point.x - point2.x;
                var q = Math.atan2(y, x);
                // noStroke();
                cars[i].obj.geo.verticesNeedUpdate = true;
                cars[i].obj.geo.colorsNeedUpdate = true;


                for (var q = TAIL_LEN - 1; q > 0; q--) {
                    cars[i].obj.geo.vertices[q].x = ease(cars[i].obj.geo.vertices[q].x, cars[i].obj.geo.vertices[q - 1].x, 0.1);
                    cars[i].obj.geo.vertices[q].y = ease(cars[i].obj.geo.vertices[q].y, cars[i].obj.geo.vertices[q - 1].y, 0.1);
                    cars[i].obj.geo.vertices[q].z = ease(cars[i].obj.geo.vertices[q].z, cars[i].obj.geo.vertices[q - 1].z, 0.1);
                }

                cars[i].obj.geo.vertices[0].x = (point.x / 2 - 1920 / 2); //(new THREE.Vector3(point.x / 5 - 1920 / 2, point.y / 5 - 1080 / 2, 0));
                cars[i].obj.geo.vertices[0].y = -(point.y / 2 - 960 / 2); //(new THREE.Vector3(point.x / 5 - 1920 / 2, point.y / 5 - 1080 / 2, 0));
                cars[i].obj.geo.vertices[0].z = cars[i].obj.z;
                if (cars[i].obj.init) {
                    cars[i].obj.init = false;
                    for (var q = TAIL_LEN - 1; q > 0; q--) {
                        cars[i].obj.geo.vertices[q].x = cars[i].obj.geo.vertices[0].x;
                        cars[i].obj.geo.vertices[q].y = cars[i].obj.geo.vertices[0].y;
                        cars[i].obj.geo.vertices[q].z = cars[i].obj.geo.vertices[0].z;
                    }
                }

                // carCanvas.translate(point.x / 2, point.y / 2);

                // ellipse(0, 0, 5, 5);
                // fill(255, (sin(millis() / 100) * 0.5 + 0.5) * 255);
                // noStroke();
                // ellipse(0, 0, 5, 5);
            }
            else if (cars[i]) {
                releaseCar(cars[i].obj);
                console.log("release");
                cars[i] = null;
            }
        }
    }
    // global.cars = cars;
}
