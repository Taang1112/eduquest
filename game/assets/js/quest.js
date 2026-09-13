/**
 * EDUQUEST - Quest Engine & Area Detection Manager
 */

window.QuestSystem = {
    allQuests: [],
    userQuests: {}, // { quest_id: status }
    activeQuest: null,
    visitedAreas: new Set(),
    isPanelOpen: false,

    currentUserId: null,

    init() {
        this.createPanelUI();
        this.fetchQuestState();
    },

    // --------------------------------------------------
    // 1. Fetch Quest State from Server API
    // --------------------------------------------------
    async fetchQuestState() {
        try {
            const res = await fetch('../api/quest/list.php');
            const data = await res.json();

            if (data.success) {
                this.allQuests = data.quests || [];
                this.userQuests = data.userQuests || {};

                if (data.user) {
                    this.currentUserId = data.user.id;
                    this.updateHUDStats(data.user);

                    // Load persistent visited areas for this user
                    let stored = localStorage.getItem('eduquest_visited_areas_' + this.currentUserId);
                    if (stored) {
                        try {
                            const arr = JSON.parse(stored);
                            if (Array.isArray(arr)) {
                                this.visitedAreas = new Set(arr);
                            }
                        } catch (e) {
                            console.error('Error parsing stored visited areas:', e);
                        }
                    }
                }

                // Determine Current Active Quest
                this.activeQuest = null;
                for (let q of this.allQuests) {
                    if (this.userQuests[q.id] === 'in_progress') {
                        this.activeQuest = q;
                        break;
                    }
                }

                this.refreshActiveQuestHUD();
            }
        } catch (err) {
            console.error('Error loading quest state:', err);
        }
    },

    // --------------------------------------------------
    // 2. Accept Quest API Call
    // --------------------------------------------------
    async acceptQuest(questId) {
        try {
            const res = await fetch('../api/quest/accept.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quest_id: questId })
            });
            const data = await res.json();

            if (data.success) {
                this.userQuests[questId] = 'in_progress';
                this.visitedAreas.clear();
                if (this.currentUserId) {
                    localStorage.removeItem('eduquest_visited_areas_' + this.currentUserId);
                }
                this.showToast(`📜 Quest Diterima: ${this.getQuestTitle(questId)}`, 'success');
                await this.fetchQuestState();
            } else {
                this.showToast(`⚠️ ${data.message}`, 'error');
            }
        } catch (err) {
            console.error('Error accepting quest:', err);
        }
    },

    // --------------------------------------------------
    // 3. Complete Quest API Call (Server-side Transaction)
    // --------------------------------------------------
    async completeQuest(questId) {
        try {
            const res = await fetch('../api/quest/complete.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quest_id: questId })
            });
            const data = await res.json();

            if (data.success) {
                this.userQuests[questId] = 'completed';
                this.visitedAreas.clear();
                if (this.currentUserId) {
                    localStorage.removeItem('eduquest_visited_areas_' + this.currentUserId);
                }

                // Show Rewards Notification
                let rewardMsg = `🏆 Quest Selesai! (+${data.rewards.xp_gained} XP, +${data.rewards.score_gained} Score)`;
                this.showToast(rewardMsg, 'success');

                // Level Up Notification if triggered
                if (data.leveled_up) {
                    setTimeout(() => {
                        this.showToast(`⭐ LEVEL UP! Anda naik ke Level ${data.user.level}!`, 'levelup');
                    }, 1000);
                }

                // Update HUD Realtime
                if (data.user) {
                    this.updateHUDStats(data.user);
                }

                // Trigger Progression & Achievement Engine
                if (window.ProgressionSystem) {
                    ProgressionSystem.handleRewards(data);
                }

                await this.fetchQuestState();
            } else {
                this.showToast(`⚠️ ${data.message}`, 'error');
            }
        } catch (err) {
            console.error('Error completing quest:', err);
        }
    },

    // --------------------------------------------------
    // 4. Realtime Area Detection & Quest 1 Progress
    // --------------------------------------------------
    checkAreaDetection(playerX, playerY) {
        let currentArea = '';
        if (playerY < 350) {
            if (playerX > 1830 && playerY < 250) currentArea = 'secret_area';
            else if (playerX < 800) currentArea = 'aula';
            else if (playerX > 1180) currentArea = 'lapangan';
            else currentArea = 'courtyard';
        } else if (playerY < 600) {
            currentArea = 'corridor';
        } else if (playerY < 980) {
            if (playerX < 650) currentArea = 'classroom';
            else if (playerX < 1310) currentArea = 'ruang_guru';
            else currentArea = 'library';
        } else {
            if (playerX < 930) currentArea = 'computer_lab';
            else if (playerX < 1450) currentArea = 'cafeteria';
            else currentArea = 'uks';
        }

        // Global Area Discovery Achievement Tracker
        if (currentArea && currentArea !== 'corridor' && !this.visitedAreas.has(currentArea)) {
            this.visitedAreas.add(currentArea);
            if (this.currentUserId) {
                localStorage.setItem('eduquest_visited_areas_' + this.currentUserId, JSON.stringify(Array.from(this.visitedAreas)));
            }
        }

        // Quest 1 ("Kenali Sekolahmu"): Requires visiting 4 unique key school areas
        if (this.activeQuest && this.activeQuest.id === 1) {
            const validQuest1Areas = ['courtyard', 'classroom', 'ruang_guru', 'computer_lab', 'library', 'cafeteria', 'uks', 'aula'];
            let q1Visited = Array.from(this.visitedAreas).filter(a => validQuest1Areas.includes(a));
            let count = q1Visited.length;

            if (count < 4) {
                // HUD updates automatically
            } else if (count === 4 && !this.q1ToastShown) {
                this.q1ToastShown = true;
                this.showToast('✓ Objective Selesai! Bicara dengan Bu Sari untuk klaim reward.', 'success');
            }
            this.refreshActiveQuestHUD();
        }
    },

    // Check if Quest objective is met
    isObjectiveMet(questId) {
        if (questId === 1) {
            const validAreas = ['courtyard', 'classroom', 'ruang_guru', 'computer_lab', 'library', 'cafeteria', 'uks', 'aula'];
            let count = Array.from(this.visitedAreas).filter(a => validAreas.includes(a)).length;
            return count >= 4;
        }
        if (questId === 8) return this.visitedAreas.has('secret_area');
        return true;
    },

    getQuestTitle(questId) {
        let q = this.allQuests.find(item => item.id === questId);
        return q ? q.title : `Quest #${questId}`;
    },

    // --------------------------------------------------
    // 5. Realtime Unified HUD & Quest Panel Refresh
    // --------------------------------------------------
    updateHUDStats(user) {
        const levelEl = document.getElementById('hudLevel');
        const xpEl = document.getElementById('hudXp');
        const scoreEl = document.getElementById('hudScore');

        if (levelEl) levelEl.textContent = user.level;
        if (xpEl) xpEl.textContent = user.xp;
        if (scoreEl) scoreEl.textContent = user.score;
    },

    refreshActiveQuestHUD() {
        // Update Left Active Quest HUD Overlay
        const hudEl = document.getElementById('hudActiveQuestWidget');
        if (hudEl) {
            if (this.activeQuest) {
                let statusText = '';
                if (this.activeQuest.id === 1) {
                    let count = Math.min(4, this.visitedAreas.size);
                    statusText = count >= 4 ? `✓ Explorer: 4/4 Area (Klaim ke Bu Sari)` : `📍 Explorer: ${count}/4 Area`;
                } else {
                    statusText = `✏️ Akses Kuis di Lokasi Quest`;
                }
                hudEl.innerHTML = `
                    <div class="hud-quest-label">⚡ Quest Aktif</div>
                    <div class="hud-quest-title">${this.activeQuest.title}</div>
                    <div class="hud-quest-status">${statusText}</div>
                `;
                hudEl.style.display = 'block';
            } else {
                hudEl.style.display = 'none';
            }
        }

        // Update Quest Log Modal if rendering or open
        this.renderPanelUI();
    },

    updateActiveQuestHUD() {
        this.refreshActiveQuestHUD();
    },

    // --------------------------------------------------
    // 6. UI Render & Panel Control
    // --------------------------------------------------
    createPanelUI() {
        if (document.getElementById('questPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'questPanel';
        panel.className = 'quest-panel-overlay';
        document.body.appendChild(panel);

        const toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-notification-container';
        document.body.appendChild(toastContainer);
    },

    updateQuestChainUI(chainData) {
        if (!chainData) return;
        this.questChainData = chainData;
        if (this.isPanelOpen) {
            this.renderPanelUI();
        }
    },

    togglePanel() {
        const panel = document.getElementById('questPanel');
        if (!panel) return;
        this.isPanelOpen = !this.isPanelOpen;
        if (this.isPanelOpen) {
            panel.classList.add('active');
            if (window.ProgressionSystem) ProgressionSystem.fetchProfile();
            this.renderPanelUI();
        } else {
            panel.classList.remove('active');
        }
    },

    renderPanelUI() {
        const panel = document.getElementById('questPanel');
        if (!panel) return;

        let html = `
            <div class="quest-panel-header">
                <span class="quest-panel-title">📜 QUEST LOG & DAFTAR MISI</span>
                <button class="quest-close-btn" onclick="QuestSystem.togglePanel()">✕</button>
            </div>
        `;

        // Active Quest Section
        if (this.activeQuest) {
            let progressText = '0/1';
            let percent = 0;

            if (this.activeQuest.id === 1) {
                let currentCount = Math.min(4, this.visitedAreas.size);
                progressText = `${currentCount}/4 Area`;
                percent = (currentCount / 4) * 100;
            } else {
                progressText = 'Dapat Diklaim!';
                percent = 100;
            }

            html += `
                <div class="quest-card active-card">
                    <div class="quest-card-header">⚡ Quest Aktif: ${this.activeQuest.title}</div>
                    <div class="quest-card-desc">${this.activeQuest.description}</div>
                    
                    <div class="quest-progress-container">
                        <div class="quest-progress-label">
                            <span>Progress Objective</span>
                            <span>${progressText}</span>
                        </div>
                        <div class="quest-progress-bar">
                            <div class="quest-progress-fill" style="width: ${percent}%;"></div>
                        </div>
                    </div>

                    <div class="quest-reward-tags">
                        <span class="reward-tag xp">+${this.activeQuest.xp_reward} XP</span>
                        <span class="reward-tag score">+${this.activeQuest.score_reward} Score</span>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="quest-card" style="text-align: center; color: var(--text-muted);">
                    <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">📜</div>
                    <div>Tidak ada Quest Aktif</div>
                    <div style="font-size: 0.8rem; margin-top: 0.3rem;">Bicara dengan NPC untuk mengambil Quest baru!</div>
                </div>
            `;
        }

        // Quest Chain / All Quests Section (Showing Available, Active, Completed, & Locked)
        if (this.questChainData && this.questChainData.length > 0) {
            html += `<div class="quest-chain-section-title">🗺️ DAFTAR QUEST SEKOLAH</div>`;
            this.questChainData.forEach(q => {
                let badgeClass = 'available';
                let badgeText = '▶ TERSEDIA';

                if (q.status === 'completed') {
                    badgeClass = 'completed';
                    badgeText = '✓ SELESAI';
                } else if (q.status === 'in_progress') {
                    badgeClass = 'in_progress';
                    badgeText = '⚡ AKTIF';
                } else if (q.is_locked) {
                    badgeClass = 'locked';
                    badgeText = '🔒 TERKUNCI';
                }

                let lockSub = q.is_locked ? `<div class="quest-lock-reason">🔒 Membutuhkan '${q.prerequisite_title}'</div>` : '';

                html += `
                    <div class="quest-chain-item ${badgeClass}">
                        <div class="qchain-header">
                            <span class="qchain-title">${q.title}</span>
                            <span class="qchain-badge ${badgeClass}">${badgeText}</span>
                        </div>
                        <div class="qchain-desc">${q.description}</div>
                        ${lockSub}
                        <div class="qchain-rewards">Hadiah: ⭐ +${q.xp_reward} XP   🏆 +${q.score_reward} Score</div>
                    </div>
                `;
            });
        }

        panel.innerHTML = html;
    },

    // --------------------------------------------------
    // 7. Toast Notification Trigger
    // --------------------------------------------------
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
};
