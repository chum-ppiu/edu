<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Subjects</div>
        <div class="page-sub">Manage school subjects and curriculum</div>
      </div>
      <button class="btn btn-primary" type="button">+ Add Subject</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Subject</th><th>Code</th><th>Department</th><th>Credit Hours</th><th>Teachers</th><th>Classes</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td class="td-main">Mathematics</td><td style="font-family:monospace;color:var(--text3)">MATH101</td><td><span class="badge badge-blue">Science</span></td><td>4</td><td>2</td><td>4</td><td><div class="actions"><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td></tr>
            <tr><td class="td-main">English Language</td><td style="font-family:monospace;color:var(--text3)">ENG101</td><td><span class="badge badge-purple">Arts</span></td><td>3</td><td>2</td><td>4</td><td><div class="actions"><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td></tr>
            <tr><td class="td-main">General Science</td><td style="font-family:monospace;color:var(--text3)">SCI101</td><td><span class="badge badge-blue">Science</span></td><td>4</td><td>1</td><td>3</td><td><div class="actions"><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td></tr>
            <tr><td class="td-main">History</td><td style="font-family:monospace;color:var(--text3)">HIS101</td><td><span class="badge badge-purple">Arts</span></td><td>3</td><td>1</td><td>4</td><td><div class="actions"><div class="action-btn">✏️</div><div class="action-btn danger">🗑</div></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>