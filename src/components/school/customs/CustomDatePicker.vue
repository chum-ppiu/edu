<template>
  <div class="custom-datepicker-container" ref="datepickerRef">
    <div class="datepicker-input-wrapper">
      <input
        type="text"
        :class="inputClass"
        :placeholder="placeholder"
        :value="displayValue"
        readonly
        @click="togglePopover"
      />
      <span class="datepicker-icon-trigger" @click="togglePopover">
        📅
      </span>
    </div>

    <teleport to="body" :disabled="!appendToBody">
      <transition name="popover-fade">
        <div 
          v-if="isOpen" 
          class="datepicker-popover-overlay"
          :class="{ 'is-teleported': appendToBody }"
          :style="popoverStyle"
          ref="popoverRef"
        >
          <MiniCalendar
            :model-value="modelValue"
            :selection-mode="selectionMode"
            :format="format"
            @update:model-value="onDateUpdate"
            @date-selected="onDateSelected"
          />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import MiniCalendar from '@/components/school/bases/MiniCalendar.vue'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },
  selectionMode: {
    type: String,
    default: 'single'
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  placeholder: {
    type: String,
    default: 'YYYY-MM-DD'
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
const datepickerRef = ref(null)
const popoverRef = ref(null)

// Dynamic coordinates positioning state
const coords = ref({ top: 0, left: 0, width: '270px' })

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  
  if (Array.isArray(props.modelValue)) {
    if (props.selectionMode === 'range') {
      return props.modelValue.filter(Boolean).map(d => d.split(' ')[0]).join(' ~ ')
    }
    // Fixed typo here: changed props.map to props.modelValue.map
    return props.modelValue.filter(Boolean).map(d => d.split(' ')[0]).join(', ')
  }
  
  return props.modelValue.split(' ')[0]
})

// Calculate flexible layout screen placement
const updatePopoverPosition = () => {
  if (!datepickerRef.value) return

  const rect = datepickerRef.value.getBoundingClientRect()
  const scrollY = window.scrollY
  const scrollX = window.scrollX
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const popoverWidth = 270 
  const popoverHeight = 310 

  let top = rect.bottom + (props.appendToBody ? scrollY : 0) + 6
  let left = rect.left + (props.appendToBody ? scrollX : 0)

  // 1. Flip upwards if running out of bottom room
  if (rect.bottom + popoverHeight > viewportHeight && rect.top - popoverHeight > 0) {
    top = rect.top + (props.appendToBody ? scrollY : 0) - popoverHeight - 6
  }

  // 2. Adjust alignment leftward if pushed past the right edge of screen
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

// Track viewport changes to keep the panel pinned properly while open
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

const onDateUpdate = (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const onDateSelected = () => {
  if (props.selectionMode === 'single') {
    isOpen.value = false
  } else if (props.selectionMode === 'range' && Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    isOpen.value = false
  }
}

const handleClickOutside = (event) => {
  const clickedInput = datepickerRef.value && datepickerRef.value.contains(event.target)
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
.custom-datepicker-container {
  position: relative;
  width: 100%;
  display: inline-block;
}

.datepicker-input-wrapper {
  position: relative;
  width: 100%;
}

.datepicker-input-wrapper input {
  width: 100%;
  padding-right: 36px;
  cursor: pointer;
  background-color: var(--bg-2);
  text-overflow: ellipsis;
}

.datepicker-icon-trigger {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  opacity: 0.6;
  transition: opacity 0.15s ease;
}

.datepicker-input-wrapper:hover .datepicker-icon-trigger {
  opacity: 1;
}

/* Floating overlay panel card */
.datepicker-popover-overlay {
  background: var(--panel, #ffffff);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-lg, 14px);
  border: 1px solid var(--border, rgba(226, 232, 240, 0.8));
  overflow: hidden;
}

/* Ensure the calendar container stays above screen layers when teleported to document body root level */
.datepicker-popover-overlay.is-teleported {
  z-index: 99999;
}

/* Micro Animations definitions */
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