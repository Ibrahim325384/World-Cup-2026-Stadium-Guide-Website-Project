import { MATCHES, Match } from '../data/matches';

export interface SimulatedScore {
  homeScore: number;
  awayScore: number;
}

export interface TeamStanding {
  team: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
}

/**
 * Parses match date and time into a JavaScript Date object.
 * e.g., "June 11, 2026" and "15:00" -> Date object
 */
export function parseMatchDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr} ${timeStr}`);
}

/**
 * Returns a stable, deterministic, realistic football score for any match ID.
 * Highly realistic: lower-scoring on average, occasional draws or clean sheets,
 * and stable (will always return the same score for the same match ID).
 */
export function getSimulatedScore(matchId: string): SimulatedScore {
  let hash = 0;
  for (let i = 0; i < matchId.length; i++) {
    hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Generate realistic scores:
  // Probabilities: 
  // - 0 goals: 20%
  // - 1 goal: 35%
  // - 2 goals: 25%
  // - 3 goals: 12%
  // - 4+ goals: 8%
  const getGoals = (val: number) => {
    const r = val % 100;
    if (r < 20) return 0;
    if (r < 55) return 1;
    if (r < 80) return 2;
    if (r < 92) return 3;
    return 4;
  };

  const homeScore = getGoals(hash);
  const awayScore = getGoals(hash >> 5);

  return { homeScore, awayScore };
}

/**
 * Checks if a match is completed relative to the comparison date.
 */
export function isMatchCompleted(matchDateStr: string, matchTimeStr: string, referenceDate: Date): boolean {
  const matchDate = parseMatchDateTime(matchDateStr, matchTimeStr);
  return matchDate.getTime() <= referenceDate.getTime();
}

/**
 * Computes the group standings based on matches and current scores.
 */
export function computeStandings(scores: Record<string, { homeScore: number; awayScore: number }>): Record<string, TeamStanding[]> {
  const groupData: Record<string, Record<string, TeamStanding>> = {};

  // Initialize standings structure for all stages which have defined groups
  MATCHES.forEach(match => {
    if (match.group) {
      const grp = match.group;
      if (!groupData[grp]) {
        groupData[grp] = {};
      }

      // Initialize Home Team
      if (!groupData[grp][match.homeTeam]) {
        groupData[grp][match.homeTeam] = {
          team: match.homeTeam,
          flag: match.homeFlag,
          played: 0, won: 0, drawn: 0, lost: 0,
          gf: 0, ga: 0, gd: 0, pts: 0,
          form: []
        };
      }

      // Initialize Away Team
      if (!groupData[grp][match.awayTeam]) {
        groupData[grp][match.awayTeam] = {
          team: match.awayTeam,
          flag: match.awayFlag,
          played: 0, won: 0, drawn: 0, lost: 0,
          gf: 0, ga: 0, gd: 0, pts: 0,
          form: []
        };
      }
    }
  });

  // Populate data based on current scores state
  MATCHES.forEach(match => {
    if (match.group && scores[match.id]) {
      const grp = match.group;
      const score = scores[match.id];
      const hTeam = groupData[grp][match.homeTeam];
      const aTeam = groupData[grp][match.awayTeam];

      if (hTeam && aTeam) {
        hTeam.played += 1;
        aTeam.played += 1;
        hTeam.gf += score.homeScore;
        hTeam.ga += score.awayScore;
        aTeam.gf += score.awayScore;
        aTeam.ga += score.homeScore;

        if (score.homeScore > score.awayScore) {
          hTeam.won += 1;
          hTeam.pts += 3;
          hTeam.form.push('W');
          
          aTeam.lost += 1;
          aTeam.form.push('L');
        } else if (score.homeScore < score.awayScore) {
          aTeam.won += 1;
          aTeam.pts += 3;
          aTeam.form.push('W');
          
          hTeam.lost += 1;
          hTeam.form.push('L');
        } else {
          hTeam.drawn += 1;
          hTeam.pts += 1;
          hTeam.form.push('D');
          
          aTeam.drawn += 1;
          aTeam.form.push('D');
        }

        hTeam.gd = hTeam.gf - hTeam.ga;
        aTeam.gd = aTeam.gf - aTeam.ga;
      }
    }
  });

  // Format & sort standings for each group
  const formattedStandings: Record<string, TeamStanding[]> = {};
  Object.keys(groupData).forEach(grp => {
    const teamsList = Object.values(groupData[grp]);
    
    // Sort by points, then GD, then GF, then alphabetically
    teamsList.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.localeCompare(b.team);
    });

    formattedStandings[grp] = teamsList;
  });

  return formattedStandings;
}

/**
 * Dynamically resolves placeholder teams for knockout stages and maps final match data.
 */
export function computeResolvedMatches(
  scores: Record<string, { homeScore: number; awayScore: number }>,
  standings: Record<string, TeamStanding[]>
): any[] {
  const groupTeams = (groupName: string, rank: number) => {
    const groupKey = `Group ${groupName}`;
    const groupRows = standings[groupKey];
    if (groupRows && groupRows[rank - 1]) {
      return groupRows[rank - 1];
    }
    return null;
  };

  const matchOutcome: Record<number, { 
    winner: { team: string; flag: string }; 
    loser: { team: string; flag: string };
    home: { team: string; flag: string };
    away: { team: string; flag: string };
  }> = {};

  return MATCHES.map(match => {
    let resolvedHomeTeam = match.homeTeam;
    let resolvedHomeFlag = match.homeFlag;
    let resolvedAwayTeam = match.awayTeam;
    let resolvedAwayFlag = match.awayFlag;

    if (!match.group) {
      // Resolve placeholder team names
      const resolveTeamString = (teamStr: string): { team: string; flag: string } | null => {
        // Group X Winner
        const winnerReg = teamStr.match(/^Group ([A-L]) Winner[s]?$/i);
        if (winnerReg) {
          const grp = winnerReg[1].toUpperCase();
          const teamInfo = groupTeams(grp, 1);
          if (teamInfo) return { team: teamInfo.team, flag: teamInfo.flag };
        }

        // Group X Runner-up
        const runnerUpReg = teamStr.match(/^Group ([A-L]) Runner-up$/i);
        if (runnerUpReg) {
          const grp = runnerUpReg[1].toUpperCase();
          const teamInfo = groupTeams(grp, 2);
          if (teamInfo) return { team: teamInfo.team, flag: teamInfo.flag };
        }

        // Group X 3rd Place
        const thirdReg = teamStr.match(/^Group ([A-L]) 3rd Place$/i);
        if (thirdReg) {
          const grp = thirdReg[1].toUpperCase();
          const teamInfo = groupTeams(grp, 3);
          if (teamInfo) return { team: teamInfo.team, flag: teamInfo.flag };
        }

        // Winner Match X
        const winReg = teamStr.match(/^Winner Match (\d+)$/i);
        if (winReg) {
          const mNum = parseInt(winReg[1], 10);
          if (matchOutcome[mNum]) return matchOutcome[mNum].winner;
        }

        // Loser Match X
        const loseReg = teamStr.match(/^Loser Match (\d+)$/i);
        if (loseReg) {
          const mNum = parseInt(loseReg[1], 10);
          if (matchOutcome[mNum]) return matchOutcome[mNum].loser;
        }

        // Specialized final strings
        if (teamStr === 'Winner Semifinal 1' || teamStr === 'Winner Semifinal 1 ') {
          if (matchOutcome[100]) return matchOutcome[100].winner;
        }
        if (teamStr === 'Winner Semifinal 2') {
          if (matchOutcome[101]) return matchOutcome[101].winner;
        }
        if (teamStr === 'Loser Semifinal 1') {
          if (matchOutcome[100]) return matchOutcome[100].loser;
        }
        if (teamStr === 'Loser Semifinal 2') {
          if (matchOutcome[101]) return matchOutcome[101].loser;
        }

        return null;
      };

      const homeRes = resolveTeamString(match.homeTeam);
      if (homeRes) {
        resolvedHomeTeam = homeRes.team;
        resolvedHomeFlag = homeRes.flag;
      }

      const awayRes = resolveTeamString(match.awayTeam);
      if (awayRes) {
        resolvedAwayTeam = awayRes.team;
        resolvedAwayFlag = awayRes.flag;
      }

      // Determine this match outcome
      const score = scores[match.id] || { homeScore: 0, awayScore: 0 };
      let winner = { team: `Winner Match ${match.matchNumber}`, flag: '🏳️' };
      let loser = { team: `Loser Match ${match.matchNumber}`, flag: '🏳️' };

      if (homeRes && awayRes) {
        winner = { team: `Winner of ${resolvedHomeTeam}/${resolvedAwayTeam}`, flag: '🏳️' };
        loser = { team: `Loser of ${resolvedHomeTeam}/${resolvedAwayTeam}`, flag: '🏳️' };
      } else if (homeRes) {
        winner = { team: `Winner of ${resolvedHomeTeam}/TBD`, flag: '🏳️' };
      } else if (awayRes) {
        winner = { team: `Winner of TBD/${resolvedAwayTeam}`, flag: '🏳️' };
      }

      if (score.homeScore > score.awayScore) {
        winner = { team: resolvedHomeTeam, flag: resolvedHomeFlag };
        loser = { team: resolvedAwayTeam, flag: resolvedAwayFlag };
      } else if (score.awayScore > score.homeScore) {
        winner = { team: resolvedAwayTeam, flag: resolvedAwayFlag };
        loser = { team: resolvedHomeTeam, flag: resolvedHomeFlag };
      } else {
        winner = { team: resolvedHomeTeam, flag: resolvedHomeFlag };
        loser = { team: resolvedAwayTeam, flag: resolvedAwayFlag };
      }

      matchOutcome[match.matchNumber] = {
        winner,
        loser,
        home: { team: resolvedHomeTeam, flag: resolvedHomeFlag },
        away: { team: resolvedAwayTeam, flag: resolvedAwayFlag }
      };
    }

    return {
      ...match,
      resolvedHomeTeam,
      resolvedHomeFlag,
      resolvedAwayTeam,
      resolvedAwayFlag
    };
  });
}
