import type { NextPage } from "next";
import Head from "next/head";
import { GridView } from "../views";

const Grid: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Tarding Gridz</title>
        <meta name="description" content="Have a nice clean chart view" />
      </Head>
      <GridView />
    </div>
  );
};

export default Grid;
