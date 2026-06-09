<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormValidation } from '@/composables/useFormValidation'
import FormGroup from '@/components/school/bases/FormGroup.vue'
import ModalDialog from '@/components/school/bases/ModalDialog.vue'
import Selection from '@/components/school/bases/Selection.vue'

const { t } = useI18n()
const { errors, validateForm, clearError } = useFormValidation()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'close'])

// Component Reactive Local Record state matching subject.json fields
const form = ref({
  name: '',
  code: '',
  credits: null,
  dpt: 'Science'
})

// Department selection picker dropdown values
const departmentOptions = ['Science', 'Language', 'Arts']

/**
 * Dynamically resolves internal validation schema configurations to reactive translation values
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
    { key: 'name', i18nKey: 'addSubject.name' },
    { key: 'code', i18nKey: 'addSubject.code' },
    { key: 'credits', i18nKey: 'addSubject.credits' },
  ]

  const isValid = validateForm(form.value, rules)

  if (!isValid) {
    console.warn('❌ Form validation failed.')
    return
  }

  // Bubble payload back up to host array list view
  emit('submit', {
    name: form.value.name.trim(),
    code: form.value.code.toUpperCase().trim(),
    credits: Number(form.value.credits),
    dpt: form.value.dpt
  })

  handleClose()
}

const handleClose = () => {
  emit('close')
  
  // Reset form properties back to baseline state
  form.value.name = ''
  form.value.code = ''
  form.value.credits = null
  form.value.dpt = 'Science'

  // Flush legacy validation tags
  clearError('name')
  clearError('code')
  clearError('credits')
  clearError('dpt')
}
</script>

<template>
  <ModalDialog 
    :model-value="isOpen" 
    :title="t('addSubject.title') || 'Add New Subject'"
    :save-label="t('common.save') || 'Save'"
    
    :cancel-label="t('common.cancel')"
    @update:model-value="handleClose"
    @save="handleSave"
    @cancel="handleClose"
  >
    <div class="subject-form-layout">
      
      <FormGroup :label="t('addSubject.name', 'Subject Name')" required :error="renderError('name')">
        <input 
          v-model="form.name" 
          type="text" 
          class="filter-input input-field" 
          :placeholder="t('addSubject.namePlaceholder')"
          @input="clearError('name')"
        />
      </FormGroup>

      <div class="form-grid-split">
        <FormGroup :label="t('addSubject.code', 'Subject Code')" required :error="renderError('code')">
          <input 
            v-model="form.code" 
            type="text" 
            class="filter-input input-field" 
            :placeholder="t('addSubject.codePlaceholder')"
            @input="clearError('code')"
          />
        </FormGroup>

        <FormGroup :label="t('addSubject.credits', 'Credits')" required :error="renderError('credits')">
          <input 
            v-model.number="form.credits" 
            type="number" 
            class="filter-input input-field" 
            :placeholder="t('addSubject.creditsPlaceholder')"
            @input="clearError('credits')"
          />
        </FormGroup>
      </div>

      <FormGroup :label="t('addSubject.dpt', 'Department')">
        <Selection 
          v-model="form.dpt" 
          :options="departmentOptions"
          :placeholder="t('addSubject.dptPlaceholder', 'Select Department')"
          @change="clearError('dpt')"
        />
      </FormGroup>

    </div>
  </ModalDialog>
</template>

<style scoped>
.subject-form-layout {
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