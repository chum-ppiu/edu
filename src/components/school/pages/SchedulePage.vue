<template>
  <div class="page active">
    <div class="page-header">
      <div>
        <div class="page-title">Class Schedule</div>
        <div class="page-sub">Weekly timetable</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <select class="filter-input"><option>Grade 12A</option><option>Grade 12B</option><option>Grade 11A</option></select>
        <button class="btn btn-ghost" type="button">🖨 Print</button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="schedule-grid">
          <div class="sch-header">Time</div><div class="sch-header">Monday</div><div class="sch-header">Tuesday</div><div class="sch-header">Wednesday</div><div class="sch-header">Thursday</div><div class="sch-header">Friday</div>
          <div class="sch-time">7:00</div><div class="sch-cell" style="background:rgba(79,142,247,.12)"><div class="sch-subject" style="color:var(--accent)">Math</div><div class="sch-teacher">Mr. Dara</div></div><div class="sch-cell" style="background:rgba(0,212,170,.12)"><div class="sch-subject" style="color:var(--accent3)">Science</div><div class="sch-teacher">Mr. Kosal</div></div><div class="sch-cell" style="background:rgba(124,92,252,.12)"><div class="sch-subject" style="color:var(--accent2)">English</div><div class="sch-teacher">Ms. Srey</div></div><div class="sch-cell" style="background:rgba(79,142,247,.12)"><div class="sch-subject" style="color:var(--accent)">Math</div><div class="sch-teacher">Mr. Dara</div></div><div class="sch-cell" style="background:rgba(247,147,79,.12)"><div class="sch-subject" style="color:var(--accent4)">History</div><div class="sch-teacher">Ms. Lida</div></div>
          <div class="sch-time">9:00</div><div class="sch-cell" style="background:rgba(0,212,170,.12)"><div class="sch-subject" style="color:var(--accent3)">Science</div><div class="sch-teacher">Mr. Kosal</div></div><div class="sch-cell" style="background:rgba(79,142,247,.12)"><div class="sch-subject" style="color:var(--accent)">Math</div><div class="sch-teacher">Mr. Dara</div></div><div class="sch-cell empty"></div><div class="sch-cell" style="background:rgba(124,92,252,.12)"><div class="sch-subject" style="color:var(--accent2)">English</div><div class="sch-teacher">Ms. Srey</div></div><div class="sch-cell" style="background:rgba(0,212,170,.12)"><div class="sch-subject" style="color:var(--accent3)">Science</div><div class="sch-teacher">Mr. Kosal</div></div>
          <div class="sch-time">11:00</div><div class="sch-cell" style="background:rgba(247,147,79,.12)"><div class="sch-subject" style="color:var(--accent4)">History</div><div class="sch-teacher">Ms. Lida</div></div><div class="sch-cell empty"></div><div class="sch-cell" style="background:rgba(79,142,247,.12)"><div class="sch-subject" style="color:var(--accent)">Math</div><div class="sch-teacher">Mr. Dara</div></div><div class="sch-cell empty"></div><div class="sch-cell" style="background:rgba(124,92,252,.12)"><div class="sch-subject" style="color:var(--accent2)">English</div><div class="sch-teacher">Ms. Srey</div></div>
          <div class="sch-time">13:00</div><div class="sch-cell" style="background:rgba(124,92,252,.12)"><div class="sch-subject" style="color:var(--accent2)">English</div><div class="sch-teacher">Ms. Srey</div></div><div class="sch-cell" style="background:rgba(247,147,79,.12)"><div class="sch-subject" style="color:var(--accent4)">History</div><div class="sch-teacher">Ms. Lida</div></div><div class="sch-cell" style="background:rgba(0,212,170,.12)"><div class="sch-subject" style="color:var(--accent3)">Science</div><div class="sch-teacher">Mr. Kosal</div></div><div class="sch-cell" style="background:rgba(247,147,79,.12)"><div class="sch-subject" style="color:var(--accent4)">History</div><div class="sch-teacher">Ms. Lida</div></div><div class="sch-cell empty"></div>
        </div>
      </div>
    </div>
  </div>
</template>