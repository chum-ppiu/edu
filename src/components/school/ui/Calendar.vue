<template>
  <div class="app-shell">
    
    <div class="app-layout">
      
      <div class="main-area">
        <header class="cal-header">
          <div class="header-filters">
            <div class="filter-dropdown">
              <select v-model="filterClass" @change="applyFilters">
                <option value="">All Classes</option>
                <option v-for="c in classOptions" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="filter-dropdown">
              <select v-model="filterTeacher" @change="applyFilters">
                <option value="">All Teachers</option>
                <option v-for="t in teacherOptions" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <button class="btn-reset-header" v-if="filterClass || filterTeacher" @click="resetFilters">✕ Reset</button>
          </div>

          <button class="btn-new-event" @click="openNewEventModal">+ New Event</button>
        </header>

        <div class="cal-scroll">
          <div class="cal-grid">
            <div class="time-col-header"></div>
            <div
              v-for="day in weekDays"
              :key="day.iso"
              class="day-header"
              :class="{ today: day.isToday, 'day-off-header': isDayOff(day) }"
            >
              <span class="day-name">{{ day.name }}</span>
              <span class="day-num">{{ day.num }}</span>
            </div>

            <template v-for="hour in hours" :key="hour">
              <div class="time-label">{{ formatHour(hour) }}</div>
              <div
                v-for="day in weekDays"
                :key="day.iso + hour"
                class="cell"
                :class="{ 'day-off': isDayOff(day) }"
                @click="onCellClick"
              >
                <span v-if="isDayOff(day) && hour === 9" class="day-off-label">Day off</span>
                <template v-for="evt in getEventsForCell(day.iso, hour)" :key="evt.id">
                  <div
                    class="event-chip"
                    :class="evt.colorClass"
                    :style="{ height: chipHeight(evt) + 'px', top: chipOffset(evt) + 'px' }"
                    @click.stop="openEvent(evt)"
                  >
                    <span class="event-icon">{{ evt.icon }}</span>
                    <div class="event-info">
                      <div class="event-title">{{ evt.title }}</div>
                      <div class="event-time">{{ evt.startTime }} – {{ evt.endTime }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>

      <aside class="sidebar-right">
        <div class="mini-cal-panel">
          <div class="mini-cal-header">
            <button class="mini-nav" @click="prevMiniMonth">‹</button>
            <span class="mini-month-label">{{ miniMonthLabel }}</span>
            <button class="mini-nav" @click="nextMiniMonth">›</button>
          </div>
          <div class="mini-cal-grid">
            <span v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d" class="mini-dow">{{ d }}</span>
            <span
              v-for="cell in miniCalCells"
              :key="cell.key"
              class="mini-day"
              :class="{
                'mini-empty': !cell.day,
                'mini-today': cell.isToday,
                'mini-selected': cell.isInSelectedWeek,
                'mini-has-event': cell.hasEvent,
              }"
              @click="cell.day && jumpToDate(cell.date)"
            >
              {{ cell.day || '' }}
            </span>
          </div>
          <button class="btn-today" @click="jumpToToday">Jump to Today</button>
        </div>
      </aside>

    </div>

    <transition name="popup">
      <div v-if="selectedEvent" class="event-popup">
        <div class="popup-header">
          <div class="popup-badge" :class="selectedEvent.colorClass">
            <span>{{ selectedEvent.icon }}</span>
            <strong>{{ selectedEvent.title }}</strong>
          </div>
          <div class="popup-actions">
            <button title="Edit" @click="editEvent(selectedEvent)">✏️</button>
            <button title="Delete" @click="deleteEvent(selectedEvent)">🗑️</button>
            <button title="Close" @click="selectedEvent = null">✕</button>
          </div>
        </div>
        <div class="popup-body">
          <p class="popup-eyebrow">Event on {{ selectedEvent.dayLabel }}</p>
          <h3 class="popup-title">{{ selectedEvent.fullTitle || selectedEvent.title }}</h3>
          <p class="popup-desc">{{ selectedEvent.description }}</p>
          <div class="popup-time-row">
            <span class="popup-time-chip">🕐 {{ selectedEvent.startTime }} – {{ selectedEvent.endTime }}</span>
            <span class="popup-date-chip">{{ selectedEvent.dateLabel }}</span>
          </div>
          <div class="popup-details">
            <div class="detail-row"><span class="detail-key">Teacher</span><span class="detail-val">{{ selectedEvent.teacher || '—' }}</span></div>
            <div class="detail-row"><span class="detail-key">Class</span><span class="detail-val">{{ selectedEvent.className }}</span></div>
            <div class="detail-row"><span class="detail-key">Room</span><span class="detail-val">{{ selectedEvent.room }}</span></div>
          </div>
          <button class="btn-share">🔗 Share link</button>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>New Class Event</h3>
            <button @click="showModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group"><label>Title</label><input v-model="newEvent.title" placeholder="e.g. Physics Class" /></div>
            <div class="form-row">
              <div class="form-group"><label>Class</label>
                <select v-model="newEvent.className">
                  <option v-for="c in classOptions" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div class="form-group"><label>Teacher</label>
                <select v-model="newEvent.teacher">
                  <option v-for="t in teacherOptions" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Start Time</label><input v-model="newEvent.startTime" type="time" /></div>
              <div class="form-group"><label>End Time</label><input v-model="newEvent.endTime" type="time" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Day</label>
                <select v-model="newEvent.dayIso">
                  <option v-for="d in weekDays" :key="d.iso" :value="d.iso">{{ d.name }}, {{ d.num }}</option>
                </select>
              </div>
              <div class="form-group"><label>Room</label><input v-model="newEvent.room" placeholder="e.g. Room 101" /></div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showModal = false">Cancel</button>
            <button class="btn-save" @click="saveEvent">Save Event</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Helper configuration arrays
const hours = Array.from({ length: 13 }, (_, i) => i + 7)
const classOptions = ['Physics', 'Mathematics', 'Art', 'Chemistry', 'Physical Education', 'Lunch Break', 'Math']
const teacherOptions = ['Mr. Johnson', 'Ms. Smith', 'Dr. Lee', 'Mrs. Patel', 'Mr. Brown']

// Helper function for calculations
const getMonday = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  return d
}

// Stateful Reactive Elements
const today = new Date()
const weekStart = ref(getMonday(today))
const miniViewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const filterClass = ref('')
const filterTeacher = ref('')
const selectedEvent = ref(null)
const showModal = ref(false)

const newEvent = reactive({
  title: '',
  className: '',
  teacher: '',
  startTime: '08:00',
  endTime: '09:00',
  dayIso: '',
  room: ''
})

const events = ref([
  { id:1, title:'Physics class',      fullTitle:'Physics Class (Advanced)',      description:'Wave mechanics & optics',      className:'Physics',            teacher:'Mr. Johnson', room:'Lab 2',    dayOffset:0, startHour:8,  startMin:0,  endHour:9,  endMin:0,  startTime:'08:00 AM', endTime:'09:00 AM', icon:'⚛️', colorClass:'chip-orange' },
  { id:2, title:'Art class',           fullTitle:'Art & Design Studio',             description:'Watercolor techniques',        className:'Art',                teacher:'Ms. Smith',   room:'Studio A', dayOffset:2, startHour:9,  startMin:0,  endHour:10, endMin:30, startTime:'09:00 AM', endTime:'10:30 AM', icon:'🎨', colorClass:'chip-pink'   },
  { id:3, title:'Homecoming',          fullTitle:'Homecoming for Graduates (MCG)',  description:'Meeting with Starview Academy', className:'Mathematics',        teacher:'Dr. Lee',     room:'Hall B',   dayOffset:0, startHour:10, startMin:0,  endHour:11, endMin:30, startTime:'10:00 AM', endTime:'11:30 AM', icon:'🎓', colorClass:'chip-red'    },
  { id:4, title:'Physical Education', fullTitle:'Physical Education',              description:'Football & fitness drills',     className:'Physical Education', teacher:'Mr. Brown',   room:'Gym',      dayOffset:1, startHour:10, startMin:30, endHour:12, endMin:0,  startTime:'10:30 AM', endTime:'12:00 PM', icon:'🏃', colorClass:'chip-teal'   },
  { id:5, title:'Chemistry',           fullTitle:'Chemistry Lab',                   description:'Titration experiment',         className:'Chemistry',          teacher:'Mrs. Patel',  room:'Lab 1',    dayOffset:3, startHour:9,  startMin:0,  endHour:10, endMin:45, startTime:'09:00 AM', endTime:'10:45 AM', icon:'🧪', colorClass:'chip-yellow' },
  { id:6, title:'Math class',          fullTitle:'Mathematics (Calculus)',          description:'Differentiation & integration', className:'Math',               teacher:'Dr. Lee',     room:'Room 204', dayOffset:4, startHour:8,  startMin:0,  endHour:9,  endMin:30, startTime:'08:00 AM', endTime:'09:30 AM', icon:'📐', colorClass:'chip-purple' },
  { id:7, title:'Lunch break',         fullTitle:'Lunch Break',                     description:'Free period',                  className:'Lunch Break',        teacher:'',            room:'Cafeteria',dayOffset:2, startHour:12, startMin:0,  endHour:13, endMin:0,  startTime:'12:00 PM', endTime:'01:00 PM', icon:'🍱', colorClass:'chip-green'  },
])

// Computed Properties
const weekDays = computed(() => {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    return {
      iso: d.toISOString().split('T')[0],
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      num: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      dayOfWeek: d.getDay()
    }
  })
})

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    if (filterClass.value && e.className !== filterClass.value) return false
    if (filterTeacher.value && e.teacher !== filterTeacher.value) return false
    return true
  })
})

const miniMonthLabel = computed(() => {
  return miniViewDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const miniCalCells = computed(() => {
  const year = miniViewDate.value.getFullYear()
  const month = miniViewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  
  for (let i = 0; i < startOffset; i++) cells.push({ key: 'e' + i, day: null })
  
  const selectedWeekIsos = new Set(weekDays.value.map(d => d.iso))
  const eventIsos = new Set(filteredEvents.value.map(e => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + e.dayOffset)
    return d.toISOString().split('T')[0]
  }))
  
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const iso = date.toISOString().split('T')[0]
    cells.push({ 
      key: iso, 
      day: d, 
      date, 
      isToday: date.toDateString() === today.toDateString(), 
      isInSelectedWeek: selectedWeekIsos.has(iso), 
      hasEvent: eventIsos.has(iso) 
    })
  }
  return cells
})

// Methods
const prevMiniMonth = () => { miniViewDate.value = new Date(miniViewDate.value.getFullYear(), miniViewDate.value.getMonth() - 1, 1) }
const nextMiniMonth = () => { miniViewDate.value = new Date(miniViewDate.value.getFullYear(), miniViewDate.value.getMonth() + 1, 1) }
const jumpToDate = (date) => { weekStart.value = getMonday(date) }
const jumpToToday = () => {
  weekStart.value = getMonday(today)
  miniViewDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
}

const formatHour = (h) => {
  const s = h < 12 ? 'AM' : 'PM'
  const d = h > 12 ? h - 12 : h
  return `${String(d).padStart(2, '0')} ${s}`
}

const isDayOff = (day) => day.dayOfWeek === 0

const getEventsForCell = (iso, hour) => {
  return filteredEvents.value.filter(e => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + e.dayOffset)
    return d.toISOString().split('T')[0] === iso && e.startHour === hour
  })
}

const chipHeight = (evt) => {
  const m = (evt.endHour - evt.startHour) * 60 + (evt.endMin - evt.startMin)
  return Math.max((m / 60) * 64 - 4, 40)
}
const chipOffset = (evt) => (evt.startMin / 60) * 64

const openEvent = (evt) => {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + evt.dayOffset)
  evt.dayLabel = d.toLocaleDateString('en-US', { weekday: 'long' })
  evt.dateLabel = d.toLocaleDateString('en-US', { day: '2-digit', month: 'long' })
  selectedEvent.value = evt
}

const editEvent = (evt) => { alert('Edit: ' + evt.title) }
const deleteEvent = (evt) => {
  events.value = events.value.filter(e => e.id !== evt.id)
  selectedEvent.value = null
}

const onCellClick = () => { selectedEvent.value = null }
const applyFilters = () => { selectedEvent.value = null }
const resetFilters = () => {
  filterClass.value = ''
  filterTeacher.value = ''
}

const openNewEventModal = () => {
  Object.assign(newEvent, {
    title: '',
    className: '',
    teacher: '',
    startTime: '08:00',
    endTime: '09:00',
    dayIso: weekDays.value[0]?.iso || '',
    room: ''
  })
  showModal.value = true
}

const saveEvent = () => {
  if (!newEvent.title) return
  const dayIdx = weekDays.value.findIndex(d => d.iso === newEvent.dayIso)
  const [sh, sm] = newEvent.startTime.split(':').map(Number)
  const [eh, em] = newEvent.endTime.split(':').map(Number)
  const colors = ['chip-orange', 'chip-pink', 'chip-teal', 'chip-purple', 'chip-yellow', 'chip-green']
  
  const fmt = (h, m) => {
    const s = h < 12 ? 'AM' : 'PM'
    const d = h > 12 ? h - 12 : h
    return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')} ${s}`
  }

  events.value.push({
    id: Date.now(),
    title: newEvent.title,
    fullTitle: newEvent.title,
    description: '',
    className: newEvent.className,
    teacher: newEvent.teacher,
    room: newEvent.room,
    dayOffset: dayIdx >= 0 ? dayIdx : 0,
    startHour: sh,
    startMin: sm,
    endHour: eh,
    endMin: em,
    startTime: fmt(sh, sm),
    endTime: fmt(eh, em),
    icon: '📚',
    colorClass: colors[Math.floor(Math.random() * colors.length)]
  })
  showModal.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

:root {
  --bg: #07111f;
  --bg-2: #0b1728;
  --bg-3: #101c31;
  --panel: rgba(11, 23, 40, 0.88);
  --panel-strong: #131f35;
  --border: rgba(141, 169, 220, 0.16);
  --border-strong: rgba(141, 169, 220, 0.28);
  --text: #edf2ff;
  --text-2: #a8b6d5;
  --text-3: #6f81a8;
  --accent: #6d93ff;
  --accent-2: #8d68ff;
  --accent-3: #19d4b3;
  --accent-4: #ff9d5c;
  --danger: #ff6b74;
  --warning: #ffd166;
  --shadow: 0 24px 60px rgba(3, 8, 18, 0.35);
  --radius-xl: 24px;
  --radius-lg: 18px;
  --radius-md: 14px;
  --radius-sm: 10px;
  color-scheme: dark;
}

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

.app-shell {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg); 
  color: var(--text);
  position: relative;
  padding: 20px;
}

/* ── LAYOUT FLEXBOX FRAMEWORK ── */
.app-layout {
  display: flex;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
  align-items: flex-start;
}

.main-area {
  flex: 1;
  min-width: 0;
}

/* ── APPLICATION HEADER ── */
.cal-header {
  display: flex; gap: 12px;
  justify-content: space-between; align-items: center;
  background: var(--panel); 
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 12px 20px; margin-bottom: 16px;
  flex-wrap: wrap;
}

/* ── SIDEBAR - FIXED MINI CALENDAR ── */
.sidebar-right {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mini-cal-panel {
  background: var(--panel);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.mini-cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.mini-month-label { font-size: 14px; font-weight: 700; color: var(--text); font-family: 'Syne', sans-serif; }
.mini-nav {
  background: var(--bg-3); border: 1px solid var(--border); color: var(--text-2);
  width: 26px; height: 26px; border-radius: var(--radius-sm); font-size: 14px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.mini-nav:hover { background: var(--panel-strong); border-color: var(--accent); color: var(--text); }

.mini-cal-grid  { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
.mini-dow       { font-size: 10px; font-weight: 700; color: var(--text-3); padding: 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
.mini-day {
  font-size: 12px; color: var(--text-2); padding: 6px 2px; border-radius: var(--radius-sm);
  cursor: pointer; transition: all 0.12s; position: relative;
  font-weight: 500;
}
.mini-day:hover                    { background: var(--bg-3); color: var(--text); }
.mini-day.mini-today               { background: var(--accent); color: var(--bg); font-weight: 700; }
.mini-day.mini-selected            { background: rgba(109, 147, 255, 0.15); color: var(--accent); font-weight: 700; border: 1px solid rgba(109, 147, 255, 0.3); }
.mini-day.mini-today.mini-selected { background: var(--accent); color: var(--bg); }
.mini-day.mini-has-event::after    { content: ''; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--accent-3); }
.mini-day.mini-today.mini-has-event::after { background: var(--bg); }
.mini-empty { pointer-events: none; opacity: 0; }

.btn-today {
  margin-top: 14px; width: 100%;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  color: var(--text); border-radius: var(--radius-md); padding: 8px 0;
  font-size: 12px; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all 0.15s;
}
.btn-today:hover { background: var(--panel-strong); border-color: var(--accent); }

/* Filters Header Styling */
.header-filters { display: flex; align-items: flex-end; gap: 8px; margin-left: auto; }
.filter-dropdown { display: flex; flex-direction: column; gap: 3px; }
.filter-dropdown select {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 7px 28px 7px 11px; font-size: 13px;
  font-family: 'DM Sans', sans-serif; color: var(--text); font-weight: 500;
  cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23a8b6d5'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center;
  transition: border-color 0.15s;
}
.filter-dropdown select:focus { outline: none; border-color: var(--accent); }
.btn-reset-header {
  background: rgba(255, 107, 116, 0.1); border: 1px solid var(--danger); color: var(--danger);
  border-radius: var(--radius-md); padding: 7px 12px; font-size: 12px; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.15s; white-space: nowrap; align-self: flex-end;
}
.btn-reset-header:hover { background: rgba(255, 107, 116, 0.2); }

.btn-new-event {
  background: var(--accent); color: var(--bg); border: none; border-radius: var(--radius-md);
  padding: 10px 18px; font-size: 13px; font-weight: 700;
  cursor: pointer; white-space: nowrap; font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 14px rgba(109, 147, 255, 0.3); transition: all 0.2s; flex-shrink: 0;
}
.btn-new-event:hover { background: #8fb0ff; transform: translateY(-1px); }

/* ── MAIN CALENDAR GRID ── */
.cal-scroll { flex: 1; overflow-y: auto; border-radius: var(--radius-xl); box-shadow: var(--shadow); }
.cal-grid {
  display: grid; grid-template-columns: 64px repeat(6, 1fr);
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl); overflow: hidden; min-width: 640px;
}
.time-col-header { background: var(--bg-3); border-bottom: 1px solid var(--border); }
.day-header {
  padding: 14px 6px 12px; text-align: center;
  border-bottom: 1px solid var(--border); border-left: 1px solid var(--border); background: var(--bg-3);
}
.day-header.day-off-header { background: rgba(11, 23, 40, 0.5); }
.day-header.today .day-num {
  background: var(--accent); color: var(--bg); border-radius: 50%;
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; margin: 0 auto;
}
.day-name { display: block; font-size: 10px; color: var(--text-3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.day-num  { display: block; font-size: 15px; font-weight: 700; color: var(--text); }
.time-label {
  padding: 6px 8px 0; font-size: 10px; color: var(--text-3); font-weight: 500;
  text-align: right; height: 64px; border-bottom: 1px solid var(--border);
  display: flex; align-items: flex-start; justify-content: flex-end;
  background: var(--bg-3);
}
.cell {
  height: 64px; border-left: 1px solid var(--border); border-bottom: 1px solid var(--border);
  position: relative; cursor: pointer; transition: background 0.1s;
}
.cell:hover { background: var(--panel-strong); }
.cell.day-off { 
  background: repeating-linear-gradient(135deg, var(--bg-2), var(--bg-2) 5px, var(--bg-3) 5px, var(--bg-3) 10px); 
  cursor: default; 
}
.day-off-label {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-size: 11px; color: var(--text-3); font-weight: 600; white-space: nowrap;
}
.event-chip {
  position: absolute; left: 4px; right: 4px; border-radius: var(--radius-sm);
  padding: 5px 8px; display: flex; align-items: flex-start; gap: 6px;
  cursor: pointer; z-index: 2; overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s; border: 1px solid transparent;
}
.event-chip:hover { transform: scale(1.02); box-shadow: var(--shadow); z-index: 3; }
.event-icon  { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
.event-info  { min-width: 0; overflow: hidden; }
.event-title { font-size: 11px; font-weight: 700; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.event-time  { font-size: 10px; opacity: 0.8; margin-top: 1px; font-weight: 500; }

/* Dynamic Chip Colors mapped with theme accents */
.chip-orange { background: rgba(255, 157, 92, 0.12); color: var(--accent-4); border-color: rgba(255, 157, 92, 0.3); }
.chip-pink   { background: rgba(255, 107, 116, 0.12); color: var(--danger); border-color: rgba(255, 107, 116, 0.3); }
.chip-red    { background: var(--danger); color: var(--bg); border-color: var(--danger); }
.chip-teal   { background: rgba(25, 212, 179, 0.12); color: var(--accent-3); border-color: rgba(25, 212, 179, 0.3); }
.chip-yellow { background: rgba(255, 209, 102, 0.12); color: var(--warning); border-color: rgba(255, 209, 102, 0.3); }
.chip-purple { background: rgba(141, 104, 255, 0.12); color: var(--accent-2); border-color: rgba(141, 104, 255, 0.3); }
.chip-green  { background: rgba(25, 212, 179, 0.15); color: var(--accent-3); border-color: rgba(25, 212, 179, 0.4); }

/* ── FLOATING OVERLAYS (POPUP & MODAL) ── */
.event-popup {
  position: fixed; top: 50%; right: 320px; transform: translateY(-50%);
  width: 280px; background: var(--panel-strong); border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-strong); z-index: 100; overflow: hidden;
}
.popup-header { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border); }
.popup-badge  { display: flex; align-items: center; gap: 7px; padding: 4px 9px; border-radius: var(--radius-sm); font-size: 12px; }
.popup-actions button { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; border-radius: 6px; color: var(--text-2); transition: background 0.1s, color 0.1s; }
.popup-actions button:hover { background: var(--bg-3); color: var(--text); }
.popup-actions { display: flex; gap: 4px; }
.popup-body     { padding: 14px; }
.popup-eyebrow  { font-size: 10px; color: var(--text-3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.popup-title    { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.popup-desc     { font-size: 12px; color: var(--text-2); margin-bottom: 12px; }
.popup-time-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.popup-time-chip { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 5px 9px; font-size: 11px; font-weight: 600; color: var(--accent); }
.popup-date-chip { font-size: 11px; color: var(--text-3); font-weight: 500; }
.popup-details  { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; background: var(--bg-2); padding: 10px; border-radius: var(--radius-sm); }
.detail-row     { display: flex; justify-content: space-between; font-size: 12px; }
.detail-key     { color: var(--text-3); font-weight: 500; }
.detail-val     { color: var(--text); font-weight: 600; }
.btn-share {
  width: 100%; background: var(--bg-3); border: 1px solid var(--border-strong);
  color: var(--text-2); border-radius: var(--radius-md); padding: 8px;
  font-size: 12px; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all 0.15s;
}
.btn-share:hover { background: var(--panel); color: var(--text); border-color: var(--accent); }

.modal-overlay { position: fixed; inset: 0; background: rgba(3, 8, 18, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal         { background: var(--panel-strong); border-radius: var(--radius-xl); width: 460px; max-width: 95vw; box-shadow: var(--shadow); border: 1px solid var(--border-strong); overflow: hidden; }
.modal-header  { padding: 18px 20px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
.modal-header h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--text); }
.modal-header button { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-3); }
.modal-header button:hover { color: var(--text); }
.modal-body    { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.form-group    { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-size: 10px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select {
  border: 1px solid var(--border-strong); border-radius: var(--radius-md);
  padding: 9px 12px; font-size: 13px; font-family: 'DM Sans', sans-serif;
  color: var(--text); background: var(--bg-2); transition: border-color 0.15s;
}
.form-group input:focus, .form-group select:focus { outline: none; border-color: var(--accent); }
.form-row      { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal-footer  { padding: 14px 20px 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border); }
.btn-cancel {
  background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: var(--radius-md);
  padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: 'DM Sans', sans-serif; color: var(--text-2); transition: all 0.15s;
}
.btn-cancel:hover { background: var(--bg-2); color: var(--text); }
.btn-save {
  background: var(--accent); color: var(--bg); border: none; border-radius: var(--radius-md);
  padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(109, 147, 255, 0.2); transition: background 0.15s;
}
.btn-save:hover { background: #8fb0ff; }

/* ── RESPONSIVE ANIMATIONS ── */
.popup-enter-active, .popup-leave-active { transition: opacity 0.2s, transform 0.2s; }
.popup-enter-from { opacity: 0; transform: translateY(-50%) translateX(12px); }
.popup-leave-to   { opacity: 0; transform: translateY(-50%) translateX(12px); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 992px) {
  .app-layout { flex-direction: column; }
  .sidebar-right { width: 100%; }
  .event-popup { right: 20px; top: auto; bottom: 20px; transform: none; width: calc(100% - 40px); }
  .popup-enter-from, .popup-leave-to { transform: translateY(12px); opacity: 0; }
}
</style>