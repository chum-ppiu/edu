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

          <button class="btn btn-primary btn-new-event" type="button" @click="openNewEventModal">+ New Event</button>
        </header>

        <div class="calendar-workspace">
          
          <div class="time-sidebar">
            <div class="time-corner-header">Time</div>
            <div class="time-column-labels">
              <div v-for="hour in hours" :key="hour" class="time-label">
                <span class="time-text">{{ formatHour(hour) }}</span>
              </div>
            </div>
          </div>

          <div class="columns-viewport" ref="viewportRef">
            
            <div class="grid-content-relative">
              <div 
                v-if="showNowIndicator" 
                class="global-now-indicator" 
                :style="{ top: nowIndicatorTop + 'px' }"
              >
                <div class="now-indicator-line"></div>
              </div>

              <div class="days-columns-container">
                <div 
                  v-for="(day, index) in weekDays" 
                  :key="day.iso" 
                  class="day-stream-column"
                  :class="{ 'is-today': day.isToday, 'is-day-off': isDayOff(day) }"
                  ref="dayColumnsRef"
                >
                  <div class="day-stream-header">
                    <span class="day-name">{{ day.name }}</span>
                    <span class="day-num">{{ day.num }}</span>
                  </div>

                  <div class="day-stream-cells">
                    <div
                      v-for="hour in hours"
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
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <aside class="sidebar-right">
        <MiniCalendar
          :model-value="miniCalendarString"
          format="YYYY-MM-DD HH:mm:ss"
          @date-selected="jumpToDate"
          @today-clicked="onMiniTodayClick"
        />
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
            <button class="btn-save btn btn-primary" type="button" @click="saveEvent">Save Event</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import MiniCalendar from '@/components/school/bases/MiniCalendar.vue'

const CELL_HEIGHT = 68 
const HEADER_ROW_HEIGHT = 56

const hours = Array.from({ length: 13 }, (_, i) => i + 7) // 7 AM to 7 PM
const classOptions = ['Physics', 'Mathematics', 'Art', 'Chemistry', 'Physical Education', 'Lunch Break', 'Math']
const teacherOptions = ['Mr. Johnson', 'Ms. Smith', 'Dr. Lee', 'Mrs. Patel', 'Mr. Brown']

const viewportRef = ref(null)
const dayColumnsRef = ref([])

const getMonday = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  return d
}

const today = new Date()
const weekStart = ref(getMonday(today))

// Maintains highlight alignment on the active workspace day sequence
const currentSelectedDay = ref(new Date(today))

// Automatically translates active date reference instances into properly formatted target string strings
const miniCalendarString = computed(() => {
  const target = currentSelectedDay.value
  const yyyy = target.getFullYear()
  const mm = String(target.getMonth() + 1).padStart(2, '0')
  const dd = String(target.getDate()).padStart(2, '0')
  const hh = String(target.getHours()).padStart(2, '0')
  const min = String(target.getMinutes()).padStart(2, '0')
  const ss = String(target.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
})

const filterClass = ref('')
const filterTeacher = ref('')
const selectedEvent = ref(null)
const showModal = ref(false)

const currentTime = ref(new Date())
let timerInterval = null

const scrollToCurrentDay = async () => {
  await nextTick()
  const todayIndex = weekDays.value.findIndex(d => d.isToday)
  if (todayIndex !== -1 && dayColumnsRef.value && dayColumnsRef.value[todayIndex]) {
    dayColumnsRef.value[todayIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }
}

onMounted(() => {
  scrollToCurrentDay()
  timerInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 30000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const newEvent = reactive({
  title: '', className: '', teacher: '', startTime: '08:00', endTime: '09:00', dayIso: '', room: ''
})

const events = ref([
  { id:1, title:'Physics class',      fullTitle:'Physics Class (Advanced)',      description:'Wave mechanics & optics',      className:'Physics',            teacher:'Mr. Johnson', room:'Lab 2',    dayOffset:0, startHour:8,  startMin:0,  endHour:9,  endMin:0,  startTime:'08:00 AM', endTime:'09:00 AM', icon:'⚛️', colorClass:'chip-orange' },
  { id:2, title:'Art class',           fullTitle:'Art & Design Studio',             description:'Watercolor techniques',        className:'Art',                teacher:'Ms. Smith',   room:'Studio A', dayOffset:2, startHour:9,  startMin:0,  endHour:10, endMin:30, startTime:'09:00 AM', endTime:'10:30 AM', icon:'🎨', colorClass:'chip-pink'   },
  { id:3, title:'Homecoming',          fullTitle:'Homecoming for Graduates (MCG)',  description:'Meeting with Starview Academy', className:'Mathematics',        teacher:'Dr. Lee',     room:'Hall B',   dayOffset:0, startHour:10, startMin:0,  endHour:11, endMin:30, startTime:'10:00 AM', endTime:'11:30 AM', icon:'🎓', colorClass:'chip-red'    },
  { id:4, title:'Physical Education', fullTitle:'Physical Education',              description:'Football & fitness drills',     className:'Physical Education', teacher:'Mr. Brown',   room:'Gym',      dayOffset:1, startHour:10, startMin:30, endHour:12, endMin:0,  startTime:'10:30 AM', endTime:'12:00 PM', icon:'🏃', colorClass:'chip-teal'   },
  { id:5, title:'Chemistry',           fullTitle:'Chemistry Lab',                   description:'Titration experiment',          className:'Chemistry',          teacher:'Mrs. Patel',  room:'Lab 1',    dayOffset:3, startHour:9,  startMin:0,  endHour:10, endMin:45, startTime:'09:00 AM', endTime:'10:45 AM', icon:'🧪', colorClass:'chip-yellow' },
  { id:6, title:'Math class',          fullTitle:'Mathematics (Calculus)',          description:'Differentiation & integration', className:'Math',               teacher:'Dr. Lee',     room:'Room 204', dayOffset:4, startHour:8,  startMin:0,  endHour:9,  endMin:30, startTime:'08:00 AM', endTime:'09:30 AM', icon:'📐', colorClass:'chip-purple' },
  { id:7, title:'Lunch break',          fullTitle:'Lunch Break',                     description:'Free period',                  className:'Lunch Break',        teacher:'',            room:'Cafeteria',dayOffset:2, startHour:12, startMin:0,  endHour:13, endMin:0,  startTime:'12:00 PM', endTime:'01:00 PM', icon:'🍱', colorClass:'chip-green'  },
])

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

const showNowIndicator = computed(() => {
  const currentHour = currentTime.value.getHours()
  const startHour = hours[0]
  const endHour = hours[hours.length - 1]
  return currentHour >= startHour && currentHour <= endHour
})

const nowIndicatorTop = computed(() => {
  if (!showNowIndicator.value) return 0
  const currentHour = currentTime.value.getHours()
  const currentMinute = currentTime.value.getMinutes()
  const startHour = hours[0]
  
  const totalPassedHours = currentHour - startHour
  return HEADER_ROW_HEIGHT + (totalPassedHours * CELL_HEIGHT) + ((currentMinute / 60) * CELL_HEIGHT)
})

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    if (filterClass.value && e.className !== filterClass.value) return false
    if (filterTeacher.value && e.teacher !== filterTeacher.value) return false
    return true
  })
})

// Handles selections fired from calendar dates grid updates cleanly
const jumpToDate = (date) => { 
  currentSelectedDay.value = date
  weekStart.value = getMonday(date)
  setTimeout(scrollToCurrentDay, 50)
}

// Separate callback hook capturing Today buttons explicitly
const onMiniTodayClick = (date) => {
  currentSelectedDay.value = date
  weekStart.value = getMonday(date)
  setTimeout(scrollToCurrentDay, 50)
}

const formatHour = (h) => {
  const s = h < 12 ? 'AM' : 'PM'
  const d = h > 12 ? h - 12 : h === 0 ? 12 : h
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
  return Math.max((m / 60) * CELL_HEIGHT - 4, 38)
}
const chipOffset = (evt) => (evt.startMin / 60) * CELL_HEIGHT

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
const resetFilters = () => { filterClass.value = ''; filterTeacher.value = '' }

const openNewEventModal = () => {
  Object.assign(newEvent, {
    title: '', className: '', teacher: '', startTime: '08:00', endTime: '09:00', dayIso: weekDays.value[0]?.iso || '', room: ''
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
    const d = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')} ${s}`
  }
  events.value.push({
    id: Date.now(), title: newEvent.title, fullTitle: newEvent.title, description: '', className: newEvent.className, teacher: newEvent.teacher, room: newEvent.room, dayOffset: dayIdx >= 0 ? dayIdx : 0, startHour: sh, startMin: sm, endHour: eh, endMin: em, startTime: fmt(sh, sm), endTime: fmt(eh, em), icon: '📚', colorClass: colors[Math.floor(Math.random() * colors.length)]
  })
  showModal.value = false
}
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.app-shell {
  min-height: 100vh;
  background: transparent; 
  color: var(--text);
  padding: 12px;
}

.app-layout {
  display: flex;
  gap: 16px;
  max-width: 100%;
  margin: 0 auto;
}

.main-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.cal-header {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  background: var(--panel); 
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  margin-bottom: 12px;
}

/* ── WORKSPACE FRAME ── */
.calendar-workspace {
  display: flex;
  background: var(--bg-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  overflow-y: hidden;
  overflow-x: auto;
  position: relative;
}

/* ── FREEZABLE LEFT SIDEBAR ── */
.time-sidebar {
  width: 55px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-3);
  border-right: 2px solid var(--border-strong);
  position: sticky;
  left: 0;
  z-index: 20;
}

.time-corner-header {
  height: 56px; 
  border-bottom: 1px solid var(--border-strong);
  background: var(--bg-3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-2);
  letter-spacing: 0.5px;
  user-select: none;
}

.time-column-labels {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.time-label {
  height: 68px; 
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  border-bottom: 1px solid var(--border);
  user-select: none;
}

.time-text {
  font-size: 10px;
  color: var(--text-3);
  font-weight: 700;
  padding: 6px 8px 0 0;
}

/* ── HORIZONTAL SCHEDULE GRID VIEWPORT ── */
.columns-viewport {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: visible;
}

.grid-content-relative {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.days-columns-container {
  display: flex;
  flex: 1;
  width: 100%;
}

/* ── EXACT TIME TRACKING LINE ── */
.global-now-indicator {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 2px;
  z-index: 10;
  pointer-events: none;
}

.now-indicator-line {
  width: 960px;
  height: 2px;
  background: var(--danger, #ff6b74);
  box-shadow: 0 0 6px rgba(255, 107, 116, 0.7);
  position: relative;
}

.now-indicator-line::before {
  content: '';
  position: absolute;
  left: 0;
  top: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--danger, #ff6b74);
  box-shadow: 0 0 4px rgba(255, 107, 116, 0.8);
}

/* ── DAY STREAM COLUMNS ── */
.day-stream-column {
  flex: 1;
  min-width: 160px; 
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  background: var(--bg-2);
}

.day-stream-column.is-today {
  background: rgba(109, 147, 255, 0.02);
}

.day-stream-header {
  height: 56px; 
  padding: 8px 4px;
  text-align: center;
  background: var(--bg-3);
  border-bottom: 1px solid var(--border-strong);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.day-name { font-size: 10px; color: var(--text-3); font-weight: 700; text-transform: uppercase; }
.day-num { font-size: 14px; font-weight: 800; color: var(--text); margin-top: 2px; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; }

.is-today .day-stream-header .day-num {
  background: var(--accent);
  color: #fff;
  border-radius: 50%;
}

.day-stream-cells {
  flex: 1;
}

.cell {
  height: 68px; 
  border-bottom: 1px solid var(--border);
  position: relative;
  cursor: pointer;
  background: transparent;
}
.cell:hover { background: rgba(255, 255, 255, 0.01); }

.is-day-off .cell, .cell.day-off { 
  background: repeating-linear-gradient(135deg, var(--bg-2), var(--bg-2) 6px, var(--bg-3) 6px, var(--bg-3) 12px) !important; 
  cursor: default; 
}
.day-off-label {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-size: 10px; color: var(--text-3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
}

/* ── CARDS & POPUPS ── */
.event-chip {
  position: absolute; 
  left: 4px; 
  right: 4px; 
  border-radius: var(--radius-md);
  padding: 6px 8px; 
  display: flex; 
  flex-direction: column;
  gap: 2px;
  cursor: pointer; 
  z-index: 2; 
  overflow: hidden;
  border: 1px solid transparent;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.event-chip:hover { transform: translateY(-1px); box-shadow: var(--shadow); z-index: 4; }
.event-icon  { font-size: 12px; margin-bottom: 1px; }
.event-info  { min-width: 0; }
.event-title { font-size: 11px; font-weight: 700; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.event-time  { font-size: 9px; opacity: 0.85; font-weight: 600; margin-top: 1px; }

.chip-orange { background: rgba(255, 157, 92, 0.12); color: var(--accent-4); border-color: rgba(255, 157, 92, 0.3); }
.chip-pink   { background: rgba(255, 107, 116, 0.12); color: var(--danger); border-color: rgba(255, 107, 116, 0.3); }
.chip-red    { background: var(--danger); color: #fff; border-color: var(--danger); }
.chip-teal   { background: rgba(25, 212, 179, 0.12); color: var(--accent-3); border-color: rgba(25, 212, 179, 0.3); }
.chip-yellow { background: rgba(255, 209, 102, 0.12); color: var(--warning); border-color: rgba(255, 209, 102, 0.3); }
.chip-purple { background: rgba(141, 104, 255, 0.12); color: var(--accent-2); border-color: rgba(141, 104, 255, 0.3); }
.chip-green  { background: rgba(25, 212, 179, 0.15); color: var(--accent-3); border-color: rgba(25, 212, 179, 0.4); }

.sidebar-right { width: 260px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px; }

.header-filters { display: flex; align-items: center; gap: 8px; }
.filter-dropdown select {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-md);
  padding: 6px 24px 6px 10px; font-size: 12px; color: var(--text); font-weight: 500; cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23a8b6d5'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center;
}
.btn-reset-header { background: rgba(255, 107, 116, 0.1); border: 1px solid var(--danger); color: var(--danger); border-radius: var(--radius-md); padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; }
.btn-new-event { padding: 6px 14px; font-size: 12px; font-weight: 700; height: 32px; cursor: pointer;}

.event-popup { position: fixed; top: 50%; right: 20px; transform: translateY(-50%); width: 280px; background: var(--panel-strong); border-radius: var(--radius-lg); box-shadow: var(--shadow); border: 1px solid var(--border-strong); z-index: 100; }
.popup-header { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border); }
.popup-badge { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: var(--radius-sm); font-size: 11px; }
.popup-actions { display: flex; gap: 4px; }
.popup-actions button { background: none; border: none; cursor: pointer; font-size: 13px; padding: 2px; color: var(--text-2); }
.popup-body { padding: 12px; }
.popup-eyebrow { font-size: 9px; color: var(--text-3); font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.popup-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.popup-desc { font-size: 11px; color: var(--text-2); margin-bottom: 10px; }
.popup-time-row { display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 10px; }
.popup-time-chip { background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 4px 8px; font-size: 10px; font-weight: 600; color: var(--accent); }
.popup-date-chip { font-size: 10px; color: var(--text-3); }
.popup-details { display: flex; flex-direction: column; gap: 4px; background: var(--bg-2); padding: 8px; border-radius: var(--radius-sm); margin-bottom: 10px; }
.detail-row { display: flex; justify-content: space-between; font-size: 11px; }
.detail-key { color: var(--text-3); }
.detail-val { color: var(--text); font-weight: 600; }
.btn-share { width: 100%; background: var(--bg-3); border: 1px solid var(--border-strong); color: var(--text-2); border-radius: var(--radius-md); padding: 6px; font-size: 11px; font-weight: 700; cursor: pointer; }

.modal-overlay { position: fixed; inset: 0; background: rgba(3, 8, 18, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal { background: var(--panel-strong); border-radius: var(--radius-xl); width: 420px; max-width: 95vw; box-shadow: var(--shadow); border: 1px solid var(--border-strong); overflow: hidden; }
.modal-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
.modal-header h3 { font-size: 16px; font-weight: 800; color: var(--text); }
.modal-header button { background: none; border: none; font-size: 16px; cursor: pointer; color: var(--text-3); }
.modal-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 9px; font-weight: 700; color: var(--text-3); text-transform: uppercase; }
.form-group input, .form-group select { border: 1px solid var(--border-strong); border-radius: var(--radius-md); padding: 8px 10px; font-size: 12px; color: var(--text); background: var(--bg-2); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.modal-footer { padding: 12px 16px 16px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid var(--border); }
.btn-cancel { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: var(--radius-md); padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; color: var(--text-2); }

@media (max-width: 768px) {
  .cal-header { flex-direction: column; align-items: stretch; gap: 10px; }
  .header-filters { justify-content: space-between; }
  .event-popup { left: 12px; right: 12px; bottom: 12px; top: auto; transform: none; width: auto; }
}

@media (max-width: 600px) {
  .sidebar-right { display: none }
}
</style>