<script setup>
import { computed, ref } from 'vue'
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
}

// const pageTitles = {
//   dashboard: 'Dashboard',
//   students: 'Students',
//   'add-student': 'Add Student',
//   teachers: 'Teachers',
//   classes: 'Classes',
//   grades: 'Grades',
//   attendance: 'Attendance',
//   payments: 'Payments',
//   announcements: 'Announcements',
//   schedule: 'Schedule',
//   reports: 'Reports',
//   subjects: 'Subjects',
//   settings: 'Settings',
// }

const { t } = useI18n()

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
}))

const activePage = ref('dashboard')
const currentComponent = computed(() => pageComponents[activePage.value] ?? DashboardPage)

function showPage(pageId) {
  if (pageComponents[pageId]) {
    activePage.value = pageId
  }
}
</script>

<template>
  <div class="school-app">
    <SchoolSidebar :sections="navSections" :active-page="activePage" @navigate="showPage" />

    <main class="school-main">
      <SchoolTopbar :title="pageTitles[activePage]" />
      <section class="content">
        <component :is="currentComponent" @navigate="showPage" />
      </section>
    </main>
  </div>
</template>