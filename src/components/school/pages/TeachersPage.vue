<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AddTeacher from '@/components/school/forms/AddTeacher.vue'

const { t } = useI18n()

const isAddModalOpen = ref(false)

// Structural reactive data array aligned with teacher.json schema
const teachers = ref([
  {
    ID: 1,
    fullName: "Sok Dara",
    email: "sok.dara@example.com",
    phone: "0123456789",
    subjects: [
      { ID: 1, Name: "Mathematics" },
      { ID: 2, Name: "Physics" },
      { ID: 3, Name: "Chemistry" }
    ],
    grades: [
      { gradeID: 1, gradeName: "Grade 10" },
      { gradeID: 2, gradeName: "Grade 11" },
      { gradeID: 3, gradeName: "Grade 12" }
    ],
    status: "active",
    bio: "Sok Dara is a dedicated teacher with over 10 years of experience in teaching mathematics and science subjects. He is passionate about helping students achieve their academic goals and fostering a love for learning.",
    // Visual metadata derived from core theme structures
    initials: "SD",
    bannerGradient: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
    profileImage: "https://img.icons8.com/liquid-glass-color/1200/user-male-circle.jpg" // Placeholder for potential future profile image uploads
  }
])

// Helper functions to cleanly join lists for view templates
const formatSubjects = (subjects) => subjects.map(s => s.Name).join(' · ')
const formatGrades = (grades) => grades.map(g => g.gradeName).join(', ')

// Safely computes years of experience directly out of user bio context for metric display
const parseExperience = (bio) => {
  const match = bio.match(/(\d+)\s+years/)
  return match ? `${match[1]}+ Yrs` : '10+ Yrs'
}

const handleAddTeacherSubmit = (newTeacher) => {
  console.log('✅ New teacher added:', newTeacher)
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
      <div v-for="teacher in teachers" :key="teacher.ID" class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        
        <div>
          <div :style="{ background: teacher.bannerGradient }" style="height: 90px; width: 100%; position: relative; opacity: 0.85;">
            <div style="position: absolute; top: 12px; right: 12px;">
              <span :class="['badge', teacher.status === 'active' ? 'badge-green' : 'badge-yellow']" style="text-transform: uppercase; letter-spacing: 0.5px;">
                {{ teacher.status }}
              </span>
            </div>
          </div>

          <div style="padding: 0 20px; text-align: center; margin-top: -45px; position: relative; z-index: 2;">
            <div class="teacher-avatar-frame">
              <img 
                v-if="teacher.profileImage" 
                :src="teacher.profileImage" 
                :alt="teacher.fullName"
                class="teacher-avatar-img"
              />
              <span 
                v-else 
                class="teacher-avatar-fallback"
                :style="{ background: teacher.bannerGradient }"
              >
                {{ teacher.initials }}
              </span>
            </div>
            
            <div style="font-weight: 800; font-size: 17px; margin-top: 12px; color: var(--text);">
              {{ teacher.fullName }}
            </div>
            <div style="font-size: 12px; color: var(--accent); font-weight: 700; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
              {{ formatSubjects(teacher.subjects) }}
            </div>
            <div style="font-size: 11px; color: var(--text-3); margin-top: 2px;">
              {{ formatGrades(teacher.grades) }}
            </div>

            <div style="font-size: 11.5px; color: var(--text-2); margin-top: 12px; font-style: italic; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; padding: 0 10px;">
              "{{ teacher.bio }}"
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: rgba(255, 255, 255, 0.01); margin-top: 20px; padding: 12px 10px;">
            <div style="flex: 1; text-align: center;">
              <div style="font-family: var(--font-family-main); font-size: 16px; font-weight: 800; color: var(--text);">3</div>
              <div style="font-size: 10px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">{{ t('teachers.classes') }}</div>
            </div>
            <div style="width: 1px; height: 20px; background: var(--border);"></div>
            <div style="flex: 1; text-align: center;">
              <div style="font-family: var(--font-family-main); font-size: 16px; font-weight: 800; color: var(--text);">{{ teacher.grades.length }}</div>
              <div style="font-size: 10px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">Grades</div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; gap: 12px;">
          <div style="display: flex; gap: 8px;">
            <a :href="'mailto:' + teacher.email" class="action-btn" style="width: 32px; height: 32px; border-radius: 50%;" :title="teacher.email">✉</a>
            <a :href="'tel:' + teacher.phone" class="action-btn" style="width: 32px; height: 32px; border-radius: 50%;" :title="teacher.phone">📞</a>
          </div>

          <div style="display: flex; gap: 6px; flex: 1; justify-content: flex-end;">
            <button class="btn btn-ghost" style="padding: 6px 12px; font-size: 11.5px;" type="button">
              {{ t('teachers.view') }}
            </button>
            <button class="btn btn-primary" style="padding: 6px 14px; font-size: 11.5px; box-shadow: none;" type="button">
              {{ t('teachers.edit') }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <AddTeacher 
      :is-open="isAddModalOpen"
      @submit="handleAddTeacherSubmit"
      @close="isAddModalOpen = false"
    />
  </div>
</template>
<style scoped>
/* Container circle matching the overlapping design specifications */
.teacher-avatar-frame {
  width: 86px;
  height: 86px;
  margin: 0 auto;
  border-radius: 50%;
  background: var(--bg-3);
  border: 4px solid var(--bg-2);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Ensures profile images clip cleanly into a circle */
}

/* Fluid responsive image formatting */
.teacher-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fallback text treatment using your custom text clipping mask rules */
.teacher-avatar-fallback {
  font-family: var(--font-family-main);
  font-size: 26px;
  font-weight: 800;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>