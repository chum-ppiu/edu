<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import ControlTabs from '../ui/ControlTabs.vue'

const { t } = useI18n()

const tabs = [
  {
    value: 'school-info',
    label: computed(() => t('settings.schoolInfo')),
    icon: '🏫',
    description: computed(() => 'Brand and contact details'),
  },
  {
    value: 'academic-year',
    label: 'Academic Year',
    icon: '📅',
    description: 'Terms and calendar',
  },
  {
    value: 'fee-structure',
    label: 'Fee Structure',
    icon: '💰',
    description: 'Tuition and billing rules',
  },
  {
    value: 'roles',
    label: 'Roles',
    icon: '👤',
    description: 'Permissions and access',
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    description: 'Alerts and delivery channels',
  },
]

const activeTab = ref('school-info')

const panelTitle = computed(() => {
  const titles = {
    'school-info': t('settings.schoolInfo'),
    'academic-year': t('settings.academicYear'),
    'fee-structure': t('settings.feeStructure'),
    roles: t('settings.roles'),
    notifications: t('settings.notifications'),
  }

  return titles[activeTab.value]
})
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('settings.title') }}</div>
        <div class="page-sub">{{ t('settings.subtitle') }}</div>
      </div>
      <button class="btn btn-primary" type="button">💾 {{ t('settings.saveChanges') }}</button>
    </div>

    <ControlTabs v-model="activeTab" :items="tabs" />

    <div class="card" style="margin-top:18px;">
      <div class="card-header">
        <span class="card-title">{{ panelTitle }}</span>
        <span style="font-size:12px;color:var(--text3);">{{ t('settings.coreConfiguration') }}</span>
      </div>
      <div class="card-body">
        <template v-if="activeTab === 'school-info'">
          <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border);flex-wrap:wrap;">
            <div style="width:80px;height:80px;border-radius:20px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 18px 34px rgba(109,147,255,.18);">🎓</div>
            <div>
              <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;">EduCore School</div>
              <div style="font-size:12px;color:var(--text3);margin-top:4px;">Phnom Penh, Cambodia</div>
              <button class="btn btn-ghost" style="margin-top:8px;font-size:12px;" type="button">{{ t('settings.changeLogo') }}</button>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">School Name</label><input class="form-input" value="EduCore School" /></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="admin@educore.edu.kh" type="email" /></div>
            <div class="form-group"><label class="form-label">Phone</label><input class="form-input" value="+855 23 456 789" /></div>
            <div class="form-group"><label class="form-label">Website</label><input class="form-input" value="www.educore.edu.kh" /></div>
            <div class="form-group full"><label class="form-label">Address</label><textarea class="form-input" rows="2">Street 271, Phnom Penh, Cambodia</textarea></div>
          </div>
        </template>

        <template v-else-if="activeTab === 'academic-year'">
          <div class="grid-2" style="margin-bottom:0;align-items:start;">
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin-bottom:8px;">Current Academic Year</div>
                <div style="color:var(--text3);font-size:13px;margin-bottom:14px;">Manage term dates and holiday windows.</div>
                <div class="form-grid">
                  <div class="form-group"><label class="form-label">Year</label><input class="form-input" value="2024-2025" /></div>
                  <div class="form-group"><label class="form-label">Status</label><input class="form-input" value="Active" /></div>
                  <div class="form-group"><label class="form-label">Start Date</label><input class="form-input" type="date" /></div>
                  <div class="form-group"><label class="form-label">End Date</label><input class="form-input" type="date" /></div>
                </div>
              </div>
            </div>
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin-bottom:8px;">Term Structure</div>
                <div class="ann-item" style="padding-top:0;">
                  <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
                    <div>
                      <div class="td-main">Semester 1</div>
                      <div class="fee-due">Aug - Dec</div>
                    </div>
                    <span class="badge badge-green">Open</span>
                  </div>
                </div>
                <div class="ann-item">
                  <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
                    <div>
                      <div class="td-main">Semester 2</div>
                      <div class="fee-due">Jan - May</div>
                    </div>
                    <span class="badge badge-gray">Planned</span>
                  </div>
                </div>
                <div class="ann-item">
                  <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
                    <div>
                      <div class="td-main">Holiday Break</div>
                      <div class="fee-due">June - July</div>
                    </div>
                    <span class="badge badge-blue">Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="activeTab === 'fee-structure'">
          <div class="grid-2" style="align-items:start;">
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin-bottom:8px;">Fee Categories</div>
                <div class="fee-item" style="padding-top:0;">
                  <div><div class="fee-name">Tuition Fee</div><div class="fee-due">Primary school billing item</div></div>
                  <div class="fee-amount" style="color:var(--accent3)">$450</div>
                </div>
                <div class="fee-item">
                  <div><div class="fee-name">Library Fee</div><div class="fee-due">Books and learning resources</div></div>
                  <div class="fee-amount" style="color:var(--accent)">$30</div>
                </div>
                <div class="fee-item">
                  <div><div class="fee-name">Sports Fee</div><div class="fee-due">Athletics and events</div></div>
                  <div class="fee-amount" style="color:var(--warning)">$25</div>
                </div>
              </div>
            </div>
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin-bottom:8px;">Payment Rules</div>
                <div style="display:flex;flex-direction:column;gap:12px;">
                  <div class="quick-stat" style="text-align:left;padding:14px;">
                    <div class="quick-stat-lbl" style="font-size:11px;text-transform:uppercase;letter-spacing:1px;">Late Fee</div>
                    <div class="quick-stat-val" style="margin-top:4px;">$5 / day</div>
                  </div>
                  <div class="quick-stat" style="text-align:left;padding:14px;">
                    <div class="quick-stat-lbl" style="font-size:11px;text-transform:uppercase;letter-spacing:1px;">Installments</div>
                    <div class="quick-stat-val" style="margin-top:4px;">3 payments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="activeTab === 'roles'">
          <div class="grid-3" style="margin-bottom:0;">
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div class="td-main" style="margin-bottom:8px;">Administrator</div>
                <div style="color:var(--text3);font-size:13px;">Full access to school operations.</div>
              </div>
            </div>
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div class="td-main" style="margin-bottom:8px;">Teacher</div>
                <div style="color:var(--text3);font-size:13px;">Class, attendance, and grade tools.</div>
              </div>
            </div>
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div class="td-main" style="margin-bottom:8px;">Parent</div>
                <div style="color:var(--text3);font-size:13px;">Read-only access to child progress.</div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="grid-2" style="margin-bottom:0;align-items:start;">
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div class="td-main" style="margin-bottom:8px;">Email Alerts</div>
                <div style="color:var(--text3);font-size:13px;margin-bottom:14px;">Send updates for fees, attendance, and announcements.</div>
                <div class="progress"><div class="progress-fill" style="width:84%;background:linear-gradient(90deg,var(--accent3),var(--accent))"></div></div>
              </div>
            </div>
            <div class="card" style="border-radius:20px;">
              <div class="card-body">
                <div class="td-main" style="margin-bottom:8px;">Push Notifications</div>
                <div style="color:var(--text3);font-size:13px;margin-bottom:14px;">Enable urgent alerts for staff and parents.</div>
                <div class="progress"><div class="progress-fill" style="width:68%;background:linear-gradient(90deg,var(--accent),var(--accent2))"></div></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>