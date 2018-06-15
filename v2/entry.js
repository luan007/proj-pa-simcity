function setup() {
    createCanvas(dw, dh);
    frameRate(60);
    smooth(7);

    window.cv = {
        buildings: createGraphics(dw, dh),
        cars: createGraphics(dw, dh),
        grass: createGraphics(dw, dh),
        background: createGraphics(dw, dh),
        outline: createGraphics(dw, dh),
        glow: createGraphics(dw, dh)
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
    cv.buildings.clear();

    //begin - render pipeline
    updateCars(t);
    updateGrass(t);
    resetChunks(t);
    updateWorld(t);
    updateChunks(t);
    //end   - render pipeline

    //all layers!
    blendMode(ADD);
    image(cv.buildings, 0, 0);
    image(cv.background, 0, 0);
    image(cv.grass, 0, 0);
    image(cv.cars, 0, 0);
}