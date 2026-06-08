<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('addStudent.title') }}</div>
        <div class="page-sub">{{ t('addStudent.subtitle') }}</div>
      </div>
      <button class="btn btn-ghost" type="button" @click="emit('navigate', 'students')">← {{ t('addStudent.back') }}</button>
    </div>

    <div class="grid-2" style="align-items: start;">
      <div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><span class="card-title">{{ t('addStudent.personal') }}</span></div>
          <div class="card-body">
            <div class="form-grid">
              
              <FormGroup :label="t('addStudent.firstName')" required :error="renderError('firstName')">
                <input class="filter-input" v-model="studentForm.firstName" placeholder="Sokha" @input="clearError('firstName')" />
              </FormGroup>
              
              <FormGroup :label="t('addStudent.lastName')" required :error="renderError('lastName')">
                <input class="filter-input" v-model="studentForm.lastName" placeholder="Kim" @input="clearError('lastName')" />
              </FormGroup>
              
              <FormGroup :label="t('addStudent.gender')" required :error="renderError('gender')">
                <select class="filter-input" v-model="studentForm.gender" @change="clearError('gender')">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </FormGroup>
              
              <FormGroup :label="t('addStudent.dob')" required :error="renderError('dateOfBirth')">
                <CustomDatePicker 
                  v-model="studentForm.dateOfBirth" 
                  selection-mode="single"
                  format="YYYY-MM-DD"
                  placeholder="YYYY-MM-DD"
                  @change="clearError('dateOfBirth')"
                />
              </FormGroup>

              <FormGroup :label="t('addStudent.pob')">
                <input class="filter-input" v-model="studentForm.placeOfBirth" placeholder="Phnom Penh" />
              </FormGroup>
              
              <FormGroup :label="t('addStudent.nationality')">
                <input class="filter-input" v-model="studentForm.nationality" placeholder="Khmer" />
              </FormGroup>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">{{ t('addStudent.contact') }}</span></div>
          <div class="card-body">
            <div class="form-grid">
              <FormGroup :label="t('addStudent.phone')" required :error="renderError('phone')">
                <input class="filter-input" v-model="studentForm.phone" placeholder="012 345 678" @input="clearError('phone')" />
              </FormGroup>
              
              <FormGroup :label="t('addStudent.email')">
                <input class="filter-input" v-model="studentForm.email" placeholder="student@example.com" />
              </FormGroup>
              
              <FormGroup :label="t('addStudent.address')" style="grid-column:span 2">
                <input class="filter-input" v-model="studentForm.address" placeholder="Street 123, Sangkat, Khan..." />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><span class="card-title">{{ t('addStudent.academic') }}</span></div>
          <div class="card-body">
            <div class="form-grid">
              <FormGroup :label="t('addStudent.studentId')" required :error="renderError('studentId')">
                <input class="filter-input" v-model="studentForm.studentId" placeholder="STD2026001" @input="clearError('studentId')" />
              </FormGroup>
              
              <FormGroup :label="t('addStudent.grade')" required :error="renderError('grade')">
                <select class="filter-input" v-model="studentForm.grade" @change="clearError('grade')">
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </FormGroup>
              
              <FormGroup :label="t('addStudent.class')" required :error="renderError('classGroup')">
                <select class="filter-input" v-model="studentForm.classGroup" @change="clearError('classGroup')">
                  <option value="Class A1">Class A1</option>
                  <option value="Class B2">Class B2</option>
                </select>
              </FormGroup>
              
              <FormGroup :label="t('addStudent.enrollmentDate')" required :error="renderError('enrollmentDate')">
                <CustomDatePicker 
                  v-model="studentForm.enrollmentDate" 
                  selection-mode="single"
                  format="YYYY-MM-DD"
                  placeholder="YYYY-MM-DD"
                  @change="clearError('enrollmentDate')"
                />
              </FormGroup>

              <FormGroup :label="t('addStudent.status')">
                <select class="filter-input" v-model="studentForm.status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormGroup>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">{{ t('addStudent.upload') }}</span></div>
          <div class="card-body">
            <input 
              type="file" 
              ref="fileInputRef" 
              style="display: none;" 
              @change="handleFileUpload"
              accept=".png,.jpg,.jpeg,.pdf"
            />
            <div 
              style="border:2px dashed var(--border);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:border-color .2s;" 
              onmouseover="this.style.borderColor='var(--accent)'" 
              onmouseout="this.style.borderColor='var(--border)'"
              @click="triggerFileBrowse"
            >
              <div style="font-size:28px;margin-bottom:8px;">📎</div>
              <div style="font-size:13px;font-weight:600;">
                {{ studentForm.documentName || t('addStudent.uploadHint') }}
              </div>
              <div style="font-size:11px;color:var(--text3);margin-top:4px;">{{ t('addStudent.uploadSub') }}</div>
              <button class="btn btn-ghost" style="margin-top:12px;font-size:12px;" type="button">
                {{ t('addStudent.browse') }}
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions" style="margin-top:16px;padding-top:0;border:none;">
          <button class="btn btn-ghost" type="button" @click="emit('navigate', 'students')">
            {{ t('common.cancel') }}
          </button>
          <button class="btn btn-primary" type="button" @click="handleSave">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CustomDatePicker from '@/components/school/ui/CustomDatePicker.vue';
import FormGroup from '@/components/FormGroup.vue'; 
import { useFormValidation } from '@/composables/useFormValidation'; 

const emit = defineEmits(['navigate']);
const { t } = useI18n();

const fileInputRef = ref(null);
const { errors, validateForm, clearError } = useFormValidation();

const studentForm = ref({
  firstName: '',
  lastName: '',
  gender: 'Male',
  dateOfBirth: '',
  placeOfBirth: '',
  nationality: '',
  phone: '',
  email: '',
  address: '',
  studentId: '',
  grade: 'Grade 10', 
  classGroup: 'Class A1', 
  enrollmentDate: '',
  status: 'Active',
  documentFile: null,
  documentName: ''
});

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

const triggerFileBrowse = () => {
  if (fileInputRef.value) fileInputRef.value.click();
};

const handleFileUpload = (event) => {
  const target = event.target;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    studentForm.value.documentFile = file;
    studentForm.value.documentName = file.name;
  }
};

const handleSave = () => {
  // Pass the raw structural key links instead of pre-computed translated text
  const rules = [
    { key: 'firstName', i18nKey: 'addStudent.firstName' },
    { key: 'lastName', i18nKey: 'addStudent.lastName' },
    { key: 'gender', i18nKey: 'addStudent.gender' },
    { key: 'dateOfBirth', i18nKey: 'addStudent.dob' },
    { key: 'phone', i18nKey: 'addStudent.phone' },
    { key: 'studentId', i18nKey: 'addStudent.studentId' },
    { key: 'grade', i18nKey: 'addStudent.grade' },
    { key: 'classGroup', i18nKey: 'addStudent.class' },
    { key: 'enrollmentDate', i18nKey: 'addStudent.enrollmentDate' }
  ];

  const isValid = validateForm(studentForm.value, rules);

  if (!isValid) {
    console.warn('❌ Form validation failed.');
    return;
  }

  console.log('====================================');
  console.log('🚀 SUBMITTING DATA PAYLOAD:', JSON.parse(JSON.stringify(studentForm.value)));
  console.log('====================================');
  
  emit('navigate', 'students');
};
</script>