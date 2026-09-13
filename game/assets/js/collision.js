/**
 * EDUQUEST - Collision System (AABB Bounding Box)
 */

window.CollisionSystem = {
    /**
     * Checks if two rectangles intersect.
     */
    rectsIntersect(r1, r2) {
        return (
            r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r1.height > r2.y
        );
    },

    /**
     * Resolves box collision against array of obstacle rectangles.
     * Allows smooth wall sliding by checking X and Y axes independently.
     */
    resolveMovement(box, vx, vy, obstacles, mapWidth, mapHeight) {
        let newX = box.x + vx;
        let newY = box.y + vy;

        // Map Boundary Collision Check for X
        if (newX < 10) newX = 10;
        if (newX + box.width > mapWidth - 10) newX = mapWidth - 10 - box.width;

        // Obstacle Collision Check for X
        let testBoxX = { x: newX, y: box.y, width: box.width, height: box.height };
        for (let obs of obstacles) {
            if (this.rectsIntersect(testBoxX, obs)) {
                if (vx > 0) {
                    newX = obs.x - box.width - 0.1;
                } else if (vx < 0) {
                    newX = obs.x + obs.width + 0.1;
                }
                break;
            }
        }

        // Map Boundary Collision Check for Y
        if (newY < 10) newY = 10;
        if (newY + box.height > mapHeight - 10) newY = mapHeight - 10 - box.height;

        // Obstacle Collision Check for Y
        let testBoxY = { x: newX, y: newY, width: box.width, height: box.height };
        for (let obs of obstacles) {
            if (this.rectsIntersect(testBoxY, obs)) {
                if (vy > 0) {
                    newY = obs.y - box.height - 0.1;
                } else if (vy < 0) {
                    newY = obs.y + obs.height + 0.1;
                }
                break;
            }
        }

        return { x: newX, y: newY };
    }
};
