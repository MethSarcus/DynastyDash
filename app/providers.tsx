// app/providers.tsx
'use client'

import {CacheProvider} from '@chakra-ui/next-js'
import {ChakraProvider} from '@chakra-ui/react'
import {useState} from 'react'
import {LeagueContext} from '../contexts/LeagueContext'
import {SeasonContext} from '../contexts/SeasonContext'
import {StatsContext} from '../contexts/StatsContext'
import customTheme from '../theme/index'

export function Providers({children}: {children: React.ReactNode}) {
	const [context, setContext] = useState({})
	const [statsContext, setStatsContext] = useState({})
	const [seasonContext, setSeasonContext] = useState(null)
	return (
		<CacheProvider>
			<SeasonContext.Provider value={[seasonContext, setSeasonContext]}>
				<StatsContext.Provider value={[statsContext, setStatsContext]}>
					<LeagueContext.Provider value={[context, setContext]}>
						<ChakraProvider theme={customTheme}>{children}</ChakraProvider>
					</LeagueContext.Provider>
				</StatsContext.Provider>
			</SeasonContext.Provider>
		</CacheProvider>
	)
}