'use client'
import {Box, Grid, GridItem, HStack, Spinner} from '@chakra-ui/react'
import {useContext} from 'react'
import League from '../../../../classes/custom/League'
import MemberRoster from '../../../../components/groups/roster/MemberRoster'
import DraftValueTable from '../../../../components/tables/DraftValueTable'
import {Context} from '../../../../contexts/Context'

export default function Page() {
	const [context, setContext] = useContext(Context)
	const desktopGrid = `"rosters"`

	const mobileGrid = `"rosters"`
	if (context.settings == undefined || context.playerDetails == undefined) return <Spinner/>
	return (
		<Grid
			templateAreas={[mobileGrid, desktopGrid]}
			gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
			
		>
			<GridItem area={'rosters'}>
				<HStack align={"top"} gap={4}>
                    {Array.from((context as League)?.members.values()).map((leagueMember, index) => {
						return <MemberRoster key={index} member={leagueMember}/>
					})}
                </HStack>
			</GridItem>
		</Grid>
	)
}
