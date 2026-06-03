<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { getLocale, persistLocale } from '../../../i18n'

defineProps({
  title: { type: String, required: true },
})

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
    <div class="topbar-title">{{ title }}</div>
    <label class="topbar-search">
      <span style="color:var(--text3)">🔍</span>
      <input type="text" :placeholder="t('common.searchAnything')" />
    </label>
    <div class="topbar-language" role="group" :aria-label="t('language.switchToEnglish')">
      <button
        v-for="item in localeItems"
        :key="item.value"
        class="topbar-lang-btn"
        :class="{ active: item.active }"
        type="button"
        :aria-pressed="item.active"
        :title="item.value === 'en' ? t('language.switchToKhmer') : t('language.switchToEnglish')"
        @click="setLocale(item.value)"
      >
        <span class="topbar-lang-flag">{{ item.flag }}</span>
        <span class="topbar-lang-label">{{ item.label }}</span>
      </button>
    </div>
    <button class="topbar-btn" type="button" :aria-label="t('topbar.notifications')">
      🔔
      <span class="notif-dot"></span>
    </button>
    <button class="topbar-btn" type="button" :aria-label="t('topbar.help')">❓</button>
    <div class="user-avatar" style="width:36px;height:36px;cursor:pointer;font-size:13px;">AD</div>
  </header>
</template>

<style scoped>
.topbar-language {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(16, 28, 49, 0.7);
}

.topbar-lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--text3);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 700;
}

.topbar-lang-btn:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.04);
}

.topbar-lang-btn.active {
  background: linear-gradient(135deg, rgba(109, 147, 255, 0.18), rgba(141, 104, 255, 0.18));
  color: var(--text);
  box-shadow: inset 0 0 0 1px rgba(109, 147, 255, 0.16);
}

.topbar-lang-flag {
  font-size: 14px;
}
</style>