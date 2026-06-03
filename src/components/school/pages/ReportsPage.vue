<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Reports & Analytics</div>
        <div class="page-sub">School performance overview</div>
      </div>
      <button class="btn btn-ghost" type="button">📥 Export PDF</button>
    </div>

    <div class="grid-3">
      <div class="card"><div class="card-body" style="text-align:center;padding:28px;"><div style="font-size:36px;margin-bottom:10px;">📊</div><div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:6px;">Grade Report</div><div style="font-size:12px;color:var(--text3);">Average grades by class and subject</div><button class="btn btn-primary" style="margin-top:14px;font-size:12px;" type="button">Generate</button></div></div>
      <div class="card"><div class="card-body" style="text-align:center;padding:28px;"><div style="font-size:36px;margin-bottom:10px;">📅</div><div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:6px;">Attendance Report</div><div style="font-size:12px;color:var(--text3);">Daily and monthly attendance analytics</div><button class="btn btn-primary" style="margin-top:14px;font-size:12px;" type="button">Generate</button></div></div>
      <div class="card"><div class="card-body" style="text-align:center;padding:28px;"><div style="font-size:36px;margin-bottom:10px;">💰</div><div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:6px;">Finance Report</div><div style="font-size:12px;color:var(--text3);">Fee collection and outstanding balances</div><button class="btn btn-primary" style="margin-top:14px;font-size:12px;" type="button">Generate</button></div></div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Performance by Class</span></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 12A</span><span style="font-weight:600;color:var(--accent3)">Avg GPA: 3.8</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:95%;background:linear-gradient(90deg,var(--accent3),var(--accent))"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 12B</span><span style="font-weight:600;color:var(--accent)">Avg GPA: 3.5</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:87%;background:linear-gradient(90deg,var(--accent),var(--accent2))"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 11A</span><span style="font-weight:600;color:var(--warning)">Avg GPA: 3.2</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:80%;background:linear-gradient(90deg,var(--warning),var(--accent4))"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span>Grade 10A</span><span style="font-weight:600;color:var(--accent4)">Avg GPA: 3.0</span></div><div class="progress" style="height:10px;"><div class="progress-fill" style="width:75%;background:linear-gradient(90deg,var(--accent4),var(--red))"></div></div></div>
        </div>
      </div>
    </div>
  </div>
</template>