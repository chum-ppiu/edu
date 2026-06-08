<template>
  <div class="mini-cal-panel">
    <div class="mini-cal-header">
      <div class="mini-selectors-group">
        <div class="custom-select-wrapper filter-dropdown">
          <select :value="currentMonth" @change="onMonthChange" class="filter-input header-select month-select">
            <option v-for="(m, idx) in monthsLabels" :key="idx" :value="idx">
              {{ m }}
            </option>
          </select>
        </div>
        <div class="custom-select-wrapper filter-dropdown">
          <select :value="currentYear" @change="onYearChange" class="filter-input header-select year-select">
            <option v-for="y in yearOptions" :key="y" :value="y">
              {{ y }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="mini-nav-group">
        <button class="mini-nav" @click="prevMonth" aria-label="Previous month">‹</button>
        <button class="mini-nav" @click="nextMonth" aria-label="Next month">›</button>
      </div>
    </div>

    <div class="mini-cal-grid">
      <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d" class="mini-dow">
        {{ d }}
      </span>
      <span
        v-for="cell in miniCalCells"
        :key="cell.key"
        class="mini-day"
        :class="{
          'mini-empty': !cell.day,
          'mini-today': cell.isToday && cell.day,
          'mini-selected': cell.isSelected && cell.day,
          'mini-has-event': cell.hasEvent && cell.day,
        }"
        @click="cell.day && handleDayClick(cell.date)"
      >
        <span class="day-number">{{ cell.day || '' }}</span>
      </span>
    </div>
    
    <button class="btn btn-primary btn-today" type="button" @click="jumpToToday">Today</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss'
  }
})

const emit = defineEmits(['update:modelValue', 'date-selected', 'today-clicked'])

const today = new Date()
const activeDate = ref(new Date())
const miniViewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

// Store tracked internal timestamp attributes
const savedHour = ref(today.getHours())
const savedMinute = ref(today.getMinutes())
const savedSecond = ref(today.getSeconds())

// Formats output strings perfectly to include requested seconds blocks
const formatDateString = (date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  
  if (props.format.includes('HH:mm:ss')) {
    const hh = String(savedHour.value).padStart(2, '0')
    const min = String(savedMinute.value).padStart(2, '0')
    const ss = String(savedSecond.value).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
  } else if (props.format.includes('HH:mm')) {
    const hh = String(savedHour.value).padStart(2, '0')
    const min = String(savedMinute.value).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`
  }
  
  return `${yyyy}-${mm}-${dd}`
}

// Secure string token parsing strategy
const parseStringToDate = (val) => {
  if (!val) {
    return { date: new Date(), hr: today.getHours(), min: today.getMinutes(), sec: today.getSeconds() }
  }
  
  const parts = val.split(' ')
  const datePart = parts[0] || ''
  const timePart = parts[1] || ''
  
  let targetDate = new Date()
  if (datePart.includes('-')) {
    const [y, m, d] = datePart.split('-').map(Number)
    targetDate = new Date(y, m - 1, d)
  }
  
  let hr = today.getHours()
  let min = today.getMinutes()
  let sec = today.getSeconds()
  
  if (timePart.includes(':')) {
    const timeSegments = timePart.split(':').map(Number)
    hr = isNaN(timeSegments[0]) ? hr : timeSegments[0]
    min = isNaN(timeSegments[1]) ? min : timeSegments[1]
    sec = isNaN(timeSegments[2]) ? 0 : timeSegments[2]
  }
  
  return { date: targetDate, hr, min, sec }
}

// Watch inputs from parents
watch(() => props.modelValue, (newVal) => {
  const { date, hr, min, sec } = parseStringToDate(newVal)
  activeDate.value = date
  savedHour.value = hr
  savedMinute.value = min
  savedSecond.value = sec
  miniViewDate.value = new Date(date.getFullYear(), date.getMonth(), 1)
}, { immediate: true })

const monthsLabels = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
]

const staticEventDays = ref([
  new Date(today.getFullYear(), today.getMonth(), 12).toDateString(),
  new Date(today.getFullYear(), today.getMonth(), 18).toDateString(),
  new Date(today.getFullYear(), today.getMonth() + 1, 5).toDateString(),
])

const currentMonth = computed(() => miniViewDate.value.getMonth())
const currentYear = computed(() => miniViewDate.value.getFullYear())

const yearOptions = computed(() => {
  const baseYear = today.getFullYear()
  const years = []
  for (let i = baseYear - 5; i <= baseYear + 5; i++) {
    years.push(i)
  }
  return years
})

const miniCalCells = computed(() => {
  const year = miniViewDate.value.getFullYear()
  const month = miniViewDate.value.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  let startOffset = firstDayOfMonth.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells = []
  for (let i = 0; i < startOffset; i++) {
    cells.push({ key: `empty-prev-${i}`, day: null })
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d)
    const dateString = dateObj.toDateString()
    
    cells.push({
      key: `curr-${d}`,
      day: d,
      date: dateObj,
      isToday: dateString === today.toDateString(),
      isSelected: dateString === activeDate.value.toDateString(),
      hasEvent: staticEventDays.value.includes(dateString)
    })
  }
  return cells
})

const prevMonth = () => {
  miniViewDate.value = new Date(miniViewDate.value.getFullYear(), miniViewDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  miniViewDate.value = new Date(miniViewDate.value.getFullYear(), miniViewDate.value.getMonth() + 1, 1)
}

const onMonthChange = (event) => {
  miniViewDate.value = new Date(miniViewDate.value.getFullYear(), parseInt(event.target.value), 1)
}

const onYearChange = (event) => {
  miniViewDate.value = new Date(parseInt(event.target.value), miniViewDate.value.getMonth(), 1)
}

const handleDayClick = (date) => {
  activeDate.value = date
  
  // If user selected day, generate string with the time/seconds preserved or live
  const outString = formatDateString(date)
  emit('update:modelValue', outString)
  
  // Create a combined custom object to send cleanly to @date-selected handler
  const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), savedHour.value, savedMinute.value, savedSecond.value)
  emit('date-selected', combinedDate)
}

const jumpToToday = () => {
  const currentToday = new Date()
  activeDate.value = currentToday
  
  savedHour.value = currentToday.getHours()
  savedMinute.value = currentToday.getMinutes()
  savedSecond.value = currentToday.getSeconds()
  miniViewDate.value = new Date(currentToday.getFullYear(), currentToday.getMonth(), 1)
  
  const outString = formatDateString(currentToday)
  emit('update:modelValue', outString)
  emit('today-clicked', currentToday)
}
</script>

<style scoped>
/* ── CALENDAR PANEL WRAPPER ── */
.mini-cal-panel { 
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  background: var(--panel, #ffffff); 
  border-radius: var(--radius-lg, 14px); 
  padding: 16px; 
  border: 1px solid var(--border, rgba(226, 232, 240, 0.8)); 
  font-family: var(--font-family-main, system-ui, sans-serif);
  box-sizing: border-box;
}

/* ── PRECISE HEADER LAYOUT ── */
.mini-cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 8px;
}

.mini-selectors-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.custom-select-wrapper {
  position: relative;
  display: inline-block;
}

.header-select {
  padding: 5px 22px 5px 8px !important;
}

.month-select { width: 105px; }
.year-select { width: 72px; font-weight: 500; }
.btn-today { margin-top: 12px; width: 100%; }
.mini-nav-group { display: flex; gap: 2px; }

.mini-nav { 
  background: var(--bg-2, #f8fafc); 
  border: 1px solid var(--border-strong, #cbd5e1); 
  color: var(--text-2, #64748b); 
  width: 30px; 
  height: 30px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.mini-nav:hover { 
  background: var(--border);
  color: var(--text);
}

.mini-nav:active { transform: scale(0.92); }

/* ── CALENDAR MATRIX GRID ── */
.mini-cal-grid { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  gap: 4px; 
  text-align: center; 
  width: 100%;
}

.mini-dow { 
  font-size: 10px; 
  font-weight: 700; 
  color: var(--text-3, #94a3b8); 
  padding: 6px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.mini-day { 
  position: relative;
  width: 100%;
  padding-top: 100%; 
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.day-number {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px; 
  color: var(--text-2, #475569); 
  font-weight: 500;
  z-index: 2;
  user-select: none;
}

.mini-day:not(.mini-empty) { cursor: pointer; }
.mini-day:not(.mini-empty):hover { 
  background: var(--shadow-strong, rgba(0, 0, 0, 0.05));
  transform: scale(1.06);
}

.mini-day:not(.mini-empty):hover .day-number {
  color: var(--text, #0f172a); 
  font-weight: 600;
}

.mini-day:not(.mini-empty):active { transform: scale(0.94); }

.mini-day.mini-today { 
  background: var(--accent, #3b82f6); 
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.25);
}
.mini-day.mini-today .day-number { color: #ffffff !important; font-weight: 700; }
.mini-day.mini-today:hover { background: var(--accent-hover, #2563eb); }

.mini-day.mini-selected { 
  background: rgba(59, 130, 246, 0.08); 
  box-shadow: inset 0 0 0 1px var(--accent, #3b82f6);
}
.mini-day.mini-selected .day-number { color: var(--accent, #3b82f6); font-weight: 700; }

.mini-day.mini-has-event::after { 
  content: ''; 
  position: absolute; 
  bottom: 14%; left: 50%; 
  transform: translateX(-50%); 
  width: 3.5px; height: 3.5px; 
  border-radius: 50%; 
  background: var(--accent-3, #10b981); 
  z-index: 3;
}
.mini-day.mini-today.mini-has-event::after { background: #ffffff; }

.mini-day.mini-empty { pointer-events: none; visibility: hidden; }
</style>