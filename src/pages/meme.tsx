import type { NextPage } from "next";
import Head from "next/head";
import { MemeView } from "../views";

const Grid: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Meme Generator</title>
        <meta name="description" content="Create a cool meme for your tweets n stuff" />
      </Head>
      <MemeView />
    </div>
  );
};

export default Grid;
