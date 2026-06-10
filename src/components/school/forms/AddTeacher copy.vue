<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormValidation } from '@/composables/useFormValidation'; 
import FormGroup from '@/components/school/bases/FormGroup.vue'
import ModalDialog from '@/components/school/bases/ModalDialog.vue'
import Selection from '@/components/school/bases/Selection.vue'
const { errors, validateForm, clearError } = useFormValidation();

const { t } = useI18n()

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['submit', 'close'])

// Configured arrays matching your system layout structure
const gradeOptions = [
  'Grade 10A',
  'Grade 10B',
  'Grade 11A',
  'Grade 11B',
  'Grade 12A',
  'Grade 12B'
]

const statusOptions = ['Active', 'On Leave', 'Inactive']

// Component Reactive Local Record state
const form = ref({
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  grade: '', // default baseline selected item
  status: 'Active',
  bio: ''
})


/**
 * Dynamically resolves internal meta objects into translated text layouts in real-time
 * This handles instant language updates when switching locales.
 */
const renderError = (fieldKey) => {
  const errorMeta = errors.value[fieldKey];
  if (!errorMeta) return '';
  
  if (errorMeta.errorType === 'requiredField') {
    return t('error.requiredField', { field: t(errorMeta.fieldKey) });
  }
  return '';
};


const handleSave = () => {
 // Pass the raw structural key links instead of pre-computed translated text
  const rules = [
    { key: 'fullName', i18nKey: 'addTeacher.fullName' },
    { key: 'email', i18nKey: 'addTeacher.email' },
    { key: 'phone', i18nKey: 'addTeacher.phone' },
  ];

  const isValid = validateForm(form.value, rules);

  if (!isValid) {
    console.warn('❌ Form validation failed.');
    return;
  }

  // Native gradient tokens matching the dashboard layout design system 
  const systemGradients = [
    'linear-gradient(135deg, #4f8ef7, #7c5cfc)',
    'linear-gradient(135deg, #00d4aa, #4f8ef7)',
    'linear-gradient(135deg, #f7934f, #f75f5f)'
  ]
  const assignedColor = systemGradients[Math.floor(Math.random() * systemGradients.length)]

  emit('submit', {
    fullName: form.value.fullName.trim(),
    subject: form.value.subject.trim(),
    color: assignedColor,
    status: form.value.status,
    classes: 0,
    students: 0,
    rating: 5.0,
    email: form.value.email,
    phone: form.value.phone,
    bio: form.value.bio
  })

  handleClose()
}

const handleClose = () => {
  // 2. Emit the close event to the parent
  emit('close')
  
  // Clear standard layout inputs
  form.value.fullName = ''
  form.value.email = ''
  form.value.phone = ''
  form.value.subject = ''
  form.value.grade = 'Grade 12A'
  form.value.status = 'Active'
  form.value.bio = ''
  // Clear validation errors
  clearError('fullName')
  clearError('email')
  clearError('phone')
}
</script>

<template>
  <ModalDialog 
    :model-value="isOpen" 
    :title="t('addTeacher.title') || 'Add New Teacher'"
    :save-label="t('common.save')"
    :cancel-label="t('common.cancel')"
    @update:model-value="handleClose"
    @save="handleSave"
    @cancel="handleClose"
  >
    <div class="teacher-form-layout">
      
      <FormGroup :label="t('addTeacher.fullName')" required :error="renderError('fullName')">
        <input 
          v-model="form.fullName" 
          type="text" 
          class="filter-input input-field" 
          :placeholder="t('addTeacher.fullNamePlaceholder')"
          @input="clearError('fullName')"
        />
      </FormGroup>

      <div class="form-grid-split">
        <FormGroup :label="t('addTeacher.email')" required :error="renderError('email')">
          <input 
            v-model="form.email" 
            type="email" 
            class="filter-input input-field" 
            :placeholder="t('addTeacher.emailPlaceholder')"
            @input="clearError('email')"
          />
        </FormGroup>

        <FormGroup :label="t('addTeacher.phone')" required :error="renderError('phone')">
          <input 
            v-model="form.phone" 
            type="tel" 
            class="filter-input input-field" 
            :placeholder="t('addTeacher.phonePlaceholder')"
            @input="clearError('phone')"
          />
        </FormGroup>
      </div>

      <div class="form-grid-split">
        <FormGroup :label="t('addTeacher.subject')">
          <input 
            v-model="form.subject" 
            type="text" 
            class="filter-input input-field" 
            :placeholder="t('addTeacher.subjectPlaceholder')"
          />
        </FormGroup>

        <FormGroup :label="t('addTeacher.grade')">
          <Selection 
            v-model="form.grade" 
            :options="gradeOptions"
            :placeholder="t('addTeacher.gradePlaceholder')"
            :multiple="true"
            :maxDisplay="2"
          />
        </FormGroup>
      </div>

      <FormGroup :label="t('addTeacher.status')">
        <Selection 
          v-model="form.status" 
          :options="statusOptions"
          :placeholder="t('addTeacher.statusPlaceholder')"
        />
      </FormGroup>

      <FormGroup :label="t('addTeacher.bio')">
        <textarea 
          v-model="form.bio" 
          class="filter-input bio-textarea" 
          rows="3" 
          :placeholder="t('addTeacher.bioPlaceholder')"
        ></textarea>
      </FormGroup>

    </div>
  </ModalDialog>
</template>

<style scoped>
.teacher-form-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 2px;
}

.form-grid-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.bio-textarea {
  font-family: inherit;
  resize: vertical;
  min-height: 72px;
  background: var(--bg-2, #101c31);
  color: var(--text, #edf2ff);
  border-radius: var(--radius-sm, 10px);
  padding: 10px 14px;
  outline: none;
}

@media (max-width: 500px) {
  .form-grid-split {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>