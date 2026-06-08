<template>
  <div class="pro-timepicker">
    <div class="timepicker-banner">
      <div class="banner-time-digits">
        <span 
          class="banner-digit" 
          :class="{ 'digit-active': activeMode === 'hour' }"
          @click="activeMode = 'hour'"
        >
          {{ formatNumber(selectedHour) }}
        </span>
        
        <span class="banner-separator">:</span>
        
        <span 
          class="banner-digit" 
          :class="{ 'digit-active': activeMode === 'minute' }"
          @click="activeMode = 'minute'"
        >
          {{ formatNumber(selectedMinute) }}
        </span>
      </div>

      <div class="banner-ampm-col">
        <span 
          :class="{ 'ampm-active': period === 'AM' }"
          @click="updatePeriod('AM')"
        >
          AM
        </span>
        <span 
          :class="{ 'ampm-active': period === 'PM' }"
          @click="updatePeriod('PM')"
        >
          PM
        </span>
      </div>
    </div>

    <div class="timepicker-body">
      <div class="clock-face-canvas">
        <div class="clock-pointer-hand" :style="handRotationStyle">
          <div class="clock-selection-bubble"></div>
        </div>
        
        <div class="clock-axis-pin"></div>

        <span
          v-for="nodeValue in currentViewNumbers"
          :key="nodeValue"
          class="clock-dial-number"
          :class="{ 'node-active': isNodeSelected(nodeValue) }"
          :style="calculateNodePlacement(nodeValue)"
          @click="handleDialSelection(nodeValue)"
        >
          {{ activeMode === 'minute' ? formatNumber(nodeValue) : nodeValue }}
        </span>
      </div>
    </div>

    <div class="timepicker-footer-actions">
      <button class="btn btn-primary" type="button" @click="emitSelectionData">
        {{ t('common.ok') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: String,
    default: '12:00 AM'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])
const { t } = useI18n()

const selectedHour = ref(12)
const selectedMinute = ref(0)
const period = ref('AM')
const activeMode = ref('hour') // Defaulting to hours selection on view launch

const currentViewNumbers = computed(() => {
  return activeMode.value === 'hour'
    ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
})

// Robust parsing logic processing variation instances cleanly (e.g. "09:00 am", "11:22 PM")
const parseTimeString = (timeString) => {
  if (!timeString) return
  
  const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(am|pm)/i)
  if (match) {
    selectedHour.value = parseInt(match[1], 10)
    selectedMinute.value = parseInt(match[2], 10)
    period.value = match[3].toUpperCase()
  }
}

// Keep local component state dynamically updated when base props change
watch(() => props.modelValue, (newVal) => {
  parseTimeString(newVal)
}, { immediate: true })

const isNodeSelected = (val) => {
  return activeMode.value === 'hour' ? selectedHour.value === val : selectedMinute.value === val
}

const getTargetAngle = (val) => {
  const positionIndex = currentViewNumbers.value.indexOf(val)
  return positionIndex >= 0 ? positionIndex * 30 : 0
}

const calculateNodePlacement = (val) => {
  const angleRad = (getTargetAngle(val) - 90) * (Math.PI / 180)
  const dialRadius = 65 
  const positionX = dialRadius * Math.cos(angleRad)
  const positionY = dialRadius * Math.sin(angleRad)
  
  return {
    transform: `translate(${positionX}px, ${positionY}px)`
  }
}

const handRotationStyle = computed(() => {
  const activeValue = activeMode.value === 'hour' ? selectedHour.value : selectedMinute.value
  return {
    transform: `rotate(${getTargetAngle(activeValue)}deg)`
  }
})

const formatNumber = (val) => String(val).padStart(2, '0')

const updatePeriod = (p) => {
  period.value = p
  updateModel()
}

const handleDialSelection = (val) => {
  if (activeMode.value === 'hour') {
    selectedHour.value = val
    activeMode.value = 'minute' 
  } else {
    selectedMinute.value = val
  }
  updateModel()
}

const updateModel = () => {
  const formatted = `${formatNumber(selectedHour.value)}:${formatNumber(selectedMinute.value)} ${period.value.toLowerCase()}`
  emit('update:modelValue', formatted)
}

const emitSelectionData = () => {
  const formatted = `${formatNumber(selectedHour.value)}:${formatNumber(selectedMinute.value)} ${period.value.toLowerCase()}`
  emit('confirm', {
    hour: selectedHour.value,
    minute: selectedMinute.value,
    period: period.value,
    formatted
  })
}
</script>

<style scoped>
.pro-timepicker {
  display: inline-flex;
  flex-direction: column;
  width: 220px; 
  background-color: var(--bg-2); 
  border: 1px solid var(--border); 
  border-radius: var(--radius-md); 
  overflow: hidden;
  font-family: var(--font-family-main, sans-serif);
  user-select: none;
  box-shadow: var(--shadow);
}
.timepicker-banner {
  background-color: var(--bg-3); 
  border-bottom: 1px solid var(--border); 
  padding: 16px 20px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.banner-time-digits {
  display: flex;
  align-items: center;
  font-size: 34px; 
  font-weight: 500;
  line-height: 1;
}
.banner-digit {
  color: var(--text-3); 
  cursor: pointer;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}
.banner-separator {
  color: var(--text-3); 
  margin: 0 4px;
  opacity: 0.5;
  position: relative;
  top: -2px;
}
.banner-ampm-col {
  display: flex;
  flex-direction: column;
  font-size: 14px; 
  font-weight: 700;
  gap: 4px; 
  align-self: flex-end;
  margin-bottom: 2px;
  color: var(--text-3); 
}
.banner-ampm-col span {
  cursor: pointer;
  transition: color 0.2s ease;
}
.digit-active,
.ampm-active {
  color: var(--text) !important; 
  text-shadow: 0 0 12px rgba(25, 212, 179, 0.3);
}
.timepicker-body {
  padding: 16px; 
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-2); 
}
.clock-face-canvas {
  position: relative;
  width: 170px; 
  height: 170px; 
  background-color: var(--panel-strong); 
  border: 1px solid var(--border); 
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.clock-axis-pin {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--bg-3); 
  border: 1px solid var(--border); 
  z-index: 5;
}
.clock-dial-number {
  position: absolute;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px; 
  font-weight: 600;
  color: var(--text);
  border-radius: 50%;
  cursor: pointer;
  z-index: 3;
  transition: color 0.15s ease, font-weight 0.15s ease;
}
.clock-dial-number:hover {
  background-color: var(--shadow-strong);
}
.clock-dial-number.node-active {
  font-weight: 800;
}
.clock-pointer-hand {
  position: absolute;
  bottom: 50%;
  left: calc(50% - 1px);
  width: 2px;
  height: 65px; 
  background-color: var(--bg); 
  box-shadow: 0 0 14px #4f8df764;
  transform-origin: bottom center;
  z-index: 2;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.clock-selection-bubble {
  position: absolute;
  top: -14px; 
  left: -13px; 
  width: 28px; 
  height: 28px;
  background-color: var(--bg-3); 
  box-shadow: 0 0 14px #4f8df764;
  border-radius: 50%;
}
.timepicker-footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 16px 16px 16px;
  gap: 12px;
  background-color: var(--bg-2);
}
</style>