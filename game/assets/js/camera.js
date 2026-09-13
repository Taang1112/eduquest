/**
 * EDUQUEST - Camera System (Smooth Viewport Tracking & Boundary Clamping)
 */

window.Camera = {
    x: 0,
    y: 0,
    width: 1000,
    height: 600,

    init(viewportWidth, viewportHeight) {
        this.width = viewportWidth;
        this.height = viewportHeight;
    },

    resize(viewportWidth, viewportHeight) {
        this.width = viewportWidth;
        this.height = viewportHeight;
    },

    update(targetX, targetY, mapWidth, mapHeight) {
        // Center camera on target entity (Player)
        let desiredX = targetX - this.width / 2;
        let desiredY = targetY - this.height / 2;

        // Clamp camera coordinates so it never shows area outside the map boundary
        if (desiredX < 0) desiredX = 0;
        if (desiredY < 0) desiredY = 0;

        if (desiredX > mapWidth - this.width) {
            desiredX = Math.max(0, mapWidth - this.width);
        }
        if (desiredY > mapHeight - this.height) {
            desiredY = Math.max(0, mapHeight - this.height);
        }

        // Smooth camera lerp movement
        this.x += (desiredX - this.x) * 0.15;
        this.y += (desiredY - this.y) * 0.15;
    }
};
