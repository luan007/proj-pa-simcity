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
    console.log(data.names);
    console.log(p);
    view = data.config.view;
});

var tcam = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);
var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// var light = new THREE.DirectionalLight(0xeeffff, 10);
// scene.add(light);

scene.fog = new THREE.Fog(0, 0, 1200)

// scene.add(light2);
tcam.position.z = 350;

var t = 0;

function setup() {
    createCanvas(1920, 1080);
    frameRate(60);
    smooth(1);
    initOverlays();
}

function draw() {
    try {
        t = millis();
        probe_t = (Math.pow((t / 6000) % 1, 2))
        probe = Math.min(1, map(probe_t, 0, 0.3, 0, 1));
        if (!data) return;
        updateWorld(t);
        updateChunks(t);
        updateCars(t);
        updateOverlays(t);
        renderer.render(scene, tcam);
    } catch (e) {
        document.location.reload(true);
    }
}