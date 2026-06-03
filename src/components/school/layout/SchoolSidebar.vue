<script setup>
defineProps({
  sections: { type: Array, required: true },
  activePage: { type: String, required: true },
})

defineEmits(['navigate'])
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-mark">
        <div class="logo-icon">🎓</div>
        <div>
          <div class="logo-text">EduCore</div>
          <div class="logo-sub">SCHOOL MANAGEMENT</div>
        </div>
      </div>
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
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </div>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">AD</div>
        <div>
          <div class="user-name">Admin User</div>
          <div class="user-role">Super Admin</div>
        </div>
        <span style="margin-left:auto;color:var(--text3);font-size:14px;">⋮</span>
      </div>
    </div>
  </aside>
</template>