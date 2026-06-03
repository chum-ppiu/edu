<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Classes</div>
        <div class="page-sub">Manage all classes and enrollments</div>
      </div>
      <button class="btn btn-primary" type="button">+ Create Class</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Class</th><th>Teacher</th><th>Students</th><th>Capacity</th><th>Subjects</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td class="td-main">Grade 12A</td><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#4f8ef7,#7c5cfc)">DR</div>Mr. Dara</div></td><td>32 / 35</td><td><div class="progress" style="width:120px"><div class="progress-fill" style="width:91%;background:var(--warning)"></div></div></td><td><span class="badge badge-blue">6 subjects</span></td><td><span class="badge badge-green">Active</span></td><td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div></div></td></tr>
            <tr><td class="td-main">Grade 12B</td><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#00d4aa,#4f8ef7)">SP</div>Ms. Sreypich</div></td><td>28 / 35</td><td><div class="progress" style="width:120px"><div class="progress-fill" style="width:80%;background:var(--accent)"></div></div></td><td><span class="badge badge-blue">6 subjects</span></td><td><span class="badge badge-green">Active</span></td><td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div></div></td></tr>
            <tr><td class="td-main">Grade 11A</td><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#f7934f,#f75f5f)">KM</div>Mr. Kosal</div></td><td>30 / 35</td><td><div class="progress" style="width:120px"><div class="progress-fill" style="width:86%;background:var(--accent)"></div></div></td><td><span class="badge badge-blue">5 subjects</span></td><td><span class="badge badge-green">Active</span></td><td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div></div></td></tr>
            <tr><td class="td-main">Grade 10A</td><td><div class="cell-user"><div class="avatar avatar-sm" style="background:linear-gradient(135deg,#7c5cfc,#f75f5f)">LR</div>Ms. Lida</div></td><td>25 / 35</td><td><div class="progress" style="width:120px"><div class="progress-fill" style="width:71%;background:var(--accent3)"></div></div></td><td><span class="badge badge-blue">5 subjects</span></td><td><span class="badge badge-green">Active</span></td><td><div class="actions"><div class="action-btn">👁</div><div class="action-btn">✏️</div></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>