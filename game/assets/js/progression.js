/**
 * EDUQUEST - Progression & Profile Controller (Phase 5)
 */

window.ProgressionSystem = {
    userData: null,

    init() {
        this.fetchProfile();
    },

    fetchProfile() {
        fetch('../api/progression/profile.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.userData = data.profile;
                    this.updateHUD();
                }
            })
            .catch(err => console.error('Progression fetch error:', err));
    },

    updateHUD() {
        if (!this.userData) return;

        const u = this.userData;

        // Update Level & Username
        const elUsername = document.getElementById('hud-username');
        const elLevel = document.getElementById('hud-level');
        const elTitle = document.getElementById('hud-title');
        const elScore = document.getElementById('hud-score');

        if (elUsername) elUsername.textContent = u.username;
        if (elLevel) elLevel.textContent = `Lvl ${u.level}`;
        if (elTitle) elTitle.textContent = u.title;
        if (elScore) elScore.textContent = u.score;

        // Update XP Progress Bar
        const elXpText = document.getElementById('hud-xp-text');
        const elXpFill = document.getElementById('hud-xp-fill');

        if (elXpText) {
            elXpText.textContent = `${u.current_in_level} / ${u.required_in_level} XP (Total: ${u.xp})`;
        }
        if (elXpFill) {
            elXpFill.style.width = `${u.percent}%`;
        }

        // Sync with QuestSystem if present
        if (window.QuestSystem) {
            QuestSystem.updateQuestChainUI(u.quests);
        }
    },

    handleRewards(rewardData) {
        if (!rewardData) return;

        if (rewardData.user) {
            this.userData = rewardData.user;
            this.updateHUD();
        }

        // Show Rewards Toast
        if (rewardData.rewards) {
            const xp = rewardData.rewards.xp_gained;
            const score = rewardData.rewards.score_gained;
            if (xp > 0 || score > 0) {
                this.showRewardToast(`⭐ +${xp} XP  🏆 +${score} Score`);
            }
        }

        // Level Up Banner
        if (rewardData.leveled_up) {
            this.showLevelUpBanner(rewardData.user.level);
        }

        // Achievements Unlocked Notifications
        if (rewardData.unlocked_achievements && rewardData.unlocked_achievements.length > 0) {
            rewardData.unlocked_achievements.forEach((ach, index) => {
                setTimeout(() => {
                    if (window.AchievementSystem) {
                        AchievementSystem.showUnlockNotification(ach);
                    }
                }, index * 1200);
            });
        }

        // New Item Notifications
        if (rewardData.new_items && rewardData.new_items.length > 0) {
            rewardData.new_items.forEach((item) => {
                this.showRewardToast(`🎁 Item Baru Diperoleh: ${item.icon} ${item.name}!`);
            });
        }
    },

    showRewardToast(msg) {
        if (window.QuestSystem) {
            QuestSystem.showToast(msg, 'success');
        }
    },

    showLevelUpBanner(newLevel) {
        const modal = document.createElement('div');
        modal.className = 'level-up-banner-modal';
        modal.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <div class="level-up-title">LEVEL UP!</div>
                <div class="level-up-subtitle">Selamat! Kamu berhasil naik ke <span>Level ${newLevel}</span></div>
                <button class="level-up-btn" onclick="this.parentElement.parentElement.remove()">Lanjutkan</button>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
            if (modal.parentNode) modal.remove();
        }, 4500);
    },

    toggleProfileModal() {
        const modal = document.getElementById('profile-modal');
        if (!modal) return;

        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
        } else {
            this.fetchProfile();
            this.renderProfileModal();
            modal.classList.add('active');
        }
    },

    renderProfileModal() {
        if (!this.userData) return;
        const u = this.userData;

        const elContent = document.getElementById('profile-modal-body');
        if (!elContent) return;

        elContent.innerHTML = `
            <div class="profile-header-card">
                <div class="profile-avatar">🎓</div>
                <div class="profile-info">
                    <h2 class="profile-username">${u.username}</h2>
                    <div class="profile-rank-badge">✨ ${u.title}</div>
                </div>
            </div>

            <div class="profile-stats-grid">
                <div class="profile-stat-item">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-val">${u.level}</div>
                    <div class="stat-lbl">Level Player</div>
                </div>
                <div class="profile-stat-item">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-val">${u.score}</div>
                    <div class="stat-lbl">Total Skor</div>
                </div>
                <div class="profile-stat-item">
                    <div class="stat-icon">📜</div>
                    <div class="stat-val">${u.completed_quests_count} / ${u.total_quests_count}</div>
                    <div class="stat-lbl">Quest Selesai</div>
                </div>
                <div class="profile-stat-item">
                    <div class="stat-icon">🎖️</div>
                    <div class="stat-val">${u.unlocked_achievements_count} / ${u.total_achievements_count}</div>
                    <div class="stat-lbl">Achievement</div>
                </div>
            </div>

            <div class="profile-xp-section">
                <div class="xp-section-lbl">XP Progress Level ${u.level}</div>
                <div class="profile-xp-bar-bg">
                    <div class="profile-xp-bar-fill" style="width: ${u.percent}%"></div>
                </div>
                <div class="xp-section-num">${u.current_in_level} / ${u.required_in_level} XP (${u.percent}%) — Total: ${u.xp} XP</div>
            </div>
        `;
    }
};
