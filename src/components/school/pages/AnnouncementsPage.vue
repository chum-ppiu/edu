<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import ControlTabs from '../ui/ControlTabs.vue'

const { t } = useI18n()

const tabs = computed(() => [
  { value: 'all', label: t('common.all'), icon: '✨', count: 3, description: 'Everything' },
  { value: 'students', label: t('shell.students'), icon: '🎓', count: 1, description: 'Student-facing' },
  { value: 'teachers', label: t('shell.teachers'), icon: '👨‍🏫', count: 1, description: 'Staff updates' },
])

const activeTab = ref('all')

const announcements = [
  {
    id: 1,
    title: '📚 Final Exam Schedule - Semester 1',
    status: 'Active',
    statusClass: 'badge-green',
    meta: ['👤 Admin', '📅 Jan 15, 2024', '🎯 All Students'],
    body: 'Final examinations for Semester 1 will begin on February 5th. Please check your individual schedules and prepare accordingly.',
    audience: 'students',
  },
  {
    id: 2,
    title: '🎉 School Sports Day 2024',
    status: 'Upcoming',
    statusClass: 'badge-blue',
    meta: ['👤 Admin', '📅 Jan 12, 2024', '🎯 Everyone'],
    body: 'Annual sports day will be held on January 28th. All students are required to participate. Teams will be announced next week.',
    audience: 'all',
  },
  {
    id: 3,
    title: '💰 Fee Payment Reminder',
    status: 'Urgent',
    statusClass: 'badge-yellow',
    meta: ['👤 Finance', '📅 Jan 10, 2024', '🎯 Parents'],
    body: 'Reminder: Semester 1 tuition fees are due by January 15th. Please ensure timely payment to avoid late charges.',
    audience: 'teachers',
  },
]

const visibleAnnouncements = computed(() => {
  if (activeTab.value === 'all') {
    return announcements
  }

  return announcements.filter((announcement) => announcement.audience === activeTab.value)
})
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('announcements.title') }}</div>
        <div class="page-sub">{{ t('announcements.subtitle') }}</div>
      </div>
      <button class="btn btn-primary" type="button">+ {{ t('announcements.newAnnouncement') }}</button>
    </div>

    <div class="grid-2" style="align-items:start">
      <div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">{{ t('announcements.allAnnouncements') }}</span>
            <ControlTabs v-model="activeTab" :compact="true" :items="tabs" />
          </div>
          <div class="card-body">
            <div v-for="announcement in visibleAnnouncements" :key="announcement.id" class="ann-item">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:12px;flex-wrap:wrap;">
                <div class="ann-title">{{ announcement.title }}</div>
                <span class="badge" :class="announcement.statusClass">{{ announcement.status }}</span>
              </div>
              <div class="ann-meta"><span v-for="item in announcement.meta" :key="item">{{ item }}</span></div>
              <div class="ann-body">{{ announcement.body }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">{{ t('announcements.createAnnouncement') }}</span></div>
        <div class="card-body">
          <div class="form-group" style="margin-bottom:14px;"><label class="form-label">{{ t('announcements.titleLabel') }}</label><input class="form-input" placeholder="Announcement title..." /></div>
          <div class="form-group" style="margin-bottom:14px;"><label class="form-label">{{ t('announcements.audience') }}</label><select class="form-input"><option>Everyone</option><option>All Students</option><option>All Teachers</option><option>All Parents</option><option>Specific Class</option></select></div>
          <div class="form-group" style="margin-bottom:14px;"><label class="form-label">{{ t('announcements.message') }}</label><textarea class="form-input" rows="5" placeholder="Write your announcement here..."></textarea></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <div class="form-group" style="flex:1;margin:0"><label class="form-label">{{ t('announcements.publishDate') }}</label><input class="form-input" type="datetime-local" /></div>
            <div class="form-group" style="flex:1;margin:0"><label class="form-label">{{ t('announcements.expires') }}</label><input class="form-input" type="datetime-local" /></div>
          </div>
          <div class="form-actions"><button class="btn btn-ghost" type="button">{{ t('announcements.saveDraft') }}</button><button class="btn btn-primary" type="button">📢 {{ t('announcements.publish') }}</button></div>
        </div>
      </div>
    </div>
  </div>
</template>