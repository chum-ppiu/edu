<script setup>
import { ref } from 'vue'
import DataTable from '../ui/DataTable.vue'

const payments = ref([
  { id: 1, student: 'Sokha Kim', feeType: 'Tuition Fee', amount: 450, paid: 450, method: 'Bank', date: 'Jan 12, 2024', status: 'Paid', statusClass: 'badge-green', avatar: 'SK', avatarStyle: 'background:linear-gradient(135deg,#4f8ef7,#7c5cfc)' },
  { id: 2, student: 'Ratha Chan', feeType: 'Tuition Fee', amount: 450, paid: 225, method: 'Cash', date: 'Jan 10, 2024', status: 'Partial', statusClass: 'badge-yellow', avatar: 'RC', avatarStyle: 'background:linear-gradient(135deg,#f7934f,#f75f5f)' },
  { id: 3, student: 'Borey Sok', feeType: 'Library Fee', amount: 30, paid: 0, method: '—', date: 'Due Jan 15', status: 'Overdue', statusClass: 'badge-red', avatar: 'BS', avatarStyle: 'background:linear-gradient(135deg,#7c5cfc,#f75f5f)' },
])

const columns = [
  { key: 'student', label: 'Student' },
  { key: 'feeType', label: 'Fee Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'paid', label: 'Paid' },
  { key: 'method', label: 'Method' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
]

const filters = [
  { key: 'status', label: 'Status', options: [ { label: 'Paid', value: 'Paid' }, { label: 'Pending', value: 'Pending' }, { label: 'Partial', value: 'Partial' }, { label: 'Overdue', value: 'Overdue' } ] }
]

function handleReceipt(row) {
  // placeholder: hook into modal or download flow
  console.log('open receipt for', row)
}
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Payments</div>
        <div class="page-sub">Fee collection and payment tracking</div>
      </div>
      <button class="btn btn-primary" type="button">+ Record Payment</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card green"><div class="stat-icon green">✅</div><div class="stat-value">$48.5k</div><div class="stat-label">Collected This Term</div><div class="stat-change up">↑ 18%</div></div>
      <div class="stat-card red"><div class="stat-icon orange">⏰</div><div class="stat-value">$16.5k</div><div class="stat-label">Outstanding</div><div class="stat-change down">48 students</div></div>
      <div class="stat-card blue"><div class="stat-icon blue">📋</div><div class="stat-value">248</div><div class="stat-label">Invoices Issued</div></div>
      <div class="stat-card purple"><div class="stat-icon purple">🎓</div><div class="stat-value">12</div><div class="stat-label">Scholarships</div></div>
    </div>

    <div class="card">
      <DataTable
        title="Recent Payments"
        subtitle="Fee collection and payment records"
        :rows="payments"
        :columns="columns"
        :filters="filters"
        :page-size="6"
        :search-keys="['student','feeType','method','date','status']"
        :show-actions="false"
      >
        <template #cell-student="{ row }">
          <div class="cell-user"><div class="avatar avatar-sm" :style="row.avatarStyle">{{ row.avatar }}</div><span class="td-main">{{ row.student }}</span></div>
        </template>

        <template #cell-amount="{ row }">
          ${{ row.amount }}
        </template>

        <template #cell-paid="{ row }">
          <span :style="{ color: row.paid >= row.amount ? 'var(--accent3)' : 'var(--warning)', fontWeight: 700 }">${{ row.paid }}</span>
        </template>

        <template #cell-status="{ row }">
          <span class="badge" :class="row.statusClass">{{ row.status }}</span>
        </template>

        <template #actions="{ row }">
          <button class="action-btn" type="button" @click="handleReceipt(row)">🧾</button>
        </template>
      </DataTable>
    </div>
  </div>
</template>