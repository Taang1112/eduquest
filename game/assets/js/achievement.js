/**
 * EDUQUEST - Achievement System UI & Notifications (Phase 5)
 */

window.AchievementSystem = {
    achievements: [],

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            // Hotkey 'H' or 'h' for Achievement panel
            if (e.key === 'h' || e.key === 'H') {
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    this.toggleModal();
                }
            }
            // Hotkey 'P' or 'p' for Profile panel
            if (e.key === 'p' || e.key === 'P') {
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    if (window.ProgressionSystem) {
                        ProgressionSystem.toggleProfileModal();
                    }
                }
            }
        });
    },

    fetchAchievements() {
        return fetch('../api/achievement/list.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.achievements = data.achievements;
                }
                return this.achievements;
            })
            .catch(err => console.error('Achievement fetch error:', err));
    },

    toggleModal() {
        const modal = document.getElementById('achievement-modal');
        if (!modal) return;

        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
        } else {
            this.fetchAchievements().then(() => {
                this.renderModal();
                modal.classList.add('active');
            });
        }
    },

    renderModal() {
        const elList = document.getElementById('achievement-modal-list');
        if (!elList) return;

        if (!this.achievements || this.achievements.length === 0) {
            elList.innerHTML = '<div class="ach-empty">Tidak ada data achievement.</div>';
            return;
        }

        let html = '';
        let unlockedCount = 0;

        this.achievements.forEach(ach => {
            if (ach.is_unlocked) unlockedCount++;
            const lockedClass = ach.is_unlocked ? 'unlocked' : 'locked';
            const badgeText = ach.is_unlocked ? '✓ Terbuka' : '🔒 Terkunci';

            html += `
                <div class="achievement-card ${lockedClass}">
                    <div class="ach-icon-box">${ach.icon || '🏆'}</div>
                    <div class="ach-details">
                        <div class="ach-title-row">
                            <h3 class="ach-title">${ach.title}</h3>
                            <span class="ach-badge ${lockedClass}">${badgeText}</span>
                        </div>
                        <p class="ach-desc">${ach.description}</p>
                        <div class="ach-rewards">
                            <span class="ach-r-item">⭐ +${ach.xp_reward} XP</span>
                            <span class="ach-r-item">🏆 +${ach.score_reward} Skor</span>
                        </div>
                    </div>
                </div>
            `;
        });

        const elHeaderCount = document.getElementById('ach-header-count');
        if (elHeaderCount) {
            elHeaderCount.textContent = `${unlockedCount} / ${this.achievements.length} Terbuka`;
        }

        elList.innerHTML = html;
    },

    showUnlockNotification(ach) {
        const toast = document.createElement('div');
        toast.className = 'achievement-unlock-toast';
        toast.innerHTML = `
            <div class="ach-toast-icon">${ach.icon || '🏆'}</div>
            <div class="ach-toast-info">
                <div class="ach-toast-tag">🏆 ACHIEVEMENT UNLOCKED!</div>
                <div class="ach-toast-title">${ach.title}</div>
                <div class="ach-toast-rewards">⭐ +${ach.xp_reward} XP   🏆 +${ach.score_reward} Score</div>
            </div>
        `;
        document.body.appendChild(toast);

        // Slide in animation
        setTimeout(() => toast.classList.add('show'), 50);

        // Slide out & cleanup
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 500);
        }, 4000);
    }
};
