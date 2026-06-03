<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('attendance.title') }}</div>
        <div class="page-sub">{{ t('attendance.subtitle') }}</div>
      </div>
      <button class="btn btn-primary" type="button">✅ {{ t('attendance.markAttendance') }}</button>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">{{ t('attendance.today') }}</span><span style="font-size:12px;color:var(--text3)">Mon, Jan 15 - Grade 12A</span></div>
        <div class="card-body" style="padding:0">
          <table>
            <thead><tr><th>Student</th><th>Status</th><th>Time</th><th>Note</th></tr></thead>
            <tbody>
              <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#4f8ef7,#7c5cfc)">SK</div>Sokha Kim</div></td><td><span class="badge badge-green">Present</span></td><td style="font-size:12px;color:var(--text3)">07:45 AM</td><td>—</td></tr>
              <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#00d4aa,#4f8ef7)">PV</div>Phally Vann</div></td><td><span class="badge badge-yellow">Late</span></td><td style="font-size:12px;color:var(--warning)">08:12 AM</td><td style="font-size:12px;color:var(--text3)">Traffic</td></tr>
              <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#f7934f,#f75f5f)">RC</div>Ratha Chan</div></td><td><span class="badge badge-red">Absent</span></td><td style="font-size:12px;color:var(--text3)">—</td><td style="font-size:12px;color:var(--text3)">Sick</td></tr>
              <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#7c5cfc,#f75f5f)">BS</div>Borey Sok</div></td><td><span class="badge badge-green">Present</span></td><td style="font-size:12px;color:var(--text3)">07:50 AM</td><td>—</td></tr>
              <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#f7c948,#f7934f)">LN</div>Lida Noun</div></td><td><span class="badge badge-blue">Excused</span></td><td style="font-size:12px;color:var(--text3)">—</td><td style="font-size:12px;color:var(--text3)">Event</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">{{ t('attendance.calendar') }} - Sokha Kim</span></div>
        <div class="card-body">
          <div style="display:flex;gap:6px;margin-bottom:12px;font-size:11px;color:var(--text3);flex-wrap:wrap;">
            <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:rgba(0,212,170,.2);display:inline-block;"></span>Present</span>
            <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:rgba(247,95,95,.2);display:inline-block;"></span>Absent</span>
            <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:rgba(247,201,72,.2);display:inline-block;"></span>Late</span>
          </div>
          <div class="attendance-grid">
            <div class="att-day att-empty" style="font-weight:700;background:none;color:var(--text3);">M</div><div class="att-day att-empty" style="font-weight:700;background:none;color:var(--text3);">T</div><div class="att-day att-empty" style="font-weight:700;background:none;color:var(--text3);">W</div><div class="att-day att-empty" style="font-weight:700;background:none;color:var(--text3);">T</div><div class="att-day att-empty" style="font-weight:700;background:none;color:var(--text3);">F</div><div class="att-day att-empty" style="font-weight:700;background:none;color:var(--text3);">S</div><div class="att-day att-empty" style="font-weight:700;background:none;color:var(--text3);">S</div>
            <div class="att-day att-present">1</div><div class="att-day att-present">2</div><div class="att-day att-present">3</div><div class="att-day att-late">4</div><div class="att-day att-present">5</div><div class="att-day att-empty">6</div><div class="att-day att-empty">7</div>
            <div class="att-day att-present">8</div><div class="att-day att-present">9</div><div class="att-day att-absent">10</div><div class="att-day att-present">11</div><div class="att-day att-present">12</div><div class="att-day att-empty">13</div><div class="att-day att-empty">14</div>
            <div class="att-day att-present">15</div><div class="att-day att-present">16</div><div class="att-day att-present">17</div><div class="att-day att-present">18</div><div class="att-day att-late">19</div><div class="att-day att-empty">20</div><div class="att-day att-empty">21</div>
          </div>
          <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;">
            <div class="quick-stat"><div class="quick-stat-val" style="color:var(--accent3)">18</div><div class="quick-stat-lbl">{{ t('attendance.present') }}</div></div>
            <div class="quick-stat"><div class="quick-stat-val" style="color:var(--red)">1</div><div class="quick-stat-lbl">{{ t('attendance.absent') }}</div></div>
            <div class="quick-stat"><div class="quick-stat-val" style="color:var(--warning)">2</div><div class="quick-stat-lbl">{{ t('attendance.late') }}</div></div>
            <div class="quick-stat"><div class="quick-stat-val" style="color:var(--accent3)">90%</div><div class="quick-stat-lbl">{{ t('attendance.rate') }}</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>