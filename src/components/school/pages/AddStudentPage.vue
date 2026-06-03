<script setup>
defineEmits(['navigate'])
</script>

<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Add New Student</div>
        <div class="page-sub">Fill in the student information below</div>
      </div>
      <button class="btn btn-ghost" type="button" @click="$emit('navigate', 'students')">← Back</button>
    </div>

    <div class="grid-2" style="align-items:start">
      <div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><span class="card-title">Personal Information</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label class="form-label">First Name *</label><input class="filter-input" placeholder="Sokha" /></div>
              <div class="form-group"><label class="form-label">Last Name *</label><input class="filter-input" placeholder="Kim" /></div>
              <div class="form-group"><label class="form-label">Date of Birth</label><input class="filter-input" type="date" /></div>
              <div class="form-group"><label class="form-label">Gender</label><select class="filter-input"><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div class="form-group full"><label class="form-label">Email *</label><input class="filter-input" placeholder="sokha@school.edu" type="email" /></div>
              <div class="form-group"><label class="form-label">Phone</label><input class="filter-input" placeholder="+855 12 345 678" /></div>
              <div class="form-group"><label class="form-label">Student Code</label><input class="filter-input" placeholder="Auto-generated" disabled style="opacity:.5" /></div>
              <div class="form-group full"><label class="form-label">Address</label><textarea class="filter-input" rows="2" placeholder="Phnom Penh, Cambodia"></textarea></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Parent/Guardian</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Parent Name</label><input class="filter-input" placeholder="Kim Sokha" /></div>
              <div class="form-group"><label class="form-label">Relationship</label><select class="filter-input"><option>Father</option><option>Mother</option><option>Guardian</option></select></div>
              <div class="form-group"><label class="form-label">Phone</label><input class="filter-input" placeholder="+855 12 000 000" /></div>
              <div class="form-group"><label class="form-label">Email</label><input class="filter-input" placeholder="parent@email.com" /></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card" style="margin-bottom:20px;">
          <div class="card-header"><span class="card-title">Academic Information</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Class *</label><select class="filter-input"><option>Grade 10A</option><option>Grade 10B</option><option>Grade 11A</option><option>Grade 12A</option></select></div>
              <div class="form-group"><label class="form-label">Department</label><select class="filter-input"><option>Science</option><option>Arts</option><option>Commerce</option></select></div>
              <div class="form-group"><label class="form-label">Academic Year</label><select class="filter-input"><option>2024-2025</option><option>2023-2024</option></select></div>
              <div class="form-group"><label class="form-label">Enrollment Date</label><input class="filter-input" type="date" /></div>
              <div class="form-group"><label class="form-label">Status</label><select class="filter-input"><option>Active</option><option>Inactive</option></select></div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Upload Documents</span></div>
          <div class="card-body">
            <div style="border:2px dashed var(--border);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:border-color .2s;" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
              <div style="font-size:28px;margin-bottom:8px;">📎</div>
              <div style="font-size:13px;font-weight:600;">Drag and drop files here</div>
              <div style="font-size:11px;color:var(--text3);margin-top:4px;">Profile photo, ID card, certificates</div>
              <button class="btn btn-ghost" style="margin-top:12px;font-size:12px;" type="button">Browse Files</button>
            </div>
          </div>
        </div>

        <div class="form-actions" style="margin-top:16px;padding-top:0;border:none;">
          <button class="btn btn-ghost" type="button" @click="$emit('navigate', 'students')">Cancel</button>
          <button class="btn btn-primary" type="button">💾 Save Student</button>
        </div>
      </div>
    </div>
  </div>
</template>