var simplex = new SimplexNoise('SEED');

var worldContainer = new THREE.Group();
var chunkContainer = new THREE.Group();



// var chunk_grids = new THREE.BoxGeometry(5, 5, 5);
// var chunkMat = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     opacity: 0.1,
//     transparent: true,
//     blending: THREE.AdditiveBlending
// });




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
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    size: 10,
    depthTest: false,
    opacity: 0.1,
    map: circle_texture
});

var chunkMat_core = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    size: 3,
    depthTest: false,
    opacity: 0.5,
    map: circle_texture
});

var chunkPS = new THREE.Points(chunkVerts, chunkMat);
var chunkPS2 = new THREE.Points(chunkVerts2, chunkMat_core);
chunkContainer.add(chunkPS);
chunkContainer.add(chunkPS2);

var gs = 0.15;
scene.add(worldContainer);
scene.add(chunkContainer);

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
    opacity: 0.1,
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
        this.group.add(this.mesh2);
        this.mesh2.scale.x = this.mesh2.scale.y = 3;
        chunkContainer.add(this.group);
        this.val = 0;
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
        this.val = ease(this.val, target, 0.04);
        chunkVerts.vertices[this.index].z = Math.abs(this.val * 10);
        chunkVerts2.vertices[this.index].z = Math.abs(this.val * 10);
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
            0.5 + this.val / 50, 0.3, Math.abs(this.val) / 30 + 0.1
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