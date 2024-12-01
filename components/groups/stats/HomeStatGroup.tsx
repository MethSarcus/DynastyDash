"use client"
import { Flex, SimpleGrid, Spacer } from "@chakra-ui/react";
import League from "../../../classes/custom/League";
import { OrdinalStatInfo } from "../../../classes/custom/OrdinalStatInfo";
import GenericStatCard from "../../cards/statcards/GenericStatCard";

interface MyProps {
    league?: League

}

const HomeStatGroup = (props: MyProps) => {
    const notableMembers = props.league?.getNotableMembers?.()
    return (
        <SimpleGrid columns={2} spacing={3} height={"full"}>
        <GenericStatCard
          statName={"Best PF"}
          isLoaded = {props.league?.settings != undefined}
          statValue={notableMembers?.highestScoring.stats.pf.toFixed(2)}
          statOwner={notableMembers?.highestScoring.name}
          avatar={notableMembers?.highestScoring.getAvatar() ?? ""}
          isGoodThing={true} />



      <GenericStatCard
      isLoaded = {props.league?.settings != undefined}
        statName={"Best Manager"}
        statValue={`${notableMembers?.bestManager.stats.gp.toFixed(2)} Gut Points`}
        statOwner={notableMembers?.bestManager.name}
        avatar={notableMembers?.bestManager.getAvatar() ?? ""}
        isGoodThing={true}
      
      />

      <GenericStatCard
        statName={"Worst PF"}
        isLoaded = {props.league?.settings != undefined}
        statValue={notableMembers?.lowestScoring.stats.pf.toFixed(2)}
        statOwner={notableMembers?.lowestScoring.name}
        avatar={notableMembers?.lowestScoring.getAvatar() ?? ""}
        isGoodThing={false}
        
      />

      <GenericStatCard
        isLoaded = {props.league?.settings != undefined}
        statName={"Worst Manager"}
        statValue={`${notableMembers?.worstManager.stats.gp.toFixed(2)} Gut Points`}
        statOwner={notableMembers?.worstManager.name}
        avatar={notableMembers?.worstManager.getAvatar() ?? ""}
        isGoodThing={false}
      />
      </SimpleGrid>
    )

}

export default HomeStatGroup