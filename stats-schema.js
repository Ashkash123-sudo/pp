// stats-schema.js - sport-specific player stat fields, shared by the
// add-player form (sport.js) and the player profile page (player.js).
// Each entry: [storageKey, label].
window.CFHS_STAT_SCHEMA = {
  Football: [['passing', 'Passing yds'], ['rushing', 'Rushing yds'], ['receiving', 'Receiving yds'], ['touchdowns', 'Touchdowns'], ['tackles', 'Tackles'], ['interceptions', 'Interceptions']],
  Basketball: [['ppg', 'Points / game'], ['rpg', 'Rebounds / game'], ['apg', 'Assists / game'], ['spg', 'Steals / game'], ['bpg', 'Blocks / game'], ['fgPct', 'FG %']],
  Volleyball: [['kills', 'Kills'], ['aces', 'Aces'], ['assists', 'Assists'], ['digs', 'Digs'], ['blocks', 'Blocks'], ['hitPct', 'Hitting %']],
  Soccer: [['goals', 'Goals'], ['assists', 'Assists'], ['shots', 'Shots'], ['saves', 'Saves'], ['cleanSheets', 'Clean sheets']],
  Baseball: [['avg', 'Batting avg'], ['hits', 'Hits'], ['homeRuns', 'Home runs'], ['rbi', 'RBI'], ['era', 'ERA'], ['strikeouts', 'Strikeouts (P)']],
  Softball: [['avg', 'Batting avg'], ['hits', 'Hits'], ['homeRuns', 'Home runs'], ['rbi', 'RBI'], ['era', 'ERA'], ['strikeouts', 'Strikeouts (P)']],
  Tennis: [['record', 'Match record'], ['setsWon', 'Sets won'], ['flight', 'Flight / line']],
  Golf: [['scoringAvg', 'Scoring avg'], ['lowRound', 'Low round'], ['pars', 'Pars'], ['birdies', 'Birdies']],
  'Cross Country': [['pr5k', '5K PR'], ['seasonBest', 'Season best'], ['top10', 'Top-10 finishes']],
  'Track & Field': [['events', 'Events'], ['pr', 'Personal record'], ['seasonBest', 'Season best']],
  Swimming: [['events', 'Events'], ['pr', 'Personal record'], ['seasonBest', 'Season best'], ['relays', 'Relays']],
  Lacrosse: [['goals', 'Goals'], ['assists', 'Assists'], ['groundBalls', 'Ground balls'], ['saves', 'Saves']],
  Wrestling: [['record', 'Record'], ['pins', 'Pins'], ['weightClass', 'Weight class'], ['takedowns', 'Takedowns']]
};
window.CFHS_DEFAULT_STATS = [['stat1', 'Stat 1'], ['stat2', 'Stat 2'], ['stat3', 'Stat 3']];
window.cfhsStatSchema = function (sport) {
  return window.CFHS_STAT_SCHEMA[sport] || window.CFHS_DEFAULT_STATS;
};
window.CFHS_SPORT_EMOJI = {
  Baseball: '⚾', Softball: '🥎', Basketball: '🏀', Soccer: '⚽', Football: '🏈',
  Volleyball: '🏐', Tennis: '🎾', Golf: '⛳', Swimming: '🏊', 'Cross Country': '🏃',
  'Track & Field': '🎽', Lacrosse: '🥍', Wrestling: '🤼'
};
