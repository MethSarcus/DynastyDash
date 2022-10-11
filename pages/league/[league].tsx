import {
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import Footer from "../../components/Footer";
import LeaguePageContent from "../../components/LeaguePageContent";
import Navbar from "../../components/nav/Navbar";

const LeaguePage: NextPage = () => {
  const [text, setText] = useState("");
  


  return (
    <Box w={"100%"} h="100%" bg={"surface.0"}>
      <Grid
        templateAreas={`"header header"
                  "main main"
                  "footer footer"`}
        gridTemplateRows={"50px 1fr 30px"}
        gridTemplateColumns={"150px 1fr"}
        h="100%"
        gap="1"
        color="surface.0"
        fontWeight="bold"
      >
        <GridItem area={"header"}>
          <Navbar />
        </GridItem>

        <GridItem width={"100%"} bg="surface.0" area={"main"} p={4}>
          <LeaguePageContent />
        </GridItem>

        <GridItem bg="surface.1" area={"footer"}>
          <Footer />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default LeaguePage;
