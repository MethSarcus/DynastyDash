"use client";
import { Flex, HStack, SimpleGrid, Spacer } from "@chakra-ui/react";
import League, { StatType } from "../../../classes/custom/League";
import { OrdinalStatInfo } from "../../../classes/custom/OrdinalStatInfo";
import { ordinal_suffix_of } from "../../../utility/rosterFunctions";
import GenericStatCard from "../../cards/statcards/GenericStatCard";
import TeamPersonalStatCard from "../../cards/statcards/TeamPersonalStatCard";
import TeamStatCard from "../../cards/statcards/TeamStatCard";

interface MyProps {
  league?: League;
  memberId: number;
}

export default function TeamStatGroup(props: MyProps) {
  let member;
  let pfRank;
  let paRank;
  let powerRank;
  let ppRank;
  let opslapRank;
  let gutpointRank;

  if (props.league?.settings != undefined) {
    member = props.league.members.get(props.memberId);

    pfRank = props.league.getMemberRank(props.memberId, StatType.PF);
    paRank = props.league.getMemberRank(props.memberId, StatType.PA);
    ppRank = props.league.getMemberRank(props.memberId, StatType.PP);
    opslapRank = props.league.getMemberRank(props.memberId, StatType.OPSLAP);
    powerRank = props.league.getMemberRank(props.memberId, StatType.POWER_RANK);
    gutpointRank = props.league.getMemberRank(props.memberId, StatType.GP);
  }

  return (
    <SimpleGrid columns={3} spacing={3}>
      <TeamPersonalStatCard
        statName={"Power Rank"}
        isLoaded={props.league?.settings != undefined}
        statRank={ordinal_suffix_of(powerRank?.rank!)}
        statValue={`${(
          member?.stats.power_wins! /
          (member?.stats.power_wins! + member?.stats.power_losses!)
        ).toFixed(2)}%`}
        isGoodThing={powerRank?.aboveAverage}
      />
      <TeamPersonalStatCard
        statName={"PF"}
        isLoaded={props.league?.settings != undefined}
        statRank={ordinal_suffix_of(pfRank?.rank!)}
        statValue={member?.stats.pf.toFixed(2)}
        isGoodThing={pfRank?.aboveAverage}
      />
      <TeamPersonalStatCard
        isLoaded={props.league?.settings != undefined}
        statName={"PA"}
        statValue={member?.stats.pa?.toFixed(2)}
        statRank={ordinal_suffix_of(paRank?.rank!)}
        isGoodThing={!paRank?.aboveAverage}
      />

      <TeamPersonalStatCard
        statName={"MaxPF"}
        isLoaded={props.league?.settings != undefined}
        statRank={ordinal_suffix_of(ppRank?.rank!)}
        statValue={member?.stats.pp.toFixed(2)}
        isGoodThing={ppRank?.aboveAverage}
      />

      <TeamPersonalStatCard
        statName={"OPSLAP"}
        isLoaded={props.league?.settings != undefined}
        statRank={ordinal_suffix_of(opslapRank?.rank!)}
        statValue={member?.stats.opslap.toFixed(2)}
        isGoodThing={opslapRank?.aboveAverage}
      />
      <TeamPersonalStatCard
        statName={"Gut Points"}
        isLoaded={props.league?.settings != undefined}
        statRank={ordinal_suffix_of(gutpointRank?.rank!)}
        statValue={member?.stats.gp.toFixed(2)}
        isGoodThing={gutpointRank?.aboveAverage}
      />
    </SimpleGrid>
  );
}

function getMemberStats(stats: OrdinalStatInfo[], memberId: number) {
  let memberStat;
  stats.forEach((stat) => {
    if (stat.rosterId == memberId) {
      memberStat = stat;
    }
  });

  return memberStat;
}
