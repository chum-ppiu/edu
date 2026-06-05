<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { getLocale, persistLocale } from '../../../i18n'

defineProps({
  title: { type: String, required: true },
})

defineEmits(['toggle-sidebar'])

const { t, locale } = useI18n()

const localeItems = computed(() => [
  {
    value: 'en',
    label: t('language.english'),
    flag: '🇺🇸',
    active: locale.value === 'en',
  },
  {
    value: 'km',
    label: t('language.khmer'),
    flag: '🇰🇭',
    active: locale.value === 'km',
  },
])

function setLocale(nextLocale) {
  if (nextLocale !== getLocale()) {
    persistLocale(nextLocale)
  }
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="hamburger-btn" @click="$emit('toggle-sidebar')" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <!-- <h1 class="topbar-title">{{ title }}</h1> -->
    </div>

    <!-- Right Side Content Elements -->
    <div class="topbar-right">
      <label class="topbar-search">
        <span class="search-icon">🔍</span>
        <input type="text" :placeholder="t('common.searchAnything')" />
      </label>

      <div class="topbar-actions">
        <div class="topbar-language" role="group">
          <button
            v-for="item in localeItems"
            :key="item.value"
            class="topbar-lang-btn"
            :class="{ active: item.active }"
            type="button"
            @click="setLocale(item.value)"
          >
            <span class="topbar-lang-flag">{{ item.flag }}</span>
            <span class="topbar-lang-label">{{ item.label }}</span>
          </button>
        </div>

        <button class="topbar-btn" type="button">
          🔔
          <span class="notif-dot"></span>
        </button>
        
        <button class="topbar-btn help-btn" type="button">❓</button>
        
        <div class="topbar-avatar">AD</div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  height: 70px;
  min-height: 70px;
  flex-shrink: 0; /* Prevents topbar shrinking on small height screens */
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
}
.hamburger-btn:hover { background: var(--bg-3); color: var(--text); }

.topbar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

/* Fixed spacing bug: Removed max-width block and updated alignment */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: flex-end; /* Keeps items pushed tightly together to the right side */
}

.topbar-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 260px; /* Aligns smoothly with search input in image_c52243.png */
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0 14px;
  transition: all 0.2s;
}
.topbar-search:focus-within { border-color: var(--accent); background: var(--bg-3); }
.search-icon { font-size: 0.9rem; color: var(--text-3); }
.topbar-search input { width: 100%; padding: 8px 6px; background: transparent; border: none; outline: none; color: var(--text); font-size: 0.88rem; }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-language {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg-2);
}

.topbar-lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s;
}
.topbar-lang-btn.active { background: var(--panel-strong); color: var(--text); }

.topbar-btn {
  position: relative;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.05rem;
  transition: all 0.2s;
}
.topbar-btn:hover { background: var(--bg-3); border-color: var(--border-strong); }
.notif-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: var(--danger); border-radius: 50%; }

.topbar-avatar {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  background: var(--accent-2);
  color: #fff;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .hamburger-btn { display: flex; }
}

@media (max-width: 768px) {
  .topbar { padding: 0 16px; }
  .topbar-search, .topbar-language .topbar-lang-label, .help-btn { display: none; }
}
</style>