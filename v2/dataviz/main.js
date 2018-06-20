
function ease(a, b, t) {
    if (a == b || Math.abs(a - b) < 0.001) return b;
    return a + (b - a) * t;
}

function map(a, b, c, d, e) {
    return (b - a) / (c - b) * (e - d) + d;
}


var data = undefined;

socket.on("pack", (p) => {
    data = p;
    console.log(p);
});

var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias:true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// var light = new THREE.DirectionalLight(0xeeffff, 10);
// scene.add(light);

scene.fog = new THREE.Fog(0, 0, 1200)

// scene.add(light2);
camera.position.z = 350;

function init() {

}

var began = Date.now();
var t = 0;
function loop() {

    t = Date.now() - began;
    probe_t = (Math.pow((t / 6000) % 1, 2))
    probe = Math.min(1, map(probe_t, 0, 0.3, 0, 1));
    requestAnimationFrame(loop);
    if (!data) return;
    updateWorld(t);
    updateChunks(t);
    updateCars(t);
    renderer.render(scene, camera);
}

init();
loop();