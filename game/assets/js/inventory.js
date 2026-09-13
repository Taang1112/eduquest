/**
 * EDUQUEST - Inventory System UI (Phase 5 Collectible Items)
 */

window.InventorySystem = {
    items: [],

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            // Hotkey 'I' or 'i' for Inventory panel
            if (e.key === 'i' || e.key === 'I') {
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    this.toggleModal();
                }
            }
        });
    },

    fetchItems() {
        return fetch('../api/progression/profile.php')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.profile) {
                    this.items = data.profile.items || [];
                }
                return this.items;
            })
            .catch(err => console.error('Inventory fetch error:', err));
    },

    toggleModal() {
        const modal = document.getElementById('inventory-modal');
        if (!modal) return;

        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
        } else {
            this.fetchItems().then(() => {
                this.renderModal();
                modal.classList.add('active');
            });
        }
    },

    renderModal() {
        const elGrid = document.getElementById('inventory-modal-grid');
        if (!elGrid) return;

        if (!this.items || this.items.length === 0) {
            elGrid.innerHTML = `
                <div class="inv-empty-state">
                    <div class="inv-empty-icon">🎒</div>
                    <div class="inv-empty-text">Belum ada item koleksi.</div>
                    <div class="inv-empty-sub">Selesaikan Quest untuk mendapatkan item spesial sekolah!</div>
                </div>
            `;
            return;
        }

        let html = '';
        this.items.forEach(item => {
            html += `
                <div class="inventory-item-card">
                    <div class="inv-item-icon">${item.icon || '📦'}</div>
                    <div class="inv-item-info">
                        <div class="inv-item-name">${item.name}</div>
                        <div class="inv-item-desc">${item.description}</div>
                        <div class="inv-item-qty">Jumlah: x${item.quantity}</div>
                    </div>
                </div>
            `;
        });

        elGrid.innerHTML = html;
    }
};
