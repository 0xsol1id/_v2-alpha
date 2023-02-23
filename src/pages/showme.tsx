import type { NextPage } from "next";
import Head from "next/head";
import { GalleryView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div className=" flex flex-col h-screen justify-between">
      <Head>
        <title>DegenBags</title>
        <meta name="description" content="Stalk every wallet in the ecosystem and bash them!" />
      </Head>
      <GalleryView />
    </div>
  );
};

export default Home;