"use client";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import e from "cors";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import League from "../../../../../classes/custom/League";
import LeagueMember from "../../../../../classes/custom/LeagueMember";
import Matchup from "../../../../../classes/custom/Matchup";
import { MatchupSide } from "../../../../../classes/custom/MatchupSide";
import { Week } from "../../../../../classes/custom/Week";
import MatchupPreview from "../../../../../components/cards/MatchupPreview";
import TeamCard from "../../../../../components/cards/TeamCard";
import TeamPageRadarChart from "../../../../../components/charts/team_charts/TeamPageRadarChart";
import TeamPlayerStatGroup from "../../../../../components/groups/stats/TeamPlayerStatGroup";
import TeamStatGroup from "../../../../../components/groups/stats/TeamStatGroup";
import WeeklyTeamStatGroup from "../../../../../components/groups/stats/WeeklyTeamStatGroup";
import MemberTradeGroup from "../../../../../components/groups/transactions/MemberTradeGroup";
import { Context } from "../../../../../contexts/Context";

export default function TeamPage() {
  const [context, setContext] = useContext(Context);
  const memberId = usePathname()?.split("/").at(-1);

  let member: undefined | LeagueMember
  let matchups: Matchup[] = [];

  if (context.settings) {
    member = context.members.get(parseInt(memberId!));
    matchups = [];
    (context as League).weeks.forEach((week: Week) => {
      matchups.push(week.getMemberMatchup(member?.roster.roster_id!))
    })
  }

  return (
    <Box overflowX={"hidden"}>
      <Grid
        gap={5}
        mx={4}
        my={2}
        templateAreas={`"TeamSum TeamSum TeamSum"
                          "schedule schedule schedule"
                          "stats stats stats"
                          "playerStats playerStats playerStats"
                          "weekStats weekStats weekStats"
                          "radar radar radar"`}
      >
        <GridItem area={"TeamSum"} mt={3}>
          {context?.members != undefined && (
            <TeamCard
              member={member}
              league={context}
              variant={""}
              size={"md"}
            />
          )}
        </GridItem>
        <GridItem overflowX={"auto"} area={"schedule"}>
          <Flex>
            {matchups.map((matchup: Matchup) => {
              return <MatchupPreview key={`week_${matchup.weekNumber}_preview`} matchup={matchup} member={member}/>
            })}
          </Flex>
        </GridItem>
        <GridItem area={"stats"}>
          <TeamStatGroup league={context} memberId={parseInt(memberId!)} />
        </GridItem>

        <GridItem area={"playerStats"} overflowX={"clip"}>
          <Text mb={2} textColor={"textTheme.mediumEmphasis"}>
            Player Stats
          </Text>
          <Box overflowX={"auto"}>
            <TeamPlayerStatGroup
              league={context}
              memberId={parseInt(memberId!)}
            />
          </Box>
        </GridItem>
        <GridItem area={"weekStats"} overflowX={"clip"}>
          <Text mb={2} textColor={"textTheme.mediumEmphasis"}>
            Team Stats
          </Text>
          <Box overflowX={"auto"}>
            <WeeklyTeamStatGroup
              league={context}
              memberId={parseInt(memberId!)}
            />
          </Box>
        </GridItem>
        <GridItem maxH={"600px"} minH="300px" area={"radar"}>
          <Tabs variant="soft-rounded" colorScheme={"secondary"}>
            <TabList>
              <Tab>Pos Avg</Tab>
              <Tab>Two</Tab>
              <Tab>Trades</Tab>
            </TabList>

            <TabPanels>
              <TabPanel maxH={"600px"} minH="300px" h={"1px"}>
                <TeamPageRadarChart
                  league={context}
                  memberId={parseInt(memberId!)}
                />
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
              <TabPanel>
                <MemberTradeGroup league={context} memberId={memberId} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Box>
  );
}
