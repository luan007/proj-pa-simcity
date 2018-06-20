function random(min, max){
    min = min || 0;
    max = max || 1;
    return Math.random() * (max - min) + min;
}

var circle_texture = new THREE.TextureLoader().load("./assets/normal-circle@2x.png");
var circle_stroke_texture = new THREE.TextureLoader().load("./assets/stroke-circle@2x.png");

var grid_texture = new THREE.TextureLoader().load("./assets/grid.png");
var road_texture = new THREE.TextureLoader().load("./assets/maoxi copy.png");
var roadline_texture = new THREE.TextureLoader().load("./assets/ROAD-01.png");
var water_texture = new THREE.TextureLoader().load("./assets/WATER-01.png");

var probe = 0;

grid_texture.wrapS = THREE.RepeatWrapping;
grid_texture.wrapT = THREE.RepeatWrapping;
grid_texture.repeat.set( 1920 / 100, 960 / 100 );