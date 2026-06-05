<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  sections: { type: Array, required: true },
  activePage: { type: String, required: true },
  isOpen: { type: Boolean, default: false }
})

defineEmits(['navigate', 'close'])
</script>

<template>
  <aside class="sidebar" :class="{ 'is-mobile-open': isOpen }">
    <div class="sidebar-header">
      <div class="logo-mark">
        <div class="logo-icon">🎓</div>
        <div>
          <div class="logo-text">EduCore</div>
          <div class="logo-sub">{{ t('shell.brandSub') }}</div>
        </div>
      </div>
      <button class="close-sidebar-btn" @click="$emit('close')">✕</button>
    </div>

    <nav class="sidebar-nav">
      <template v-for="section in sections" :key="section.label">
        <div class="nav-section">{{ section.label }}</div>
        <div
          v-for="item in section.items"
          :key="item.id"
          class="nav-item"
          :class="{ active: activePage === item.id }"
          @click="$emit('navigate', item.id)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </div>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">AD</div>
        <div class="user-info">
          <div class="user-name">Admin User</div>
          <div class="user-role">Super Admin</div>
        </div>
        <button class="user-actions-btn">⋮</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: var(--bg-2);
  border-right: 1px solid var(--border);
  z-index: 100;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  flex-shrink: 0;
}

.logo-mark { display: flex; align-items: center; gap: 12px; }
.logo-icon {
  font-size: 24px;
  background: var(--bg-3);
  padding: 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.logo-text { font-weight: 700; font-size: 1.15rem; letter-spacing: -0.02em; color: var(--text); }
.logo-sub { font-size: 0.75rem; color: var(--text-3); }
.close-sidebar-btn { display: none; background: transparent; border: none; color: var(--text-2); font-size: 1.2rem; cursor: pointer; }

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 24px 12px;
}

.sidebar-nav::-webkit-scrollbar { width: 4px; }
.sidebar-nav::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

.nav-section {
  font-size: 0.72rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-3);
  padding: 18px 12px 6px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-2);
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 2px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: var(--text);
  background: var(--bg-3);
  transform: translateX(2px);
}

.nav-item.active {
  /* background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%); */
  color: #ffffff;
  font-weight: 600;
}

.nav-icon { font-size: 1.1rem; display: flex; align-items: center; justify-content: center; width: 20px; }
.nav-label { flex: 1; }
.nav-badge {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 99px;
  font-weight: 700;
  background: var(--panel-strong);
  color: var(--accent-4);
  border: 1px solid var(--border-strong);
}
.nav-item.active .nav-badge { background: rgba(255, 255, 255, 0.2); color: #fff; border-color: transparent; }

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-2);
  flex-shrink: 0;
}
.user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--panel-strong); border: 1px solid var(--border); border-radius: var(--radius-md); }
.user-avatar { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--accent); color: #fff; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; }
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 0.85rem; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 0.75rem; color: var(--text-3); }
.user-actions-btn { background: transparent; border: none; color: var(--text-3); cursor: pointer; font-size: 1rem; padding: 4px; }

@media (max-width: 1024px) {
  .sidebar { position: fixed; left: 0; top: 0; transform: translateX(-100%); transition: transform 0.3s ease; box-shadow: var(--shadow); }
  .sidebar.is-mobile-open { transform: translateX(0); }
  .close-sidebar-btn { display: block; }
}
</style>