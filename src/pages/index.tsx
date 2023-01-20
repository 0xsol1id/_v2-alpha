import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div  className=" flex flex-col h-screen justify-between">
      <Head>
        <title>SOLJUNKS</title>
        <meta
          name="description"
          content="Welcome to the JunkVerse!"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
