import produce, { immerable } from "immer";
import { ordinal_suffix_of, POSITION } from "../../utility/rosterFunctions";
import { LeagueSettings, ScoringSettings } from "../sleeper/LeagueSettings";
import SleeperLeague from "../sleeper/SleeperLeague";
import { SleeperMatchup } from "../sleeper/SleeperMatchup";
import { SleeperRoster } from "../sleeper/SleeperRoster";
import { SleeperTransaction } from "../sleeper/SleeperTransaction";
import { SleeperUser } from "../sleeper/SleeperUser";
import LeagueMember from "./LeagueMember";
import { MatchupSide } from "./MatchupSide";
import MemberScores from "./MemberStats";
import { OrdinalStatInfo } from "./OrdinalStatInfo";
import { SleeperPlayerDetails } from "./Player";
import { Week } from "./Week";

export default class League {
  //members maps roster ID to leaguemember
  [immerable] = true;
  public members: Map<number, LeagueMember> = new Map();
  public weeks: Map<number, Week> = new Map();
  public transactions: SleeperTransaction[];
  public allMatchups: SleeperMatchup[][];
  public settings: LeagueSettings;
  public modifiedSettings?: LeagueSettings;
  public useModifiedSettings: boolean = false;
  public playerDetails: Map<string, SleeperPlayerDetails> = new Map();
  public playerStatMap: Map<number, any> = new Map();
  public playerProjectionMap: Map<number, any> = new Map();
  public memberIdToRosterId: Map<string, number> = new Map();

  constructor(sleeperLeague: SleeperLeague, modifiedSettings?: LeagueSettings) {
    if (modifiedSettings) {
      this.modifiedSettings = modifiedSettings;
      this.useModifiedSettings = true;
    } else {
      this.modifiedSettings = sleeperLeague.sleeperDetails;
    }
    sleeperLeague.player_details.forEach((player: any) => {
      this.playerDetails.set(player._id, player.details);
    });
    sleeperLeague.users.forEach((user: SleeperUser) => {
      sleeperLeague.rosters.forEach((roster: SleeperRoster) => {
        if (roster.owner_id == user.user_id) {
          this.members.set(roster.roster_id, new LeagueMember(user, roster));
          this.memberIdToRosterId.set(user.user_id, roster.roster_id);
        }
      });
    });

    this.allMatchups = sleeperLeague.matchups;
    this.transactions = []; //TODO add api calls for getting this info
    this.settings = sleeperLeague.sleeperDetails;
    this.settings = sleeperLeague.sleeperDetails;
    this.setStats(sleeperLeague.player_stats);
    this.initMemberTradeStats();
    this.setProjections(sleeperLeague.player_projections);
    this.setWeeks(sleeperLeague.matchups);
    this.calcMemberScores();
  }

  

  getPfOrdinalStats(): OrdinalStatInfo[] {
    let pfStats: LeagueMember[] = []
    this.members.forEach((member, rosterId) => {
      pfStats.push(member)
    })

    return pfStats.sort((a:LeagueMember, b:LeagueMember) => b.stats.pf - a.stats.pf).map((member, index) => {
      return new OrdinalStatInfo(member.name, member.roster.roster_id, index + 1, `${member.stats.pf.toFixed(2)} PF`, member.avatar)
    })
  }

  getGpOrdinalStats(): OrdinalStatInfo[] {
    let gpStats: LeagueMember[] = []
    this.members.forEach((member, rosterId) => {
      gpStats.push(member)
    })

    return gpStats.sort((a:LeagueMember, b:LeagueMember) => b.stats.gp - a.stats.gp).map((member, index) => {
      return new OrdinalStatInfo(member.name, member.roster.roster_id, index + 1, `${member.stats.gp.toFixed(2)} GP`, member.avatar)
    })
  }

  //Creates a map mapping week number to a map of player id to the players stats
  setStats(stats: any) {
    stats.forEach((statList: any, index: number) => {
      let weekNum = index + 1;
      this.playerStatMap.set(weekNum, new Map());
      statList.forEach((stat: any) => {
        this.playerStatMap.get(weekNum).set(stat._id, stat.stats);
      });
    });
  }

  //Creates a map mapping week number to a map of player id to the players projections
  setProjections(projections: any) {
    projections.forEach((projectionList: any, index: number) => {
      let weekNum = index + 1;
      this.playerProjectionMap.set(weekNum, new Map());
      projectionList.forEach((stat: any) => {
        this.playerProjectionMap.get(weekNum).set(stat._id, stat.stats);
      });
    });
  }

  modifyStats(customSettings: ScoringSettings) {
    this.modifiedSettings = produce(
      this.modifiedSettings,
      (draftState: LeagueSettings) => {
        draftState.scoring_settings = customSettings;
      }
    );
    this.useModifiedSettings = true;
    this.recalcStats();
  }

  disableModifiedStats() {
    this.useModifiedSettings = false;
  }

  getPositions() {
    if (this.settings.roster_positions != undefined) {
      return this.settings.roster_positions
        .map((pos) => {
          if (Object.values(POSITION).includes(pos as POSITION)) {
            return pos as POSITION;
          }
        })
        .filter((value, index, array) => {
          return value != undefined && array.indexOf(value) === index;
        });
    } else {
      return [];
    }
  }

  setWeeks(allMatchups: SleeperMatchup[][]) {
    allMatchups.forEach((weekMatchups: SleeperMatchup[], index: number) => {
      let weekNum = index + 1;
      let isPlayoffs = false;
      if (
        this.settings.playoff_week_start &&
        this.settings.playoff_week_start <= weekNum
      ) {
        isPlayoffs = true;
      }
      let settings = this.settings;
      if (this.useModifiedSettings && this.modifiedSettings) {
        settings = this.modifiedSettings;
      }
      let week = new Week(
        weekNum,
        weekMatchups,
        this.playerStatMap,
        this.playerProjectionMap,
        this.playerDetails,
        settings,
        isPlayoffs
      );
      this.weeks.set(weekNum, week);
    });
  }

  getPlayerStat(playerId: number, weekNum: number) {
    return this.playerStatMap.get(weekNum).get(playerId.toString());
  }

  getPlayerProjection(playerId: number, weekNum: number) {
    return this.playerProjectionMap.get(weekNum).get(playerId.toString());
  }

  changeName(name: string) {
    this.settings.name = name;
  }

  initMemberTradeStats() {
    this.members.forEach((member: LeagueMember, rosterId: number) => {
      for (let i = 1; i <= this.members.size; i++) member.tradeStats.set(i, 0);
    });
  }

  recalcStats() {
    for (let [key, member] of this.members) {
      member.stats = new MemberScores();
    }
    this.setWeeks(this.allMatchups);
    this.calcMemberScores();
  }

  calcMemberScores() {
    this.weeks.forEach((week) => {
      week.matchups.forEach((matchup) => {
        if (matchup.awayTeam) {
          let homeId = matchup.homeTeam.roster_id;
          let awayId = matchup.awayTeam.roster_id;
          let homeMember = this.members.get(homeId);
          let awayMember = this.members.get(matchup.awayTeam.roster_id);
          let homeTeam = matchup.homeTeam;
          let awayTeam = matchup.awayTeam;

          if (homeMember && awayMember) {
            homeMember.stats.pf += homeTeam.pf;
            homeMember.stats.pp += homeTeam.pp;
            homeMember.stats.opslap += homeTeam.opslap;
            homeMember.stats.gp += homeTeam.gp;
            homeMember.stats.gutPlays += homeTeam.gut_plays;
            homeMember.stats.custom_points += homeTeam.custom_points;
            homeMember.stats.pa += awayTeam.pf;
            homeTeam.position_starts.forEach((value, key) => {
              if (homeMember?.stats.position_scores.has(key)) {
                homeMember?.stats.position_starts.set(
                  key,
                  homeMember.stats.position_starts.get(key)!! + value
                );
                homeMember?.stats.position_scores.set(
                  key,
                  homeMember.stats.position_scores.get(key)!! +
                    homeTeam.position_scores.get(key)!!
                );
                homeMember?.stats.projected_position_scores.set(
                  key,
                  homeMember.stats.projected_position_scores.get(key)!! +
                    homeTeam.position_projected_scores.get(key)!!
                );
              } else {
                homeMember?.stats.position_starts.set(key, value);
                homeMember?.stats.position_scores.set(
                  key,
                  homeTeam.position_scores.get(key)!!
                );
                homeMember?.stats.projected_position_scores.set(
                  key,
                  homeTeam.position_projected_scores.get(key)!!
                );
              }
            });

            awayMember.stats.pf += awayTeam.pf;
            awayMember.stats.pp += awayTeam.pp;
            awayMember.stats.opslap += awayTeam.opslap;
            awayMember.stats.gp += awayTeam.gp;
            awayMember.stats.gutPlays += awayTeam.gut_plays;
            awayMember.stats.custom_points += awayTeam.custom_points;
            awayMember.stats.pa += homeTeam.pf;

            awayTeam.position_starts.forEach((value, key) => {
              if (awayMember?.stats.position_scores.has(key)) {
                awayMember?.stats.position_starts.set(
                  key,
                  awayMember.stats.position_starts.get(key)!! + value
                );
                awayMember?.stats.position_scores.set(
                  key,
                  awayMember.stats.position_scores.get(key)!! +
                    awayTeam.position_scores.get(key)!!
                );
                awayMember?.stats.projected_position_scores.set(
                  key,
                  awayMember.stats.projected_position_scores.get(key)!! +
                    awayTeam.position_projected_scores.get(key)!!
                );
              } else {
                awayMember?.stats.position_starts.set(key, value);
                awayMember?.stats.position_scores.set(
                  key,
                  awayTeam.position_scores.get(key)!!
                );
                awayMember?.stats.projected_position_scores.set(
                  key,
                  awayTeam.position_projected_scores.get(key)!!
                );
              }
            });

            if (homeTeam.pf > awayTeam.pf) {
              homeMember.stats.wins += 1;
              awayMember.stats.losses += 1;
            } else if (homeTeam.pf < awayTeam.pf) {
              awayMember.stats.wins += 1;
              homeMember.stats.losses += 1;
            } else {
              homeMember.stats.ties += 1;
              awayMember.stats.ties += 1;
            }

            if (homeTeam.projectedScore < awayTeam.projectedScore) {
              homeMember.stats.timesUnderdog += 1;
              if (matchup.winnerRosterId == homeId) {
                homeMember.stats.upsets += 1;
              }
            } else {
              awayMember.stats.timesUnderdog += 1;
              if (matchup.winnerRosterId == awayId) {
                awayMember.stats.upsets += 1;
              }
            }
          }
        }
      });
      let teams: MatchupSide[] = week.getAllTeams();

      teams.sort((a: MatchupSide, b: MatchupSide) => {
        if (a.pf < b.pf) {
          return 1;
        } else if (a.pf > b.pf) {
          return -1;
        } else {
          return 0;
        }
      });

      teams.forEach((team, index) => {
        let member = this.members.get(team.roster_id);
        let pwrwins = this.members.size - index;
        let pwrlosses = this.members.size - pwrwins;
        if (member) {
          member.stats.power_wins += pwrwins - 1;
          member.stats.power_losses += pwrlosses;
        }
      });
    });
  }
}
