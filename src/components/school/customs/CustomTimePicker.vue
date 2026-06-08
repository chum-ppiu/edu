<template>
  <div class="custom-timepicker-container" ref="timepickerRef">
    <div class="timepicker-input-wrapper">
      <input
        type="text"
        :class="inputClass"
        :placeholder="placeholder"
        :value="displayValue"
        readonly
        @click="togglePopover"
      />
      <span class="timepicker-icon-trigger" @click="togglePopover">
        🕒
      </span>
    </div>

    <teleport to="body" :disabled="!appendToBody">
      <transition name="popover-fade">
        <div 
          v-if="isOpen" 
          class="timepicker-popover-overlay"
          :class="{ 'is-teleported': appendToBody }"
          :style="popoverStyle"
          ref="popoverRef"
        >
          <TimePicker
            :model-value="modelValue"
            @update:model-value="onTimeUpdate"
            @cancel="isOpen = false"
            @confirm="onTimeSelected"
          />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import TimePicker from '@/components/school/bases/TimePicker.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'HH:mm AM/PM'
  },
  inputClass: {
    type: String,
    default: 'filter-input'
  },
  appendToBody: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const timepickerRef = ref(null)
const popoverRef = ref(null)

// Coordinates layout tracking matrices state matching CustomDatePicker bounding parameters
const coords = ref({ top: 0, left: 0, width: '310px' })

const displayValue = computed(() => {
  return props.modelValue || ''
})

// Flexible programmatic boundary adjustment loops
const updatePopoverPosition = () => {
  if (!timepickerRef.value) return

  const rect = timepickerRef.value.getBoundingClientRect()
  const scrollY = window.scrollY
  const scrollX = window.scrollX
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const popoverWidth = 310  // Exact matching width of .pro-timepicker
  const popoverHeight = 390 // Approximate total pixel footprint height of full component

  let top = rect.bottom + (props.appendToBody ? scrollY : 0) + 6
  let left = rect.left + (props.appendToBody ? scrollX : 0)

  // 1. Flip upwards if running out of bottom layout space
  if (rect.bottom + popoverHeight > viewportHeight && rect.top - popoverHeight > 0) {
    top = rect.top + (props.appendToBody ? scrollY : 0) - popoverHeight - 6
  }

  // 2. Shift leftward if extending past screen right-boundary lines
  if (rect.left + popoverWidth > viewportWidth) {
    left = viewportWidth - popoverWidth - 16 + (props.appendToBody ? scrollX : 0)
  }

  coords.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${popoverWidth}px`
  }
}

const togglePopover = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    updatePopoverPosition()
  }
}

// Global listener hooks keeping elements firmly synchronized during scroll operations
watch(isOpen, (value) => {
  if (value) {
    window.addEventListener('scroll', updatePopoverPosition, true)
    window.addEventListener('resize', updatePopoverPosition)
  } else {
    window.removeEventListener('scroll', updatePopoverPosition, true)
    window.removeEventListener('resize', updatePopoverPosition)
  }
})

const popoverStyle = computed(() => {
  if (props.appendToBody) {
    return {
      position: 'absolute',
      top: coords.value.top,
      left: coords.value.left,
      width: coords.value.width
    }
  }
  return {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '6px',
    width: '100%'
  }
})

const onTimeUpdate = (newValue) => {
  emit('update:modelValue', newValue)
}

const onTimeSelected = (data) => {
  emit('update:modelValue', data.formatted)
  emit('change', data.formatted)
  isOpen.value = false // Auto dismiss on confirmation submission click execution
}

const handleClickOutside = (event) => {
  const clickedInput = timepickerRef.value && timepickerRef.value.contains(event.target)
  const clickedPopover = popoverRef.value && popoverRef.value.contains(event.target)

  if (!clickedInput && !clickedPopover) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  window.removeEventListener('scroll', updatePopoverPosition, true)
  window.removeEventListener('resize', updatePopoverPosition)
})
</script>

<style scoped>
.custom-timepicker-container {
  position: relative;
  width: 100%;
  display: inline-block;
}

.timepicker-input-wrapper {
  position: relative;
  width: 100%;
}

.timepicker-input-wrapper input {
  width: 100%;
  padding-right: 36px;
  cursor: pointer;
  background-color: var(--bg-2);
  text-overflow: ellipsis;
}

.timepicker-icon-trigger {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  opacity: 0.6;
  transition: opacity 0.15s ease-in-out;
}

.timepicker-input-wrapper:hover .timepicker-icon-trigger {
  opacity: 1;
}

/* Base structural shadow container card matching datepicker patterns */
.timepicker-popover-overlay {
  background: var(--bg-2);
  box-shadow: var(--shadow);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.timepicker-popover-overlay.is-teleported {
  z-index: 99999;
}

/* Smooth micro interactions scale entry transition metrics */
.popover-fade-enter-active {
  animation: slideInUp 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.popover-fade-leave-active {
  transition: opacity 0.1s linear;
}
.popover-fade-leave-to {
  opacity: 0;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>