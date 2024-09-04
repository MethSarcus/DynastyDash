'use client'
import {HStack} from '@chakra-ui/react'
import League from '../../../classes/custom/League'
import Matchup from '../../../classes/custom/Matchup'
import { MatchupSide } from '../../../classes/custom/MatchupSide'
import NotableMatchupStatCard from '../../cards/statcards/NotableMatchupStatCard'
import WeekStatCard from '../../cards/statcards/WeekStatCard'

interface MyProps {
	league: League | undefined
}
const LeagueNotableWeeksStatGroup = (props: MyProps) => {
	let bestWeekTeam: MatchupSide | undefined = undefined
	let bestWeek: Matchup | undefined = undefined
	let worstWeekTeam: MatchupSide | undefined = undefined
	let worstWeek: Matchup | undefined = undefined
	let closestGame: Matchup | undefined = undefined
	let furthestGame: Matchup | undefined = undefined
	let biggestShootout: Matchup | undefined = undefined //highest combined score
	let smallestShootout: Matchup | undefined = undefined

	if (props.league?.settings != undefined) {
		let notableWeeks = props.league.getLeagueNotableWeeks()

		bestWeek = notableWeeks.matchupForBestTeam as unknown as Matchup
		bestWeekTeam = bestWeek?.getWinner()
		worstWeek = notableWeeks.matchupForWorstTeam as unknown as Matchup
		worstWeekTeam = worstWeek?.getLoser()

		closestGame = notableWeeks.closestGame as unknown as Matchup
		biggestShootout = notableWeeks.biggestShootout as unknown as Matchup
		furthestGame = notableWeeks.furthestGame as unknown as Matchup
		smallestShootout = notableWeeks.smallestShootout as unknown as Matchup
	}

	return (
		<HStack align={'stretch'} height={"full"}>
			<NotableMatchupStatCard
				matchup={bestWeek}
				memberId={bestWeekTeam?.roster_id}
				score={`${bestWeekTeam?.pf?.toFixed(2)} PF`}
				title={'Highest Score'}
				subStat={
					props.league?.members?.get(bestWeekTeam?.roster_id ?? 0)?.teamName
				}
				isLoaded={bestWeekTeam != undefined}
			/>
			<NotableMatchupStatCard
				memberId={worstWeekTeam?.roster_id}
				matchup={worstWeek}
				score={`${worstWeekTeam?.pf?.toFixed(2)} PF`}
				title={'Lowest Score'}
				subStat={
					props.league?.members?.get(worstWeekTeam?.roster_id ?? 0)?.teamName
				}
				isLoaded={worstWeekTeam != undefined}
			/>
			<NotableMatchupStatCard
				matchup={biggestShootout}
				title={'Biggest Shootout'}
				score={`${biggestShootout?.getCombinedScore().toFixed(2)}`}
				subSubStat={'Combined Points'}
				isLoaded={biggestShootout != undefined}
			/>
			<NotableMatchupStatCard
				matchup={smallestShootout}
				title={'Smallest Shootout'}
				score={`${smallestShootout?.getCombinedScore().toFixed(2)}`}
				subSubStat={'Combined Points'}
				isLoaded={smallestShootout != undefined}
			/>
			<NotableMatchupStatCard
				matchup={closestGame}
				title={'Closest Match'}
				score={`${closestGame?.getMargin().toFixed(2)}`}
				subSubStat={'margin'}
				isLoaded={closestGame != undefined}
			/>
			<NotableMatchupStatCard
				matchup={furthestGame}
				title={'Biggest Stomp'}
				score={`${furthestGame?.getMargin().toFixed(2)}`}
				subSubStat={'margin'}
				isLoaded={furthestGame != undefined}
			/>
		</HStack>
	)
}

export default LeagueNotableWeeksStatGroup