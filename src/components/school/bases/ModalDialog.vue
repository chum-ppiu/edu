<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['center', 'top', 'left', 'right', 'bottom'].includes(value),
  },
  cancelLabel: {
    type: String,
    default: 'Cancel',
  },
  saveLabel: {
    type: String,
    default: 'Save',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'cancel', 'save', 'close'])

const overlayClass = computed(() => `modal-overlay modal-overlay-${props.position}`)
const panelClass = computed(() => `modal-panel modal-panel-${props.position}`)
const saveVariant = computed(() => {
  const label = props.saveLabel.trim().toLowerCase()

  if (/(delete|remove|discard|trash|destroy)/.test(label)) {
    return 'danger'
  }

  return 'primary'
})

const saveButtonClass = computed(() => `btn btn-${saveVariant.value}`)

function close() {
  emit('update:modelValue', false)
  emit('cancel')
}

function save() {
  emit('save')
}

function onKeydown(event) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof document === 'undefined') {
      return
    }

    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true },
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
  }

  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" :class="overlayClass" @click.self="close">
      <div :class="panelClass" role="dialog" aria-modal="true" :aria-label="title || 'Dialog'">
        <header class="modal-header">
          <div>
            <div class="modal-title">{{ title }}</div>
          </div>
          <button class="modal-close" type="button" aria-label="Close dialog" @click="close">×</button>
        </header>

        <section class="modal-body">
          <slot>
            <p v-if="content" class="modal-copy">{{ content }}</p>
          </slot>
        </section>

        <footer v-if="showFooter" class="modal-footer">
          <button class="btn btn-ghost" type="button" @click="close">{{ cancelLabel }}</button>
          <button :class="saveButtonClass" type="button" @click="save">{{ saveLabel }}</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(5, 8, 16, 0.68);
  backdrop-filter: blur(4px);
  display: flex;
  padding: 20px;
  animation: modalFadeIn 0.18s ease;
}

.modal-overlay-center,
.modal-overlay-top,
.modal-overlay-bottom {
  justify-content: center;
}

.modal-overlay-center {
  align-items: center;
}

.modal-overlay-top {
  align-items: flex-start;
}

.modal-overlay-bottom {
  align-items: flex-end;
}

.modal-overlay-left {
  justify-content: flex-start;
  align-items: center;
}

.modal-overlay-right {
  justify-content: flex-end;
  align-items: center;
}

.modal-panel {
  background: linear-gradient(180deg, rgba(22, 28, 46, 0.98), rgba(18, 24, 40, 0.98));
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: min(100%, 560px);
  max-height: min(90vh, 760px);
  transform-origin: center;
  animation: modalPopIn 0.2s ease;
}

.modal-panel-center {
  max-width: 560px;
}

.modal-panel-top,
.modal-panel-bottom {
  width: min(100%, 680px);
}

.modal-panel-left,
.modal-panel-right {
  width: min(100%, 420px);
  min-height: 100vh;
  max-height: 100vh;
  border-radius: 0;
}

.modal-panel-top {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.modal-panel-bottom {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.modal-header,
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.modal-header {
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-family: var(--font-family-main);
  font-size: 16px;
  font-weight: 700;
}

.modal-close {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg3);
  color: var(--text2);
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: var(--text);
  background: var(--border);
}

.modal-body {
  padding: 20px;
  overflow: auto;
}

.modal-copy {
  margin: 0;
  color: var(--text2);
  line-height: 1.65;
  font-size: 13px;
}

.modal-footer {
  padding: 16px 20px 20px;
  border-top: 1px solid var(--border);
}

.btn-danger {
  background: linear-gradient(135deg, #f73b4b, #fc0519);
  box-shadow: 0 10px 30px rgba(184, 66, 75, 0.24);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modalPopIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>