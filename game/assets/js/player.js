/**
 * EDUQUEST - Player Entity Controller (Phase 5 Sprite Upgrade)
 */

window.Player = {
    x: 1000,
    y: 450,
    width: 32,
    height: 32,
    speed: 4,
    vx: 0,
    vy: 0,
    facing: 'down',
    isMoving: false,
    animStep: 0,

    // Sprite Asset Management
    spriteSheet: null,
    spriteLoaded: false,
    spriteError: false,
    frameWidth: 32,
    frameHeight: 48,

    init(x, y) {
        this.x = x || 1000;
        this.y = y || 450;

        // Load Player Pixel Art Spritesheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'assets/images/characters/player/sprite.png';
        this.spriteSheet.onload = () => {
            this.spriteLoaded = true;
        };
        this.spriteSheet.onerror = () => {
            console.warn('Player sprite image failed to load. Using fallback vector character.');
            this.spriteError = true;
        };
    },

    handleInput(keys, isInputLocked) {
        this.vx = 0;
        this.vy = 0;

        if (isInputLocked || (window.QuizSystem && QuizSystem.isOpen)) {
            this.isMoving = false;
            return;
        }

        let moveUp = keys['w'] || keys['W'] || keys['ArrowUp'];
        let moveDown = keys['s'] || keys['S'] || keys['ArrowDown'];
        let moveLeft = keys['a'] || keys['A'] || keys['ArrowLeft'];
        let moveRight = keys['d'] || keys['D'] || keys['ArrowRight'];

        if (moveUp) this.vy -= 1;
        if (moveDown) this.vy += 1;
        if (moveLeft) this.vx -= 1;
        if (moveRight) this.vx += 1;

        // Diagonal Speed Normalization
        if (this.vx !== 0 && this.vy !== 0) {
            this.vx *= 0.7071;
            this.vy *= 0.7071;
        }

        this.vx *= this.speed;
        this.vy *= this.speed;

        this.isMoving = (this.vx !== 0 || this.vy !== 0);

        // Update facing direction
        if (moveUp) this.facing = 'up';
        if (moveDown) this.facing = 'down';
        if (moveLeft) this.facing = 'left';
        if (moveRight) this.facing = 'right';
    },

    update(map) {
        if (!this.isMoving) {
            this.animStep = 0;
            return;
        }

        // Update step animation frame
        this.animStep += 0.15;

        // Bounding box for collision check (placed at feet area)
        let playerBox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };

        // Resolve collision against map obstacles and world boundaries
        let resolved = CollisionSystem.resolveMovement(
            playerBox,
            this.vx,
            this.vy,
            map.obstacles,
            map.width,
            map.height
        );

        this.x = resolved.x;
        this.y = resolved.y;
    },

    render(ctx, camera) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        let centerX = this.x + this.width / 2;

        // Shadow under player feet
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height - 2, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Render Sprite if Loaded
        if (this.spriteLoaded && !this.spriteError) {
            ctx.imageSmoothingEnabled = false; // Preserve sharp pixel art

            // Row mapping: 0=down, 1=left, 2=right, 3=up
            let row = 0;
            if (this.facing === 'left') row = 1;
            else if (this.facing === 'right') row = 2;
            else if (this.facing === 'up') row = 3;

            // Column mapping (animation frame)
            let col = 0;
            if (this.isMoving) {
                col = Math.floor(this.animStep) % 4;
            }

            let sx = col * this.frameWidth;
            let sy = row * this.frameHeight;

            // Draw Sprite (offset Y so character feet align with collision box)
            ctx.drawImage(
                this.spriteSheet,
                sx, sy, this.frameWidth, this.frameHeight,
                this.x, this.y - 16, this.frameWidth, this.frameHeight
            );
        } else {
            // Graceful Fallback Vector Character
            let wobbleY = this.isMoving ? Math.sin(this.animStep * 2) * 2 : 0;

            // Body / Shirt (Indigo gradient)
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.roundRect(this.x + 4, this.y + 12 + wobbleY, 24, 18, 6);
            ctx.fill();
            ctx.strokeStyle = '#4338ca';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Head (Skin tone)
            ctx.fillStyle = '#fed7aa';
            ctx.beginPath();
            ctx.arc(centerX, this.y + 10 + wobbleY, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Hair (Dark brown)
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.arc(centerX, this.y + 7 + wobbleY, 11, Math.PI, Math.PI * 2);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#0f172a';
            if (this.facing === 'down') {
                ctx.fillRect(centerX - 4, this.y + 10 + wobbleY, 2.5, 3);
                ctx.fillRect(centerX + 1.5, this.y + 10 + wobbleY, 2.5, 3);
            } else if (this.facing === 'left') {
                ctx.fillRect(centerX - 6, this.y + 10 + wobbleY, 2.5, 3);
            } else if (this.facing === 'right') {
                ctx.fillRect(centerX + 3.5, this.y + 10 + wobbleY, 2.5, 3);
            }
        }

        ctx.restore();
    }
};
