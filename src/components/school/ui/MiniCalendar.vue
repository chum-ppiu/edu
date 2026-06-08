<template>
  <div class="mini-cal-panel">
    <div class="mini-cal-header">
      <div class="mini-selectors-group">
        <div class="custom-select-wrapper filter-dropdown">
          <select :value="currentMonth" @change="onMonthChange" class="header-select month-select filter-input">
            <option v-for="(m, idx) in monthsLabels" :key="idx" :value="idx">
              {{ m }}
            </option>
          </select>
        </div>
        <div class="custom-select-wrapper filter-dropdown">
          <select :value="currentYear" @change="onYearChange" class="header-select year-select filter-input">
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
      <span v-for="d in localizedDaysOfWeek" :key="d" class="mini-dow">
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
    
    <button class="btn btn-primary btn-today" type="button" @click="jumpToToday">
      {{ localizedTodayLabel }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

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

// Initialize your i18n instance hook
const { locale } = useI18n()

const today = new Date()
const activeDate = ref(new Date())
const miniViewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const savedHour = ref(today.getHours())
const savedMinute = ref(today.getMinutes())
const savedSecond = ref(today.getSeconds())

// Dynamic localized labels for Months
const monthsLabels = computed(() => {
  if (locale.value === 'km') {
    return [
      'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
      'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
    ]
  }
  return [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
})

// Dynamic localized labels for Days of Week abbreviation headers
const localizedDaysOfWeek = computed(() => {
  if (locale.value === 'km') {
    return ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា']
  }
  return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
})

// Dynamic text label for the "Today" button action footer
const localizedTodayLabel = computed(() => {
  return locale.value === 'km' ? 'ថ្ងៃនេះ' : 'Today'
})

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

watch(() => props.modelValue, (newVal) => {
  const { date, hr, min, sec } = parseStringToDate(newVal)
  activeDate.value = date
  savedHour.value = hr
  savedMinute.value = min
  savedSecond.value = sec
  miniViewDate.value = new Date(date.getFullYear(), date.getMonth(), 1)
}, { immediate: true })

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
  const outString = formatDateString(date)
  emit('update:modelValue', outString)
  
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
  max-width: 300px;
  margin: 0 auto;
  background: var(--panel, #ffffff); 
  border-radius: var(--radius-lg, 14px); 
  padding: 16px; 
  border: 1px solid var(--border, rgba(226, 232, 240, 0.8)); 
  font-family: var(--font-family-main, system-ui, sans-serif);
  box-sizing: border-box;
}

/* ── REFACTORED COMPACT HEADER LAYOUT ── */
.mini-cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 4px;
  width: 100%;
}

.mini-selectors-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.custom-select-wrapper {
  position: relative;
  display: inline-block;
  min-width: 0;
}

.header-select {
  background: var(--bg-2, #f8fafc);
  border: 1px solid var(--border-strong, #cbd5e1);
  border-radius: 6px;
  padding: 4px 16px 4px 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text, #1e293b);
  cursor: pointer;
  appearance: none;
  outline: none;
  width: 100%;
  height: 28px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%2364748b'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}

.month-select {
  width: 88px;
}

.year-select {
  width: 62px;
}

.mini-nav-group {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.mini-nav { 
  background: var(--bg-2, #f8fafc); 
  border: 1px solid var(--border-strong, #cbd5e1); 
  color: var(--text-2, #64748b); 
  width: 26px; 
  height: 26px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.mini-nav:hover { 
  background: var(--border);
  color: var(--text, #1e293b);
}

/* ── CALENDAR MATRIX GRID ── */
.mini-cal-grid { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  gap: 2px; 
  text-align: center; 
  width: 100%;
}

.mini-dow { 
  font-size: 10px; 
  font-weight: 700; 
  color: var(--text-3, #94a3b8); 
  padding: 4px 0; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.mini-day { 
  position: relative;
  width: 100%;
  padding-top: 100%; 
  border-radius: 50%;
  background: transparent;
}

.day-number {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px; 
  color: var(--text-2, #475569); 
  font-weight: 500;
  user-select: none;
}

.mini-day:not(.mini-empty) { cursor: pointer; }
.mini-day:not(.mini-empty):hover { 
  background: var(--shadow-strong, rgba(0, 0, 0, 0.05));
}
.mini-day:not(.mini-empty):hover .day-number {
  color: var(--text, #0f172a); 
  font-weight: 600;
}

.mini-day.mini-today { 
  background: var(--accent, #3b82f6); 
}
.mini-day.mini-today .day-number { color: #ffffff !important; font-weight: 700; }

.mini-day.mini-selected { 
  background: rgba(59, 130, 246, 0.08); 
  box-shadow: inset 0 0 0 1px var(--accent, #3b82f6);
}
.mini-day.mini-selected .day-number { color: var(--accent, #3b82f6); font-weight: 700; }

.mini-day.mini-has-event::after { 
  content: ''; 
  position: absolute; 
  bottom: 12%; left: 50%; 
  transform: translateX(-50%); 
  width: 3px; height: 3px; 
  border-radius: 50%; 
  background: var(--accent-3, #10b981); 
}
.mini-day.mini-today.mini-has-event::after { background: #ffffff; }

.mini-day.mini-empty { pointer-events: none; visibility: hidden; }

.btn-today {
  margin-top: 10px;
  width: 100%;
  padding: 6px;
  font-size: 12px;
  height: auto;
}
</style>