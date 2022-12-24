'use client'
import {
    Avatar,
	Box,
	Card,
	Center,
	Grid,
	GridItem,
	Image,
	Text,
	Tooltip,
	useMultiStyleConfig,
	VStack,
} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import League from '../../classes/custom/League'
import LeagueMember from '../../classes/custom/LeagueMember'
import TrendingLineChart from '../charts/team_charts/TrendingLineChart'

type MyProps = {
	league: League
	member: LeagueMember | undefined
	variant: string
	size: string
}

const TeamCardWithTrendingGraph = (props: MyProps) => {
	const {variant, size, ...rest} = props
	return (
		<Card
			boxShadow={'lg'}
			rounded={'md'}
			bg='surface.0'
			textColor={'white'}
			fontSize={'.8em'}
		>
			<Grid templateAreas={`"member linechart linechart"`} gap='1'>
				<GridItem area={'member'}>
					<Center>
						<Avatar
							objectFit='cover'
							maxW={'40px'}
                            borderRadius={0}
							src={`https://sleepercdn.com/avatars/thumbs/${props.member?.avatar}`
									
							}
						/>
						<VStack spacing={0} pl={2} alignItems={'left'} flex={1}>
							<Text maxWidth={['120px']} noOfLines={1}>
								{props?.member?.name}
							</Text>
							<Tooltip
								label={`${props.member?.stats.divisionWins} - ${
									props.member?.stats.divisionLosses
								} ${
									props.member?.stats?.divisionTies ?? 0 > 0
										? `-${props.member?.stats?.divisionTies}`
										: ''
								} Division Record`}
							>
								<Text p={0}>
									{props.member?.stats.wins} - {props.member?.stats.losses}{' '}
									{props.member?.stats?.ties ?? 0 > 0
										? `- ${props.member?.stats?.ties}`
										: ''}
								</Text>
							</Tooltip>
							<Text fontSize={'.6em'} p={0} m={0}></Text>
						</VStack>
					</Center>
				</GridItem>
			</Grid>
		</Card>
	)
}

export default TeamCardWithTrendingGraph
