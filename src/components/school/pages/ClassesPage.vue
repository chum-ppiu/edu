<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from '@/components/school/bases/DataTable.vue'
import AddClass from '@/components/school/forms/AddClass.vue'

const { t } = useI18n()

const isAddModalOpen = ref(false)

const classes = ref([
  { id: 1, name: 'Grade 12A', teacher: 'Mr. Dara', teacherAvatar: 'DR', avatarStyle: 'background:linear-gradient(135deg,#4f8ef7,#7c5cfc)', students: 32, capacity: 35, subjects: 6, status: 'Active' , progress: 91},
  { id: 2, name: 'Grade 12B', teacher: 'Ms. Sreypich', teacherAvatar: 'SP', avatarStyle: 'background:linear-gradient(135deg,#00d4aa,#4f8ef7)', students: 28, capacity: 35, subjects: 6, status: 'Active', progress: 80},
  { id: 3, name: 'Grade 11A', teacher: 'Mr. Kosal', teacherAvatar: 'KM', avatarStyle: 'background:linear-gradient(135deg,#f7934f,#f75f5f)', students: 30, capacity: 35, subjects: 5, status: 'Active', progress: 86},
  { id: 4, name: 'Grade 10A', teacher: 'Ms. Lida', teacherAvatar: 'LR', avatarStyle: 'background:linear-gradient(135deg,#7c5cfc,#f75f5f)', students: 25, capacity: 35, subjects: 5, status: 'Active', progress: 71},
])

const columns = [
  { key: 'name', label: t('classes.title') },
  { key: 'teacher', label: t('classes.teacher') },
  { key: 'students', label: t('classes.students') },
  { key: 'capacity', label: t('classes.capacity') },
  { key: 'subjects', label: t('classes.subjects') },
  { key: 'status', label: t('classes.status') },
]

function handleView(row) { console.log('view class', row) }
function handleEdit(row) { console.log('edit class', row) }

const handleAddClassSubmit = (newClass) => {
  console.log('✅ New class added:', newClass)
  classes.value.push({
    id: classes.value.length + 1,
    ...newClass
  })
}
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('classes.title') }}</div>
        <div class="page-sub">{{ t('classes.subtitle') }}</div>
      </div>
      <button class="btn btn-primary" type="button" @click="isAddModalOpen = true">
        + {{ t('classes.create') }}
      </button>
    </div>

    <div class="card">
      <DataTable
        :title="t('classes.title')"
        :subtitle="t('classes.subtitle')"
        :rows="classes"
        :columns="columns"
        :page-size="8"
        :search-keys="['name','teacher','status']"
      >
        <template #cell-teacher="{ row }">
          <div class="cell-user">
            <div class="avatar avatar-sm" :style="row.avatarStyle">{{ row.teacherAvatar }}</div>
            {{ row.teacher }}
          </div>
        </template>

        <template #cell-capacity="{ row }">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 12px; min-width: 45px; display: inline-block;">
              {{ row.students }} / {{ row.capacity }}
            </span>
            <div class="progress" style="width:120px">
              <div 
                class="progress-fill" 
                :style="{ 
                  width: (row.students / row.capacity * 100) + '%', 
                  background: (row.students / row.capacity * 100) > 85 ? 'var(--warning)' : 'var(--accent)' 
                }"
              ></div>
            </div>
          </div>
        </template>

        <template #cell-subjects="{ row }">
          <span class="badge badge-blue">{{ row.subjects }} subjects</span>
        </template>
        
        <template #cell-status="{ row }">
          <span :class="['badge', row.status.toLowerCase() === 'active' ? 'badge-green' : 'badge-gray']">
            {{ row.status }}
          </span>
        </template>

        <template #actions="{ row }">
          <button class="action-btn" type="button" @click="handleView(row)">👁</button>
          <button class="action-btn" type="button" @click="handleEdit(row)">✏️</button>
        </template>
      </DataTable>
    </div>

    <AddClass 
      :is-open="isAddModalOpen"
      @submit="handleAddClassSubmit"
      @close="isAddModalOpen = false"
    />
  </div>
</template>