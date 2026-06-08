<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

function selectTab(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="control-tabs" role="tablist" :class="{ 'control-tabs--compact': compact }">
    <button
      v-for="item in props.items"
      :key="item.value"
      type="button"
      class="control-tab"
      :class="{ 'is-active': item.value === props.modelValue }"
      role="tab"
      :aria-selected="item.value === props.modelValue"
      :title="item.description || item.label"
      @click="selectTab(item.value)"
    >
      <span v-if="item.icon" class="control-tab__icon">{{ item.icon }}</span>
      <span class="control-tab__copy">
        <span class="control-tab__label">{{ item.label }}</span>
        <span v-if="item.description" class="control-tab__description">{{ item.description }}</span>
      </span>
      <span v-if="item.count !== undefined" class="control-tab__count">{{ item.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.control-tabs {
  display: inline-flex;
  align-items: stretch;
  gap: 8px;
  padding: 8px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(10, 17, 31, 0.72);
  border: 1px solid rgba(141, 169, 220, 0.16);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(16px);
  max-width: 100%;
  overflow-x: auto;
}

.control-tabs--compact {
  padding: 6px;
  gap: 6px;
  border-radius: 18px;
}

.control-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 12px 16px;
  border: 1px solid transparent;
  border-radius: 16px;
  color: var(--text2);
  background: transparent;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  white-space: nowrap;
}

.control-tabs--compact .control-tab {
  min-height: 40px;
  padding: 10px 14px;
  border-radius: 13px;
}

.control-tab:hover {
  color: var(--text);
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.035);
}

.control-tab.is-active {
  color: var(--text);
  background: linear-gradient(135deg, rgba(109, 147, 255, 0.18), rgba(141, 104, 255, 0.12));
  border-color: rgba(109, 147, 255, 0.24);
  box-shadow:
    inset 0 0 0 1px rgba(109, 147, 255, 0.08),
    0 14px 26px rgba(109, 147, 255, 0.14);
}

.control-tab__icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 15px;
  flex-shrink: 0;
}

.control-tab__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}

.control-tab__label {
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.control-tab__description {
  font-size: 10px;
  color: var(--text3);
  line-height: 1.2;
}

.control-tab__count {
  margin-left: 2px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  color: white;
  background: rgba(109, 147, 255, 0.92);
  flex-shrink: 0;
}

@media (max-width: 760px) {
  .control-tabs {
    width: 100%;
  }

  .control-tab {
    flex: 0 0 auto;
  }
}
</style>