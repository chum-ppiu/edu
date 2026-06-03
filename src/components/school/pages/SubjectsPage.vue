<script setup>
import { ref } from 'vue'
import DataTable from '../ui/DataTable.vue'

const subjects = ref([
  { id: 1, subject: 'Mathematics', code: 'MATH101', department: 'Science', creditHours: 4, teachers: 2, classes: 4 },
  { id: 2, subject: 'English Language', code: 'ENG101', department: 'Arts', creditHours: 3, teachers: 2, classes: 4 },
  { id: 3, subject: 'General Science', code: 'SCI101', department: 'Science', creditHours: 4, teachers: 1, classes: 3 },
  { id: 4, subject: 'History', code: 'HIS101', department: 'Arts', creditHours: 3, teachers: 1, classes: 4 },
])

const columns = [
  { key: 'subject', label: 'Subject' },
  { key: 'code', label: 'Code' },
  { key: 'department', label: 'Department' },
  { key: 'creditHours', label: 'Credit Hours' },
  { key: 'teachers', label: 'Teachers' },
  { key: 'classes', label: 'Classes' },
]

function handleEdit(row) { console.log('edit subject', row) }
function handleDelete(row) { console.log('delete subject', row) }
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Subjects</div>
        <div class="page-sub">Manage school subjects and curriculum</div>
      </div>
      <button class="btn btn-primary" type="button">+ Add Subject</button>
    </div>

    <div class="card">
      <DataTable
        title="Subjects"
        subtitle="Manage curriculum and assigned classes"
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