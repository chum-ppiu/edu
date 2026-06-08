<template>
  <div class="custom-select-container" ref="selectRef">
    <select 
      class="hidden-native-select" 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled selected>Select option</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <button 
      type="button"
      class="custom-select-trigger"
      :class="{ 'active': isOpen }"
      @click="toggleDropdown"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <span v-if="modelValue" class="selected-text">{{ modelValue }}</span>
      <span v-else class="placeholder-text">{{ placeholder }}</span>
      
      <span class="chevron-icon" :class="{ 'rotated': isOpen }"></span>
    </button>

    <teleport to="body" :disabled="!appendToBody">
      <transition name="dropdown-fade">
        <div
          v-if="isOpen"
          class="custom-select-popover"
          :class="{ 'is-teleported': appendToBody }"
          :style="popoverStyle"
          ref="popoverRef"
        >
          <ul class="custom-select-options" role="listbox">
            <li 
              v-for="option in options" 
              :key="option"
              class="custom-option"
              :class="{ 'selected': modelValue === option }"
              role="option"
              :aria-selected="modelValue === option"
              @click="selectOption(option)"
            >
              <span class="option-label">{{ option }}</span>
              
              <svg v-if="modelValue === option" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="var(--accent, #4f8ef7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </li>
          </ul>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select option'
  },
  appendToBody: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const selectRef = ref(null);
const popoverRef = ref(null);

const coords = ref({ top: '0px', left: '0px', minWidth: '100%' });

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    updatePopoverPosition();
  }
};

const selectOption = (value) => {
  emit('update:modelValue', value);
  emit('change', value);
  isOpen.value = false;
};

const updatePopoverPosition = () => {
  if (!selectRef.value) return;

  const rect = selectRef.value.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Use the button width as base min-width fallback
  const triggerWidth = rect.width;
  
  // Calculate approximate height (6px padding + ~38px per row item)
  const dropdownHeight = 12 + (props.options.length * 38);

  let top = rect.bottom + (props.appendToBody ? scrollY : 0) + 6;
  let left = rect.left + (props.appendToBody ? scrollX : 0);

  // Flip upward if space at the bottom of viewport is tight
  if (rect.bottom + dropdownHeight > viewportHeight && rect.top - dropdownHeight > 0) {
    top = rect.top + (props.appendToBody ? scrollY : 0) - dropdownHeight - 6;
  }

  // Prevent list clip-off on small viewports or layout margins
  const safetyBufferWidth = Math.max(triggerWidth, 110); 
  if (left + safetyBufferWidth > viewportWidth) {
    left = viewportWidth - safetyBufferWidth - 16 + (props.appendToBody ? scrollX : 0);
  }

  coords.value = {
    top: `${top}px`,
    left: `${left}px`,
    minWidth: `${triggerWidth}px`
  };
};

watch(isOpen, (value) => {
  if (value) {
    window.addEventListener('scroll', updatePopoverPosition, true);
    window.addEventListener('resize', updatePopoverPosition);
  } else {
    window.removeEventListener('scroll', updatePopoverPosition, true);
    window.removeEventListener('resize', updatePopoverPosition);
  }
});

const popoverStyle = computed(() => {
  if (props.appendToBody) {
    return {
      position: 'absolute',
      top: coords.value.top,
      left: coords.value.left,
      minWidth: coords.value.minWidth
    };
  }
  return {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '6px',
    minWidth: '100%'
  };
});

const handleClickOutside = (event) => {
  const clickedInput = selectRef.value && selectRef.value.contains(event.target);
  const clickedPopover = popoverRef.value && popoverRef.value.contains(event.target);

  if (!clickedInput && !clickedPopover) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
  window.removeEventListener('scroll', updatePopoverPosition, true);
  window.removeEventListener('resize', updatePopoverPosition);
});
</script>

<style scoped>
.custom-select-container {
  position: relative;
  width: 100%;
}

.hidden-native-select {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.custom-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  text-align: left;
  user-select: none;
  background: var(--bg-2);
  border: 1px solid var(--border-strong, #334155);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  box-sizing: border-box;
}

.custom-select-trigger.active {
  border-color: var(--accent, #4f8ef7);
  box-shadow: 0 0 0 2px rgba(79, 142, 247, 0.2);
}

.placeholder-text {
  color: var(--text-3, #64748b);
}

.selected-text {
  color: var(--text, #f8fafc);
  font-weight: 500;
}

.chevron-icon {
  width: 10px;
  height: 6px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23a8b6d5'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  flex-shrink: 0;
  opacity: 0.8;
  margin-left: 8px;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
  filter: drop-shadow(0 0 3px var(--accent));
  opacity: 1;
}

/* ── FLOATING OVERLAY PANEL ── */
.custom-select-popover {
  box-sizing: border-box;
  /* Allows the menu to scale wider than tiny parent buttons automatically */
  width: max-content !important; 
  /* Sets an optimal proportional baseline width */
  max-width: 280px; 
}

.custom-select-popover.is-teleported {
  z-index: 999999 !important;
}

.custom-select-options {
  margin: 0;
  padding: 6px;
  list-style: none;
  background: var(--panel);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

.custom-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  margin-bottom: 2px;
  font-size: 13.5px;
  color: var(--text-2);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.custom-option:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.custom-option.selected {
  background: rgba(79, 142, 247, 0.1);
  color: var(--accent);
  font-weight: 600;
}

/* Fluid Entry Animation Sequencer */
.dropdown-fade-enter-active {
  animation: slideInUp 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-leave-active {
  transition: opacity 0.1s linear;
}
.dropdown-fade-leave-to {
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