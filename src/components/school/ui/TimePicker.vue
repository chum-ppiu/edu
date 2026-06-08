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
          @click="period = 'AM'"
        >
          AM
        </span>
        <span 
          :class="{ 'ampm-active': period === 'PM' }"
          @click="period = 'PM'"
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
      <button class="btn btn-primary" type="button" @click="emitSelectionData">{{ t('common.ok') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n';
const emit = defineEmits(['confirm'])
const { t } = useI18n();
// Default target viewport values based on provided image reference metrics
const selectedHour = ref(10)
const selectedMinute = ref(25)
const period = ref('AM')
const activeMode = ref('minute') // 'hour' | 'minute'

// Dynamically toggles configurations to prevent numbers from crossing over
const currentViewNumbers = computed(() => {
  return activeMode.value === 'hour'
    ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
})

const isNodeSelected = (val) => {
  return activeMode.value === 'hour' ? selectedHour.value === val : selectedMinute.value === val
}

// Maps value indexes cleanly onto a standardized 360-degree radial rotational grid
const getTargetAngle = (val) => {
  const positionIndex = currentViewNumbers.value.indexOf(val)
  return positionIndex * 30 // 12 distinct points * 30 degrees = 360 degrees
}

// Uses smooth trigonometric layouts to space metrics near inner boundaries without clipping
const calculateNodePlacement = (val) => {
  const angleRad = (getTargetAngle(val) - 90) * (Math.PI / 180)
  const dialRadius = 94 // Balanced layout spacing offset
  const positionX = dialRadius * Math.cos(angleRad)
  const positionY = dialRadius * Math.sin(angleRad)
  
  return {
    transform: `translate(${positionX}px, ${positionY}px)`
  }
}

// Computes structural pointer track system vectors based on active value adjustments
const handRotationStyle = computed(() => {
  const activeValue = activeMode.value === 'hour' ? selectedHour.value : selectedMinute.value
  const targetRotation = getTargetAngle(activeValue)
  
  return {
    transform: `rotate(${targetRotation}deg)`
  }
})

const formatNumber = (val) => String(val).padStart(2, '0')

const handleDialSelection = (val) => {
  if (activeMode.value === 'hour') {
    selectedHour.value = val
    activeMode.value = 'minute' // Automatic step cascade transition sequence
  } else {
    selectedMinute.value = val
  }
}

const emitSelectionData = () => {
  emit('confirm', {
    hour: selectedHour.value,
    minute: selectedMinute.value,
    period: period.value,
    formatted: `${formatNumber(selectedHour.value)}:${formatNumber(selectedMinute.value)} ${period.value}`
  })
}
</script>

<style scoped>
/* Main Component Outer Frame Card */
.pro-timepicker {
  display: inline-flex;
  flex-direction: column;
  width: 310px;
  background-color: var(--bg-2); /* #0b1728 */
  border: 1px solid var(--border); /* rgba(141, 169, 220, 0.16) */
  border-radius: var(--radius-xl); /* 24px */
  overflow: hidden;
  font-family: var(--font-family-main, sans-serif);
  user-select: none;
  box-shadow: var(--shadow);
}

/* --- BANNER HEADER DISPLAY --- */
.timepicker-banner {
  background-color: var(--bg-3); /* Solid premium integration background variant */
  border-bottom: 1px solid var(--border); /* */
  padding: 24px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-time-digits {
  display: flex;
  align-items: center;
  font-size: 58px;
  font-weight: 700;
  line-height: 1;
}

.banner-digit {
  color: var(--text-3); /* #6f81a8 unselected placeholder */
  cursor: pointer;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

.banner-separator {
  color: var(--text-3); /* */
  margin: 0 6px;
  opacity: 0.5;
  position: relative;
  top: -4px;
}

/* AM/PM Navigation Stack Layout adjustments */
.banner-ampm-col {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 700;
  gap: 8px;
  align-self: flex-end;
  margin-bottom: 2px;
  color: var(--text-3); /* */
}

.banner-ampm-col span {
  cursor: pointer;
  transition: color 0.2s ease;
}

/* Color Tokens applied from your base variables */
.digit-active,
.ampm-active {
  color: var(--text) !important; /* Premium focused glowing look (#edf2ff) */
  text-shadow: 0 0 12px rgba(25, 212, 179, 0.3);
}

/* --- MAIN CLOCK DIAL CANVAS --- */
.timepicker-body {
  padding: 32px 24px 24px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-2); /* Matches master component wrapper */
}

.clock-face-canvas {
  position: relative;
  width: 240px;
  height: 240px;
  background-color: var(--panel-strong); /* #131f35 contrasting surface */
  border: 1px solid var(--border); /* */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Center Core Axis Node Pin */
.clock-axis-pin {
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: var(--bg-3); /* #131f35 contrasting surface */
  border: 1px solid var(--border); /* */
  z-index: 5;
}

/* Radial Coordinate Grid Items */
.clock-dial-number {
  position: absolute;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text); /* Clear readable blueish-gray default text color */
  border-radius: 50%;
  cursor: pointer;
  z-index: 3;
  transition: color 0.15s ease, font-weight 0.15s ease;
}
.clock-dial-number:hover {
  background-color: var(--shadow-strong);
}

/* Active number styling transformation overlay */
.clock-dial-number.node-active {
  font-weight: 800;
}

/* --- TRACKING HAND POINTER SYSTEM --- */
.clock-pointer-hand {
  position: absolute;
  bottom: 50%;
  left: calc(50% - 1px);
  width: 2px;
  height: 94px;
  background-color: var(--bg); 
  box-shadow: 0 0 14px #4f8df764;
  transform-origin: bottom center;
  z-index: 2;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Target Selection Loop Outer Tracking Ring */
.clock-selection-bubble {
  position: absolute;
  top: -18px;
  left: -17px;
  width: 36px;
  height: 36px;
  background-color: var(--bg-3); 
  box-shadow: 0 0 14px #4f8df764;
  border-radius: 50%;
}

/* --- FOOTER ACTION SPECIFICS --- */
.timepicker-footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 24px 24px 24px;
  gap: 12px;
  background-color: var(--bg-2);
}

.picker-btn {
  background: transparent;
  border: none;
  border-radius: var(--radius-sm); /* 10px */
  min-width: 72px;
  height: 36px;
  padding: 0 12px;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.picker-btn:hover {
  background-color: rgba(141, 169, 220, 0.08);
  transform: translateY(-1px);
}

.picker-btn:active {
  transform: translateY(0);
}
</style>