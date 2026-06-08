<template>
  <div class="form-group filter-dropdown" :class="{ 'has-error': error }">
    <label class="form-label">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="star-danger">*</span>
    </label>
    
    <slot></slot>

    <transition name="error-fade">
      <span v-if="error" class="error-message-text">
        {{ error }}
      </span>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.error-message-text {
  color: #ef4444; /* Standard system red tokens styling warning alerts */
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
}

/* Reusable feedback adjustment hooks for inputs nested inside an active error state */
:deep(.filter-input),
:deep(.datepicker-input-wrapper input) {
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.has-error :deep(.filter-input),
.has-error :deep(.datepicker-input-wrapper input) {
  border-color: #f87171 !important;
}

.has-error :deep(.filter-input:focus),
.has-error :deep(.datepicker-input-wrapper input:focus) {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

/* Micro smooth error fade transition animations definitions */
.error-fade-enter-active {
  transition: all 0.2s ease-out;
}
.error-fade-leave-active {
  transition: all 0.15s ease-in;
}
.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>