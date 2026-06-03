<script setup>
import { computed, ref } from 'vue'

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

const pageTitles = {
  dashboard: 'Dashboard',
  students: 'Students',
  'add-student': 'Add Student',
  teachers: 'Teachers',
  classes: 'Classes',
  grades: 'Grades',
  attendance: 'Attendance',
  payments: 'Payments',
  announcements: 'Announcements',
  schedule: 'Schedule',
  reports: 'Reports',
  subjects: 'Subjects',
  settings: 'Settings',
}

const navSections = [
  { label: 'Overview', items: [{ id: 'dashboard', icon: '⊞', label: 'Dashboard' }] },
  {
    label: 'Academic',
    items: [
      { id: 'students', icon: '👨‍🎓', label: 'Students', badge: '248' },
      { id: 'teachers', icon: '👨‍🏫', label: 'Teachers' },
      { id: 'classes', icon: '🏫', label: 'Classes' },
      { id: 'subjects', icon: '📚', label: 'Subjects' },
    ],
  },
  {
    label: 'Management',
    items: [
      { id: 'grades', icon: '📊', label: 'Grades' },
      { id: 'attendance', icon: '📅', label: 'Attendance', badge: '5' },
      { id: 'payments', icon: '💰', label: 'Payments' },
      { id: 'announcements', icon: '📢', label: 'Announcements' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'schedule', icon: '🗓️', label: 'Schedule' },
      { id: 'reports', icon: '📈', label: 'Reports' },
      { id: 'settings', icon: '⚙️', label: 'Settings' },
    ],
  },
]

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