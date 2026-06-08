<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from '@/components/school/bases/DataTable.vue'

const { t } = useI18n()

const subjects = ref([
  { id: 1, subject: 'Mathematics', code: 'MATH101', department: 'Science', creditHours: 4, teachers: 2, classes: 4 },
  { id: 2, subject: 'English Language', code: 'ENG101', department: 'Arts', creditHours: 3, teachers: 2, classes: 4 },
  { id: 3, subject: 'General Science', code: 'SCI101', department: 'Science', creditHours: 4, teachers: 1, classes: 3 },
  { id: 4, subject: 'History', code: 'HIS101', department: 'Arts', creditHours: 3, teachers: 1, classes: 4 },
])

const columns = [
  { key: 'subject', label: t('subjects.subject') },
  { key: 'code', label: t('subjects.code') },
  { key: 'department', label: t('subjects.department') },
  { key: 'creditHours', label: t('subjects.creditHours') },
  { key: 'teachers', label: t('subjects.teachers') },
  { key: 'classes', label: t('subjects.classes') },
]

function handleEdit(row) { console.log('edit subject', row) }
function handleDelete(row) { console.log('delete subject', row) }
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('subjects.title') }}</div>
        <div class="page-sub">{{ t('subjects.subtitle') }}</div>
      </div>
      <button class="btn btn-primary" type="button">+ {{ t('subjects.add') }}</button>
    </div>

    <div class="card">
      <DataTable
        :title="t('subjects.listTitle')"
        :subtitle="t('subjects.listSubtitle')"
        :rows="subjects"
        :columns="columns"
        :page-size="8"
        :search-keys="['subject','code','department']"
      >
        <template #cell-code="{ row }">
          <span style="font-family:monospace;color:var(--text3)">{{ row.code }}</span>
        </template>

        <template #cell-department="{ row }">
          <span class="badge" :class="row.department === 'Science' ? 'badge-blue' : 'badge-purple'">{{ row.department }}</span>
        </template>

        <template #actions="{ row }">
          <button class="action-btn" type="button" @click="handleEdit(row)">✏️</button>
          <button class="action-btn danger" type="button" @click="handleDelete(row)">🗑</button>
        </template>
      </DataTable>
    </div>
  </div>
</template>