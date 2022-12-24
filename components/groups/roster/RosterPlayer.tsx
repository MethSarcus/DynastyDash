import {
	Avatar,
	Box,
	Center,
	Collapse,
	Flex,
	HStack,
	Spacer,
	Text,
	useDisclosure,
} from '@chakra-ui/react'
import {SleeperPlayerDetails} from '../../../classes/custom/Player'
import SeasonPlayer from '../../../classes/custom/SeasonPlayer'
import {project_colors} from '../../../utility/project_colors'
import RosterPlayerTrendingLineChart from '../../charts/team_charts/RosterPlayerTrendingLineChart'
import PositionBadge from '../../PositionBadges/PositionBadge'

interface MyProps {
	playerDetails: SleeperPlayerDetails | undefined
	playerSeasonDetails: SeasonPlayer | undefined
    leaguePositionAverage: number
	isBenched?: boolean
}

export default function RosterPlayer(props: MyProps) {
	const {isOpen, onToggle} = useDisclosure()
	return (
		<Box
			bg={project_colors.sleeper.background_dark}
			borderRadius={2}
			minW={'155px'}
			my={1}
			onClick={onToggle}
		>
			<HStack
				py={2}
				px={2}
				bg={project_colors.sleeper.background_dark}
				shadow={'dark'}
				fontSize={'.7em'}
				position={'relative'}
				verticalAlign={'middle'}
				lineHeight={1.3}
				flexDirection={'row'}
			>
				<PositionBadge
					variant={
						props.isBenched == true
							? 'BN'
							: props.playerDetails?.fantasy_positions[0] ?? 'RB'
					}
					size={'xs'}
				/>
				<Avatar
					size={'xs'}
					src={
						isNaN(+props.playerDetails?.player_id!)
							? `https://sleepercdn.com/images/team_logos/nfl/${props.playerDetails?.player_id.toLowerCase()}.png`
							: `https://sleepercdn.com/content/nfl/players/${props.playerDetails?.player_id}.jpg`
					}
				/>
				<Box textAlign={'start'}>
					<Text
						as={'p'}
						color={'white'}
						fontWeight={'semibold'}
						fontSize={'1.1em'}
						noOfLines={1}
					>
						{props.playerDetails?.first_name.charAt(0)}.{' '}
						{props.playerDetails?.last_name}
					</Text>
					<Text
						as={'p'}
						fontWeight={'semibold'}
						color={'white'}
						fontSize={'.8em'}
					>
						{props.playerDetails?.fantasy_positions[0]}-
						{props.playerDetails?.team}
					</Text>
				</Box>
			</HStack>
			<Collapse in={isOpen} animateOpacity>
				<Box
					p='5px'
					zIndex={1}
					fontSize={'.8em'}
					color='white'
				>
					<HStack>
                        <Center noOfLines={2}>
                        <Text fontSize={'.6em'}>Avg</Text>
                        <Text fontSize={'.6em'}>{props.playerSeasonDetails?.avgPointsPerStart.toFixed(2)}</Text>
                        </Center>
                        <Center noOfLines={2}>
                        <Text fontSize={'.6em'}>Starter Points</Text>
                        <Text fontSize={'.6em'}>{props.playerSeasonDetails?.starter_points.toFixed(2)}</Text>
                        </Center>
					</HStack>
                    <Box w={"155px"} h={"60px"} p={1}>
                            <RosterPlayerTrendingLineChart player={props.playerSeasonDetails} positionAverage={props.leaguePositionAverage}/>
                        </Box>
				</Box>
			</Collapse>
		</Box>
	)
}
