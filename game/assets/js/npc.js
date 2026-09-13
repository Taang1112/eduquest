/**
 * EDUQUEST - NPC System & Proximity Detection (Phase 6 Expansion)
 */

window.NPCSystem = {
    npcs: [
        {
            id: 'bu_sari',
            questId: 1,
            name: 'Bu Sari',
            role: 'Guru Wali Kelas',
            color: '#ec4899',
            x: 1000,
            y: 420,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/npc/bu_sari/sprite.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Selamat datang di EDUQUEST!",
                "Sebagai siswa baru, penting bagimu untuk mengenali lingkungan sekolah ini.",
                "Eksplorasi Halaman, Koridor, Kelas, Lab Komputer, Perpustakaan, dan Kantin ya!"
            ]
        },
        {
            id: 'pak_andi',
            questId: 2,
            name: 'Pak Andi',
            role: 'Guru Lab Komputer',
            color: '#3b82f6',
            x: 350,
            y: 1100,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/npc/pak_andi/sprite.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Halo! Saya Pak Andi, pengelola Lab Komputer.",
                "Di sini kamu bisa belajar logika, algoritma, dan pemrograman PPLG dasar."
            ]
        },
        {
            id: 'rika',
            questId: 3,
            name: 'Rika',
            role: 'Siswa Perpustakaan',
            color: '#f59e0b',
            x: 1550,
            y: 750,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/npc/rika/sprite.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Hai! Aku Rika, salam kenal ya!",
                "Membaca buku di perpustakaan sangat menyenangkan dan menambah wawasan!"
            ]
        },
        {
            id: 'pak_eko',
            questId: 4,
            name: 'Pak Eko',
            role: 'Guru Ruang Guru',
            color: '#8b5cf6',
            x: 950,
            y: 740,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/npc/bu_sari/sprite.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Selamat datang di Ruang Guru EDUQUEST!",
                "Di sini para guru mempersiapkan materi pembelajaran dan tugas sekolah."
            ]
        },
        {
            id: 'bimo',
            questId: 5,
            name: 'Bimo',
            role: 'Siswa Olahraga & Matematika',
            color: '#ef4444',
            x: 350,
            y: 160,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/students/student-01.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Halo! Aku Bimo, biasa latihan olahraga dan belajar matematika di Aula.",
                "Logika matematika sangat berguna dalam kehidupan sehari-hari!"
            ]
        },
        {
            id: 'ibu_ratna',
            questId: null,
            name: 'Ibu Ratna',
            role: 'Petugas UKS',
            color: '#10b981',
            x: 1720,
            y: 1180,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/npc/bu_sari/sprite.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Selamat datang di Ruang Kesehatan Sekolah (UKS).",
                "Ingat, kesehatan fisik dan stamina sangat penting untuk kelancaran belajar."
            ]
        },
        {
            id: 'mbak_yanti',
            questId: 10,
            name: 'Mbak Yanti',
            role: 'Penjaga Kantin',
            color: '#f43f5e',
            x: 1200,
            y: 1100,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/npc/rika/sprite.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Selamat datang di Kantin EDUQUEST!",
                "Makanan sehat dan minuman bergizi selalu tersedia di sini. Mau coba kuis PKK?"
            ]
        },
        {
            id: 'senior_alumni',
            questId: 8,
            name: 'Kak Faiz',
            role: 'Senior Alumni Rahasia',
            color: '#6366f1',
            x: 1900,
            y: 100,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/students/student-03.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Wah, kamu berhasil menemukan Taman Rahasia Alumni ini!",
                "Sebagai apresiasi, ambillah stiker rahasia ini dan teruslah berprestasi!"
            ]
        },
        {
            id: 'budi',
            questId: 9,
            name: 'Budi',
            role: 'Siswa RPL',
            color: '#16a34a',
            x: 400,
            y: 750,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/students/student-01.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Halo! Aku Budi dari Kelas RPL 1.",
                "Aduh, buku catatanku tercecer di sekitar kelas..."
            ]
        },
        {
            id: 'siti',
            questId: null,
            name: 'Siti',
            role: 'Siswi RPL',
            color: '#9333ea',
            x: 1100,
            y: 450,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/students/student-02.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Hai! Jangan lupa cek papan pengumuman di koridor ya."
            ]
        },
        {
            id: 'doni',
            questId: null,
            name: 'Doni',
            role: 'Siswa RPL',
            color: '#ea580c',
            x: 1350,
            y: 1150,
            width: 32,
            height: 32,
            facing: 'down',
            spritePath: 'assets/images/characters/students/student-03.png',
            spriteSheet: null,
            spriteLoaded: false,
            dialog: [
                "Nasi goreng di kantin Mbak Yanti enak banget lho!"
            ]
        }
    ],

    nearNpc: null,

    init() {
        for (let npc of this.npcs) {
            npc.spriteSheet = new Image();
            npc.spriteSheet.src = npc.spritePath;
            npc.spriteSheet.onload = () => {
                npc.spriteLoaded = true;
            };
            npc.spriteSheet.onerror = () => {
                console.warn(`NPC ${npc.name} sprite fallback active.`);
                npc.spriteLoaded = false;
            };
        }
    },

    update(player) {
        this.nearNpc = null;
        let pCenterX = player.x + player.width / 2;
        let pCenterY = player.y + player.height / 2;

        let closestDist = Infinity;

        for (let npc of this.npcs) {
            let nCenterX = npc.x + npc.width / 2;
            let nCenterY = npc.y + npc.height / 2;

            let dist = Math.hypot(pCenterX - nCenterX, pCenterY - nCenterY);

            if (dist < 80) {
                let dx = pCenterX - nCenterX;
                let dy = pCenterY - nCenterY;
                if (Math.abs(dx) > Math.abs(dy)) {
                    npc.facing = dx > 0 ? 'right' : 'left';
                } else {
                    npc.facing = dy > 0 ? 'down' : 'up';
                }
            } else {
                npc.facing = 'down';
            }

            if (dist < 65 && dist < closestDist) {
                closestDist = dist;
                this.nearNpc = npc;
            }
        }
    },

    render(ctx, camera, isDialogOpen) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        for (let npc of this.npcs) {
            let centerX = npc.x + npc.width / 2;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.beginPath();
            ctx.ellipse(centerX, npc.y + npc.height - 2, 14, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            if (npc.spriteLoaded) {
                ctx.imageSmoothingEnabled = false;

                let row = 0;
                if (npc.facing === 'left') row = 1;
                else if (npc.facing === 'right') row = 2;
                else if (npc.facing === 'up') row = 3;

                let col = (Math.floor(Date.now() / 800) % 2 === 0) ? 0 : 2;

                ctx.drawImage(
                    npc.spriteSheet,
                    col * 32, row * 48, 32, 48,
                    npc.x, npc.y - 16, 32, 48
                );
            } else {
                ctx.fillStyle = npc.color;
                ctx.beginPath();
                ctx.roundRect(npc.x + 4, npc.y + 12, 24, 18, 6);
                ctx.fill();

                ctx.fillStyle = '#fed7aa';
                ctx.beginPath();
                ctx.arc(centerX, npc.y + 10, 11, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.arc(centerX, npc.y + 7, 11, Math.PI, Math.PI * 2);
                ctx.fill();
            }

            let floatY = Math.sin(Date.now() / 250) * 3;
            if (npc.questId && window.QuestSystem && QuestSystem.userQuests) {
                let questStatus = QuestSystem.userQuests[npc.questId];

                if (questStatus === 'completed') {
                    ctx.font = '700 12px Outfit, sans-serif';
                    ctx.fillStyle = '#34d399';
                    ctx.textAlign = 'center';
                    ctx.fillText('✓ Quest Selesai', centerX, npc.y - 28 + floatY);
                } else if (questStatus === 'in_progress') {
                    if (QuestSystem.isObjectiveMet(npc.questId)) {
                        ctx.font = '700 13px Outfit, sans-serif';
                        ctx.fillStyle = '#f59e0b';
                        ctx.textAlign = 'center';
                        ctx.fillText('❓ Klaim Reward!', centerX, npc.y - 28 + floatY);
                    } else {
                        ctx.font = '700 12px Outfit, sans-serif';
                        ctx.fillStyle = '#818cf8';
                        ctx.textAlign = 'center';
                        ctx.fillText('📜 Active Quest', centerX, npc.y - 28 + floatY);
                    }
                } else if (!questStatus) {
                    ctx.font = '700 13px Outfit, sans-serif';
                    ctx.fillStyle = '#fbbf24';
                    ctx.textAlign = 'center';
                    ctx.fillText('📜 Quest Baru!', centerX, npc.y - 28 + floatY);
                }
            }

            ctx.font = '600 12px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(npc.name, centerX, npc.y - 12);

            ctx.font = '400 10px Outfit, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(npc.role, centerX, npc.y - 2);

            if (this.nearNpc === npc && !isDialogOpen) {
                let promptY = npc.y - 48 + floatY;

                ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
                ctx.beginPath();
                ctx.roundRect(centerX - 75, promptY - 14, 150, 24, 12);
                ctx.fill();
                ctx.strokeStyle = '#818cf8';
                ctx.stroke();

                ctx.font = '700 11px Outfit, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('💬 Tekan [E] untuk berbicara', centerX, promptY + 2);
            }
        }

        ctx.restore();
    }
};
