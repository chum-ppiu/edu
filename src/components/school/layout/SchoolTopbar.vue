<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <header class="topbar">
    <div class="topbar-title">{{ title }}</div>
    <label class="topbar-search">
      <span style="color:var(--text3)">🔍</span>
      <input type="text" placeholder="Search anything..." />
    </label>
    <button class="topbar-btn" type="button" aria-label="Notifications">
      🔔
      <span class="notif-dot"></span>
    </button>
    <button class="topbar-btn" type="button" aria-label="Help">❓</button>
    <div class="user-avatar" style="width:36px;height:36px;cursor:pointer;font-size:13px;">AD</div>
  </header>
</template>