/**
 * EDUQUEST - Map Engine & Enhanced 2D School Environment (Phase 6 Expansion)
 */

window.SchoolMap = {
    width: 2000,
    height: 1400,

    // Array of solid bounding box obstacles { x, y, width, height, name, type }
    obstacles: [],

    // Current zone tracking for area title notifications
    currentZone: '',
    zoneTitleText: '',
    zoneTitleTimer: 0,
    discoveredZones: new Set(),

    init() {
        this.buildObstacles();
    },

    buildObstacles() {
        this.obstacles = [];

        // Outer Map Perimeter Boundaries
        this.obstacles.push({ x: 0, y: 0, width: 2000, height: 20, name: 'Top Perimeter' });
        this.obstacles.push({ x: 0, y: 1380, width: 2000, height: 20, name: 'Bottom Perimeter' });
        this.obstacles.push({ x: 0, y: 0, width: 20, height: 1400, name: 'Left Perimeter' });
        this.obstacles.push({ x: 1980, y: 0, width: 20, height: 1400, name: 'Right Perimeter' });

        // Courtyard Fence Wall (separating Courtyard & Corridor, with main entrance gap 850-1150)
        this.obstacles.push({ x: 20, y: 350, width: 830, height: 15, name: 'Fence Left' });
        this.obstacles.push({ x: 1150, y: 350, width: 830, height: 15, name: 'Fence Right' });

        // Wall between Corridor and Middle Rooms (Class 1, Ruang Guru, Library)
        // Doorway 1: Class 1 Door gap (300 to 420)
        // Doorway 2: Ruang Guru Door gap (920 to 1040)
        // Doorway 3: Library Door gap (1540 to 1660)
        this.obstacles.push({ x: 20, y: 600, width: 280, height: 20, name: 'Class 1 Left Wall' });
        this.obstacles.push({ x: 420, y: 600, width: 500, height: 20, name: 'Class 1-Guru Dividing Wall' });
        this.obstacles.push({ x: 1040, y: 600, width: 500, height: 20, name: 'Guru-Lib Dividing Wall' });
        this.obstacles.push({ x: 1660, y: 600, width: 320, height: 20, name: 'Lib Right Wall' });

        // Internal vertical dividing walls for Class 1, Ruang Guru, and Library
        this.obstacles.push({ x: 650, y: 620, width: 20, height: 360, name: 'Class 1-Guru Vertical Wall' });
        this.obstacles.push({ x: 1310, y: 620, width: 20, height: 360, name: 'Guru-Lib Vertical Wall' });

        // Wall between Middle Rooms and Lower Rooms (Computer Lab, Cafeteria, UKS)
        // Doorway 4: Lab Door gap (420 to 540)
        // Doorway 5: Cafeteria Door gap (1150 to 1270)
        // Doorway 6: UKS Door gap (1620 to 1740)
        this.obstacles.push({ x: 20, y: 980, width: 400, height: 20, name: 'Lab Top Left Wall' });
        this.obstacles.push({ x: 540, y: 980, width: 610, height: 20, name: 'Lab-Cafe Top Wall' });
        this.obstacles.push({ x: 1270, y: 980, width: 350, height: 20, name: 'Cafe-UKS Top Wall' });
        this.obstacles.push({ x: 1740, y: 980, width: 240, height: 20, name: 'UKS Top Right Wall' });

        // Vertical dividing walls for Lower Rooms (Lab | Kantin | UKS)
        this.obstacles.push({ x: 930, y: 1000, width: 20, height: 380, name: 'Lab-Cafe Vertical Wall' });
        this.obstacles.push({ x: 1450, y: 1000, width: 20, height: 380, name: 'Cafe-UKS Vertical Wall' });

        // --------------------------------------------------
        // Courtyard, Aula & Lapangan Objects
        // --------------------------------------------------
        this.obstacles.push({ x: 990, y: 140, width: 20, height: 20, type: 'flagpole' });
        this.obstacles.push({ x: 80, y: 60, width: 40, height: 40, type: 'tree' });
        this.obstacles.push({ x: 1780, y: 60, width: 40, height: 40, type: 'tree' });
        this.obstacles.push({ x: 1820, y: 180, width: 40, height: 40, type: 'tree' });
        this.obstacles.push({ x: 450, y: 220, width: 100, height: 35, type: 'bench' });
        this.obstacles.push({ x: 1450, y: 220, width: 100, height: 35, type: 'bench' });
        this.obstacles.push({ x: 200, y: 310, width: 20, height: 20, type: 'trash' });
        this.obstacles.push({ x: 1780, y: 310, width: 20, height: 20, type: 'trash' });

        // Aula Stage & Seating (x: 50..400)
        this.obstacles.push({ x: 60, y: 50, width: 320, height: 45, type: 'stage' });
        this.obstacles.push({ x: 100, y: 140, width: 100, height: 35, type: 'bench' });
        this.obstacles.push({ x: 240, y: 140, width: 100, height: 35, type: 'bench' });

        // Sports Field Hoops (x: 1250..1750)
        this.obstacles.push({ x: 1250, y: 150, width: 15, height: 60, type: 'hoop' });
        this.obstacles.push({ x: 1720, y: 150, width: 15, height: 60, type: 'hoop' });

        // Secret Alumni Area (x: 1850..1970, y: 40..240)
        this.obstacles.push({ x: 1910, y: 60, width: 40, height: 25, type: 'bench' });
        this.obstacles.push({ x: 1870, y: 140, width: 20, height: 20, type: 'plant' });

        // --------------------------------------------------
        // Class 1 Furniture
        // --------------------------------------------------
        this.obstacles.push({ x: 60, y: 640, width: 180, height: 15, type: 'blackboard' });
        this.obstacles.push({ x: 100, y: 675, width: 100, height: 40, type: 'teacher_desk' });
        this.obstacles.push({ x: 100, y: 770, width: 80, height: 45, type: 'desk' });
        this.obstacles.push({ x: 260, y: 770, width: 80, height: 45, type: 'desk' });
        this.obstacles.push({ x: 420, y: 770, width: 80, height: 45, type: 'desk' });
        this.obstacles.push({ x: 100, y: 865, width: 80, height: 45, type: 'desk' });
        this.obstacles.push({ x: 260, y: 865, width: 80, height: 45, type: 'desk' });
        this.obstacles.push({ x: 420, y: 865, width: 80, height: 45, type: 'desk' });
        this.obstacles.push({ x: 30, y: 935, width: 20, height: 20, type: 'trash' });

        // --------------------------------------------------
        // Ruang Guru Furniture
        // --------------------------------------------------
        this.obstacles.push({ x: 700, y: 640, width: 180, height: 15, type: 'whiteboard' });
        this.obstacles.push({ x: 720, y: 680, width: 110, height: 45, type: 'teacher_office_desk' });
        this.obstacles.push({ x: 880, y: 680, width: 110, height: 45, type: 'teacher_office_desk' });
        this.obstacles.push({ x: 1040, y: 680, width: 110, height: 45, type: 'teacher_office_desk' });
        this.obstacles.push({ x: 720, y: 800, width: 110, height: 45, type: 'teacher_office_desk' });
        this.obstacles.push({ x: 880, y: 800, width: 110, height: 45, type: 'teacher_office_desk' });
        this.obstacles.push({ x: 1040, y: 800, width: 110, height: 45, type: 'teacher_office_desk' });
        this.obstacles.push({ x: 1230, y: 650, width: 40, height: 180, type: 'trophy_case' });
        this.obstacles.push({ x: 670, y: 935, width: 20, height: 20, type: 'trash' });

        // --------------------------------------------------
        // Library Bookshelves & Reading Tables
        // --------------------------------------------------
        this.obstacles.push({ x: 1350, y: 650, width: 30, height: 280, type: 'bookshelf' });
        this.obstacles.push({ x: 1930, y: 650, width: 30, height: 280, type: 'bookshelf' });
        this.obstacles.push({ x: 1540, y: 690, width: 220, height: 50, type: 'reading_table' });
        this.obstacles.push({ x: 1540, y: 830, width: 220, height: 50, type: 'reading_table' });
        this.obstacles.push({ x: 1800, y: 650, width: 80, height: 40, type: 'librarian_desk' });
        this.obstacles.push({ x: 1335, y: 935, width: 20, height: 20, type: 'plant' });

        // --------------------------------------------------
        // Computer Lab Desks & Server Rack
        // --------------------------------------------------
        this.obstacles.push({ x: 80, y: 1050, width: 780, height: 45, type: 'pc_row' });
        this.obstacles.push({ x: 80, y: 1200, width: 780, height: 45, type: 'pc_row' });
        this.obstacles.push({ x: 870, y: 1040, width: 45, height: 120, type: 'server_rack' });
        this.obstacles.push({ x: 30, y: 1335, width: 20, height: 20, type: 'trash' });

        // --------------------------------------------------
        // Cafeteria Counter & Dining Tables
        // --------------------------------------------------
        this.obstacles.push({ x: 990, y: 1040, width: 440, height: 35, type: 'counter' });
        this.obstacles.push({ x: 1000, y: 1150, width: 160, height: 60, type: 'dining_table' });
        this.obstacles.push({ x: 1230, y: 1150, width: 160, height: 60, type: 'dining_table' });
        this.obstacles.push({ x: 960, y: 1335, width: 20, height: 20, type: 'trash' });

        // --------------------------------------------------
        // UKS Clinic Furniture
        // --------------------------------------------------
        this.obstacles.push({ x: 1490, y: 1040, width: 120, height: 40, type: 'doctor_desk' });
        this.obstacles.push({ x: 1490, y: 1150, width: 80, height: 140, type: 'medical_bed' });
        this.obstacles.push({ x: 1620, y: 1150, width: 80, height: 140, type: 'medical_bed' });
        this.obstacles.push({ x: 1750, y: 1150, width: 80, height: 140, type: 'medical_bed' });
        this.obstacles.push({ x: 1900, y: 1040, width: 50, height: 90, type: 'first_aid_cabinet' });
        this.obstacles.push({ x: 1475, y: 1335, width: 20, height: 20, type: 'trash' });
    },

    updateZoneNotification(playerX, playerY) {
        let detected = '';
        if (playerY < 350) {
            if (playerX > 1830 && playerY < 250) detected = '🕵️ TAMAN RAHASIA ALUMNI';
            else if (playerX < 800) detected = '🎭 AULA SEKOLAH';
            else if (playerX > 1180) detected = '⚽ LAPANGAN OLAHRAGA';
            else detected = '🌳 HALAMAN SEKOLAH';
        } else if (playerY < 600) {
            detected = '🏫 KORIDOR UTAMA';
        } else if (playerY < 980) {
            if (playerX < 650) detected = '📚 RUANG KELAS 1';
            else if (playerX < 1310) detected = '💼 RUANG GURU';
            else detected = '📖 PERPUSTAKAAN';
        } else {
            if (playerX < 930) detected = '💻 LAB KOMPUTER';
            else if (playerX < 1450) detected = '🍔 KANTIN SEKOLAH';
            else detected = '🏥 RUANG UKS';
        }

        if (detected !== this.currentZone) {
            this.currentZone = detected;
            this.zoneTitleText = detected;
            this.zoneTitleTimer = 180; // Display for ~3 seconds

            // Dispatch exploration area discovery toast if new
            if (!this.discoveredZones.has(detected)) {
                this.discoveredZones.add(detected);
                if (window.showToastNotification) {
                    window.showToastNotification(`📍 Area Ditemukan: ${detected}`, 'success');
                }
            }
        } else if (this.zoneTitleTimer > 0) {
            this.zoneTitleTimer--;
        }
    },

    render(ctx, camera) {
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, camera.width, camera.height);

        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        // --------------------------------------------------
        // 1. Layered Floor Backgrounds & Textures
        // --------------------------------------------------
        // Courtyard Grass
        ctx.fillStyle = '#1b2d23';
        ctx.fillRect(0, 0, 2000, 350);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
        ctx.fillRect(0, 0, 2000, 350);

        // Aula Hardwood Floor (x: 20..830)
        ctx.fillStyle = '#2d1f15';
        ctx.fillRect(20, 20, 810, 330);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.1)';
        for (let py = 20; py < 350; py += 25) {
            ctx.beginPath(); ctx.moveTo(20, py); ctx.lineTo(830, py); ctx.stroke();
        }

        // Sports Court Marking Floor (x: 1170..1830)
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(1170, 20, 660, 330);
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
        ctx.strokeRect(1190, 40, 620, 290);
        ctx.beginPath(); ctx.arc(1500, 185, 45, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1500, 40); ctx.lineTo(1500, 330); ctx.stroke();

        // Secret Alumni Garden Floor (x: 1840..1980, y: 20..250)
        ctx.fillStyle = '#14532d';
        ctx.fillRect(1840, 20, 140, 250);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(1870, 40, 80, 180); // Stone cobblestone secret path

        // Cobblestone Entrance Path
        ctx.fillStyle = '#334155';
        ctx.fillRect(850, 0, 300, 350);
        ctx.fillStyle = '#475569';
        ctx.fillRect(860, 0, 280, 350);

        // Main Corridor Grid Floor
        ctx.fillStyle = '#1f293d';
        ctx.fillRect(0, 350, 2000, 250);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 2000; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 350); ctx.lineTo(x, 600); ctx.stroke();
        }

        // Classroom 1 Wood Floor
        ctx.fillStyle = '#27272a';
        ctx.fillRect(20, 600, 630, 380);

        // Ruang Guru Teak Floor Accent
        ctx.fillStyle = '#3f2e1e';
        ctx.fillRect(670, 600, 640, 380);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.06)';
        for (let py = 600; py < 980; py += 30) {
            ctx.beginPath(); ctx.moveTo(670, py); ctx.lineTo(1310, py); ctx.stroke();
        }

        // Library Carpet Floor
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(1330, 600, 650, 380);

        // Computer Lab Grid Tech Floor
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(20, 1000, 910, 380);

        // Cafeteria Tile Floor
        ctx.fillStyle = '#374151';
        ctx.fillRect(950, 1000, 500, 380);

        // UKS Clinic Clean Medical Floor
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(1470, 1000, 510, 380);

        // --------------------------------------------------
        // 2. Door Openings
        // --------------------------------------------------
        // Door 1: Class 1 (300-420)
        ctx.fillStyle = '#10b981'; ctx.fillRect(300, 592, 120, 12);
        // Door 2: Ruang Guru (920-1040)
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(920, 592, 120, 12);
        // Door 3: Library (1540-1660)
        ctx.fillStyle = '#8b5cf6'; ctx.fillRect(1540, 592, 120, 12);
        // Door 4: Lab (420-540)
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(420, 972, 120, 12);
        // Door 5: Kantin (1150-1270)
        ctx.fillStyle = '#ec4899'; ctx.fillRect(1150, 972, 120, 12);
        // Door 6: UKS (1620-1740)
        ctx.fillStyle = '#22c55e'; ctx.fillRect(1620, 972, 120, 12);

        // --------------------------------------------------
        // 3. Zone Floor Labels & Overhead Signboards
        // --------------------------------------------------
        ctx.font = '700 20px Outfit, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.textAlign = 'center';

        ctx.fillText('🏫 EDUQUEST VOCATIONAL HIGH SCHOOL', 1000, 55);
        ctx.fillText('🎭 AULA SEKOLAH', 425, 90);
        ctx.fillText('⚽ LAPANGAN OLAHRAGA', 1500, 90);
        ctx.fillText('🕵️ TAMAN RAHASIA ALUMNI', 1910, 35);
        ctx.fillText('🏫 KORIDOR UTAMA', 1000, 475);
        ctx.fillText('📚 RUANG KELAS 1', 335, 635);
        ctx.fillText('💼 RUANG GURU', 990, 635);
        ctx.fillText('📖 PERPUSTAKAAN', 1655, 635);
        ctx.fillText('💻 LAB KOMPUTER', 475, 1035);
        ctx.fillText('🍔 KANTIN SEKOLAH', 1200, 1035);
        ctx.fillText('🏥 RUANG UKS', 1720, 1035);

        // Overhead Door Signboard Badges
        this.renderDoorBadge(ctx, 360, 575, '🚪 KELAS 1', '#10b981');
        this.renderDoorBadge(ctx, 980, 575, '💼 RUANG GURU', '#f59e0b');
        this.renderDoorBadge(ctx, 1600, 575, '📖 PERPUSTAKAAN', '#8b5cf6');
        this.renderDoorBadge(ctx, 480, 955, '💻 LAB KOMPUTER', '#38bdf8');
        this.renderDoorBadge(ctx, 1210, 955, '🍔 KANTIN SEKOLAH', '#ec4899');
        this.renderDoorBadge(ctx, 1680, 955, '🏥 RUANG UKS', '#22c55e');

        // Wall Clocks
        this.renderClock(ctx, 150, 610);
        this.renderClock(ctx, 800, 610);
        this.renderClock(ctx, 1500, 1010);

        // Corridor Notice Board
        ctx.fillStyle = '#78350f';
        ctx.fillRect(1160, 365, 140, 35);
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(1165, 370, 130, 25);
        ctx.font = '700 9px sans-serif';
        ctx.fillStyle = '#92400e';
        ctx.fillText('📌 PAPAN PENGUMUMAN', 1230, 385);

        // --------------------------------------------------
        // 4. Render Obstacles & Detailed Furniture
        // --------------------------------------------------
        for (let obs of this.obstacles) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(obs.x + 3, obs.y + 3, obs.width, obs.height);

            if (obs.type === 'stage') {
                ctx.fillStyle = '#b45309';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#ffffff';
                ctx.font = '700 12px sans-serif';
                ctx.fillText('🎭 PANGGUNG UTAMA AULA', obs.x + obs.width / 2, obs.y + 26);
            } else if (obs.type === 'teacher_office_desk') {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#92400e';
                ctx.fillRect(obs.x + 3, obs.y + 3, obs.width - 6, obs.height - 6);
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(obs.x + 15, obs.y + 10, 24, 16); // PC Monitor
            } else if (obs.type === 'trophy_case') {
                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#fef3c7';
                ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);
                ctx.font = '12px sans-serif';
                ctx.fillText('🏆', obs.x + 12, obs.y + 40);
                ctx.fillText('🥇', obs.x + 12, obs.y + 100);
            } else if (obs.type === 'medical_bed') {
                ctx.fillStyle = '#e2e8f0';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#94a3b8';
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(obs.x + 10, obs.y + 10, 60, 25); // Pillow
                ctx.fillStyle = '#ef4444';
                ctx.font = '14px sans-serif';
                ctx.fillText('🏥', obs.x + 30, obs.y + 80); // Red cross
            } else if (obs.type === 'first_aid_cabinet') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(obs.x + 20, obs.y + 15, 10, 30);
                ctx.fillRect(obs.x + 10, obs.y + 25, 30, 10);
            } else if (obs.type === 'doctor_desk') {
                ctx.fillStyle = '#0f766e';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'hoop') {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'whiteboard' || obs.type === 'blackboard') {
                ctx.fillStyle = obs.type === 'blackboard' ? '#064e3b' : '#f8fafc';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.strokeStyle = '#64748b';
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'teacher_desk' || obs.type === 'desk') {
                ctx.fillStyle = '#92400e';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'bookshelf') {
                ctx.fillStyle = '#451a03';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'reading_table') {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'pc_row') {
                // Computer Lab Desk Surface
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.strokeStyle = '#334155';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

                // Render 6 PC Workstations per Desk Row
                let pcCount = 6;
                let spacing = obs.width / pcCount;

                for (let i = 0; i < pcCount; i++) {
                    let pcX = obs.x + (i + 0.5) * spacing;
                    let pcY = obs.y + 14;

                    // Workstation Slot Divider Line
                    if (i > 0) {
                        ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
                        ctx.beginPath();
                        ctx.moveTo(obs.x + i * spacing, obs.y);
                        ctx.lineTo(obs.x + i * spacing, obs.y + obs.height);
                        ctx.stroke();
                    }

                    // CPU Tower (Under/Beside Desk)
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(pcX - 28, obs.y + 6, 9, 24);
                    ctx.fillStyle = '#38bdf8';
                    ctx.fillRect(pcX - 25, obs.y + 10, 3, 3); // Power Button
                    ctx.fillStyle = '#475569';
                    ctx.fillRect(pcX - 26, obs.y + 16, 5, 2); // Disc Drive Slot

                    // Monitor Base & Stand
                    ctx.fillStyle = '#64748b';
                    ctx.fillRect(pcX - 8, pcY + 10, 16, 3);
                    ctx.fillRect(pcX - 2, pcY + 6, 4, 5);

                    // Monitor Outer Frame
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(pcX - 16, pcY - 9, 32, 17);
                    ctx.strokeStyle = '#475569';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(pcX - 16, pcY - 9, 32, 17);

                    // Glowing Monitor Screen (Active IDE / Tech Display)
                    ctx.fillStyle = '#0284c7';
                    ctx.fillRect(pcX - 14, pcY - 7, 28, 13);

                    // Screen UI lines (Simulated Code / Data)
                    ctx.fillStyle = '#38bdf8';
                    ctx.fillRect(pcX - 11, pcY - 5, 14, 2);
                    ctx.fillStyle = '#7dd3fc';
                    ctx.fillRect(pcX - 11, pcY - 1, 18, 2);
                    ctx.fillStyle = '#4ade80';
                    ctx.fillRect(pcX - 11, pcY + 3, 10, 2);

                    // Monitor Power LED
                    ctx.fillStyle = '#22c55e';
                    ctx.fillRect(pcX + 11, pcY + 6, 2, 2);

                    // Keyboard
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(pcX - 13, pcY + 16, 22, 6);
                    ctx.fillStyle = '#94a3b8';
                    ctx.fillRect(pcX - 11, pcY + 17, 18, 4);

                    // Mouse
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillRect(pcX + 12, pcY + 16, 5, 6);

                    // Computer Stool / Chair Behind Desk
                    let stoolY = (obs.y < 1100) ? obs.y + obs.height + 10 : obs.y - 10;
                    ctx.fillStyle = '#1e3a8a';
                    ctx.beginPath();
                    ctx.arc(pcX, stoolY, 7, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            } else if (obs.type === 'server_rack') {
                // Main Server Cabinet Frame
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

                // Draw Server Blade Units & LED Activity Lights
                for (let sy = obs.y + 6; sy < obs.y + obs.height - 10; sy += 24) {
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(obs.x + 4, sy, obs.width - 8, 18);
                    ctx.strokeStyle = '#334155';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(obs.x + 4, sy, obs.width - 8, 18);

                    // Ventilation grills
                    ctx.fillStyle = '#475569';
                    ctx.fillRect(obs.x + 8, sy + 4, 16, 10);

                    // Blinking Server Status LEDs
                    ctx.fillStyle = '#22c55e'; ctx.fillRect(obs.x + 28, sy + 5, 3, 3);
                    ctx.fillStyle = '#38bdf8'; ctx.fillRect(obs.x + 33, sy + 5, 3, 3);
                    ctx.fillStyle = '#f59e0b'; ctx.fillRect(obs.x + 28, sy + 10, 3, 3);
                }

                ctx.font = '700 8px Outfit, sans-serif';
                ctx.fillStyle = '#38bdf8';
                ctx.textAlign = 'center';
                ctx.fillText('SERVER', obs.x + obs.width / 2, obs.y + obs.height - 4);
            } else if (obs.type === 'tree') {
                let centerX = obs.x + obs.width / 2;
                let centerY = obs.y + obs.height / 2;
                ctx.fillStyle = '#15803d';
                ctx.beginPath(); ctx.arc(centerX, centerY, 24, 0, Math.PI * 2); ctx.fill();
            } else if (obs.type === 'bench') {
                ctx.fillStyle = '#b45309';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else if (obs.type === 'trash') {
                ctx.fillStyle = '#64748b';
                ctx.beginPath(); ctx.arc(obs.x + 10, obs.y + 10, 10, 0, Math.PI * 2); ctx.fill();
            } else if (obs.type === 'dining_table') {
                ctx.fillStyle = '#d97706';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            } else {
                ctx.fillStyle = '#475569';
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            }

            ctx.restore();
        }

        // Flag Pole & Flag Detail
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(998, 70, 4, 90);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(1002, 70, 32, 16);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(1002, 86, 32, 16);

        ctx.restore();
    },

    renderDoorBadge(ctx, x, y, text, color) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(x - 60, y - 12, 120, 22, 10);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '700 11px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, x, y + 3);
        ctx.restore();
    },

    renderClock(ctx, x, y) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 4, y); ctx.stroke();
        ctx.restore();
    },

    renderUIOverlays(ctx, canvasWidth, canvasHeight, playerX, playerY) {
        this.updateZoneNotification(playerX, playerY);

        if (this.zoneTitleTimer > 0 && this.zoneTitleText) {
            ctx.save();
            let alpha = Math.min(1, this.zoneTitleTimer / 30);
            ctx.globalAlpha = alpha;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.beginPath();
            ctx.roundRect(canvasWidth / 2 - 150, 20, 300, 36, 18);
            ctx.fill();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.font = '700 14px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(this.zoneTitleText, canvasWidth / 2, 43);
            ctx.restore();
        }

        this.renderMinimap(ctx, canvasWidth, playerX, playerY);
    },

    renderMinimap(ctx, canvasWidth, playerX, playerY) {
        const mapW = 140;
        const mapH = 95;
        const mapX = canvasWidth - mapW - 15;
        const mapY = 15;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(mapX, mapY, mapW, mapH, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '700 9px Outfit, sans-serif';
        ctx.fillStyle = '#818cf8';
        ctx.textAlign = 'left';
        ctx.fillText('🗺️ SCHOOL MAP', mapX + 8, mapY + 12);

        const scaleX = (mapW - 16) / 2000;
        const scaleY = (mapH - 24) / 1400;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(mapX + 8 + 20 * scaleX, mapY + 18 + 600 * scaleY, 630 * scaleX, 380 * scaleY); // Class 1
        ctx.fillRect(mapX + 8 + 670 * scaleX, mapY + 18 + 600 * scaleY, 640 * scaleX, 380 * scaleY); // Ruang Guru
        ctx.fillRect(mapX + 8 + 1330 * scaleX, mapY + 18 + 600 * scaleY, 650 * scaleX, 380 * scaleY); // Library
        ctx.fillRect(mapX + 8 + 20 * scaleX, mapY + 18 + 1000 * scaleY, 910 * scaleX, 380 * scaleY); // Lab
        ctx.fillRect(mapX + 8 + 950 * scaleX, mapY + 18 + 1000 * scaleY, 500 * scaleX, 380 * scaleY); // Cafe
        ctx.fillRect(mapX + 8 + 1470 * scaleX, mapY + 18 + 1000 * scaleY, 510 * scaleX, 380 * scaleY); // UKS

        let px = mapX + 8 + playerX * scaleX;
        let py = mapY + 18 + playerY * scaleY;

        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
};
