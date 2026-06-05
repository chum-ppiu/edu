<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
const emit = defineEmits(['navigate'])
const { t } = useI18n()
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('addStudent.title') }}</div>
        <div class="page-sub">{{ t('addStudent.subtitle') }}</div>
      </div>
      <button class="btn btn-ghost" type="button" @click="emit('navigate', 'students')">← {{ t('addStudent.back') }}</button>
    </div>

    <div class="grid-2" style="align-items:start">
      <div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><span class="card-title">{{ t('addStudent.personal') }}</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.firstName') }}<span class="star-danger">*</span></label><input class="filter-input" placeholder="Sokha" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.lastName') }}<span class="star-danger">*</span></label><input class="filter-input" placeholder="Kim" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.dob') }}</label><input class="filter-input" type="date" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.gender') }}</label><select class="filter-input"><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div class="form-group filter-dropdown full"><label class="form-label">{{ t('addStudent.email') }}<span class="star-danger">*</span></label><input class="filter-input" placeholder="sokha@school.edu" type="email" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.phone') }}</label><input class="filter-input" placeholder="+855 12 345 678" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.code') }}</label><input class="filter-input not-allowed" placeholder="Auto-generated" disabled style="opacity:.5" /></div>
              <div class="form-group filter-dropdown full"><label class="form-label">{{ t('addStudent.address') }}</label><textarea class="filter-input" rows="2" placeholder="Phnom Penh, Cambodia"></textarea></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">{{ t('addStudent.parent') }}</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.parentName') }}</label><input class="filter-input" placeholder="Kim Sokha" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.relationship') }}</label><select class="filter-input"><option>Father</option><option>Mother</option><option>Guardian</option></select></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.phone') }}<span class="star-danger">*</span></label><input class="filter-input" placeholder="+855 12 000 000" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.email') }}</label><input class="filter-input" placeholder="parent@email.com" /></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><span class="card-title">{{ t('addStudent.academic') }}</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.class') }}</label><select class="filter-input"><option>Grade 10A</option><option>Grade 10B</option><option>Grade 11A</option><option>Grade 12A</option></select></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.department') }}</label><select class="filter-input"><option>Science</option><option>Arts</option><option>Commerce</option></select></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.academicYear') }}</label><select class="filter-input"><option>2024-2025</option><option>2023-2024</option></select></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.enrollmentDate') }}</label><input class="filter-input" type="date" /></div>
              <div class="form-group filter-dropdown"><label class="form-label">{{ t('addStudent.status') }}</label><select class="filter-input"><option>Active</option><option>Inactive</option></select></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">{{ t('addStudent.upload') }}</span></div>
          <div class="card-body">
            <div style="border:2px dashed var(--border);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:border-color .2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
              <div style="font-size:28px;margin-bottom:8px;">📎</div>
              <div style="font-size:13px;font-weight:600;">{{ t('addStudent.uploadHint') }}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:4px;">{{ t('addStudent.uploadSub') }}</div>
              <button class="btn btn-ghost" style="margin-top:12px;font-size:12px;" type="button">{{ t('addStudent.browse') }}</button>
            </div>
          </div>
        </div>

        <div class="form-actions" style="margin-top:16px;padding-top:0;border:none;">
          <button class="btn btn-ghost" type="button" @click="emit('navigate', 'students')">{{ t('addStudent.cancel') }}</button>
          <button class="btn btn-primary" type="button">💾 {{ t('addStudent.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>