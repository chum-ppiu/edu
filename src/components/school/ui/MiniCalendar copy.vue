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
          'mini-range-start': cell.isRangeStart && cell.day,
          'mini-range-end': cell.isRangeEnd && cell.day,
          'mini-range-between': cell.isRangeBetween && cell.day,
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
  // Supports String (for single) or Array (for multiple / range)
  modelValue: {
    type: [String, Array],
    default: ''
  },
  // Selection Mode: 'single', 'multiple', or 'range'
  selectionMode: {
    type: String,
    default: 'single',
    validator: (val) => ['single', 'multiple', 'range'].includes(val)
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss'
  }
})

const emit = defineEmits(['update:modelValue', 'date-selected', 'today-clicked'])

const { locale } = useI18n()

const today = new Date()
const miniViewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

// Localized lists of standardized active text dates ('YYYY-MM-DD')
const activeDatesList = ref([])

const savedHour = ref(today.getHours())
const savedMinute = ref(today.getMinutes())
const savedSecond = ref(today.getSeconds())

// Dynamic localized labels for Months
const monthsLabels = computed(() => {
  return locale.value === 'km'
    ? ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
})

// Dynamic localized labels for Days of Week abbreviation headers
const localizedDaysOfWeek = computed(() => {
  return locale.value === 'km' 
    ? ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'] 
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
})

const localizedTodayLabel = computed(() => {
  return locale.value === 'km' ? 'ថ្ងៃនេះ' : 'Today'
})

// Helpers to handle normalized string parsing and matching
const getISODateString = (date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

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

// Sync properties into localized states securely
const parseInputToState = (val) => {
  if (!val || (Array.isArray(val) && val.length === 0)) {
    activeDatesList.value = []
    return today
  }

  if (Array.isArray(val)) {
    activeDatesList.value = val.filter(v => v).map(v => v.split(' ')[0])
    if (activeDatesList.value.length > 0) {
      const parts = activeDatesList.value[0].split('-').map(Number)
      return new Date(parts[0], parts[1] - 1, parts[2] || 1)
    }
    return today
  }

  const datePart = val.split(' ')[0]
  const timePart = val.split(' ')[1] || ''
  activeDatesList.value = [datePart]

  let targetDate = new Date()
  if (datePart.includes('-')) {
    const [y, m, d] = datePart.split('-').map(Number)
    targetDate = new Date(y, m - 1, d)
  }

  if (timePart.includes(':')) {
    const segments = timePart.split(':').map(Number)
    savedHour.value = isNaN(segments[0]) ? savedHour.value : segments[0]
    savedMinute.value = isNaN(segments[1]) ? savedMinute.value : segments[1]
    savedSecond.value = isNaN(segments[2]) ? 0 : segments[2]
  }

  return targetDate
}

watch(() => props.modelValue, (newVal) => {
  const primaryDate = parseInputToState(newVal)
  // Only change month view automatically if the calendar panel doesn't have initialized values yet
  if (!miniViewDate.value) {
    miniViewDate.value = new Date(primaryDate.getFullYear(), primaryDate.getMonth(), 1)
  }
}, { immediate: true })

const staticEventDays = ref([
  new Date(today.getFullYear(), today.getMonth(), 12).toDateString(),
  new Date(today.getFullYear(), today.getMonth(), 18).toDateString(),
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
    const isoStr = getISODateString(dateObj)
    
    let isSelected = false
    let isRangeStart = false
    let isRangeEnd = false
    let isRangeBetween = false

    if (props.selectionMode === 'range' && activeDatesList.value.length > 0) {
      const start = activeDatesList.value[0]
      const end = activeDatesList.value[1]
      
      isRangeStart = isoStr === start
      isRangeEnd = isoStr === end
      isSelected = isRangeStart || isRangeEnd
      
      if (start && end) {
        isRangeBetween = isoStr > start && isoStr < end
      }
    } else {
      isSelected = activeDatesList.value.includes(isoStr)
    }
    
    cells.push({
      key: `curr-${d}`,
      day: d,
      date: dateObj,
      isToday: dateString === today.toDateString(),
      isSelected,
      isRangeStart,
      isRangeEnd,
      isRangeBetween,
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
  const isoStr = getISODateString(date)
  const formattedStr = formatDateString(date)
  
  if (props.selectionMode === 'multiple') {
    let updatedList = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    if (activeDatesList.value.includes(isoStr)) {
      updatedList = updatedList.filter(item => item.split(' ')[0] !== isoStr)
    } else {
      updatedList.push(formattedStr)
    }
    emit('update:modelValue', updatedList)
    
  } else if (props.selectionMode === 'range') {
    let updatedRange = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    
    // If no dates are selected, or a complete range already existed, restart selection
    if (updatedRange.length === 0 || updatedRange.length === 2) {
      updatedRange = [formattedStr]
    } else if (updatedRange.length === 1) {
      const startIso = updatedRange[0].split(' ')[0]
      // Swap order if the selected second date is earlier than the first date
      if (isoStr < startIso) {
        updatedRange = [formattedStr, updatedRange[0]]
      } else {
        updatedRange.push(formattedStr)
      }
    }
    emit('update:modelValue', updatedRange)
    
  } else {
    // Standard 'single' mode
    emit('update:modelValue', formattedStr)
  }
  
  const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), savedHour.value, savedMinute.value, savedSecond.value)
  emit('date-selected', combinedDate)
}

const jumpToToday = () => {
  const currentToday = new Date()
  miniViewDate.value = new Date(currentToday.getFullYear(), currentToday.getMonth(), 1)
  
  const outString = formatDateString(currentToday)
  if (props.selectionMode === 'single') {
    emit('update:modelValue', outString)
  } else {
    emit('update:modelValue', [outString])
  }
  emit('today-clicked', currentToday)
}
</script>

<style scoped>
/* ── CALENDAR PANEL WRAPPER ── */
.mini-cal-panel { 
  width: 100%;
  background: var(--panel, #ffffff); 
  border-radius: var(--radius-lg, 14px); 
  padding: 12px; 
  border: 1px solid var(--border, rgba(226, 232, 240, 0.8)); 
  font-family: var(--font-family-main, system-ui, sans-serif);
  box-sizing: border-box;
}

/* ── COMPACT HEADER LAYOUT ── */
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

.month-select { width: 88px; }
.year-select { width: 62px; }

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

.mini-nav:hover { background: var(--bg-3, #f1f5f9); color: var(--text, #1e293b); }

/* ── CALENDAR MATRIX GRID ── */
.mini-cal-grid { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  gap: 2px 0px; /* Tight horizontal gap to connect range backgrounds cleanly */
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
  z-index: 2;
}

.mini-day:not(.mini-empty) { cursor: pointer; }

/* Highlight Circle Effects */
.mini-day:not(.mini-empty)::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  background: transparent;
  z-index: 1;
}

.mini-day:not(.mini-empty):not(.mini-selected):not(.mini-range-between):hover::before { 
  background: var(--shadow-strong, rgba(0, 0, 0, 0.05));
}

.mini-day.mini-today::before { 
  background: var(--accent, #3b82f6) !important; 
}
.mini-day.mini-today .day-number { color: #ffffff !important; font-weight: 700; }

/* ── PRIMEVUE STYLE RANGE/SELECTION STATE VARIATIONS ── */
.mini-day.mini-selected::before,
.mini-day.mini-range-start::before,
.mini-day.mini-range-end::before {
  background: var(--accent, #3b82f6);
  border-radius: 50%;
}
.mini-day.mini-selected .day-number,
.mini-day.mini-range-start .day-number,
.mini-day.mini-range-end .day-number {
  color: #ffffff !important;
  font-weight: 700;
}

/* Beautiful Connected Background for Ranges */
.mini-day.mini-range-between {
  background: rgba(59, 130, 246, 0.08);
}
.mini-day.mini-range-between .day-number {
  color: var(--accent, #3b82f6);
  font-weight: 600;
}

/* Round off outer edges of selection handles */
.mini-day.mini-range-start {
  background: linear-gradient(to right, transparent 50%, rgba(59, 130, 246, 0.08) 50%);
}
.mini-day.mini-range-end {
  background: linear-gradient(to left, transparent 50%, rgba(59, 130, 246, 0.08) 50%);
}

/* Dot indicator for internal layout markers */
.mini-day.mini-has-event::after { 
  content: ''; 
  position: absolute; 
  bottom: 12%; left: 50%; 
  transform: translateX(-50%); 
  width: 3px; height: 3px; 
  border-radius: 50%; 
  background: var(--accent-3, #10b981); 
  z-index: 3;
}
.mini-day.mini-today.mini-has-event::after,
.mini-day.mini-selected.mini-has-event::after { background: #ffffff; }

.mini-day.mini-empty { pointer-events: none; visibility: hidden; }

.btn-today {
  margin-top: 10px;
  width: 100%;
  padding: 6px;
  font-size: 12px;
  height: auto;
}
</style>