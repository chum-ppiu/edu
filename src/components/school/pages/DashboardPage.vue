<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('dashboard.title') }}</div>
        <div class="page-sub">{{ t('dashboard.subtitle') }}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-ghost" type="button">📥 {{ t('dashboard.export') }}</button>
        <button class="btn btn-primary" type="button">+ {{ t('dashboard.addStudent') }}</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">👨‍🎓</div>
        <div class="stat-value">1,248</div>
        <div class="stat-label">{{ t('dashboard.totalStudents') }}</div>
        <div class="stat-change up">↑ 12% this month</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon purple">👨‍🏫</div>
        <div class="stat-value">86</div>
        <div class="stat-label">{{ t('dashboard.totalTeachers') }}</div>
        <div class="stat-change up">↑ 3 new this week</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">📅</div>
        <div class="stat-value">94.2%</div>
        <div class="stat-label">{{ t('dashboard.attendanceToday') }}</div>
        <div class="stat-change down">↓ 2.1% vs yesterday</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon orange">💰</div>
        <div class="stat-value">$48.5k</div>
        <div class="stat-label">{{ t('dashboard.feesCollected') }}</div>
        <div class="stat-change up">↑ 18% this term</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title">{{ t('dashboard.recentActivity') }}</span>
          <span style="font-size:12px;color:var(--accent);cursor:pointer;">{{ t('dashboard.viewAll') }}</span>
        </div>
        <div class="card-body">
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot" style="background:rgba(79,142,247,.15);color:var(--accent)">👨‍🎓</div>
              <div class="timeline-content">
                <div class="timeline-title">New student enrolled - <strong>Sokha Vann</strong></div>
                <div class="timeline-time">2 minutes ago · Grade 10A</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot" style="background:rgba(0,212,170,.15);color:var(--accent-3)">✅</div>
              <div class="timeline-content">
                <div class="timeline-title">Attendance marked - <strong>Grade 11B</strong></div>
                <div class="timeline-time">15 minutes ago · Mr. Dara</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot" style="background:rgba(247,201,72,.15);color:var(--warning)">💰</div>
              <div class="timeline-content">
                <div class="timeline-title">Payment received - <strong>$450.00</strong></div>
                <div class="timeline-time">1 hour ago · Phally Chan</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot" style="background:rgba(124,92,252,.15);color:var(--accent-2)">📊</div>
              <div class="timeline-content">
                <div class="timeline-title">Grades submitted - <strong>Mathematics</strong></div>
                <div class="timeline-time">2 hours ago · Grade 12A</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot" style="background:rgba(247,95,95,.15);color:var(--danger)">⚠️</div>
              <div class="timeline-content">
                <div class="timeline-title">5 students absent today</div>
                <div class="timeline-time">3 hours ago · Multiple classes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">{{ t('dashboard.attendanceOverview') }}</span>
          <span style="font-size:12px;color:var(--text3);">{{ t('dashboard.thisWeek') }}</span>
        </div>
        <div class="card-body">
          <div class="donut-wrap" style="margin-bottom:20px;">
            <svg class="donut" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--shadow-strong)" stroke-width="16" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent-3)" stroke-width="16" stroke-dasharray="226 251" stroke-dashoffset="63" stroke-linecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--danger)" stroke-width="16" stroke-dasharray="15 251" stroke-dashoffset="-163" stroke-linecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--warning)" stroke-width="16" stroke-dasharray="10 251" stroke-dashoffset="-178" stroke-linecap="round" />
              <text x="50" y="47" text-anchor="middle" fill="white" font-size="14" font-weight="800">94%</text>
              <text x="50" y="58" text-anchor="middle" fill="#8892b0" font-size="7">Present</text>
            </svg>
            <div class="donut-legend">
              <div class="legend-item"><div class="legend-dot" style="background:var(--accent-3)"></div>Present <span class="legend-val" style="color:var(--accent-3)">94%</span></div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--danger)"></div>Absent <span class="legend-val" style="color:var(--danger)">4%</span></div>
              <div class="legend-item"><div class="legend-dot" style="background:var(--warning)"></div>Late <span class="legend-val" style="color:var(--warning)">2%</span></div>
            </div>
          </div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:8px;">{{ t('dashboard.dailyTrend') }}</div>
          <div class="mini-bars">
            <div class="mini-bar" style="height:78%"></div>
            <div class="mini-bar" style="height:92%"></div>
            <div class="mini-bar" style="height:85%"></div>
            <div class="mini-bar" style="height:95%"></div>
            <div class="mini-bar" style="height:94%"></div>
            <div class="mini-bar" style="height:88%;opacity:.3"></div>
            <div class="mini-bar" style="height:70%;opacity:.3"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-top:4px;">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title">{{ t('dashboard.topPerformers') }}</span>
          <span style="font-size:12px;color:var(--accent);cursor:pointer;">{{ t('dashboard.viewAll') }}</span>
        </div>
        <div class="card-body" style="padding:0">
          <table>
            <thead><tr><th>Student</th><th>Class</th><th>GPA</th><th>Rank</th></tr></thead>
            <tbody>
              <tr><td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#4f8ef7,#7c5cfc)">SK</div><span class="td-main">Sokha Kim</span></div></td><td>Grade 12A</td><td><span style="color:var(--accent-3);font-weight:700;">4.0</span></td><td><span class="badge badge-yellow">🥇 #1</span></td></tr>
              <tr><td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#00d4aa,#4f8ef7)">PV</div><span class="td-main">Phally Vann</span></div></td><td>Grade 12A</td><td><span style="color:var(--accent-3);font-weight:700;">3.9</span></td><td><span class="badge badge-gray">🥈 #2</span></td></tr>
              <tr><td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#f7934f,#f75f5f)">RC</div><span class="td-main">Ratha Chan</span></div></td><td>Grade 11B</td><td><span style="color:var(--accent-3);font-weight:700;">3.8</span></td><td><span class="badge badge-gray">🥉 #3</span></td></tr>
              <tr><td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#7c5cfc,#f75f5f)">BS</div><span class="td-main">Borey Sok</span></div></td><td>Grade 12B</td><td><span style="color:var(--warning);font-weight:700;">3.7</span></td><td><span class="badge badge-gray">#4</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">{{ t('dashboard.feeCollection') }}</span>
          <span style="font-size:12px;color:var(--text3)">{{ t('dashboard.thisSemester') }}</span>
        </div>
        <div class="card-body">
          <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="font-size:13px">{{ t('dashboard.collected') }}</span>
              <span style="font-weight:700;color:var(--accent-3)">$48,500 / $65,000</span>
            </div>
            <div class="progress"><div class="progress-fill" style="width:74.6%;background:var(--accent3)"></div></div>
            <div style="font-size:11px;color:var(--text3);margin-top:4px;">74.6% collected</div>
          </div>
          <div class="fee-item"><div><div class="fee-name">Tuition Fee</div><div class="fee-due">248 students paid</div></div><div class="fee-amount" style="color:var(--accent-3)">$38,200</div></div>
          <div class="fee-item"><div><div class="fee-name">Library Fee</div><div class="fee-due">200 students paid</div></div><div class="fee-amount" style="color:var(--accent-3)">$6,000</div></div>
          <div class="fee-item"><div><div class="fee-name">Sports Fee</div><div class="fee-due">76 students paid</div></div><div class="fee-amount" style="color:var(--warning)">$4,300</div></div>
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;color:var(--text3)">{{ t('dashboard.outstanding') }}</span>
            <span style="font-size:16px;font-weight:800;color:var(--danger)">$16,500</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>