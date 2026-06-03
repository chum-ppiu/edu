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
      <div class="card-header">
        <span class="card-title">Recent Payments</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <input class="filter-input" placeholder="Search student..." style="font-size:12px;padding:5px 10px;" />
          <select class="filter-input" style="font-size:12px;padding:5px 10px;"><option>All Status</option><option>Paid</option><option>Pending</option><option>Overdue</option></select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Fee Type</th><th>Amount</th><th>Paid</th><th>Method</th><th>Date</th><th>Status</th><th>Receipt</th></tr></thead>
          <tbody>
            <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#4f8ef7,#7c5cfc)">SK</div><span class="td-main">Sokha Kim</span></div></td><td>Tuition Fee</td><td>$450</td><td style="color:var(--accent3);font-weight:700;">$450</td><td><span class="badge badge-blue">Bank</span></td><td style="font-size:12px;color:var(--text3)">Jan 12, 2024</td><td><span class="badge badge-green">Paid</span></td><td><div class="action-btn">🧾</div></td></tr>
            <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#f7934f,#f75f5f)">RC</div><span class="td-main">Ratha Chan</span></div></td><td>Tuition Fee</td><td>$450</td><td style="color:var(--warning);font-weight:700;">$225</td><td><span class="badge badge-gray">Cash</span></td><td style="font-size:12px;color:var(--text3)">Jan 10, 2024</td><td><span class="badge badge-yellow">Partial</span></td><td><div class="action-btn">🧾</div></td></tr>
            <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#7c5cfc,#f75f5f)">BS</div><span class="td-main">Borey Sok</span></div></td><td>Library Fee</td><td>$30</td><td style="color:var(--red);font-weight:700;">$0</td><td>—</td><td style="font-size:12px;color:var(--text3)">Due Jan 15</td><td><span class="badge badge-red">Overdue</span></td><td><div class="action-btn">🧾</div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>