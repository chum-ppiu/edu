<script setup>
import { computed, ref } from 'vue'

import DataTable from '@/components/school/bases/DataTable.vue'
import ModalDialog from '@/components/school/bases/ModalDialog.vue'

const emit = defineEmits(['navigate'])

const students = ref([
  {
    id: 1,
    name: 'Sokha Kim',
    email: 'sokha@school.edu',
    code: 'STU-001',
    className: 'Grade 12A',
    phone: '+855 12 345 678',
    gpa: 4.0,
    status: 'Active',
    statusClass: 'badge-green',
    avatar: 'SK',
    avatarStyle: 'background:linear-gradient(135deg,#4f8ef7,#7c5cfc)',
  },
  {
    id: 2,
    name: 'Phally Vann',
    email: 'phally@school.edu',
    code: 'STU-002',
    className: 'Grade 12A',
    phone: '+855 17 234 567',
    gpa: 3.9,
    status: 'Active',
    statusClass: 'badge-green',
    avatar: 'PV',
    avatarStyle: 'background:linear-gradient(135deg,#00d4aa,#4f8ef7)',
  },
  {
    id: 3,
    name: 'Ratha Chan',
    email: 'ratha@school.edu',
    code: 'STU-003',
    className: 'Grade 11B',
    phone: '+855 96 345 678',
    gpa: 3.8,
    status: 'Active',
    statusClass: 'badge-green',
    avatar: 'RC',
    avatarStyle: 'background:linear-gradient(135deg,#f7934f,#f75f5f)',
  },
  {
    id: 4,
    name: 'Borey Sok',
    email: 'borey@school.edu',
    code: 'STU-004',
    className: 'Grade 12B',
    phone: '+855 77 456 789',
    gpa: 3.7,
    status: 'Inactive',
    statusClass: 'badge-yellow',
    avatar: 'BS',
    avatarStyle: 'background:linear-gradient(135deg,#7c5cfc,#f75f5f)',
  },
  {
    id: 5,
    name: 'Lida Noun',
    email: 'lida@school.edu',
    code: 'STU-005',
    className: 'Grade 10A',
    phone: '+855 89 567 890',
    gpa: 3.5,
    status: 'Active',
    statusClass: 'badge-green',
    avatar: 'LN',
    avatarStyle: 'background:linear-gradient(135deg,#f7c948,#f7934f)',
  },
])

const selectedStudent = ref(students.value[0] ?? null)
const modalState = ref({
  open: false,
  mode: 'details',
  position: 'right',
  title: '',
  content: '',
  cancelLabel: 'Close',
  saveLabel: 'Save',
  student: null,
})

const columns = [
  { key: 'student', label: 'Student' },
  { key: 'code', label: 'Code' },
  { key: 'className', label: 'Class' },
  { key: 'phone', label: 'Phone' },
  { key: 'gpa', label: 'GPA' },
  { key: 'status', label: 'Status' },
]

const filters = [
  {
    key: 'className',
    label: 'Class',
    options: [
      { label: 'Grade 10A', value: 'Grade 10A' },
      { label: 'Grade 10B', value: 'Grade 10B' },
      { label: 'Grade 11A', value: 'Grade 11A' },
      { label: 'Grade 11B', value: 'Grade 11B' },
      { label: 'Grade 12A', value: 'Grade 12A' },
      { label: 'Grade 12B', value: 'Grade 12B' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
      { label: 'Graduated', value: 'Graduated' },
    ],
  },
]

const studentCountLabel = computed(() => `${students.value.length} students enrolled`)

function handleAction(action, row) {
  if (action === 'view') {
    selectedStudent.value = row
    modalState.value = {
      open: true,
      mode: 'details',
      position: 'right',
      title: 'Student Details',
      content: '',
      cancelLabel: 'Close',
      saveLabel: 'Edit Student',
      student: row,
    }
    return
  }

  if (action === 'edit') {
    selectedStudent.value = row
    emit('navigate', 'add-student')
    return
  }

  if (action === 'delete') {
    modalState.value = {
      open: true,
      mode: 'delete',
      position: 'center',
      title: 'Delete student?',
      content: `Are you sure you want to delete ${row.name}? This action cannot be undone.`,
      cancelLabel: 'Cancel',
      saveLabel: 'Delete',
      student: row,
    }
  }
}

function closeModal() {
  modalState.value.open = false
}

function handleModalSave() {
  if (!modalState.value.student) {
    closeModal()
    return
  }

  if (modalState.value.mode === 'delete') {
    students.value = students.value.filter((student) => student.id !== modalState.value.student.id)

    if (selectedStudent.value?.id === modalState.value.student.id) {
      selectedStudent.value = students.value[0] ?? null
    }

    closeModal()
    return
  }

  emit('navigate', 'add-student')
  closeModal()
}
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Students</div>
        <div class="page-sub">Manage all enrolled students</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-ghost" type="button">📥 Import</button>
        <button class="btn btn-ghost" type="button">📤 Export</button>
        <button class="btn btn-primary" type="button" @click="$emit('navigate', 'add-student')">+ Add Student</button>
      </div>
    </div>

    <!-- <div v-if="selectedStudent" class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <span class="card-title">Selected Student</span>
        <span class="badge badge-blue">{{ selectedStudent.status }}</span>
      </div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:space-between;">
          <div class="cell-user">
            <div class="avatar" :style="selectedStudent.avatarStyle">{{ selectedStudent.avatar }}</div>
            <div>
              <div class="td-main">{{ selectedStudent.name }}</div>
              <div style="font-size:11px;color:var(--text3)">{{ selectedStudent.email }}</div>
            </div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <span class="badge badge-gray">{{ selectedStudent.code }}</span>
            <span class="badge badge-blue">{{ selectedStudent.className }}</span>
            <span class="badge badge-green">GPA {{ selectedStudent.gpa }}</span>
          </div>
        </div>
      </div>
    </div> -->

    <DataTable
      :columns="columns"
      :filters="filters"
      :page-size="4"
      :rows="students"
      :search-keys="['name', 'email', 'code', 'className', 'phone', 'gpa', 'status']"
      row-key="id"
      search-placeholder="Search student by name, email, code, class, phone, GPA, or status..."
      title="Student List"
      subtitle="Search, filter, and manage enrolled students"
      @view="handleAction('view', $event)"
      @edit="handleAction('edit', $event)"
      @delete="handleAction('delete', $event)"
    >
      <template #cell-student="{ row }">
        <div class="cell-user">
          <div class="avatar" :style="row.avatarStyle">{{ row.avatar }}</div>
          <div>
            <div class="td-main">{{ row.name }}</div>
            <div style="font-size:11px;color:var(--text3)">{{ row.email }}</div>
          </div>
        </div>
      </template>

      <template #cell-code="{ row }">
        <span style="font-family:monospace;color:var(--text3)">{{ row.code }}</span>
      </template>

      <template #cell-gpa="{ row }">
        <span :style="{ color: row.gpa >= 3.8 ? 'var(--accent3)' : row.gpa >= 3.6 ? 'var(--warning)' : 'var(--text2)', fontWeight: 700 }">
          {{ row.gpa.toFixed(1) }}
        </span>
      </template>

      <template #cell-status="{ row }">
        <span class="badge" :class="row.statusClass">{{ row.status }}</span>
      </template>
    </DataTable>

    <ModalDialog
      v-model="modalState.open"
      :cancel-label="modalState.cancelLabel"
      :content="modalState.content"
      :position="modalState.position"
      :save-label="modalState.saveLabel"
      :title="modalState.title"
      @save="handleModalSave"
      @cancel="closeModal"
    >
      <template v-if="modalState.mode === 'details' && modalState.student" #default>
        <div style="display:grid;gap:16px;">
          <div class="cell-user">
            <div class="avatar" :style="modalState.student.avatarStyle">{{ modalState.student.avatar }}</div>
            <div>
              <div class="td-main">{{ modalState.student.name }}</div>
              <div style="font-size:11px;color:var(--text3)">{{ modalState.student.email }}</div>
            </div>
          </div>

          <div style="display:grid;gap:10px;grid-template-columns:repeat(2,minmax(0,1fr));">
            <div style="padding:12px;border:1px solid var(--border);border-radius:14px;background:var(--bg3);">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.08em;">Code</div>
              <div style="margin-top:4px;font-weight:700;">{{ modalState.student.code }}</div>
            </div>
            <div style="padding:12px;border:1px solid var(--border);border-radius:14px;background:var(--bg3);">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.08em;">Class</div>
              <div style="margin-top:4px;font-weight:700;">{{ modalState.student.className }}</div>
            </div>
            <div style="padding:12px;border:1px solid var(--border);border-radius:14px;background:var(--bg3);">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.08em;">Phone</div>
              <div style="margin-top:4px;font-weight:700;">{{ modalState.student.phone }}</div>
            </div>
            <div style="padding:12px;border:1px solid var(--border);border-radius:14px;background:var(--bg3);">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.08em;">GPA</div>
              <div style="margin-top:4px;font-weight:700;">{{ modalState.student.gpa.toFixed(1) }}</div>
            </div>
          </div>

          <div>
            <span class="badge" :class="modalState.student.statusClass">{{ modalState.student.status }}</span>
          </div>
        </div>
      </template>
    </ModalDialog>

    <div style="margin-top:12px;font-size:12px;color:var(--text3)">{{ studentCountLabel }}</div>
  </div>
</template>