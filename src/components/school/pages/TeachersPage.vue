<script setup>
import { ref } from 'vue'
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
      { ID: 3, Name: "Chemistry" },
      { ID: 4, Name: "Biology" }
    ],
    grades: [
      { gradeID: 1, gradeName: "Grade 10" },
      { gradeID: 2, gradeName: "Grade 11" },
      { gradeID: 3, gradeName: "Grade 12" }
    ],
    status: "active",
    bio: "Sok Dara is a dedicated teacher with over 10 years of experience in teaching mathematics and science subjects. He is passionate about helping students achieve their academic goals and fostering a love for learning.",
    initials: "SD",
    bannerGradient: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
    bannerImage: "https://t3.ftcdn.net/jpg/04/15/37/52/240_F_415375204_sdMq1exdH8iMsDsxz588J0BrbIWOSLJA.jpg"
  },
  {
    ID: 2,
    fullName: "Choun Sreypich",
    email: "choun.sreypich@example.com",
    phone: "0987654321",
    subjects: [
      { ID: 5, Name: "History" },
      { ID: 6, Name: "Geography" }
    ],
    grades: [
      { gradeID: 1, gradeName: "Grade 10" },
      { gradeID: 2, gradeName: "Grade 11" }
    ],
    status: "on leave",
    bio: "Choun Sreypich excels in creating immersive humanities and world history environments. She loves teaching historical context through creative narrative roleplay modules.",
    initials: "CS",
    bannerGradient: "linear-gradient(135deg, #00d4aa 0%, #4f8ef7 100%)",
    bannerImage: "https://img.freepik.com/premium-photo/modern-classroom-with-empty-chairs-desks-generative-ai_220873-24701.jpg"
  }
])

const handleAddTeacherSubmit = (newTeacher) => {
  teachers.value.push({
    ID: teachers.value.length + 1,
    ...newTeacher
  })
}

/**
 * Returns clean color configuration strings depending on active status strings
 */
const getStatusThemeClass = (statusString) => {
  const norm = String(statusString).toLowerCase().trim()
  if (norm === 'active') return 'status-active'
  if (norm === 'on leave') return 'status-onleave'
  return 'status-inactive'
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
      <div v-for="teacher in teachers" :key="teacher.ID" class="card teacher-card">
        
        <div 
          class="teacher-banner" 
          :style="teacher.bannerImage 
            ? { backgroundImage: `url(${teacher.bannerImage})` } 
            : { background: teacher.bannerGradient || 'var(--bg-3)' }"
        >
          <div class="banner-gradient-cover"></div>
          <span :class="['status-pill-badge', getStatusThemeClass(teacher.status)]">
            <span class="status-indicator-dot"></span>
            {{ teacher.status }}
          </span>
        </div>

        <div class="teacher-avatar-frame">
          <div class="teacher-avatar-fallback" :style="{ background: teacher.bannerGradient || 'var(--accent)' }">
            {{ teacher.initials }}
          </div>
        </div>

        <div class="teacher-identity">
          <div class="teacher-name">{{ teacher.fullName }}</div>
          <div class="teacher-email">{{ teacher.email }}</div>
        </div>

        <div class="teacher-subjects">
          <span 
            v-for="(sub, index) in teacher.subjects.slice(0, 3)" 
            :key="typeof sub === 'object' ? sub.ID : index" 
            class="badge"
          >
            {{ typeof sub === 'object' ? sub.Name : sub }}
          </span>
          <span v-if="teacher.subjects.length > 3" class="badge ellipsis-badge">...</span>
        </div>

        <p class="teacher-bio-summary">
          {{ teacher.bio }}
        </p>

        <div class="teacher-grades">
          <div class="grade-label">Grades:</div>
          <div class="grade-tags-row">
            <span v-for="(g, index) in teacher.grades" :key="typeof g === 'object' ? g.gradeID : index" class="grade-tag">
              {{ typeof g === 'object' ? g.gradeName : g }}
            </span>
          </div>
        </div>

        <hr class="card-divider" />

        <div class="teacher-actions-footer">
          <div class="contact-links">
            <a :href="'tel:' + teacher.phone" class="btn btn-ghost" :title="teacher.phone">📞</a>
          </div>

          <div style="display: flex; gap: 6px; flex: 1; justify-content: flex-end;">
            <button class="btn btn-ghost" style="font-size: 10.5px;" type="button">
              {{ t('teachers.view') }}
            </button>
            <button class="btn btn-primary" type="button">
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
div.card:hover {
  box-shadow: 0 0 5px 5px var(--shadow-strong);
}

.teacher-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.teacher-banner {
  position: relative;
  height: 90px;
  background-size: cover;
  background-position: center;
  width: 100%;
}

.banner-gradient-cover {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%);
}

.status-pill-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.status-indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-active {
  background: rgba(25, 212, 179, 0.15);
  color: #19d4b3;
  border: 1px solid rgba(25, 212, 179, 0.3);
}
.status-active .status-indicator-dot {
  background-color: #19d4b3;
}

.status-onleave {
  background: rgba(255, 157, 92, 0.15);
  color: #ff9d5c;
  border: 1px solid rgba(255, 157, 92, 0.3);
}
.status-onleave .status-indicator-dot {
  background-color: #ff9d5c;
}

.status-inactive {
  background: rgba(255, 107, 116, 0.15);
  color: #ff6b74;
  border: 1px solid rgba(255, 107, 116, 0.3);
}
.status-inactive .status-indicator-dot {
  background-color: #ff6b74;
}

.teacher-avatar-frame {
  width: 76px;
  height: 76px;
  margin: -38px auto 0 auto;
  border-radius: 50%;
  border: 4px solid var(--bg-2);
  z-index: 2;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.teacher-avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  color: white;
}

.teacher-identity {
  text-align: center;
  padding: 12px 16px 4px 16px;
}

.teacher-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.teacher-email {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 2px;
}

.teacher-subjects {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  flex-wrap: wrap;
}

.badge {
  background: var(--bg-3);
  color: var(--text-2);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  border: 1px solid var(--border);
}

.ellipsis-badge {
  letter-spacing: 1px;
  font-weight: bold;
}

.teacher-bio-summary {
  font-size: 12.5px;
  color: var(--text-2);
  padding: 4px 16px;
  margin: 0;
  text-align: center;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 38px;
}

.teacher-grades {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.grade-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-3);
}

.grade-tags-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.grade-tag {
  font-size: 11px;
  color: var(--accent);
  background: rgba(109, 147, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.card-divider {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 0;
}

.teacher-actions-footer {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.08);
}
</style>