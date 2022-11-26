"use client";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import GenericStatCard from "../../../../../components/cards/statcards/GenericStatCard";
import TeamCard from "../../../../../components/cards/TeamCard";
import TeamPageRadarChart from "../../../../../components/charts/team_charts/TeamPageRadarChart";
import HomeStatGroup from "../../../../../components/groups/stats/HomeStatGroup";
import TeamPlayerStatGroup from "../../../../../components/groups/stats/TeamPlayerStatGroup";
import TeamStatGroup from "../../../../../components/groups/stats/TeamStatGroup";
import { Context } from "../../../../../contexts/Context";

export default function TeamPage() {
  const [context, setContext] = useContext(Context);
  const memberId = usePathname()?.split("/").at(-1);

  return (
    <Box overflowX={"hidden"}>
      <Grid
        gap={5}
        mx={4}
        my={2}
        templateAreas={`"TeamSum TeamSum TeamSum"
                          "stats stats stats"
                          "playerStats playerStats playerStats"
                          "radar radar radar"`}
      >
        <GridItem area={"TeamSum"} mt={3}>
          {context?.members != undefined && (
            <TeamCard
              member={context?.members.get(parseInt(memberId!))}
              league={context}
              variant={""}
              size={"md"}
            />
          )}
        </GridItem>
        <GridItem area={"stats"}>
          <TeamStatGroup league={context} memberId={parseInt(memberId!)} />
        </GridItem>

        <GridItem area={"playerStats"} overflowX={"clip"}>
        <Text mb={2} textColor={"textTheme.mediumEmphasis"}>
          Player Stats
        </Text>
          <Box overflowX={"scroll"}>
            <TeamPlayerStatGroup
              league={context}
              memberId={parseInt(memberId!)}
            />
          </Box>
        </GridItem>
        <GridItem maxH={"600px"} minH="300px" area={"radar"}>
          <TeamPageRadarChart league={context} memberId={parseInt(memberId!)}/>
        </GridItem>
      </Grid>
    </Box>
  );
}
