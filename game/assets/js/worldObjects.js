/**
 * EDUQUEST - Interactive World Objects & Collectibles System (Phase 6 Expansion)
 */

window.WorldObjectsSystem = {
    objects: [
        {
            id: 'computer_lab_pc',
            zone: 'computer_lab',
            x: 380,
            y: 1050,
            width: 32,
            height: 32,
            label: 'Terminal Lab Komputer',
            icon: '💻',
            prompt: 'Tekan [E] untuk kuis PPLG',
            questId: 2,
            action: 'quiz'
        },
        {
            id: 'library_reading_table',
            zone: 'library',
            x: 1550,
            y: 690,
            width: 32,
            height: 32,
            label: 'Stasiun Baca Perpustakaan',
            icon: '📚',
            prompt: 'Tekan [E] untuk kuis Literasi',
            questId: 3,
            action: 'quiz'
        },
        {
            id: 'guru_desk_terminal',
            zone: 'ruang_guru',
            x: 950,
            y: 680,
            width: 32,
            height: 32,
            label: 'Meja Bahasa Indonesia Pak Eko',
            icon: '📝',
            prompt: 'Tekan [E] untuk kuis Bahasa & Sastra',
            questId: 6,
            action: 'quiz'
        },
        {
            id: 'aula_stage_terminal',
            zone: 'aula',
            x: 200,
            y: 60,
            width: 32,
            height: 32,
            label: 'Panggung Kuis Matematika Aula',
            icon: '📐',
            prompt: 'Tekan [E] untuk kuis Matematika',
            questId: 5,
            action: 'quiz'
        },
        {
            id: 'english_corner_station',
            zone: 'library',
            x: 1850,
            y: 690,
            width: 32,
            height: 32,
            label: 'English Corner Bookshelf',
            icon: '🔤',
            prompt: 'Tekan [E] untuk kuis English',
            questId: 7,
            action: 'quiz'
        },
        {
            id: 'kantin_counter_station',
            zone: 'cafeteria',
            x: 1200,
            y: 1050,
            width: 32,
            height: 32,
            label: 'Stasiun Kewirausahaan Mbak Yanti',
            icon: '🍔',
            prompt: 'Tekan [E] untuk kuis Kewirausahaan (PKK)',
            questId: 10,
            action: 'quiz'
        },
        {
            id: 'budi_lost_notebook',
            zone: 'classroom',
            x: 260,
            y: 780,
            width: 24,
            height: 24,
            label: 'Buku Catatan Budi',
            icon: '📓',
            prompt: '💬 Tekan [E] untuk ambil Buku Catatan',
            action: 'dialog',
            dialogText: '📓 Kamu menemukan Buku Catatan Budi yang tercecer! Kembalikan ke Budi di Kelas 1.'
        },
        {
            id: 'secret_alumni_sticker',
            zone: 'secret_area',
            x: 1910,
            y: 80,
            width: 24,
            height: 24,
            label: 'Stiker Legend Alumni',
            icon: '⭐',
            prompt: '💬 Tekan [E] untuk kumpulkan Stiker Legend',
            action: 'dialog',
            dialogText: '⭐ Keren! Kamu mengumpulkan Stiker Legend Alumni EDUQUEST! Prestasi sekolah telah bertambah.'
        }
    ],

    nearObject: null,

    update(player) {
        this.nearObject = null;
        let pCenterX = player.x + player.width / 2;
        let pCenterY = player.y + player.height / 2;

        let closestDist = Infinity;

        for (let obj of this.objects) {
            let oCenterX = obj.x + obj.width / 2;
            let oCenterY = obj.y + obj.height / 2;

            let dist = Math.hypot(pCenterX - oCenterX, pCenterY - oCenterY);

            if (dist < 60 && dist < closestDist) {
                closestDist = dist;
                this.nearObject = obj;
            }
        }
    },

    interact() {
        if (!this.nearObject) return false;

        const obj = this.nearObject;

        if (obj.action === 'quiz') {
            let questStatus = QuestSystem.userQuests[obj.questId];
            if (!questStatus) {
                if (window.QuestSystem) {
                    QuestSystem.showToast(`Bicara dengan NPC terlebih dahulu untuk menerima Quest #${obj.questId}!`, 'warning');
                }
            } else {
                QuizSystem.startQuiz(obj.questId);
            }
            return true;
        } else if (obj.action === 'dialog') {
            if (window.DialogSystem) {
                DialogSystem.isOpen = true;
                DialogSystem.currentNpc = {
                    name: obj.label,
                    role: 'Item Koleksi',
                    color: '#f59e0b'
                };
                DialogSystem.currentLineIndex = 0;
                DialogSystem.activeMode = 'normal';
                DialogSystem.buttons = [];
                DialogSystem.getDialogueLines = () => [obj.dialogText, 'Tekan [E] untuk menutup.'];
            }
            return true;
        }
        return false;
    },

    render(ctx, camera, isDialogOpen) {
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        let floatY = Math.sin(Date.now() / 250) * 3;

        for (let obj of this.objects) {
            let centerX = obj.x + obj.width / 2;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.beginPath();
            ctx.ellipse(centerX, obj.y - 12 + floatY, 18, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(obj.icon, centerX, obj.y - 7 + floatY);

            if (this.nearObject === obj && !isDialogOpen && (!window.QuizSystem || !QuizSystem.isOpen)) {
                let promptY = obj.y - 42 + floatY;

                ctx.fillStyle = 'rgba(14, 165, 233, 0.95)';
                ctx.beginPath();
                ctx.roundRect(centerX - 110, promptY - 14, 220, 24, 12);
                ctx.fill();
                ctx.strokeStyle = '#7dd3fc';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.font = '700 11px Outfit, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(obj.prompt, centerX, promptY + 2);
            }
        }

        ctx.restore();
    }
};
