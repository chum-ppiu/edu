<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Announcements</div>
        <div class="page-sub">School-wide communications</div>
      </div>
      <button class="btn btn-primary" type="button">+ New Announcement</button>
    </div>

    <div class="grid-2" style="align-items:start">
      <div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">All Announcements</span>
            <div class="tabs" style="margin:0">
              <div class="tab active" style="padding:4px 10px;font-size:12px;">All</div>
              <div class="tab" style="padding:4px 10px;font-size:12px;">Students</div>
              <div class="tab" style="padding:4px 10px;font-size:12px;">Teachers</div>
            </div>
          </div>
          <div class="card-body">
            <div class="ann-item">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:12px;flex-wrap:wrap;">
                <div class="ann-title">📚 Final Exam Schedule - Semester 1</div>
                <span class="badge badge-green">Active</span>
              </div>
              <div class="ann-meta"><span>👤 Admin</span><span>📅 Jan 15, 2024</span><span>🎯 All Students</span></div>
              <div class="ann-body">Final examinations for Semester 1 will begin on February 5th. Please check your individual schedules and prepare accordingly.</div>
            </div>
            <div class="ann-item">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:12px;flex-wrap:wrap;">
                <div class="ann-title">🎉 School Sports Day 2024</div>
                <span class="badge badge-blue">Upcoming</span>
              </div>
              <div class="ann-meta"><span>👤 Admin</span><span>📅 Jan 12, 2024</span><span>🎯 Everyone</span></div>
              <div class="ann-body">Annual sports day will be held on January 28th. All students are required to participate. Teams will be announced next week.</div>
            </div>
            <div class="ann-item">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:12px;flex-wrap:wrap;">
                <div class="ann-title">💰 Fee Payment Reminder</div>
                <span class="badge badge-yellow">Urgent</span>
              </div>
              <div class="ann-meta"><span>👤 Finance</span><span>📅 Jan 10, 2024</span><span>🎯 Parents</span></div>
              <div class="ann-body">Reminder: Semester 1 tuition fees are due by January 15th. Please ensure timely payment to avoid late charges.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Create Announcement</span></div>
        <div class="card-body">
          <div class="form-group" style="margin-bottom:14px;"><label class="form-label">Title *</label><input class="form-input" placeholder="Announcement title..." /></div>
          <div class="form-group" style="margin-bottom:14px;"><label class="form-label">Target Audience</label><select class="form-input"><option>Everyone</option><option>All Students</option><option>All Teachers</option><option>All Parents</option><option>Specific Class</option></select></div>
          <div class="form-group" style="margin-bottom:14px;"><label class="form-label">Message *</label><textarea class="form-input" rows="5" placeholder="Write your announcement here..."></textarea></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <div class="form-group" style="flex:1;margin:0"><label class="form-label">Publish Date</label><input class="form-input" type="datetime-local" /></div>
            <div class="form-group" style="flex:1;margin:0"><label class="form-label">Expires</label><input class="form-input" type="datetime-local" /></div>
          </div>
          <div class="form-actions"><button class="btn btn-ghost" type="button">Save Draft</button><button class="btn btn-primary" type="button">📢 Publish</button></div>
        </div>
      </div>
    </div>
  </div>
</template>