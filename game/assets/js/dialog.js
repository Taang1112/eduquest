/**
 * EDUQUEST - Dialogue System Controller (Phase 3 Quest Flow Integrated)
 */

window.DialogSystem = {
    isOpen: false,
    currentNpc: null,
    currentQuest: null,
    currentLineIndex: 0,
    activeMode: 'normal', // 'normal', 'offer_quest', 'complete_quest'

    // Button bounding boxes for click detection
    buttons: [],

    startDialog(npc) {
        if (!npc) return;

        this.isOpen = true;
        this.currentNpc = npc;
        this.currentLineIndex = 0;
        this.buttons = [];

        // Check associated quest
        this.currentQuest = QuestSystem.allQuests.find(q => q.id === npc.questId) || null;
        let questStatus = QuestSystem.userQuests[npc.questId];

        if (!questStatus) {
            // Check if quest has prerequisite quest that is not completed
            let prereqId = this.currentQuest ? this.currentQuest.prerequisite_quest_id : null;
            if (prereqId && QuestSystem.userQuests[prereqId] !== 'completed') {
                this.activeMode = 'locked_quest';
            } else {
                this.activeMode = 'offer_quest';
            }
        } else if (questStatus === 'in_progress') {
            if (QuestSystem.isObjectiveMet(npc.questId)) {
                this.activeMode = 'complete_quest';
            } else {
                this.activeMode = 'normal';
            }
        } else {
            this.activeMode = 'normal';
        }
    },

    advanceDialog() {
        if (!this.isOpen) return;

        // If interactive buttons are shown, E advances only if normal mode or locked_quest
        if (this.activeMode === 'offer_quest' || this.activeMode === 'complete_quest') {
            return; // Wait for button click or E shortcut action
        }

        this.currentLineIndex++;
        if (this.currentLineIndex >= this.getDialogueLines().length) {
            this.closeDialog();
        }
    },

    closeDialog() {
        this.isOpen = false;
        this.currentNpc = null;
        this.currentQuest = null;
        this.currentLineIndex = 0;
        this.activeMode = 'normal';
        this.buttons = [];
    },

    getDialogueLines() {
        if (!this.currentNpc) return [];
        let questStatus = QuestSystem.userQuests[this.currentNpc.questId];

        if (this.activeMode === 'locked_quest') {
            return [
                this.currentNpc.dialog[0] || "Halo!",
                `Maaf, kamu belum bisa mengambil quest '${this.currentQuest ? this.currentQuest.title : 'ini'}' (🔒).`,
                "Kamu harus menyelesaikan quest prasyarat sebelumnya terlebih dahulu!"
            ];
        }

        if (questStatus === 'completed') {
            return [
                `Terima kasih telah membantuku menyelesaikan quest '${this.currentQuest ? this.currentQuest.title : 'sekolah'}'!`,
                "Tetap semangat belajarnya dan tingkatkan terus prestasi EDUQUEST-mu!"
            ];
        }

        if (questStatus === 'in_progress') {
            if (QuestSystem.isObjectiveMet(this.currentNpc.questId)) {
                return [
                    `Luar biasa! Kamu telah berhasil memenuhi syarat objective quest '${this.currentQuest.title}'!`,
                    "Klaim reward-mu sekarang!"
                ];
            } else {
                let hint = (this.currentNpc.questId === 1) ? `Visited ${QuestSystem.visitedAreas.size}/4 areas.` : '';
                return [
                    `Quest '${this.currentQuest ? this.currentQuest.title : ''}' masih berlangsung.`,
                    `${this.currentQuest ? this.currentQuest.description : ''} ${hint}`
                ];
            }
        }

        // Available Quest Offer
        return [
            this.currentNpc.dialog[0] || "Halo!",
            `Saya punya tugas untukmu: '${this.currentQuest ? this.currentQuest.title : ''}'.`
        ];
    },

    handleCanvasClick(clickX, clickY) {
        if (!this.isOpen || this.buttons.length === 0) return false;

        for (let btn of this.buttons) {
            if (
                clickX >= btn.x &&
                clickX <= btn.x + btn.width &&
                clickY >= btn.y &&
                clickY <= btn.y + btn.height
            ) {
                btn.action();
                return true;
            }
        }
        return false;
    },

    render(ctx, viewportWidth, viewportHeight) {
        if (!this.isOpen || !this.currentNpc) return;

        this.buttons = []; // Reset click targets

        let margin = 20;
        let boxHeight = 170;
        let boxWidth = Math.min(850, viewportWidth - margin * 2);
        let boxX = (viewportWidth - boxWidth) / 2;
        let boxY = viewportHeight - boxHeight - margin;

        ctx.save();

        // Overlay Backdrop Shadow
        ctx.fillStyle = 'rgba(11, 15, 25, 0.4)';
        ctx.fillRect(0, 0, viewportWidth, viewportHeight);

        // Dialogue Box Card
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Speaker Name Header
        ctx.font = '700 18px Outfit, sans-serif';
        ctx.fillStyle = this.currentNpc.color || '#818cf8';
        ctx.textAlign = 'left';
        ctx.fillText(this.currentNpc.name, boxX + 25, boxY + 32);

        // Speaker Role Badge
        ctx.font = '600 12px Outfit, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(` (${this.currentNpc.role})`, boxX + 25 + ctx.measureText(this.currentNpc.name).width, boxY + 30);

        // Lines Logic
        let lines = this.getDialogueLines();
        let currentText = lines[this.currentLineIndex] || '';

        ctx.font = '400 15px Outfit, sans-serif';
        ctx.fillStyle = '#f8fafc';

        let words = currentText.split(' ');
        let line = '';
        let textY = boxY + 65;
        let maxWidth = boxWidth - 50;

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, boxX + 25, textY);
                line = words[n] + ' ';
                textY += 24;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, boxX + 25, textY);

        // Offer Quest Mode: Render Interactive Buttons
        if (this.activeMode === 'offer_quest' && this.currentQuest) {
            // Quest Reward Tag
            ctx.font = '700 13px Outfit, sans-serif';
            ctx.fillStyle = '#818cf8';
            ctx.fillText(`Reward: +${this.currentQuest.xp_reward} XP | +${this.currentQuest.score_reward} Score`, boxX + 25, boxY + 115);

            // Button 1: [Terima Quest]
            let btn1X = boxX + 25;
            let btn1Y = boxY + boxHeight - 42;
            let btn1W = 140;
            let btn1H = 32;

            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.roundRect(btn1X, btn1Y, btn1W, btn1H, 8);
            ctx.fill();

            ctx.font = '700 13px Outfit, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('📜 Terima Quest', btn1X + btn1W / 2, btn1Y + 21);

            this.buttons.push({
                x: btn1X, y: btn1Y, width: btn1W, height: btn1H,
                action: () => {
                    QuestSystem.acceptQuest(this.currentQuest.id);
                    this.closeDialog();
                }
            });

            // Button 2: [Tolak]
            let btn2X = btn1X + btn1W + 15;
            let btn2Y = btn1Y;
            let btn2W = 100;
            let btn2H = 32;

            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctx.beginPath();
            ctx.roundRect(btn2X, btn2Y, btn2W, btn2H, 8);
            ctx.fill();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
            ctx.stroke();

            ctx.font = '700 13px Outfit, sans-serif';
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('✕ Tolak', btn2X + btn2W / 2, btn2Y + 21);

            this.buttons.push({
                x: btn2X, y: btn2Y, width: btn2W, height: btn2H,
                action: () => {
                    this.closeDialog();
                }
            });

        } else if (this.currentQuest && QuestSystem.userQuests[this.currentQuest.id] === 'in_progress') {
            // Check if quiz is required for this quest
            let requiresQuiz = parseInt(this.currentQuest.requires_quiz) === 1;

            if (this.activeMode === 'complete_quest') {
                let btnX = boxX + 25;
                let btnY = boxY + boxHeight - 42;
                let btnW = 230;
                let btnH = 32;

                ctx.fillStyle = '#10b981';
                ctx.beginPath();
                ctx.roundRect(btnX, btnY, btnW, btnH, 8);
                ctx.fill();

                ctx.font = '700 13px Outfit, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText('🏆 Selesaikan & Klaim Reward', btnX + btnW / 2, btnY + 21);

                this.buttons.push({
                    x: btnX, y: btnY, width: btnW, height: btnH,
                    action: () => {
                        QuestSystem.completeQuest(this.currentQuest.id);
                        this.closeDialog();
                    }
                });
            } else if (requiresQuiz) {
                // Render [Kerjakan Kuis] Button
                let btnX = boxX + 25;
                let btnY = boxY + boxHeight - 42;
                let btnW = 160;
                let btnH = 32;

                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.roundRect(btnX, btnY, btnW, btnH, 8);
                ctx.fill();

                ctx.font = '700 13px Outfit, sans-serif';
                ctx.fillStyle = '#0f172a';
                ctx.textAlign = 'center';
                ctx.fillText('✏️ Kerjakan Kuis', btnX + btnW / 2, btnY + 21);

                this.buttons.push({
                    x: btnX, y: btnY, width: btnW, height: btnH,
                    action: () => {
                        this.closeDialog();
                        if (window.QuizSystem) {
                            QuizSystem.startQuiz(this.currentQuest.id);
                        }
                    }
                });
            } else {
                ctx.font = '700 13px Outfit, sans-serif';
                ctx.fillStyle = '#818cf8';
                ctx.textAlign = 'right';
                ctx.fillText('Tekan [E] untuk Lanjut ➔', boxX + boxWidth - 25, boxY + boxHeight - 20);
            }
        } else {
            // Normal Mode Hint
            ctx.font = '700 13px Outfit, sans-serif';
            ctx.fillStyle = '#818cf8';
            ctx.textAlign = 'right';
            ctx.fillText('Tekan [E] untuk Lanjut ➔', boxX + boxWidth - 25, boxY + boxHeight - 20);
        }

        ctx.restore();
    }
};
