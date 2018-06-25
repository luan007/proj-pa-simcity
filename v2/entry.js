window.addEventListener("contextmenu", function (e) { e.preventDefault(); })

function setup() {
    createCanvas(dw, dh);
    frameRate(60);
    smooth(1);
    window.cv = {
        buildings: createGraphics(dw, dh),
        cars: createGraphics(dw, dh),
        grass: createGraphics(dw, dh),
        background: createGraphics(dw, dh),
        outline: createGraphics(dw, dh),
        glow: createGraphics(dw, dh),
        overlay: createGraphics(dw, dh),
        bars: createGraphics(dw, dh - h),
    };
    cv.glow.background(100);
    initVfx();
    initChunks();
    initWorld();
    initTouchless();
    loadWorld();
}


function draw() {
    var t = millis() / 1000;
    blendMode(BLEND);
    clear();

    //begin - render pipeline
    // if (frameCount % 4 < 3) {
    updateLeapHandPos(t);
    updateTouchless();
    updateCars(t);
    updateGrass(t);
    // }
    resetChunks(t);
    updateWorld(t);
    updateChunks(t);
    updateBars(t);

    updateLeap(t);

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
    blendMode(BLEND);
    image(cv.bars, 0, 960);
}