<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from '@/components/school/bases/DataTable.vue'
import AddSubject from '@/components/school/forms/AddSubject.vue'

const { t } = useI18n()

// Control switch mirror design matching TeachersPage.vue modal architecture
const isAddModalOpen = ref(false)

// Base state values aligned to exact JSON payload structures
const subjects = ref([
  { id: 1, name: 'Mathematics', code: 'MATH101', credits: 3, dpt: 'Science' },
  { id: 2, name: 'Physics', code: 'PHYS101', credits: 4, dpt: 'Science' },
  { id: 3, name: 'Chemistry', code: 'CHEM101', credits: 4, dpt: 'Science' },
  { id: 4, name: 'Biology', code: 'BIO101', credits: 4, dpt: 'Science' },
  { id: 5, name: 'English', code: 'ENG101', credits: 3, dpt: 'Language' },
  { id: 6, name: 'Khmer', code: 'KHMR101', credits: 3, dpt: 'Language' }
])

const columns = [
  { key: 'name', label: t('subjects.subject') || 'Subject' },
  { key: 'code', label: t('subjects.code') || 'Code' },
  { key: 'dpt', label: t('subjects.department') || 'Department' },
  { key: 'credits', label: t('subjects.credits') || 'Credits' }
]

const handleAddSubjectSubmit = (newSubject) => {
  console.log('✅ New subject successfully added:', newSubject)
  
  // Append new item containing structural ID calculations
  subjects.value.push({
    id: subjects.value.length ? Math.max(...subjects.value.map(s => s.id)) + 1 : 1,
    ...newSubject
  })
}

function handleEdit(row) { console.log('edit subject row reference:', row) }
function handleDelete(row) { 
  console.log('delete subject row reference:', row)
  subjects.value = subjects.value.filter(s => s.id !== row.id)
}
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('subjects.title') || 'Subjects' }}</div>
        <div class="page-sub">{{ t('subjects.subtitle') || 'Manage and assign school courses' }}</div>
      </div>
      <button class="btn btn-primary" type="button" @click="isAddModalOpen = true">
        + {{ t('subjects.add') || 'Add Subject' }}
      </button>
    </div>

    <div class="card">
      <DataTable
        :title="t('subjects.listTitle') || 'Subject List'"
        :subtitle="t('subjects.listSubtitle') || 'Search, filter, and inspect departments'"
        :rows="subjects"
        :columns="columns"
        :page-size="8"
        :search-keys="['name', 'code', 'dpt']"
        row-key="id"
      >
        <template #cell-code="{ row }">
          <span style="font-family:monospace;color:var(--text3)">{{ row.code }}</span>
        </template>

        <template #cell-dpt="{ row }">
          <span 
            class="badge" 
            :class="row.dpt === 'Science' ? 'badge-blue' : row.dpt === 'Language' ? 'badge-green' : 'badge-purple'"
          >
            {{ row.dpt }}
          </span>
        </template>

        <template #actions="{ row }">
          <button class="action-btn" type="button" @click="handleEdit(row)">✏️</button>
          <button class="action-btn danger" type="button" @click="handleDelete(row)">🗑</button>
        </template>
      </DataTable>
    </div>

    <AddSubject 
      :is-open="isAddModalOpen"
      @submit="handleAddSubjectSubmit"
      @close="isAddModalOpen = false"
    />
  </div>
</template>