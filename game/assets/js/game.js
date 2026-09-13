/**
 * EDUQUEST - Main Game Controller & Game Loop (Phase 4 Quiz & World Interactivity Integrated)
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Input Key Tracker
    const keys = {};

    // Base Viewport Resolution
    const DEFAULT_WIDTH = 1000;
    const DEFAULT_HEIGHT = 600;

    canvas.width = DEFAULT_WIDTH;
    canvas.height = DEFAULT_HEIGHT;

    // Initialize Game Engine Subsystems
    SchoolMap.init();
    Camera.init(canvas.width, canvas.height);
    Player.init(1000, 450); // Start in Main Corridor
    NPCSystem.init();
    QuestSystem.init();
    QuizSystem.init();

    // Event Listener for Canvas Mouse Clicks (Dialogue Buttons)
    canvas.addEventListener('click', (e) => {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let clickX = (e.clientX - rect.left) * scaleX;
        let clickY = (e.clientY - rect.top) * scaleY;

        DialogSystem.handleCanvasClick(clickX, clickY);
    });

    // Event Listeners for Keyboard Controls
    window.addEventListener('keydown', (e) => {
        // Prevent scrolling with movement & interaction keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'e', 'E', 'q', 'Q', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        }

        keys[e.key] = true;

        // Toggle Quest Log Panel [Q]
        if (e.key === 'q' || e.key === 'Q') {
            if (!QuizSystem.isOpen) {
                QuestSystem.togglePanel();
            }
        }

        // Interaction Key [E] handling
        if (e.key === 'e' || e.key === 'E') {
            if (QuizSystem.isOpen) return;

            if (DialogSystem.isOpen) {
                DialogSystem.advanceDialog();
            } else if (WorldObjectsSystem.nearObject) {
                WorldObjectsSystem.interact();
            } else if (NPCSystem.nearNpc) {
                DialogSystem.startDialog(NPCSystem.nearNpc);
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Resize canvas dynamically while maintaining aspect ratio
    function handleResize() {
        const container = canvas.parentElement;
        if (!container) return;

        let maxW = container.clientWidth - 20;
        let maxH = window.innerHeight - 130;

        let scale = Math.min(maxW / DEFAULT_WIDTH, maxH / DEFAULT_HEIGHT);
        scale = Math.max(0.6, Math.min(1.2, scale)); // Limit scale bounds

        canvas.style.width = `${Math.floor(DEFAULT_WIDTH * scale)}px`;
        canvas.style.height = `${Math.floor(DEFAULT_HEIGHT * scale)}px`;
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // Main Game Loop
    function gameLoop(timestamp) {
        // 1. Update NPC & Interactive World Object Proximity
        NPCSystem.update(Player);
        WorldObjectsSystem.update(Player);

        // 2. Handle Player Inputs & Collision Updates
        Player.handleInput(keys, DialogSystem.isOpen);
        Player.update(SchoolMap);

        // 3. Realtime Area Detection & Quest Progress Tracking
        QuestSystem.checkAreaDetection(
            Player.x + Player.width / 2,
            Player.y + Player.height / 2
        );

        // 4. Update Camera Viewport Tracking
        Camera.update(
            Player.x + Player.width / 2,
            Player.y + Player.height / 2,
            SchoolMap.width,
            SchoolMap.height
        );

        // 5. Render Layers in Pipeline Order:
        //    a) Map Floor & Boundaries
        //    b) Interactive World Objects
        //    c) NPCs
        //    d) Player
        //    e) Dialogue Overlay
        SchoolMap.render(ctx, Camera);
        WorldObjectsSystem.render(ctx, Camera, DialogSystem.isOpen);
        NPCSystem.render(ctx, Camera, DialogSystem.isOpen);
        Player.render(ctx, Camera);
        DialogSystem.render(ctx, canvas.width, canvas.height);
        SchoolMap.renderUIOverlays(ctx, canvas.width, canvas.height, Player.x + Player.width / 2, Player.y + Player.height / 2);

        // 6. Loop next frame
        requestAnimationFrame(gameLoop);
    }

    // Start Game Loop
    requestAnimationFrame(gameLoop);
});
