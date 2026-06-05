<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">{{ t('reports.title') }}</div>
        <div class="page-sub">{{ t('reports.subtitle') }}</div>
      </div>
      <button class="btn btn-ghost" type="button">📥 {{ t('reports.exportPdf') }}</button>
    </div>

    <div class="grid-3">
      <div class="card"><div class="card-body" style="text-align:center;padding:28px;"><div style="font-size:36px;margin-bottom:10px;">📊</div><div style="font-size:15px;font-weight:700;margin-bottom:6px;">{{ t('reports.gradeReport') }}</div><div style="font-size:12px;color:var(--text3);">{{ t('reports.subtitle') }}</div><button class="btn btn-primary" style="margin-top:14px;font-size:12px;" type="button">{{ t('reports.generate') }}</button></div></div>
      <div class="card"><div class="card-body" style="text-align:center;padding:28px;"><div style="font-size:36px;margin-bottom:10px;">📅</div><div style="font-size:15px;font-weight:700;margin-bottom:6px;">{{ t('reports.attendanceReport') }}</div><div style="font-size:12px;color:var(--text3);">{{ t('reports.subtitle') }}</div><button class="btn btn-primary" style="margin-top:14px;font-size:12px;" type="button">{{ t('reports.generate') }}</button></div></div>
      <div class="card"><div class="card-body" style="text-align:center;padding:28px;"><div style="font-size:36px;margin-bottom:10px;">💰</div><div style="font-size:15px;font-weight:700;margin-bottom:6px;">{{ t('reports.financeReport') }}</div><div style="font-size:12px;color:var(--text3);">{{ t('reports.subtitle') }}</div><button class="btn btn-primary" style="margin-top:14px;font-size:12px;" type="button">{{ t('reports.generate') }}</button></div></div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">{{ t('reports.performanceByClass') }}</span></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 12A</span><span style="font-weight:600;color:var(--accent3)">{{ t('reports.avgGpa') }}: 3.8</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:95%;background:linear-gradient(90deg,var(--accent3),var(--accent))"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 12B</span><span style="font-weight:600;color:var(--accent)">{{ t('reports.avgGpa') }}: 3.5</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:87%;background:linear-gradient(90deg,var(--accent),var(--accent2))"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 11A</span><span style="font-weight:600;color:var(--warning)">{{ t('reports.avgGpa') }}: 3.2</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:80%;background:linear-gradient(90deg,var(--warning),var(--accent4))"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 10A</span><span style="font-weight:600;color:var(--accent4)">{{ t('reports.avgGpa') }}: 3.0</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:75%;background:linear-gradient(90deg,var(--accent4),var(--red))"></div></div></div>
        </div>
      </div>
    </div>
  </div>
</template>