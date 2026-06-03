<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Settings</div>
        <div class="page-sub">Configure school system</div>
      </div>
      <button class="btn btn-primary" type="button">💾 Save Changes</button>
    </div>

    <div class="tabs">
      <div class="tab active">🏫 School Info</div>
      <div class="tab">📅 Academic Year</div>
      <div class="tab">💰 Fee Structure</div>
      <div class="tab">👤 Roles</div>
      <div class="tab">🔔 Notifications</div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">School Information</span></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border);flex-wrap:wrap;">
          <div style="width:80px;height:80px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:36px;">🎓</div>
          <div>
            <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;">EduCore School</div>
            <div style="font-size:12px;color:var(--text3);margin-top:4px;">Phnom Penh, Cambodia</div>
            <button class="btn btn-ghost" style="margin-top:8px;font-size:12px;" type="button">Change Logo</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group"><label class="form-label">School Name</label><input class="form-input" value="EduCore School" /></div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="admin@educore.edu.kh" type="email" /></div>
          <div class="form-group"><label class="form-label">Phone</label><input class="form-input" value="+855 23 456 789" /></div>
          <div class="form-group"><label class="form-label">Website</label><input class="form-input" value="www.educore.edu.kh" /></div>
          <div class="form-group full"><label class="form-label">Address</label><textarea class="form-input" rows="2">Street 271, Phnom Penh, Cambodia</textarea></div>
        </div>
      </div>
    </div>
  </div>
</template>