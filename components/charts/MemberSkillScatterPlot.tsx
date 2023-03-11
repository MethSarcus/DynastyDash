import {Spinner, useMediaQuery} from '@chakra-ui/react'
import {
	ResponsiveScatterPlot,
	ScatterPlotDatum,
	ScatterPlotNode,
	ScatterPlotNodeProps,
	ScatterPlotTooltipProps,
} from '@nivo/scatterplot'
import League from '../../classes/custom/League'
import LeagueMember from '../../classes/custom/LeagueMember'
import {project_colors} from '../../utility/project_colors'
import {animated} from '@react-spring/web'

interface MyProps {
	league: League | undefined
}

const interpolateRadius = (size: number) => size / 2

const MemberSkillScatterPlot = (props: MyProps) => {
	const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
	if (props.league?.members == undefined) return <Spinner />
	let data = formatScoresForScatterPlot(props.league) as any
	let gridYValues = []
	let gridXValues = []
	let gpBounds = 0
	let maxPfBounds = 0
	let minPfBounds = 9999999
	let marginDesktop = {top: 60, right: 90, bottom: 60, left: 90}
	let marginMobile = {top: 60, right: 10, bottom: 60, left: 50}

	let CustomNode = <RawDatum extends ScatterPlotDatum>({
		node,
		style,
		blendMode,
		isInteractive,
		onMouseEnter,
		onMouseMove,
		onMouseLeave,
		onClick,
	}: ScatterPlotNodeProps<RawDatum>) => {
		let avatar = `https://sleepercdn.com/avatars/thumbs/${
			props.league?.getMemberByName(node.serieId)?.avatar
		}`

		if (props.league?.getMemberByName(node.serieId)?.avatar == undefined) {
			avatar =
				'https://sleepercdn.com/images/v2/avatars/avatar_default_blue.webp'
		}
		return (
			<g
				transform={`translate(${node.x}, ${node.y})`}
				style={{pointerEvents: 'none'}}
			>
				<defs>
					<clipPath id='clipCircle'>
						<circle r={node.size * 1} x={node.size * -1} y={node.size * -1} />
					</clipPath>
				</defs>
				<image
					clipPath='url(#clipCircle)'
					x={node.size * -1}
					y={node.size * -1}
					width={node.size * 2}
					height={node.size * 2}
					href={avatar}
				></image>
			</g>
		)
	}

	if (props.league?.members) {
		gridYValues.push(props.league?.stats.avg_pp)
		gridXValues.push(0)
		props.league.members.forEach((mem) => {
			if (Math.abs(mem.stats.gp) > gpBounds) {
				gpBounds = Math.abs(mem.stats.gp)
			}

			if (Math.abs(mem.stats.pp) > maxPfBounds) {
				maxPfBounds = Math.abs(mem.stats.pp)
			}

			if (Math.abs(mem.stats.pp) < minPfBounds) {
				minPfBounds = Math.abs(mem.stats.pp)
			}
		})
	}
	const theme = {
		background: project_colors.surface[1],
		textColor: 'white',
	}

	if (data.length <= 0) return <Spinner />

	return (
		<ResponsiveScatterPlot
			data={data}
			theme={theme}
			margin={isLargerThan800 ? marginDesktop : marginMobile}
			xScale={{type: 'linear', min: gpBounds * -1 - 30, max: gpBounds + 30}}
			xFormat=' >-.2f'
			yScale={{type: 'linear', min: minPfBounds - 100, max: maxPfBounds + 100}}
			gridXValues={gridXValues}
			gridYValues={gridYValues}
			yFormat='>-.2f'
			blendMode='multiply'
			nodeSize={24}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: '\u2190 \t Owner Skill (Gut Points) \t \u2192',
				legendPosition: 'middle',
				legendOffset: 46,
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: '\u2190 \tRoster Strength (MaxPF) \t \u2192',
				legendPosition: 'middle',
				legendOffset: -60,
			}}
			nodeComponent={CustomNode}
			tooltip={({node}) => (
				<div
					style={{
						color: node.color,
						background: '#333',
						padding: '12px 16px',
					}}
				>
					<b>{node.serieId}</b>
					<br />
					<small>
						{`${node.xValue > 0 ? 'Good Manager' : 'Bad Manager'} ${
							node.formattedX
						} Gut Points`}
						<br />
						{`${
							node.yValue > (props.league?.stats.avg_pp ?? 0)
								? 'Good Roster'
								: 'Bad Roster'
						} ${node.formattedY} MaxPF`}
					</small>
				</div>
			)}
		/>
	)
}

function formatScoresForScatterPlot(league: League | undefined) {
	let data: object[] = []

	league?.members?.forEach((member: LeagueMember) => {
		if (league.memberIdToRosterId.has(member.userId)) {
			data.push({
				id: member.name,
				data: [{x: member.stats.gp, y: member.stats.pp}],
			})
		}
	})
	return data
}

export default MemberSkillScatterPlot
