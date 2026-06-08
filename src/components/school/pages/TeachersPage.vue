<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AddTeacher from '@/components/school/forms/AddTeacher.vue'

const { t } = useI18n()

const isAddModalOpen = ref(false)

// Made reactive via ref() to easily push structural additions
const teachers = ref([
  { initials: 'DR', name: 'Mr. Dara Ros', subject: 'Mathematics · Grade 10, 11, 12', color: 'linear-gradient(135deg,#4f8ef7,#7c5cfc)', status: 'Active', classes: 3, students: 92, rating: 4.8 },
  { initials: 'SP', name: 'Ms. Sreypich Pok', subject: 'English · Grade 10, 11', color: 'linear-gradient(135deg,#00d4aa,#4f8ef7)', status: 'Active', classes: 2, students: 64, rating: 4.9 },
  { initials: 'KM', name: 'Mr. Kosal Mao', subject: 'Science · Grade 11, 12', color: 'linear-gradient(135deg,#f7934f,#f75f5f)', status: 'On Leave', classes: 2, students: 58, rating: 4.6 },
])

const handleAddTeacherSubmit = (newTeacher) => {
  teachers.value.push(newTeacher)
}
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('teachers.title') }}</div>
        <div class="page-sub">{{ t('teachers.subtitle') }}</div>
      </div>
      <button class="btn btn-primary" type="button" @click="isAddModalOpen = true">
        + {{ t('teachers.addTeacher') }}
      </button>
    </div>

    <div class="grid-3">
      <div v-for="teacher in teachers" :key="teacher.name" class="card">
        <div class="card-body" style="text-align:center;padding:24px;">
          <div class="avatar" style="width:60px;height:60px;font-size:22px;margin:0 auto 12px;" :style="{ background: teacher.color }">{{ teacher.initials }}</div>
          <div style="font-weight:700;font-size:15px;margin-bottom:4px;">{{ teacher.name }}</div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:10px;">{{ teacher.subject }}</div>
          
          <span class="badge badge-green" v-if="teacher.status === 'Active'">Active</span>
          <span class="badge badge-yellow" v-else>On Leave</span>
          
          <div class="quick-row" style="margin-top:14px;">
            <div class="quick-stat"><div class="quick-stat-val">{{ teacher.classes }}</div><div class="quick-stat-lbl">{{ t('teachers.classes') }}</div></div>
            <div class="quick-stat"><div class="quick-stat-val">{{ teacher.students }}</div><div class="quick-stat-lbl">{{ t('teachers.students') }}</div></div>
            <div class="quick-stat"><div class="quick-stat-val">{{ teacher.rating }}</div><div class="quick-stat-lbl">{{ t('teachers.rating') }}</div></div>
          </div>
          <div style="display:flex;gap:6px;margin-top:14px;">
            <button class="btn btn-ghost" style="flex:1;font-size:12px;" type="button">{{ t('teachers.view') }}</button>
            <button class="btn btn-primary" style="flex:1;font-size:12px;" type="button">{{ t('teachers.edit') }}</button>
          </div>
        </div>
      </div>
    </div>

    <AddTeacher 
      :is-open="isAddModalOpen" 
      @close="isAddModalOpen = false" 
      @submit="handleAddTeacherSubmit"
    />
  </div>
</template>