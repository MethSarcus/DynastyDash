'use client'
import {Box, Button, Center, Flex, HStack, useMediaQuery} from '@chakra-ui/react'
import {produce} from 'immer'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import React from 'react'
import {useContext} from 'react'
import League, {SeasonPortion} from '../../classes/custom/League'
import {DatabasePlayer, PlayerScores, SleeperPlayerDetails} from '../../classes/custom/Player'
import {LeagueContext} from '../../contexts/LeagueContext'
import {PlayerDetailsContext} from '../../contexts/PlayerDetailsContext'
import {PlayerScoresContext} from '../../contexts/PlayerScoresContext'
import {project_colors} from '../../utility/project_colors'
import ExpandableLeagueSearch from '../forms/ExpandableLeagueSearch'
import MobileSidebar from './MobileSidebar'
import SeasonPortionSelector from './SeasonPortionSelector'
import SettingsSidebar from './SettingsSidebar'
import TeamSidebar from './TeamSidebar'

interface MyProps {
	leagueID: string | undefined
}

const Navbar = (props: MyProps) => {
	const [context, setContext] = useContext(LeagueContext)
	const [playerScores, setPlayerScores] = useContext(PlayerScoresContext) as [Map<string, PlayerScores>, any]
	const [playerDetails, setPlayerDetails] = useContext(PlayerDetailsContext) as [
		Map<string, DatabasePlayer>,
		any
	]

	function setSeasonPortion(selected: String) {
		const nextState = produce(context, (draftState: League) => {
			draftState.setSeasonPortion(playerScores, playerDetails, selected as SeasonPortion)
		})
		setContext(nextState)
	}
	return (
		<Flex
			bg={'secondary.600'}
			bgGradient='linear(to-r, surface.1, surface.0)'
			maxWidth={'100vw'}
			color={'white'}>
			<HStack
				spacing='0px'
				pl={3}
				paddingY={1}
				flex={1}
				display={{sm: 'none', base: 'flex'}}
				maxWidth={'100vw'}
				overflow='hidden'>
				<MobileSidebar />
				<NavbarButton
					buttonText='VisuaLeague'
					disabled={context.settings == undefined}
					link={`/league/${context.settings?.league_id}`}
				/>
			</HStack>
			<HStack
				py={0}
				my={0}
				flex={1}
				mx={6}
				gap={0}
				spacing='0px'
				display={{sm: 'flex', base: 'none'}}
				maxWidth={'100vw'}
				overflow='hidden'>
				<NavbarButton
					buttonText='League'
					disabled={context.settings == undefined}
					link={`/league/${context.settings?.league_id}`}
				/>
				<TeamSidebar />
				<NavbarButton
					buttonText='Power Rankings'
					disabled={context.settings == undefined}
					link={`/league/${context?.settings?.league_id}/ranks`}
				/>
				<NavbarButton
					buttonText='Trading'
					disabled={context.settings == undefined}
					link={`/league/${context?.settings?.league_id}/trades`}
				/>
				<NavbarButton
					buttonText='Draft'
					disabled={context.settings == undefined}
					link={`/league/${context?.settings?.league_id}/draft`}
				/>
				<NavbarButton
					buttonText='Rosters'
					disabled={context.settings == undefined}
					link={`/league/${context?.settings?.league_id}/rosters`}
				/>
				<Box pl={3}>
					<ExpandableLeagueSearch />
				</Box>
			</HStack>
			<Center pr={3} my={2}>
				<SeasonPortionSelector onclick={setSeasonPortion} />
			</Center>
			<Center pr={3} my={2}>
				{context?.settings && <SettingsSidebar leagueSettings={context?.settings} />}
			</Center>
		</Flex>
	)
}

export default Navbar

interface NavButtonProps {
	buttonText: string
	link?: string
	disabled?: boolean
	onclick?: () => void
}
function NavbarButton(props: NavButtonProps) {
	const pathName = usePathname()
	const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
	if (props.link != undefined && props.disabled != true) {
		return (
			<Link href={props.link}>
				<Button
					transition={'all .2s ease'}
					_hover={{
						backgroundColor: 'secondary.600',
						cursor: 'pointer',
					}}
					onClick={props.onclick}
					disabled={props.disabled ?? false}
					size={'md'}
					fontWeight={'semibold'}
					borderRadius={0}
					colorScheme={'primary'}
					textColor='white'
					isActive={pathName == '/' + props.link && isLargerThan800}
					_active={{bg: project_colors.secondary[500]}}
					variant={'ghost'}
					aria-label={props.buttonText}>
					{props.buttonText}
				</Button>
			</Link>
		)
	} else {
		return (
			<Button
				transition={'all .2s ease'}
				_hover={{
					backgroundColor: 'secondary.600',
					cursor: 'pointer',
				}}
				onClick={props.onclick}
				disabled={props.disabled ?? false}
				size={'md'}
				borderRadius={0}
				fontWeight={'medium'}
				colorScheme={'primary'}
				textColor='white'
				isActive={pathName?.includes('/' + props.link) && isLargerThan800}
				_active={{bg: project_colors.secondary[500]}}
				variant='ghost'
				aria-label={props.buttonText}>
				{props.buttonText}
			</Button>
		)
	}
}
