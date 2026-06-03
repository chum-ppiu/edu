<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Grade Management</div>
        <div class="page-sub">Enter and manage student grades</div>
      </div>
      <button class="btn btn-primary" type="button">📊 Generate Reports</button>
    </div>

    <div class="filter-bar">
      <select class="filter-input"><option>Grade 12A</option><option>Grade 12B</option><option>Grade 11A</option></select>
      <select class="filter-input"><option>Mathematics</option><option>English</option><option>Science</option></select>
      <select class="filter-input"><option>Semester 1 - 2024</option><option>Semester 2 - 2024</option></select>
      <button class="btn btn-primary" type="button">Apply</button>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Grade 12A - Mathematics - Semester 1</span>
        <button class="btn btn-ghost" style="font-size:12px;" type="button">💾 Save Grades</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Midterm (30%)</th><th>Assignment (20%)</th><th>Final (50%)</th><th>Total</th><th>Grade</th><th>GPA</th></tr></thead>
          <tbody>
            <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#4f8ef7,#7c5cfc)">SK</div><span class="td-main">Sokha Kim</span></div></td><td><input class="filter-input" value="28" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><input class="filter-input" value="19" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><input class="filter-input" value="47" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><strong style="color:var(--accent3)">94/100</strong></td><td><span class="badge badge-green">A</span></td><td><span style="color:var(--accent3);font-weight:700;">4.0</span></td></tr>
            <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#00d4aa,#4f8ef7)">PV</div><span class="td-main">Phally Vann</span></div></td><td><input class="filter-input" value="26" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><input class="filter-input" value="18" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><input class="filter-input" value="45" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><strong style="color:var(--accent3)">89/100</strong></td><td><span class="badge badge-blue">B+</span></td><td><span style="color:var(--warning);font-weight:700;">3.5</span></td></tr>
            <tr><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#f7934f,#f75f5f)">RC</div><span class="td-main">Ratha Chan</span></div></td><td><input class="filter-input" value="22" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><input class="filter-input" value="16" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><input class="filter-input" value="40" style="width:70px;padding:4px 8px;text-align:center;" /></td><td><strong style="color:var(--warning)">78/100</strong></td><td><span class="badge badge-yellow">C+</span></td><td><span style="color:var(--text2);font-weight:700;">2.5</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-top:24px;">
      <div class="page-header" style="margin-bottom:16px;">
        <div class="page-title" style="font-size:16px;">Report Card Preview</div>
      </div>
      <div class="report-card">
        <div class="report-header">
          <div style="font-size:12px;color:var(--text3);margin-bottom:4px;">SEMESTER 1 - 2024-2025</div>
          <div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;">Sokha Kim</div>
          <div style="font-size:12px;color:var(--text3)">STU-001 - Grade 12A</div>
          <div class="gpa-circle"><div class="gpa-val">4.0</div><div class="gpa-lbl">GPA</div></div>
          <span class="badge badge-green">Excellent</span>
        </div>
        <div class="card-body">
          <div class="grade-item"><div class="grade-header"><span>Mathematics</span><span class="grade-score" style="color:var(--accent3)">94 - A - 4.0</span></div><div class="progress"><div class="progress-fill" style="width:94%;background:var(--accent3)"></div></div></div>
          <div class="grade-item"><div class="grade-header"><span>English</span><span class="grade-score" style="color:var(--accent3)">91 - A - 4.0</span></div><div class="progress"><div class="progress-fill" style="width:91%;background:var(--accent3)"></div></div></div>
          <div class="grade-item"><div class="grade-header"><span>Science</span><span class="grade-score" style="color:var(--accent)">85 - B+ - 3.5</span></div><div class="progress"><div class="progress-fill" style="width:85%;background:var(--accent)"></div></div></div>
          <div class="grade-item"><div class="grade-header"><span>History</span><span class="grade-score" style="color:var(--accent)">82 - B - 3.0</span></div><div class="progress"><div class="progress-fill" style="width:82%;background:var(--accent)"></div></div></div>
        </div>
      </div>
    </div>
  </div>
</template>