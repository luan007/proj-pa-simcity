window.addEventListener("contextmenu", function(e) { e.preventDefault(); })

function setup() {
    createCanvas(dw, dh);
    frameRate(60);
    smooth(5);
    window.cv = {
        buildings: createGraphics(dw, dh),
        cars: createGraphics(dw, dh),
        grass: createGraphics(dw, dh),
        background: createGraphics(dw, dh),
        outline: createGraphics(dw, dh),
        glow: createGraphics(dw, dh),
        overlay: createGraphics(dw, dw)
    };

    cv.glow.background(100);
    initVfx();
    initChunks();
    initWorld();
}


function draw() {
    var t = millis() / 1000;
    blendMode(BLEND);
    clear();

    //begin - render pipeline
    // if (frameCount % 4 < 3) {
    updateCars(t);
    updateGrass(t);
    // }
    resetChunks(t);
    updateWorld(t);
    updateChunks(t);
    //end   - render pipeline

    cv.buildings.clear();
    renderWorld(t);

    //all layers!
    blendMode(ADD);
    image(cv.buildings, 0, 0);
    image(cv.background, 0, 0);
    image(cv.grass, 0, 0);
    image(cv.cars, 0, 0);
    image(cv.overlay, 0, 0);
}