/* schedule-data.js
   Carolina Forest Panthers 2026-27 schedules.
   Source: MaxPreps (maxpreps.com/sc/myrtle-beach/carolina-forest-panthers/),
   snapshot pulled September 3, 2026. Static data - not a live feed.
   Sports not listed here had "No Schedule Available" on MaxPreps at snapshot time
   (boys/girls cross country, wrestling, track & field, boys soccer, softball,
   boys lacrosse, boys tennis).

   Most entries are the VARSITY teams (MaxPreps' default team page). JV and
   Freshman schedules are only included where MaxPreps had one posted:
   JV Football, Freshman Football, JV Girls Volleyball. JV boys/girls
   basketball and freshman volleyball had no schedule posted. The `level`
   field is authoritative - sport pages filter on it.

   Each game: { sport, gender, level, date (YYYY-MM-DD), time, opponent,
                home (true/false/null=neutral), result (CF perspective, '' if unplayed),
                note } */
window.CFHS_SCHEDULE = [
  // ---------- Football (Varsity Boys) ----------
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-08-22', time: '7:30 PM', opponent: 'West Florence', home: false, result: 'W 16-14', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-08-28', time: '7:30 PM', opponent: 'Conway', home: true, result: 'W 36-14', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-09-04', time: '7:30 PM', opponent: 'New Hanover (NC)', home: true, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-09-11', time: '7:30 PM', opponent: 'Myrtle Beach', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-09-18', time: '7:30 PM', opponent: 'West Ashley', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-10-02', time: '7:00 PM', opponent: 'Goose Creek', home: true, result: '', note: 'Region' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-10-09', time: '7:30 PM', opponent: 'Berkeley', home: true, result: '', note: 'Region' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-10-15', time: '7:00 PM', opponent: 'Socastee', home: false, result: '', note: 'Region' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-10-23', time: '7:00 PM', opponent: 'Wando', home: true, result: '', note: 'Region' },
  { sport: 'Football', gender: 'Boys', level: 'Varsity', date: '2026-10-30', time: '7:30 PM', opponent: 'Cane Bay', home: false, result: '', note: 'Region' },

  // ---------- Volleyball (Varsity Girls) ----------
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-08-18', time: '6:00 PM', opponent: 'Aynor', home: true, result: 'W 2-1', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-08-18', time: '8:00 PM', opponent: 'North Myrtle Beach', home: false, result: 'L 0-2', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-08-21', time: '7:15 PM', opponent: 'Ashley (NC)', home: true, result: 'W 2-0', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-08-22', time: '9:15 AM', opponent: 'Rock Hill', home: null, result: 'L 0-2', note: 'Tournament' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-08-22', time: '11:45 AM', opponent: 'Catawba Ridge', home: false, result: 'L 0-2', note: 'Tournament' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-08-22', time: '1:00 PM', opponent: 'Clover', home: null, result: 'L 1-2', note: 'Tournament' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-08-24', time: '6:00 PM', opponent: 'West Brunswick (NC)', home: false, result: 'W 3-1', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-02', time: '7:00 PM', opponent: 'Loris', home: false, result: 'W 3-0', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-10', time: '6:30 PM', opponent: 'Berkeley', home: true, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-15', time: '7:00 PM', opponent: 'Socastee', home: false, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-17', time: '6:30 PM', opponent: 'Wando', home: true, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-22', time: '6:30 PM', opponent: 'Cane Bay', home: false, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-24', time: '6:30 PM', opponent: 'Goose Creek', home: true, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-28', time: '5:00 PM', opponent: 'SCA (NC)', home: false, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-09-29', time: '6:30 PM', opponent: 'Goose Creek', home: false, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-10-01', time: '6:30 PM', opponent: 'Berkeley', home: false, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-10-06', time: '7:00 PM', opponent: 'Socastee', home: true, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-10-08', time: '6:30 PM', opponent: 'Wando', home: false, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-10-13', time: '6:30 PM', opponent: 'Cane Bay', home: true, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'Varsity', date: '2026-10-15', time: '5:30 PM', opponent: 'SCA (NC)', home: true, result: '', note: '' },

  // ---------- Girls Tennis (Varsity Girls) ----------
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-08-20', time: '5:30 PM', opponent: 'Conway', home: false, result: '', note: '' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-08-31', time: '5:30 PM', opponent: 'Conway', home: true, result: 'W 7-0', note: '' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-09-10', time: '4:30 PM', opponent: 'Berkeley', home: true, result: '', note: 'Region' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-09-17', time: '4:30 PM', opponent: 'Wando', home: true, result: '', note: 'Region' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-09-22', time: '4:30 PM', opponent: 'Cane Bay', home: false, result: '', note: 'Region' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-09-24', time: '4:30 PM', opponent: 'Goose Creek', home: true, result: '', note: 'Region' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-09-29', time: '4:30 PM', opponent: 'Goose Creek', home: false, result: '', note: 'Region' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-10-08', time: '4:30 PM', opponent: 'Wando', home: false, result: '', note: 'Region' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-10-13', time: '4:30 PM', opponent: 'Cane Bay', home: true, result: '', note: 'Region' },
  { sport: 'Tennis', gender: 'Girls', level: 'Varsity', date: '2026-10-15', time: '5:00 PM', opponent: 'Myrtle Beach', home: true, result: '', note: '' },

  // ---------- Swimming (fall) ----------
  { sport: 'Swimming', gender: 'Girls', level: 'Varsity', date: '2026-08-22', time: 'TBA', opponent: "Ripley's Invitational", home: null, result: '3rd of 7', note: 'Myrtle Beach, SC' },
  { sport: 'Swimming', gender: 'Boys', level: 'Varsity', date: '2026-08-22', time: 'TBA', opponent: "Ripley's Invitational", home: null, result: '3rd of 7', note: 'Myrtle Beach, SC' },

  // ---------- Boys Basketball (Varsity Boys) ----------
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-11-20', time: '7:30 PM', opponent: 'Christian Academy', home: true, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-11-23', time: 'TBA', opponent: 'Thanksgiving Tournament', home: true, result: '', note: 'Nov 23-25' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-12-01', time: '7:30 PM', opponent: 'Myrtle Beach', home: false, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-12-04', time: '7:30 PM', opponent: 'Conway', home: true, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-12-08', time: '7:30 PM', opponent: 'St. James', home: true, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-12-11', time: '7:30 PM', opponent: 'Conway', home: false, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-12-14', time: '7:30 PM', opponent: 'Dillon', home: true, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-12-17', time: '7:30 PM', opponent: 'Sumter', home: false, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2026-12-30', time: 'TBA', opponent: 'Panther Classic', home: true, result: '', note: 'Dec 30 - Jan 1' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-01-05', time: '7:30 PM', opponent: 'Myrtle Beach', home: true, result: '', note: '' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-01-08', time: '7:30 PM', opponent: 'Cane Bay', home: false, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-01-15', time: '7:30 PM', opponent: 'Wando', home: true, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-01-19', time: '7:30 PM', opponent: 'Berkeley', home: true, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-01-22', time: '7:30 PM', opponent: 'Socastee', home: false, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-01-26', time: '7:30 PM', opponent: 'Goose Creek', home: true, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-01-29', time: '7:30 PM', opponent: 'Cane Bay', home: true, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-02-02', time: '7:30 PM', opponent: 'Berkeley', home: false, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-02-05', time: '7:30 PM', opponent: 'Socastee', home: true, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-02-08', time: '7:30 PM', opponent: 'Goose Creek', home: false, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Boys', level: 'Varsity', date: '2027-02-10', time: '7:30 PM', opponent: 'Wando', home: false, result: '', note: 'Region' },

  // ---------- Girls Basketball (Varsity Girls) ----------
  { sport: 'Basketball', gender: 'Girls', level: 'Varsity', date: '2026-12-14', time: '6:00 PM', opponent: 'Dillon', home: true, result: '', note: '' },
  { sport: 'Basketball', gender: 'Girls', level: 'Varsity', date: '2027-01-22', time: '6:00 PM', opponent: 'Socastee', home: false, result: '', note: 'Region' },
  { sport: 'Basketball', gender: 'Girls', level: 'Varsity', date: '2027-02-05', time: '6:00 PM', opponent: 'Socastee', home: true, result: '', note: 'Region' },

  // ---------- Girls Golf (Varsity Girls, fall) ----------
  { sport: 'Golf', gender: 'Girls', level: 'Varsity', date: '2026-09-15', time: '4:30 PM', opponent: 'Conway', home: true, result: '', note: 'Myrtle Beach, SC' },
  { sport: 'Golf', gender: 'Girls', level: 'Varsity', date: '2026-09-21', time: '4:00 PM', opponent: 'Wando', home: false, result: '', note: 'Wedgefield CC, Georgetown' },
  { sport: 'Golf', gender: 'Girls', level: 'Varsity', date: '2026-09-21', time: '4:30 PM', opponent: 'Tri-Match', home: true, result: '', note: 'Myrtle Beach, SC' },
  { sport: 'Golf', gender: 'Girls', level: 'Varsity', date: '2026-10-01', time: '4:30 PM', opponent: 'Myrtle Beach', home: true, result: '', note: 'Myrtle Beach National' },
  { sport: 'Golf', gender: 'Girls', level: 'Varsity', date: '2026-10-13', time: 'TBA', opponent: 'AAAAA Region 6 Championship', home: null, result: '', note: '' },

  // ---------- Girls Soccer (Varsity Girls, spring) ----------
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-02-23', time: '7:00 PM', opponent: 'Georgetown', home: true, result: '', note: '' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-02-26', time: 'TBA', opponent: 'Viking Cup', home: null, result: '', note: 'Feb 26-27' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-02', time: '7:30 PM', opponent: 'West Ashley', home: true, result: '', note: '' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-05', time: '7:00 PM', opponent: 'Lucy Beckham', home: true, result: '', note: '' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-09', time: '7:30 PM', opponent: 'Waccamaw', home: true, result: '', note: '' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-12', time: 'TBA', opponent: 'Socastee', home: true, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-16', time: 'TBA', opponent: 'Goose Creek', home: false, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-19', time: 'TBA', opponent: 'Berkeley', home: true, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-23', time: 'TBA', opponent: 'Cane Bay', home: true, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-03-26', time: 'TBA', opponent: 'Wando', home: false, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-04-02', time: 'TBA', opponent: 'Socastee', home: false, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-04-06', time: 'TBA', opponent: 'Berkeley', home: false, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-04-09', time: 'TBA', opponent: 'Goose Creek', home: true, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-04-20', time: 'TBA', opponent: 'Wando', home: true, result: '', note: 'Region' },
  { sport: 'Soccer', gender: 'Girls', level: 'Varsity', date: '2027-04-23', time: 'TBA', opponent: 'Cane Bay', home: false, result: '', note: 'Region' },

  // ---------- Baseball (Varsity Boys, spring) ----------
  { sport: 'Baseball', gender: 'Boys', level: 'Varsity', date: '2027-03-08', time: '6:00 PM', opponent: 'North Brunswick (NC)', home: false, result: '', note: '' },
  { sport: 'Baseball', gender: 'Boys', level: 'Varsity', date: '2027-03-12', time: '6:00 PM', opponent: 'West Brunswick (NC)', home: false, result: '', note: '' },
  { sport: 'Baseball', gender: 'Boys', level: 'Varsity', date: '2027-04-12', time: '12:00 PM', opponent: 'Loris', home: true, result: '', note: '' },

  // ---------- Girls Lacrosse (Varsity Girls, spring) ----------
  { sport: 'Lacrosse', gender: 'Girls', level: 'Varsity', date: '2027-03-06', time: '1:00 PM', opponent: 'T.L. Hanna', home: false, result: '', note: '' },
  { sport: 'Lacrosse', gender: 'Girls', level: 'Varsity', date: '2027-03-11', time: 'TBA', opponent: 'James Island', home: false, result: '', note: 'Region' },
  { sport: 'Lacrosse', gender: 'Girls', level: 'Varsity', date: '2027-03-15', time: '7:00 PM', opponent: 'Socastee', home: true, result: '', note: 'Region' },
  { sport: 'Lacrosse', gender: 'Girls', level: 'Varsity', date: '2027-04-05', time: 'TBA', opponent: 'James Island', home: true, result: '', note: 'Region' },
  { sport: 'Lacrosse', gender: 'Girls', level: 'Varsity', date: '2027-04-08', time: '7:00 PM', opponent: 'Socastee', home: false, result: '', note: 'Region' },

  // ---------- JV Football (Boys) ----------
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-08-20', time: '6:00 PM', opponent: 'West Florence', home: true, result: 'W 7-6', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-08-27', time: '6:00 PM', opponent: 'Conway', home: false, result: 'W 29-15', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-09-03', time: '6:00 PM', opponent: 'New Hanover (NC)', home: false, result: 'W 22-0', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-09-10', time: '6:00 PM', opponent: 'Marlboro County', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-09-10', time: '6:00 PM', opponent: 'Myrtle Beach', home: true, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-09-17', time: '6:00 PM', opponent: 'Waccamaw', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-09-24', time: '6:00 PM', opponent: 'Mullins', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-10-01', time: '6:00 PM', opponent: 'Goose Creek', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-10-08', time: '6:00 PM', opponent: 'Berkeley', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-10-14', time: '6:00 PM', opponent: 'Socastee', home: true, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-10-22', time: '6:00 PM', opponent: 'Wando', home: false, result: '', note: '' },
  { sport: 'Football', gender: 'Boys', level: 'JV', date: '2026-10-29', time: '6:00 PM', opponent: 'Cane Bay', home: true, result: '', note: '' },

  // ---------- Freshman Football (Boys) ----------
  { sport: 'Football', gender: 'Boys', level: 'Freshman', date: '2026-08-27', time: '6:00 PM', opponent: 'Ashley (NC)', home: true, result: 'W 19-13', note: '' },

  // ---------- JV Volleyball (Girls) ----------
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-08-20', time: '6:00 PM', opponent: 'Aynor', home: false, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-08-24', time: '4:30 PM', opponent: 'West Brunswick (NC)', home: false, result: 'L 0-2', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-02', time: '5:30 PM', opponent: 'Loris', home: false, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-10', time: '5:00 PM', opponent: 'Berkeley', home: true, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-10', time: '6:00 PM', opponent: 'Aynor', home: true, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-15', time: '5:30 PM', opponent: 'Socastee', home: false, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-17', time: '5:00 PM', opponent: 'Wando', home: true, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-22', time: '5:00 PM', opponent: 'Cane Bay', home: false, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-24', time: '5:00 PM', opponent: 'Goose Creek', home: true, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-09-29', time: '5:00 PM', opponent: 'Goose Creek', home: false, result: '', note: '' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-10-01', time: '5:00 PM', opponent: 'Berkeley', home: false, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-10-06', time: '5:30 PM', opponent: 'Socastee', home: true, result: '', note: 'Region' },
  { sport: 'Volleyball', gender: 'Girls', level: 'JV', date: '2026-10-13', time: '5:00 PM', opponent: 'Cane Bay', home: true, result: '', note: 'Region' }
];
