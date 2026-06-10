<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormValidation } from '@/composables/useFormValidation'
import FormGroup from '@/components/school/bases/FormGroup.vue'
import ModalDialog from '@/components/school/bases/ModalDialog.vue'
import Selection from '@/components/school/bases/Selection.vue'

const { errors, validateForm, clearError } = useFormValidation()
const { t } = useI18n()

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['submit', 'close'])

// Available hardcoded baseline selections matching standard layout data
const statusOptions = ['Active', 'Inactive']
const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History'
]

// Local Form Reactive State
const form = ref({
  name: '',
  teacher: '',
  capacity: 35,
  subjects: [], // Configured for multiple selection array processing
  status: 'Active'
})

/**
 * Dynamically resolves internal validation object fields into translated text strings
 */
const renderError = (fieldKey) => {
  const errorMeta = errors.value[fieldKey]
  if (!errorMeta) return ''
  
  if (errorMeta.errorType === 'requiredField') {
    return t('error.requiredField', { field: t(errorMeta.fieldKey) })
  }
  return ''
}

const handleSave = () => {
  const rules = [
    { key: 'name', i18nKey: 'addClass.name' },
    { key: 'teacher', i18nKey: 'addClass.teacher' },
    { key: 'capacity', i18nKey: 'addClass.capacity' }
  ]

  const isValid = validateForm(form.value, rules)

  if (!isValid) {
    console.warn('❌ Form validation failed.')
    return
  }

  // System fallback visual metadata styling generation matching main theme
  const systemGradients = [
    'linear-gradient(135deg, #4f8ef7, #7c5cfc)',
    'linear-gradient(135deg, #00d4aa, #4f8ef7)',
    'linear-gradient(135deg, #f7934f, #f75f5f)',
    'linear-gradient(135deg, #7c5cfc, #f75f5f)'
  ]
  const assignedColor = systemGradients[Math.floor(Math.random() * systemGradients.length)]
  
  // Extract initials out of teacher name input context
  const nameParts = form.value.teacher.trim().split(' ')
  const fallbackInitials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : nameParts[0].substring(0, 2).toUpperCase()

  emit('submit', {
    name: form.value.name.trim(),
    teacher: form.value.teacher.trim(),
    teacherAvatar: fallbackInitials || 'TR',
    avatarStyle: `background:${assignedColor}`,
    students: 0,
    capacity: parseInt(form.value.capacity) || 35,
    subjects: form.value.subjects.length || 1,
    status: form.value.status,
    progress: 0
  })

  handleClose()
}

const handleClose = () => {
  emit('close')
  
  // Reset standard state values
  form.value.name = ''
  form.value.teacher = ''
  form.value.capacity = 35
  form.value.subjects = []
  form.value.status = 'Active'
  
  // Wipe tracking validation blocks cleanly
  clearError('name')
  clearError('teacher')
  clearError('capacity')
}
</script>

<template>
  <ModalDialog 
    :model-value="isOpen" 
    :title="t('addClass.title') || 'Add New Class'"
    :save-label="t('common.save')"
    :cancel-label="t('common.cancel')"
    @update:model-value="handleClose"
    @save="handleSave"
    @cancel="handleClose"
  >
    <div class="class-form-layout">
      
      <FormGroup :label="t('addClass.name')" required :error="renderError('name')">
        <input 
          v-model="form.name" 
          type="text" 
          class="filter-input input-field" 
          :placeholder="t('addClass.namePlaceholder') || 'e.g., Grade 10B'"
          @input="clearError('name')"
        />
      </FormGroup>

      <div class="form-grid-split">
        <FormGroup :label="t('addClass.teacher')" required :error="renderError('teacher')">
          <input 
            v-model="form.teacher" 
            type="text" 
            class="filter-input input-field" 
            :placeholder="t('addClass.teacherPlaceholder') || 'e.g., Mr. Sok'"
            @input="clearError('teacher')"
          />
        </FormGroup>

        <FormGroup :label="t('addClass.capacity')" required :error="renderError('capacity')">
          <input 
            v-model="form.capacity" 
            type="number" 
            class="filter-input input-field" 
            min="1"
            max="100"
            @input="clearError('capacity')"
          />
        </FormGroup>
      </div>

      <FormGroup :label="t('addClass.subjects')">
        <Selection 
          v-model="form.subjects" 
          :options="subjectOptions"
          :placeholder="t('addClass.subjectsPlaceholder') || 'Select active subjects'"
          :multiple="true"
          :maxDisplay="3"
        />
      </FormGroup>

      <FormGroup :label="t('addClass.status')">
        <Selection 
          v-model="form.status" 
          :options="statusOptions"
          :placeholder="t('addClass.statusPlaceholder')"
        />
      </FormGroup>

    </div>
  </ModalDialog>
</template>

<style scoped>
.class-form-layout {
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

.input-field {
  width: 100%;
}

@media (max-width: 500px) {
  .form-grid-split {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>