<script setup>
defineEmits(['navigate'])
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Students</div>
        <div class="page-sub">Manage all enrolled students</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-ghost" type="button">📥 Import</button>
        <button class="btn btn-ghost" type="button">📤 Export</button>
        <button class="btn btn-primary" type="button" @click="$emit('navigate', 'add-student')">+ Add Student</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="filter-bar" style="margin:0;flex:1;">
          <input class="filter-input" placeholder="🔍 Search student..." style="flex:1;max-width:280px;" />
          <select class="filter-input"><option>All Classes</option><option>Grade 10A</option><option>Grade 10B</option><option>Grade 11A</option><option>Grade 12A</option></select>
          <select class="filter-input"><option>All Status</option><option>Active</option><option>Inactive</option><option>Graduated</option></select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th><input type="checkbox" style="accent-color:var(--accent)" /></th><th>Student</th><th>Code</th><th>Class</th><th>Phone</th><th>GPA</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr>
              <td><input type="checkbox" style="accent-color:var(--accent)" /></td>
              <td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#4f8ef7,#7c5cfc)">SK</div><div><div class="td-main">Sokha Kim</div><div style="font-size:11px;color:var(--text3)">sokha@school.edu</div></div></div></td>
              <td style="font-family:monospace;color:var(--text3)">STU-001</td>
              <td>Grade 12A</td>
              <td>+855 12 345 678</td>
              <td><span style="color:var(--accent3);font-weight:700;">4.0</span></td>
              <td><span class="badge badge-green">Active</span></td>
              <td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td>
            </tr>
            <tr>
              <td><input type="checkbox" style="accent-color:var(--accent)" /></td>
              <td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#00d4aa,#4f8ef7)">PV</div><div><div class="td-main">Phally Vann</div><div style="font-size:11px;color:var(--text3)">phally@school.edu</div></div></div></td>
              <td style="font-family:monospace;color:var(--text3)">STU-002</td>
              <td>Grade 12A</td>
              <td>+855 17 234 567</td>
              <td><span style="color:var(--accent3);font-weight:700;">3.9</span></td>
              <td><span class="badge badge-green">Active</span></td>
              <td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td>
            </tr>
            <tr>
              <td><input type="checkbox" style="accent-color:var(--accent)" /></td>
              <td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#f7934f,#f75f5f)">RC</div><div><div class="td-main">Ratha Chan</div><div style="font-size:11px;color:var(--text3)">ratha@school.edu</div></div></div></td>
              <td style="font-family:monospace;color:var(--text3)">STU-003</td>
              <td>Grade 11B</td>
              <td>+855 96 345 678</td>
              <td><span style="color:var(--warning);font-weight:700;">3.8</span></td>
              <td><span class="badge badge-green">Active</span></td>
              <td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td>
            </tr>
            <tr>
              <td><input type="checkbox" style="accent-color:var(--accent)" /></td>
              <td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#7c5cfc,#f75f5f)">BS</div><div><div class="td-main">Borey Sok</div><div style="font-size:11px;color:var(--text3)">borey@school.edu</div></div></div></td>
              <td style="font-family:monospace;color:var(--text3)">STU-004</td>
              <td>Grade 12B</td>
              <td>+855 77 456 789</td>
              <td><span style="color:var(--warning);font-weight:700;">3.7</span></td>
              <td><span class="badge badge-yellow">Inactive</span></td>
              <td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td>
            </tr>
            <tr>
              <td><input type="checkbox" style="accent-color:var(--accent)" /></td>
              <td><div class="cell-user"><div class="avatar" style="background:linear-gradient(135deg,#f7c948,#f7934f)">LN</div><div><div class="td-main">Lida Noun</div><div style="font-size:11px;color:var(--text3)">lida@school.edu</div></div></div></td>
              <td style="font-family:monospace;color:var(--text3)">STU-005</td>
              <td>Grade 10A</td>
              <td>+855 89 567 890</td>
              <td><span style="color:var(--text2);font-weight:700;">3.5</span></td>
              <td><span class="badge badge-green">Active</span></td>
              <td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="padding:14px 16px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:12px;color:var(--text3)">Showing 1-5 of 248 students</span>
        <div style="display:flex;gap:4px;">
          <div class="action-btn">‹</div>
          <div class="action-btn" style="background:var(--accent);color:white;border-color:var(--accent);">1</div>
          <div class="action-btn">2</div>
          <div class="action-btn">3</div>
          <div class="action-btn">›</div>
        </div>
      </div>
    </div>
  </div>
</template>