<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

import SchoolSidebar from './SchoolSidebar.vue'
import SchoolTopbar from './SchoolTopbar.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import StudentsPage from '../pages/StudentsPage.vue'
import AddStudentPage from '../pages/AddStudentPage.vue'
import TeachersPage from '../pages/TeachersPage.vue'
import ClassesPage from '../pages/ClassesPage.vue'
import GradesPage from '../pages/GradesPage.vue'
import AttendancePage from '../pages/AttendancePage.vue'
import PaymentsPage from '../pages/PaymentsPage.vue'
import AnnouncementsPage from '../pages/AnnouncementsPage.vue'
import SchedulePage from '../pages/SchedulePage.vue'
import ReportsPage from '../pages/ReportsPage.vue'
import SubjectsPage from '../pages/SubjectsPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import Calendar from '../ui/Calendar.vue'

const pageComponents = {
  dashboard: DashboardPage,
  students: StudentsPage,
  'add-student': AddStudentPage,
  teachers: TeachersPage,
  classes: ClassesPage,
  grades: GradesPage,
  attendance: AttendancePage,
  payments: PaymentsPage,
  announcements: AnnouncementsPage,
  schedule: SchedulePage,
  reports: ReportsPage,
  subjects: SubjectsPage,
  settings: SettingsPage,
  calendar: Calendar,
}

const { t } = useI18n()

const isSidebarOpen = ref(false)
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }
const closeSidebar = () => { isSidebarOpen.value = false }

const navSections = computed(() => [
  { label: t('shell.overview'), items: [{ id: 'dashboard', icon: '⊞', label: t('shell.dashboard') }] },
  {
    label: t('shell.academic'),
    items: [
      { id: 'students', icon: '👨‍🎓', label: t('shell.students'), badge: '248' },
      { id: 'teachers', icon: '👨‍🏫', label: t('shell.teachers') },
      { id: 'classes', icon: '🏫', label: t('shell.classes') },
      { id: 'subjects', icon: '📚', label: t('shell.subjects') },
    ],
  },
  {
    label: t('shell.management'),
    items: [
      { id: 'grades', icon: '📊', label: t('shell.grades') },
      { id: 'attendance', icon: '📅', label: t('shell.attendance'), badge: '5' },
      { id: 'payments', icon: '💰', label: t('shell.payments') },
      { id: 'announcements', icon: '📢', label: t('shell.announcements') },
    ],
  },
  {
    label: t('shell.system'),
    items: [
      { id: 'schedule', icon: '🗓️', label: t('shell.schedule') },
      { id: 'reports', icon: '📈', label: t('shell.reports') },
      { id: 'settings', icon: '⚙️', label: t('shell.settings') },
      { id: 'calendar', icon: '📆', label: t('shell.calendar') },
    ],
  },
])

const pageTitles = computed(() => ({
  dashboard: t('shell.dashboard'),
  students: t('shell.students'),
  'add-student': t('shell.addStudent'),
  teachers: t('shell.teachers'),
  classes: t('shell.classes'),
  grades: t('shell.grades'),
  attendance: t('shell.attendance'),
  payments: t('shell.payments'),
  announcements: t('shell.announcements'),
  schedule: t('shell.schedule'),
  reports: t('shell.reports'),
  subjects: t('shell.subjects'),
  settings: t('shell.settings'),
  calendar: t('shell.calendar'),
}))

const activePage = ref('dashboard')
const currentComponent = computed(() => pageComponents[activePage.value] ?? DashboardPage)

function showPage(pageId) {
  if (pageComponents[pageId]) {
    activePage.value = pageId
    isSidebarOpen.value = false
  }
}

const handleResize = () => { if (window.innerWidth >= 1024) isSidebarOpen.value = false }
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<template>
  <div class="school-app">
    <Transition name="fade">
      <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>
    </Transition>

    <SchoolSidebar 
      :sections="navSections" 
      :active-page="activePage" 
      :is-open="isSidebarOpen"
      @navigate="showPage" 
      @close="closeSidebar"
    />

    <div class="school-main">
      <SchoolTopbar :title="pageTitles[activePage]" @toggle-sidebar="toggleSidebar" />
      
      <!-- Only this area scrolls when code or component sizes expand -->
      <section class="content">
        <component :is="currentComponent" @navigate="showPage" />
      </section>
    </div>
  </div>
</template>

<style>
/* Locks full viewport and eliminates body bouncing */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; 
}

.school-app {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: var(--bg);
  color: var(--text);
  overflow: hidden;
}

.school-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100vh;
}

.content {
  flex: 1;
  overflow-y: auto; /* Independent scroll zone */
  padding: 24px;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 8, 18, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99;
}

@media (max-width: 768px) {
  .content { padding: 16px; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>