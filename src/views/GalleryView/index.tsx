import Link from 'next/link';
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { resolveToWalletAddrress } from "@nfteyez/sol-rayz";
import { useWalletNfts, NftTokenAccount } from "@nfteyez/sol-rayz-react";

import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, LAMPORTS_PER_SOL, Transaction, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import { getDomainKey, getHashedName, getNameAccountKey, getTwitterRegistry, NameRegistryState, transferNameOwnership, performReverseLookup, NAME_PROGRAM_ID } from "@bonfida/spl-name-service";

import { Loader, SelectAndConnectWalletButton, MagicEdenLogo } from "components";
import { NftCard } from "./NftCard";
import { BurnButton } from "utils/BurnButton";
import { useWalletTokens } from "../../utils/useWalletTokens"
import { EmptyTokenCard } from "./EmptyTokenCard";
import { CloseButton } from "utils/CloseButton";
import { TokenCard } from "./TokenCard";
import { RevokeCard } from "./RevokeCard";
import { RevokeButton } from "utils/RevokeButton";
import { useWalletDelegated } from "utils/useWalletDelegated";
import { TokenName } from "utils/TokenName";

import { CreateTokenButton } from '../../utils/CreateTokenButton';
import { Metaplex, bundlrStorage, walletAdapterIdentity, MetaplexFileTag, toMetaplexFileFromBrowser, MetaplexFile } from "@metaplex-foundation/js";
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import Papa from "papaparse";
import useSWR from "swr";

import { MainMenu } from 'views/mainmenu';
import { Footer } from 'views/footer';
import { fetcher } from 'utils/fetcher';
import { EyeOffIcon } from '@heroicons/react/outline';

Modal.setAppElement("#__next");

const randomWallets = [
  { "Wallet": "DVmQbyfoTztR4iAdibRx2h6cb4J84EYArTZfj1ZcM8u4" },
  { "Wallet": "94qM9awvQiW35vmS5m86sHeJp1JZAQWkW7w3vYwHZeor" },
  { "Wallet": "6gjFy9Gp3mMN8uTLtfAyMmxdDfUe74YTo8cUTDXJtBUH" },
  { "Wallet": "DxKc73eJX5J1kY5ND69hnLs7ox64Q2exN3BVUWxBtBjo" },
  { "Wallet": "HLSgM1a7wSufVwe1NrPPR22ynY2aPsH8a1XQfqFsQiqY" },
  { "Wallet": "73tF8uN3BwVzUzwETv59WNAafuEBct2zTgYbYXLggQiU" },
  { "Wallet": "2tn4ToRyMT8Mnh29AHcrixZr8GmDBUjBcSqpYdEuWoAU" },
  { "Wallet": "EAHJNfFDtivTMzKMNXzwAF9RTAeTd4aEYVwLjCiQWY1E" },
  { "Wallet": "5URSakmV37mRXJ2rETDRZEyzEVBE2ebySVeLGWhUUk5h" },
  { "Wallet": "8v5DE3Yf6oaBFckTcG2iAvrmauiKXjHWqQ7HuRzj4htp" },
  { "Wallet": "FaqEroxry6uiu3C1WrxYnJybww3mkHkXuavbCpBvKLr5" },
  { "Wallet": "cXQEAwX36w4f2nuBybcNA2ntexKyJ7F3iUNLb3eX8PJ" },
  { "Wallet": "gqwBMP2shvC3n21n4PwtqQujQG9yHCx9yHAziYom4uZ" },
  { "Wallet": "2srVaGFB8htkvB5qYEam2bHArRQCwzrLAoq9zYFZDw5a" },
  { "Wallet": "BdwoSZEFqYwvWLHgwzmTg2j3cXYpiY1jpvvFYRJnsgyU" },
  { "Wallet": "9f3iyEszuvHgyDQbw2DLPvCfjma9fn2UtWGGw6BWqhpA" },
  { "Wallet": "MGRGhyEYZyVzwWTPnWR1gvP61NK9oDb2sLrs1FnVgmX" },
  { "Wallet": "9fALd2Qm4VW9B6VKqY18bx7YByzcZqwV5yVex9iHQWjP" },
  { "Wallet": "5rqeAsk5R3fmwLRR77KGQYxbdif2PFCuiM3uK2uyxvaV" },
  { "Wallet": "JDjFuj29hBWoSp9gjY8XcmwqdsisPyh2w8S5vgUaq2w9" },
  { "Wallet": "D6wh3WS66LqAa5ya4fTCvYRKaZDScC5d54H3ijbSAg3Z" },
  { "Wallet": "7ikJca2CpYn2yp7FGRS5uAWbuSATeSTjvTM37v8noTdo" },
  { "Wallet": "DmhK9gKYwgmzk6bP52kat1qgwvFo4gJ8HhEH32zVdCab" },
  { "Wallet": "5ni1d8WXwspbruncxs9iwDibWU2veXCaLdJ8ZT8WnKvt" },
  { "Wallet": "DxX6esF4DEDdJJzB54atkQaDCLjUK7Q2uTvhbKMQCvBQ" },
  { "Wallet": "CFmKZePyVHakWmkL8tDwWeSSZWoErBJtLD99o3R9zs2m" },
  { "Wallet": "6zusztonKZB4g7zNz3fX4o8Vxm6xayWTkoPp6RZKoqoe" },
  { "Wallet": "2b88gGMDV43Q1kweF489bqj4RZ4zU6yrke5PcCaZiizh" },
  { "Wallet": "Bxjx6HhSrc5DGuzccfsbLLch64oKKHLS3qy9Te5tVPcf" },
  { "Wallet": "BVqz7gyf2rMcNgqUkx8iJJDS4yHASmBwu93HAitV7ey3" },
  { "Wallet": "AYZCLBEGMjLR7yzgf4PSy5ZU5q7frPSMqgS6QU6sGyhh" },
  { "Wallet": "4M5vgNq26ova2nVbgKgHT5R1hpo3Gf9Yq19xER1yC7qQ" },
  { "Wallet": "7cDS2kK1cFkvGT5dz6CxMjhNZk8pZ7yHxrsuHjG5GoFv" },
  { "Wallet": "2uFuEpAch4fDvw9xurNXtLjJFP8rZnnE4Yimpyz88VJK" },
  { "Wallet": "9REeqvAq6aEosq3cAvwTMBgw2EJePBZ7k13PLYLbuLeW" },
  { "Wallet": "AvukdqQtiW2hm7kn64nviCySvr18soPmse5yoHiduScX" },
  { "Wallet": "7iYBkQXZZnw7Jxz5yLnhofx1oEYuZERWfnwKdrB5WydF" },
  { "Wallet": "AfRpqBSiT8BgUcEEMbPLCy9TpZSQcpkWvA4BkunHcef" },
  { "Wallet": "6rnPRTCHV5kBSG4pYrCZHviABZcBdj7Mc6uUihkPPpc2" },
  { "Wallet": "AH4zFowqsAeCrbBsw9UHWLCmUDqqEJCoYFtKjH6Y9N8k" },
  { "Wallet": "4ZAAEnQFqhsiCXzxGmHyfSc95rKSstqXLwccHT5pspvL" },
  { "Wallet": "5RRz4vYmHopaT8bKgAxchufoNUAgZu7ZjUjURk9Ecs7x" },
  { "Wallet": "DWYx3rgY7uTaE6KGyffHqh5QNa98Pt2uLbAQ9MGvewzJ" },
  { "Wallet": "ZLgNEZsXCunR6TrZCk5eeK71MmyLLi8Zy18vKgNLJUL" },
  { "Wallet": "AUNeqDuuFzPSeRx6jSn1WnvsyLwim3R2mqngsZeP8qH" },
  { "Wallet": "DzDk6VsamFnGLYJrY3vERr5pb2e1coeZXMo2UpGdo8mj" },
  { "Wallet": "8MFGGzfsWyiJwQVg9r7bZgY6e6fRkr54pPQj2Mr3voxx" },
  { "Wallet": "4cvJYgHz56Sj6GY6dQiZfsxMiaXZ1ZuXrd1jo52X41fa" },
  { "Wallet": "EomYnkxVCLotRPFMZ78xUQTfxfKncdeZUXjaLMTASwqG" },
  { "Wallet": "Fbpmm2rAn2XedZxQz8sqnSiKqZQtbdrUXcwFatSvZBju" },
  { "Wallet": "HeMDS1NhqsuVgag8QmWdY5WPZAsxb2vEvZEApAqS45Sw" },
  { "Wallet": "BY4tJVNpsWjM5AjGX3t4bKT7BSfcSmo4j2octY1dht99" },
  { "Wallet": "7woqoyhrysYZCRsHKSWmYEVtHxP3qWBjvpmUfNS71Ste" },
  { "Wallet": "3Pnr2DZxT3CLGYX6NfhFQyKeZhcJEWKAHmH4oH7cDKRw" },
  { "Wallet": "5aqZKcZfKzxPZY1w5tNajyb8WT6BjtCVfYdFyT4qjcip" },
  { "Wallet": "31mKbYwGwJJa2eNCgxqzmkDDFfDkGyUNXvPe6NnXyVN8" },
  { "Wallet": "2xE7HLyEXgt39cALfb1XiygEMB3HbNd1JfT7YhHhSRHY" },
  { "Wallet": "6berDa4fhoPWEoNP36samHZhRYnuvsNphKQ4ABS7ZTh8" },
  { "Wallet": "9er5VnavWah1c87gR3dPBzV23BtNWcoUjSHcTurD44EQ" },
  { "Wallet": "3NLc8oSSr5LiyMU24eFE3RnqzTuz6QwDvph7Ex5H1Xyd" },
  { "Wallet": "GUc4mZnLE9bHtGfkgwLN1EiiD8HZSRSnHJAiLCshZyp4" },
  { "Wallet": "6zJp799qQvc4CoKqvhqHbiULzGrmRq4JaZBs9P2wvbuJ" },
  { "Wallet": "2cCYDx5KKUw4Dtw6gButVH9NoRBoDkkvYt98Lf1vx91d" },
  { "Wallet": "DC9r4aJ6HZZ9pwCChxcFxgWExKgMuRM926D344ikVZwT" },
  { "Wallet": "Hqxph19idU17vg4YgmA7BjTpxASLA6PvRkL5ECKbV9Vb" },
  { "Wallet": "78fUNLmXqEkxnhYj7HxE4HoqQtwtFuB3hPyR5tCACNXk" },
  { "Wallet": "3NUvdKUikHKjjcjLFNjz2jpi43xKzN6GN13beUUiDV9D" },
  { "Wallet": "7m1L23Qv7ErStz3gUzDudNFcEfBpmFXwniRnw99VbGKc" },
  { "Wallet": "45nnw9MT4jGB4nSF2vtJZ2ygihy6t4LF6FZAcADp4p7o" },
  { "Wallet": "2Jd1duAzk5inm4pEbUrrnxcWTeLer8G47NVyntU8aaUP" },
  { "Wallet": "kDqcV7SN46wBz5RoXBwzgCUN2nza1zx25jTXvvzma2U" },
  { "Wallet": "2TRy4WuaWcYEpK1R6663V9REKBSPhtTihKzvBPRVm2Lq" },
  { "Wallet": "9MaDTH2fzPEZPepppnGRRQa7WaKjkgqFhiPCVABSQmoN" },
  { "Wallet": "99zhJij4b3whQbdBxArELReYfrRbTtPCBT3C2A69uE3Z" },
  { "Wallet": "BdxFF53v7ghx9ZSTJjZfd6wTJL5QrEsb5JX7E9oa8NFQ" },
  { "Wallet": "8cry6tkZ3RuKziNfEWfavREvbSCssGGdmws6iudAVR9t" },
  { "Wallet": "BFMSK8fsdG5ACHKmfpexHaM8fo4s3yYj9aGZtPdeE34u" },
  { "Wallet": "2qtNznGCREEejenVtowLFRfetEQBetWxpYatD7dGHFiK" },
  { "Wallet": "9r6Cf9tGmoM6aTkFxSTWf89iqEszMHh9uGWiuych7aie" },
  { "Wallet": "6TkSWhELzpnLoUSEbMLxgGhCZ2ca98Hyvytfnx6EDQ89" },
  { "Wallet": "8WQyTzC4T9KptRRecivtL2CD2ZBPaKVRemUwAYdjqjve" },
  { "Wallet": "WM3Bnemp4E394AueZPfBt5hRXR7ZnEpysSdbftLCuqb" },
  { "Wallet": "2ysNfvVvdtut4LpiMCELsEADiJmMiWXK51F7Ld3PYfKA" },
  { "Wallet": "7M9b69YCmnSxriX9tiLFNG3rzVRPNKTRKoEzjbnYunBW" },
  { "Wallet": "GkWdHnYio9d2uh4oK78M6eixhTJCBpMFjtixr5YnoS1q" },
  { "Wallet": "2Ki1xkN4PgjTBz42VvfnuthMG5LHV4ecMwCEiXZGmXAK" },
  { "Wallet": "dHvSL1iDsihVJf7Aq7EjpbQN5mqfwGNGRoNDb6g12W2" },
  { "Wallet": "AmX8xmiEuwAdph3ntcncw7BEj6qb6apnWVbCCzh1BQVJ" },
  { "Wallet": "AE2Z1TWYvmoorJTL63MdD8UUhJdaDVx9yF8CgHfCZk99" },
  { "Wallet": "WUaFjLHh76f1168o2esLHxTt2imqTGuUj7RZ6L5uUZ7" },
  { "Wallet": "5t7fN5YsHFAYuYUobfPqeLMxjjmwPawwDzcdLxA7ZieU" },
  { "Wallet": "2iiF1uxpDFdda3nvgoFTvf9ig94EdKE7C6ijARzgZRJ8" },
  { "Wallet": "FFRH5NUJ5RL97ndCMPnoRwCu3mL1LmMfePphZqeF1n39" },
  { "Wallet": "DCmQYoGqF52FimrBtnj7CsydBpeskrTLSHWQTPSh7VoY" },
  { "Wallet": "9i9LhzPtR6GKLN3YMAS9J1srtQ3fvwdfc5Hnf7CxcTVi" },
  { "Wallet": "4h7kkCMTjoBFAoC58Tn9xLTCETBWvdy8UBtLmQKiUFLy" },
  { "Wallet": "E3GNM8bG4CqVXCT3kzKeYubBLpKqj1hnCkVMbqfPWdMq" },
  { "Wallet": "FNjwbBHgTb76Afc41q2WqKeDn6fUNa9vgCUinkxuzNST" },
  { "Wallet": "CPwcLM5zRfG2CE81vDJ7kq5TkW8DyB3CiPuPunnndsMc" },
  { "Wallet": "JA7MgydDLk6mLVwiKtrF6EKWZPBVdMX6N2e5yCUTv55G" },
  { "Wallet": "D6bCeYL8q3piBCZG528imQ1RcwhgPFgebR8BQ5ZVvCSX" },
  { "Wallet": "7tJSHom1qcys97jTKwcytXo3rSv32UwUXDyAH8ZzSvDb" },
  { "Wallet": "FmPr12TxnrjxzFFChvaGiiPjBcu1bbE1UT6AiZfAPRNb" },
  { "Wallet": "7aQdeym9sBzGwyd2kZuP64TPmxjsKAovD2QCdkkM3kyx" },
  { "Wallet": "BEasUYLR4ZQvgMP5tBdaLZZ3GguwJDmnC7q78TbEwDY4" },
  { "Wallet": "FJTecczet73dWgn4LysYBtSDcqfvp2ExHDwMHJ6AQUkj" },
  { "Wallet": "H3YTFiYvr9heD4UF73jAeXzCxgTVaqgLmng9bhLaYTmr" },
  { "Wallet": "9JVVWFB9aJ6ekXaAyjQ3W6PXifhsrk4Bjte5YBHaRE5Y" },
  { "Wallet": "JCP4gy7rzq2xr1SWEUjz9VUtYUKtrAyFgM6NYbDzuP9p" },
  { "Wallet": "GeeCvJntNNS6wR8TR7X3qqRYLPtQSsFZDGFFqAe7X4dA" },
  { "Wallet": "4ewhoX7mZSgVEN13Tmja1Dy6zw2qy5A52HUKmNbCocL5" },
  { "Wallet": "Fmg5Jdh6GCFaHZsgGXqrEgieBX3BMYzpAWgczKi6jzCd" },
  { "Wallet": "9b1vmMHYTpAQCzdDJbrJAHDN1JMfUm8vpEHhsT4a3pMQ" },
  { "Wallet": "F1xvQU6HfjBQYuUjgCB8TmAbQCQrM8J8H7Rte1sAwiWS" },
  { "Wallet": "J66nm4GPswvq9T9eJDSdMTgdck7T8BP3zTTK49621uB" },
  { "Wallet": "EGa4JBrNTDafetNXgb5EaQGomaAgTcZJNf1F19vgDqd7" },
  { "Wallet": "BMWHPCit73cKF4biqsTpakf1ubW9g58gciZwPcRe33Ff" },
  { "Wallet": "69uq5XWdDqTqoa5VNfkSTKgnvqKBCoUAVXe9GAijnvNF" },
  { "Wallet": "4qzjkQueYSf3XJJGrWvzxJedTtVhWjZPCgeuvGfV2rG2" },
  { "Wallet": "8pPYZ9sX8cLFqxdfNHrqP3xXBBPmnYDpnoPrAA5KDV1Q" },
  { "Wallet": "CyTRnZN1KeVNy1xqKHG1ZR68eWxHhNB4AMDzmjfgtJyL" },
  { "Wallet": "CaL8jGNdUEV8TSabSFMRA3YiJ5w6JQAnBuso73UYvphg" },
  { "Wallet": "CYN3DaHmk9Xydo5W7Nheti2QL99LhfGrWQ8a8GrLQ8RJ" },
  { "Wallet": "6Ro58eK7S693wgaNdKUzptEG28DJZ2aEvpPDts7Sg4uf" },
  { "Wallet": "9944ZtJab8pjxm9dR8fsnj2nXcfrp4oH5f8PwQRriBmo" },
  { "Wallet": "AP9PomHNRfd5s59XYnWFrFd6SX9EUTL4SD5gsSmqNkJ2" },
  { "Wallet": "6YRHAC752eAzJb4sAM7QQPQbMKEqviMYugwZKeAA3mJs" },
  { "Wallet": "8hZdvwaPivGic4DYtkZxiDbTKNRetf5HoUEf1UEAn4tY" },
  { "Wallet": "5DxrzqVoTKPJXiABxRJwvsUBrWdk9XacqQdMjLw9LWv8" },
  { "Wallet": "8VKqBznMqXytooi2YXLAeNxdspAKQyxMnVcpvbTNgR71" },
  { "Wallet": "F8FjbEXtPW7S4dZk1si768fFCtRZBjPC3Wr27BLhBTQR" },
  { "Wallet": "c5XFRmb4bJkxvKcUkY2r9yLeFnrDJqyGMbFtuSV8bUe" },
  { "Wallet": "DzBhESoZpRTQF3UkzdcV85KKwNCBaWmuqx5J39hndwHk" },
  { "Wallet": "9FYd2WxoT4baMXbZjJzqquUqqhndEP37Bzc5QmLA4ywk" },
  { "Wallet": "ByFBCYEZa7xFFKyJYfaLuAksSY1i5z79Kj4Q2uTtfCKs" },
  { "Wallet": "7jUgTohSbDNgqH58m2bNksEtKqsxyhcMf5fRG58XLLmE" },
  { "Wallet": "HHmmWgMDYkXutU39hzoG7NzEhS8LKygAUewy763QE7rr" },
  { "Wallet": "6v1fL88peHJCRyfKuze8XyqP4Tqcqy4wb9Wmtg6z8im1" },
  { "Wallet": "5RMmnGh5KBSVNxgUpbpPhYAuKj2AEGe5X3SbiLy8f4w3" },
  { "Wallet": "D3oREopGkE3fa3H2FT6AW9gh3BgoqDGDnZonZdztmg4U" },
  { "Wallet": "2KcVHkLHyGjLFUcTw2kYnEc2WNqEubigAmjCV7JJi7Au" },
  { "Wallet": "Bdn9HrKu7kubPAfuNZm4QBxTxwXF1r1y8NfGQ9TxEC9u" },
  { "Wallet": "J3gAmJiP48z3uczX8ku6uu7gzUQxzV2FdwpQj7JxdC4G" },
  { "Wallet": "H7G6jdWDXhGfyQanrc9gCRZwHk6j1WegEP6UY9pfNjqw" },
  { "Wallet": "6wfnCWorHKjWuSNFCM3oxxmXYCb9kEs7uBo97hcBjKt8" },
  { "Wallet": "ErNoHvtTyPaWcMc8PdXbYcCTN8oFqFWj3BXVXJNLCjLo" },
  { "Wallet": "36MdZuBeUMLHpyNuoGgGzyrEcvSUHv4fVcWx7j8TRixL" },
  { "Wallet": "A4jTwCn4zmUYmSo88MgiiCQRaCtuSbAMdR84ZPvay7Bw" },
  { "Wallet": "4ZVYJvxt9b6fpRTpMTHQnE3jHWEmLx8wjLYYMBKAgNc9" },
  { "Wallet": "88btH24DiLUyUvBzZJcapKBAEYLsPXzuQM6ni523RF8S" },
  { "Wallet": "3HXUAb7FJ5xk3YEV86SdXAuNs3utwpuKzpj3coEJC9te" },
  { "Wallet": "2nYaLvLTRbiGtdQjaFJZdumA36kqJRPES151qz8xTZJg" }
]

var isConnectedWallet = false
var walletPublicKey = randomWallets[randomInt(0, randomWallets.length)].Wallet //start with a random wallet from the list

const NFTstoBurn: string[] = []
const NFTstoSend: string[] = []
const TokenstoRevoke: string[] = []
const AccountstoClose: string[] = []

function convertTimestamp(timestamp: any) {
  var d = new Date(timestamp * 1000),
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),
    dd = ('0' + d.getDate()).slice(-2),
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),
    sec = ('0' + d.getSeconds()).slice(-2),
    ampm = 'AM',
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = 'PM';
  } else if (hh === 12) {
    h = 12;
    ampm = 'PM';
  } else if (hh == 0) {
    h = 12;
  }

  time = dd + '.' + mm + '.' + yyyy + ' / ' + h + ':' + min + ':' + sec + ' ' + ampm;
  return time;
}

function randomInt(low: number, high: number) {
  return Math.floor(Math.random() * (high - low) + low)
}



export const GalleryView: FC = ({ }) => {
  const queryParameters = new URLSearchParams(window.location.search)
  const walletParam: any = queryParameters.get("wallet")
  const collectionParam: any = queryParameters.get("collection")

  type CollectionProps = {
    ua: string
    uri: string
    mint: string
    onTokenDetailsFetched?: (props: any) => unknown;
  };

  type CollectionsListProps = {
    collections: string[];
    collectionsUri2: string[];
    collectionsMint: string[];
    error?: Error;
    setRefresh: Dispatch<SetStateAction<boolean>>
  };

  const CollectionsList = ({ collections, collectionsUri2, collectionsMint, error, setRefresh }: CollectionsListProps) => {
    if (error) {
      return null;
    }

    if (!collectionsUri2?.length) {
      return (
        <div className="font-pixel text-center text-2xl pt-16">
          No NFTs found in this wallet
        </div>
      );
    }

    return (
      <div>
        <div className="rounded">
          <div className='flex justify-center bg-gray-900 p-2'>
            <h1 className='font-pixel ml-5 underline'>Collection Overview</h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-start gap-1 p-2">

            {collectionsUri2?.map((tmp, index) => (
              <CollectionCard ua={collections[index]} uri={tmp} mint={collectionsMint[index]} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CollectionCard: FC<CollectionProps> = ({
    ua,
    uri,
    mint,
    onTokenDetailsFetched = () => { },
  }) => {
    const [fallbackImage, setFallbackImage] = useState(false);
    const { data, error } = useSWR(
      // uri || url ? getMetaUrl(details) : null,
      uri,
      fetcher,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );

    useEffect(() => {
      if (!error && !!data) {
        onTokenDetailsFetched(data);
      }
    }, [data, error]);

    const onImageError = () => setFallbackImage(true);
    const [shortUpdateAuthority, setShortUpdateAuthority] = useState("")
    const { image, external_url } = data ?? {};

    const [collectionName, setcollectionName] = useState("")
    const handleChangecollectionName = (val: string) => {
      setcollectionName(val)
    }
    async function GetCollectionName(url: string) {
      try {
        const response = await fetch(url)
        const jsonData = await response.json()
        if (jsonData.collection)
          handleChangecollectionName(jsonData.collection)
        else
          setShortUpdateAuthority(ua.slice(0, 3) + "..." + ua.slice(-3))
      } catch (e) {
        console.log(e)
      }
    }

    const test = () => {
      setSearch2(ua)
    }

    useEffect(() => {
      GetCollectionName(`https://fudility.xyz:3420/collectionname/${mint}`)
    }, []);

    return (
      <div className="rounded bg-gray-900 p-1 border-2 border-gray-700 text-center">
        <figure className="animation-pulse-color mb-1">
          {!fallbackImage && !error ? (
            <div>
              <button onClick={test} className="btn btn-ghost h-44 p-1 tooltip tooltip-top font-pixel" data-tip="Show details">
                <img
                  src={image}
                  onError={onImageError}
                  className="bg-gray-800 object-cover rounded h-40"
                />
              </button>
            </div>
          ) : (
            // Fallback when preview isn't available. This could be broken image, video, or audio
            <div>
              <div className="w-auto flex items-center justify-center">
                <button onClick={test} className="btn btn-ghost h-44 w-40 p-0 tooltip tooltip-top font-pixel" data-tip="Show details">
                  <img
                    src={image}
                    onError={onImageError}
                    className="object-cover rounded text-center"
                  />
                  <EyeOffIcon className="h-38 w-38 text-white" />
                </button>
              </div>
            </div>
          )}
        </figure>
        <div className=' h-14'>
          <h2 className="font-pixel text-sm mb-2">
            {collectionName.replace(/_/g, " ").toUpperCase()}
            {shortUpdateAuthority}

          </h2>
          <div className="flex justify-center font-pixel text-xs">
            {/*shortenUA*/}
            {external_url &&
              <a target="_blank" className="btn btn-ghost btn-xs tooltip tooltip-top font-pixel" data-tip="Show Website" href={external_url}>🔗</a>
            }
            {collectionName &&
              <a target="_blank" className="btn btn-ghost btn-xs tooltip tooltip-top font-pixel" data-tip="Show on ME" href={`https://magiceden.io/marketplace/${collectionName}`}><MagicEdenLogo /></a>
            }
          </div>
        </div>
      </div>
    );
  };

  const getQuery = () => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  };

  const getQueryStringVal = (key: string): string | null => {
    return getQuery().get(key);
  };

  const useQueryParam = (
    key: string,
    defaultVal: string
  ): [string, (val: string) => void] => {
    const [query, setQuery] = useState(getQueryStringVal(key) || defaultVal);

    const updateUrl = (newVal: string) => {
      setQuery(newVal);

      const query = getQuery();

      if (newVal.trim() !== '') {
        query.set(key, newVal);
      } else {
        query.delete(key);
      }

      // This check is necessary if using the hook with Gatsby
      if (typeof window !== 'undefined') {
        const { protocol, pathname, host } = window.location;
        const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    };

    return [query, updateUrl];
  };

  const [search, setSearch] = useQueryParam('wallet', '');
  const [search2, setSearch2] = useQueryParam('collection', '');

  type NftListProps = {
    nfts: NftTokenAccount[];
    updateAuthority: string
    error?: Error;
    setRefresh: Dispatch<SetStateAction<boolean>>
  };

  const NftList = ({ nfts, updateAuthority, error, setRefresh }: NftListProps) => {
    if (error) {
      return null;
    }

    if (!nfts?.length) {
      return (
        <div className="font-pixel text-center text-2xl pt-16">
          No NFTs found in this wallet
        </div>
      );
    }

    const back = () => {
      setSearch2('');
    }

    return (
      <div className="rounded">
        <div className='flex justify-between bg-gray-900 p-2'>
          <h1 className='font-pixel ml-5'>Collection: {updateAuthority}</h1>
          <button onClick={back} className="btn btn-primary btn-sm font-pixel mr-2">back to overview</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 items-start gap-1 p-2">
          {nfts?.map((nft: any, index) => (
            nft.updateAuthority == updateAuthority ? (
              <NftCard isConnectedWallet={isConnectedWallet} key={index} details={nft} onSelect={() => { }} toBurn={NFTstoBurn} toSend={NFTstoSend} />
            ) : (null)
          ))}
        </div>
      </div>
    );
  };

  const [openTab, setOpenTab] = useState(1);
  const { connection } = useConnection();
  const [walletToParsePublicKey, setWalletToParsePublicKey] =
    useState<string>(walletParam == "" ? walletPublicKey : walletParam);

  const { publicKey } = useWallet();
  const wallet = useWallet();

  const [refresh, setRefresh] = useState(false)

  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress: walletToParsePublicKey,
    connection,
  });

  const { tokens } = useWalletTokens({
    publicAddress: walletToParsePublicKey,
    connection,
    type: 'spl'
  });

  const { delegatedTokens } = useWalletDelegated({
    publicAddress: walletToParsePublicKey,
    connection,
  });

  let errorMessage
  if (error) {
    errorMessage = error.message
  }

  const [history, setHistory] = useState([])
  const handleChangeHistory = (val: []) => {
    setHistory(val)
  }
  async function GetHistory(url: string) {
    try {
      const response = await fetch(url)
      const jsonData = await response.json()
      handleChangeHistory(jsonData)
    } catch (e) {
      console.log(e)
    }
  }

  var junksCount: number = 0
  var smbCount: number = 0
  var facesCount: number = 0
  var gen2Count: number = 0
  var rektiezCount: number = 0
  var points = 0

  /*const [collections, setCollections] = useState<string[]>([])  //PICS / NAME ???
  const handleChangeCollections = (val: string) => {
    const tmp = collections
    tmp.push(val)
    setCollections(tmp)
  }
  

  const [collectionsUri, setCollectionsUri] = useState<string[]>([])  //PICS / NAME ???
  const handleChangeCollectionsUri = (val: string) => {
    const tmp = collectionsUri
    tmp.push(val)
    setCollectionsUri(tmp)
  }

  const [collectionsMint, setCollectionsMint] = useState<string[]>([])  //PICS / NAME ???
  const handleChangeCollectionsMint = (val: string) => {
    const tmp = collectionsMint
    tmp.push(val)
    setCollectionsMint(tmp)
  }

  const resetCollections = (val: any) => {
    setCollectionsUri(val)
    setCollectionsMint(val)
    setCollections(val)
  }*/

  let collections: any[] = []
  let collectionsUri: any[] = []
  let collectionsMint: any[] = []

  nfts.forEach((element: any) => {
    if (element.updateAuthority == "EshFf23GMA55yKPCQm76KrhSyfp7RuAsjDDpHE7wTeDM") {
      junksCount++
    }
    if (element.updateAuthority == "FEtQrCx12b9ebbTZq8Un11RNJUYxiDQF4zQCJctzRYH6") {
      smbCount++
    }
    if (element.updateAuthority == "8DQoDXZvWrUHjp4DbjFTW8AhXsdTBgYVicwieJ6FzKVe") {
      facesCount++
    }
    if (element.updateAuthority == "5XZrWyd6hmMcUScak7S2ef92rQW4hftkJDMDg6uYHssp") {
      gen2Count++
    }
    if (element.updateAuthority == "PnsQRTnqXBPshHpPj2kHWZwyrWABa5GTrPA6MDkwV4p") {
      rektiezCount++
    }
    if (!collections.includes(element.updateAuthority)) {
      collections.push(element.updateAuthority)
      collectionsUri.push(element.data.uri)
      collectionsMint.push(element.mint)
    }
  });

  points = (junksCount * 5) + (smbCount * 25) + (facesCount * 100) + (gen2Count * 10) + (rektiezCount * 50)
  if (error) {
    return null;
  }

  const [value, setValue] = useState(walletToParsePublicKey);

  const onChange = async () => {
    setOpenTab(1)
    const val = value
    const address = await resolveToWalletAddrress({ text: val.trim() })
    isConnectedWallet = false
    setWalletToParsePublicKey(address)
    walletPublicKey = address
    //GetHistory(`https://fudility.xyz:3420/history/${address}`)
  };

  const onChangeME = async (address: any) => {
    setOpenTab(1)
    isConnectedWallet = false
    setWalletToParsePublicKey(address)
    walletPublicKey = address
    setValue(address)
    //GetHistory(`https://fudility.xyz:3420/history/${address}`)
  };

  const randomWallet = () => {
    setOpenTab(1)
    var wallet = randomWallets[randomInt(0, randomWallets.length)]
    isConnectedWallet = false
    setWalletToParsePublicKey(wallet.Wallet)
    walletPublicKey = wallet.Wallet
    setValue(wallet.Wallet)
    //GetHistory(`https://fudility.xyz:3420/history/${wallet.Wallet}`)
  };

  const onUseWalletClick = () => {
    if (publicKey) {
      setOpenTab(1)
      isConnectedWallet = true
      setWalletToParsePublicKey(publicKey?.toBase58())
      walletPublicKey = publicKey?.toBase58()
      setValue(publicKey?.toBase58())
      //GetHistory(`https://fudility.xyz:3420/history/${publicKey?.toBase58()}`)
    }
  };

  const refreshWallet = () => {
    var wallet = value
    var wallet2 = randomWallets[randomInt(0, randomWallets.length)]

    setValue(wallet2.Wallet)
    walletPublicKey = wallet2.Wallet

    setTimeout(function () {
      setWalletToParsePublicKey(wallet)
      walletPublicKey = wallet
      setValue(wallet)
      //GetHistory(`https://fudility.xyz:3420/history/${wallet}`)
    }, 200);
  };

  {/*const getTransactions = async (address: PublicKeyInitData, numTx: any) => {
    const pubKey = new PublicKey(address);
    let transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx });

    let signatureList = transactionList.map((transaction: { signature: any }) => transaction.signature);
    let transactionDetails = await connection.getParsedTransactions(signatureList, { maxSupportedTransactionVersion: 0 });
    transactionList.forEach((transaction: any, i: number) => {
      console.log(transaction)
      const date = new Date(transaction.blockTime * 1000);
      const transactionInstructions = transactionDetails[i]?.transaction.message.instructions;
      console.log(`Transaction No: ${i + 1}`);
      console.log(`Signature: ${transaction.signature}`);
      console.log(`Fee: ${(transactionDetails[i]?.meta?.fee)}`);
      console.log(`Time: ${date}`);
      console.log(`Status: ${transaction.confirmationStatus}`);
      transactionInstructions?.forEach((instruction, n) => {
        console.log(`---Instructions ${n + 1}: ${instruction.programId.toString()}`);
      })
      console.log(("-").repeat(20));
    })
  }*/}

  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const [isBattleOpen, setIsBattleOpen] = useState(false);
  function toggleBattleModal() {
    setIsBattleOpen(!isBattleOpen);
  }

  const [isPonziOpen, setIsPonziOpen] = useState(false);
  function togglePonziModal() {
    setIsPonziOpen(!isPonziOpen);
  }

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  function toggleUploadModal() {
    setIsUploadOpen(!isUploadOpen);
  }

  //Message related
  const bg1 = './message_bg1.png';
  const bg2 = './message_bg2.png';
  const bg3 = './message_bg3.png';
  const bgs = { bg1, bg2, bg3 }
  const [selectedBG, setSelectedBG] = useState(bgs.bg1)

  const [username, setUsername] = useState('')
  // const [NFTImage, setNFTImage] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(bundlrStorage());

  //Generate the design of the NFT message
  const generateImg = async () => {
    const canvas = await html2canvas(document.getElementById('canvas')!, {
      scale: 2
    });
    const img = canvas.toDataURL('image/png');
    return img;
  };

  const HandleUsernameChange = async (e: any) => {
    setUsername(e.target.value);
    setIsGenerated(false);
    setErrorMsg('');
    setIsSent(false);
  };

  const CreateAndSendNFT = async () => {
    try {
      setSending(true)
      const image = await generateImg();
      const _name = "SolJunksNFT BashMail"
      const description = `Send to you via SOLJUNKS.IO's WalletStalker by ${walletToParsePublicKey}`;
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: _name,
        description: description,
        image: image,
        external_url: "https://soljunks.io/"
      });
      if (uri) {
        const { nft } = await metaplex.nfts().create({
          name: _name,
          uri: uri,
          sellerFeeBasisPoints: 0,
          tokenOwner: new PublicKey(walletToParsePublicKey),
        });

        if (nft) {
          setSending(false);
          setIsSent(true);
          setIsGenerated(false);
        };
      };
    }

    catch (errorMsg) {
      setSending(false);
      const err = (errorMsg as any)?.message;
      if (err.includes('could not find mint')) {
        setErrorMsg('The mint address seems to be wrong, verify it');
      }
      else if (err.includes('Invalid name account provided')) {
        setErrorMsg('This solana domain name does not exist')
      }
    }
  };

  const [fileUploadIsSelected, setFileUploadIsSelected] = useState(false)
  const [fileUpload, setUploadFile] = useState<Readonly<{
    buffer: Buffer;
    fileName: string;
    displayName: string;
    uniqueName: string;
    contentType: string | null;
    extension: string | null;
    tags: MetaplexFileTag[];
  }>>()
  const [fileUploadName, setUploadFileName] = useState('');
  const [uri, setUri] = useState('');
  const [uploadingArweave, setArweaveUploading] = useState(false);
  const [uploadCost, setUploadCost] = useState<number>();
  const [errorUpload, setErrorUpload] = useState('');

  const metaplexUpload = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(bundlrStorage());

  let _fileUpload: MetaplexFile;

  const handleUploadFileChange = async (event: any) => {
    setFileUploadIsSelected(true);
    setUri('');
    setErrorUpload('');
    setArweaveUploading(false);
    const browserFile = event.target.files[0];
    _fileUpload = await toMetaplexFileFromBrowser(browserFile);
    setUploadFile(_fileUpload);
    setUploadFileName(_fileUpload.displayName);
    const getUploadCost = await (await metaplexUpload.storage().getUploadPriceForFile(_fileUpload)).basisPoints.toString(10)
    const cost = parseInt(getUploadCost, 10)
    setUploadCost(cost / LAMPORTS_PER_SOL)
  }

  const UploadFile = async () => {
    try {
      setErrorUpload('');
      setArweaveUploading(true);
      if (fileUpload) {
        const uri = await metaplexUpload.storage().upload(fileUpload);
        console.log(uri);
        if (uri) {
          setUri(uri);
          setFileUploadIsSelected(false);
          setArweaveUploading(false);
        }
      }
    }
    catch (error) {
      const err = (error as any)?.message;
      setErrorUpload(err);
      setArweaveUploading(false);
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(value);
  }

  useEffect(() => {
    GetHistory(`https://fudility.xyz:3420/history/${walletToParsePublicKey}`)
    //getTransactions(walletPublicKey, 5)
    setSearch(walletToParsePublicKey)
    setSearch2("")
  }, [walletToParsePublicKey])

  return (
    <div className="">
      <div className="">
        <div className="navbar sticky top-0 z-50 text-neutral-content flex justify-between bg-gray-900">
          <div>
            <MainMenu />
          </div>
          <div>
            <div className="tooltip tooltip-left font-pixel" data-tip="Show a random wallet">
              <button onClick={randomWallet} className="btn btn-primary text-2xl">
                🤷‍♂️
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter Wallet Address"
              className="font-pixel w-96 input input-bordered mr-2 ml-2 bg-base-200"
              value={value}
              onChange={(e) => { setValue(e.target.value) }}
            />
            <div className="tooltip tooltip-left" data-tip="Load wallet">
              <button onClick={onChange} className="btn btn-primary text-xl">
                👁️
              </button>
            </div>
            <div className="tooltip tooltip-left" data-tip="Copy wallet">
              <button onClick={copy} className="btn btn-primary text-xl ml-2 mr-2">
                💾
              </button>
            </div>
            {/*<div className="tooltip tooltip-left" data-tip="Refresh Wallet">
              <button onClick={refreshWallet} className="btn btn-primary text-lg">
                🗘
              </button>
            </div>*/}
          </div>
          {publicKey ? (
            <div>
              <div className="font-pixel tooltip tooltip-left" data-tip="Show Your wallet">
                <SelectAndConnectWalletButton
                  onUseWalletClick={onUseWalletClick}
                />
              </div>
              <WalletMultiButton />
            </div>
          ) : (
            <WalletMultiButton />
          )}
        </div>
        <div className="">
          <div className="tab-content" id="tabs-tabContent">
            {error && errorMessage != "Invalid address: " ? (
              <div>
                <h1>Error Occures</h1>
                {(error as any)?.message}
              </div>
            ) : null}
            {!error && isLoading &&
              <div className="grid grid-flow-row auto-rows-max content-center h-[55.7rem]">
                <Loader />
              </div>
            }
            {!error && !isLoading && !refresh &&
              <div className="grid grid-cols-9">
                <ul className="space-y-2 bg-gray-900 h-[55.7rem] block p-2">
                  <li className="">
                    <div className="">
                      {/*<DomainName />*/}
                      <Balance />
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">Total SPLs:&nbsp;</p><p className="font-pixel">{tokens.length}</p></div>
                      <br />
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">Total NFTs:&nbsp;</p><p className="font-pixel">{nfts.length}</p></div>
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">Collections:&nbsp;</p><p className="font-pixel">{collections.length}</p></div>
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">NFT Value:&nbsp;</p><p className="font-pixel">tba</p></div>
                      <br />
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">SolJunks GEN1:&nbsp;</p><p className="font-pixel">{junksCount}</p></div>
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">$olana Money Bu$ine$$:&nbsp;</p><p className="font-pixel">{smbCount}</p></div>
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">Faces of $MB:&nbsp;</p><p className="font-pixel">{facesCount}</p></div>
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">SolJunks GEN2:&nbsp;</p><p className="font-pixel">{gen2Count}</p></div>
                      <div className="flex justify-between text-sm ml-2"><p className="font-pixel">Lil Rektiez:&nbsp;</p><p className="font-pixel">{rektiezCount}</p></div>
                      <br />
                      <div className="flex justify-between text-sm ml-2 uppercase"><p className="font-pixel">Wallet Score:&nbsp;</p><p className="font-pixel">{points}</p></div>
                      <br />
                    </div>
                  </li>
                  <li>
                  </li>
                  <li>
                    <a href="#ownedNFTs"
                      onClick={() => setOpenTab(1)}
                      className={` ${openTab === 1 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm w-full rounded`}
                    >SHOW NFTs</a>
                  </li>
                  <li>
                    <a href="#MEhistory"
                      onClick={() => setOpenTab(2)}
                      className={` ${openTab === 2 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm w-full rounded`}
                    >Show SPL-Tokens</a>
                  </li>
                  <li>
                    <a href="#MEhistory"
                      onClick={() => setOpenTab(4)}
                      className={` ${openTab === 4 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm w-full rounded`}
                    >Show <MagicEdenLogo /> History</a>
                  </li>
                  <li>
                    <a href="#closeAcc"
                      onClick={() => setOpenTab(5)}
                      className={` ${openTab === 5 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm w-full rounded`}
                    >SHow Empty Accounts</a>
                  </li>
                  <li>
                    <a href="#revokeAuth"
                      onClick={() => setOpenTab(6)}
                      className={` ${openTab === 6 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm w-full rounded`}
                    >Show Delegated Auth</a>
                  </li>
                  <div className="w-full">
                    {isConnectedWallet ? (
                      <div>
                        {openTab === 1 || openTab === 2 ? (
                          <BurnButton toBurn={NFTstoBurn} connection={connection} publicKey={publicKey} wallet={wallet} setRefresh={setRefresh} />) : (
                          <div />
                        )}
                        {openTab === 5 ? (
                          <CloseButton toClose={AccountstoClose} connection={connection} publicKey={publicKey} wallet={wallet} setRefresh={setRefresh} />) : (
                          <div />
                        )}
                        {openTab === 6 ? (
                          <RevokeButton toRevoke={TokenstoRevoke} connection={connection} publicKey={publicKey} wallet={wallet} setRefresh={setRefresh} />) : (
                          <div />
                        )}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                  {publicKey ? (
                    <div className='mt-8'>
                      {!isConnectedWallet &&
                        <div className='mt-8'>
                          <li>
                            <button onClick={toggleModal} className="font-pixel btn w-full rounded mb-2 bg-gray-700">
                              SEND A MAIL TO THIS WALLET
                            </button>
                          </li>
                          <li>
                            <button onClick={toggleBattleModal} className="font-pixel btn w-full rounded mb-2 bg-gray-700">
                              BATTLE THIS WALLET
                            </button>
                          </li>
                        </div>
                      }
                      <div>
                        <li>
                          <a href="#createSPLtoken"
                            onClick={() => setOpenTab(7)}
                            className={` ${openTab === 7 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn w-full rounded mb-2`}
                          >Create ponzi token</a>
                        </li>
                        <li>
                          <button onClick={toggleUploadModal} className="font-pixel btn w-full rounded mb-2 bg-gray-700">
                            upload file to Arweave
                          </button>
                        </li>
                        <li>
                          <a href="#updateNFT"
                            onClick={() => setOpenTab(12)}
                            className={` ${openTab === 12 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn w-full rounded mb-2`}
                          >Multi Send Token</a>
                        </li>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className='font-pixel p-4 text-center bg-primary rounded mt-10'>Connect wallet to access tools</h1>
                    </div>
                  )}
                </ul>
                <div className=" col-span-8">
                  <div className={openTab === 1 ? "block" : "hidden"}>
                    <div className="overflow-auto h-[55.7rem] scrollbar">
                      {search2 != '' &&
                        <NftList nfts={nfts} error={error} setRefresh={setRefresh} updateAuthority={search2} />
                      }
                      {search2 == '' &&
                        <CollectionsList collections={collections} collectionsUri2={collectionsUri} collectionsMint={collectionsMint} error={error} setRefresh={setRefresh} />
                      }
                    </div>
                  </div>
                  <div className={openTab === 2 ? "block" : "hidden"}>
                    <div className="">
                      {error && errorMessage != "Invalid address: " ? (
                        <div>
                          <h1 className='font-pixel'>Error Occures</h1>
                          {(error as any)?.message}
                        </div>
                      ) : null}

                      {!error && isLoading &&
                        <div>
                          <Loader />
                        </div>
                      }
                      {!error && !isLoading && !refresh &&
                        <div className="p-1 h-[55.7rem] mr-1 overflow-auto min-w-full">
                          <TokenList tokens={tokens} error={error} setRefresh={setRefresh} />
                        </div>
                      }
                    </div>
                  </div>
                  <div className={openTab === 3 ? "block" : "hidden"}>
                    <div className="p-1 rounded h-[55.7rem] mr-1 overflow-auto min-w-full scrollbar">
                    </div>
                  </div>
                  <div className={openTab === 4 ? "block" : "hidden"}>
                    <div className="rounded h-[55.7rem] mr-2 overflow-auto min-w-full p-2 scrollbar">
                      {history?.map((num: any, index) => (
                        <div key={index}>
                          {num.type != "bid" ? (
                            <div className="grid grid-cols-4 bg-gray-900 text-sm justify-between h-14 text-center rounded-lg mb-1 border-2 border-gray-800">
                              <div className='my-auto p-1'>
                                {/*<TokenIconME mint={num.tokenMint} />*/}
                                <button className="flex bg-gray-900 justify-between hover:bg-gray-700 rounded-lg ml-1 font-pixel tooltip tooltip-right w-48" data-tip="Show on ME">
                                  <a href={`https://magiceden.io/item-details/${num.tokenMint}`} target="_blank">
                                    {/*<TokenName mint={num.tokenMint} />*/}
                                    {num.tokenMint}
                                  </a>
                                </button>
                                {/*<p className='flex font-pixel text-xs'>{num.collection}</p>*/}
                              </div>
                              {num.type == "buyNow" && num.buyer == walletToParsePublicKey ? (
                                <p className="font-pixel text-center rounded bg-green-600 w-48 my-auto">BUY for {num.price.toFixed(2)}◎</p>
                              ) : (
                                num.type == "list" ? (
                                  <p className="font-pixel text-center rounded bg-yellow-400 w-48 my-auto">LIST for {num.price.toFixed(2)}◎</p>
                                ) : (
                                  num.type == "delist" ? (
                                    <p className="font-pixel text-center rounded bg-gray-500 w-48 my-auto">DELIST for {num.price.toFixed(2)}◎</p>
                                  ) : (
                                    num.type == "buyNow" && num.seller == walletToParsePublicKey ? (
                                      <p className="font-pixel text-center rounded bg-red-600 w-48  my-auto">SELL for {num.price.toFixed(2)}◎</p>
                                    ) : (
                                      num.type == "cancelBid" ? (
                                        <p className="font-pixel text-center rounded bg-blue-600 w-48 my-auto">CANCEL for {num.price.toFixed(2)}◎</p>
                                      ) : (
                                        <p className="rounded w-40h-8 my-auto">{num.type}</p>
                                      )
                                    )
                                  )
                                )
                              )}
                              <div className='flex justify-between my-auto'>
                                <p className="font-pixel text-xs my-auto ml-2">{convertTimestamp(num.blockTime)}</p>
                              </div>
                              <div className='flex justify-between'>
                                {num.type == "buyNow" && num.seller == walletToParsePublicKey ? (
                                  <p className="font-pixel flex uppercase text-xs rounded my-auto"><p className='mr-2'>Bought by: </p>
                                    <button onClick={() => onChangeME(num.buyer)} className="btn bg-gray-700 btn-sm text-xs">
                                      {num.buyer}
                                    </button>
                                  </p>
                                ) : (
                                  null
                                )}
                                {num.type == "buyNow" && num.buyer == walletToParsePublicKey ? (
                                  <p className="font-pixel flex uppercase text-xs rounded my-auto"><p className='mr-2'>Bought by: </p>
                                    <button onClick={() => onChangeME(num.seller)} className="btn bg-gray-700 btn-sm text-xs">
                                      {num.seller}
                                    </button>
                                  </p>
                                ) : (
                                  null
                                )}
                              </div>

                            </div>
                          ) : (null)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={openTab === 5 ? "block" : "hidden"}>
                    <div className="overflow-auto h-[55.7rem] scrollbar">
                      {isConnectedWallet &&
                        <EmptyAccounts />
                      }
                    </div>
                  </div>
                  <div className={openTab === 6 ? "block" : "hidden"}>
                    <div className="mb-auto my-10">
                      {error && errorMessage != "Invalid address: " ? (
                        <div>
                          <h1>Error Occures</h1>
                          {(error as any)?.message}
                        </div>
                      ) : null}

                      {!error && isLoading &&
                        <div>
                          <Loader />
                        </div>
                      }
                      {!error && !isLoading && !refresh &&
                        <div className="p-1 h-[55.7rem] mr-1 overflow-auto min-w-full scrollbar">
                          <RevokeList tokens={delegatedTokens} error={error} setRefresh={setRefresh} />
                        </div>
                      }
                    </div>
                  </div>
                  <div className={openTab === 7 ? "block" : "hidden"}>
                    {isConnectedWallet &&
                      <SPLTokenView />
                    }
                  </div>
                  <div className={openTab === 8 ? "block" : "hidden"}>

                  </div>
                  <div className={openTab === 9 ? "block" : "hidden"}>

                  </div>
                  <div className={openTab === 10 ? "block" : "hidden"}>

                  </div>
                  <div className={openTab === 11 ? "block" : "hidden"}>
                    eeeeeeearn
                  </div>
                  <div className={openTab === 12 ? "block" : "hidden"}>
                    <MultiSenderView />
                  </div>
                </div >
              </div>
            }
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(45, 45, 65, 1)'
            },

          }}
          ariaHideApp={false}
          contentLabel="BASHMAIL SENDER"
        >
          <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleModal}>X</button>
          <div className="text-center">
            <h1 className="font-pixel text-2xl">Send a NFT Message to:</h1>
            <h1 className="font-pixel text-2xl">{walletToParsePublicKey}</h1>
            <div>
              <form className="mt-[5%] mb-[3%]">
                <input className="font-pixel mb-[1%] text-black pl-1 border-1 border-black sm:w-[520px] w-[100%] text-center h-12"
                  type="text"
                  required
                  placeholder="Message"
                  maxLength={300}
                  onChange={HandleUsernameChange}
                />
                <div className='font-pixel'>{username.length}/300</div>
              </form>
              <div className="flex justify-center mt-4">
                <div className="sm:w-[350px] sm:h-[350px] w-[150px] h-[150px] container" id="canvas">
                  <div className="relative">
                    <img src={selectedBG} alt='' /><br />
                    <h2 className="font-pixel absolute text-sm text-gray-900 top-4 left-1/2 -translate-x-1/2 break-words w-64"><strong>{username}</strong></h2>
                  </div>
                </div>
              </div>

              <div className='mt-8'>
                <button className='font-pixel btn btn-sm btn-secondary mr-2' onClick={() => setSelectedBG(bgs.bg1)}>BG 1</button>
                <button className='font-pixel btn btn-sm btn-secondary mr-2' onClick={() => setSelectedBG(bgs.bg2)}>BG 2</button>
                <button className='font-pixel btn btn-sm btn-secondary' onClick={() => setSelectedBG(bgs.bg3)}>BG 3</button>
              </div>

              {sending == false &&
                <button className="font-pixel mt-4 btn btn-primary uppercase"
                  onClick={CreateAndSendNFT}>Send NFT Message
                </button>}

              {sending == true &&
                <button className="mt-4 btn btn-primary uppercase">
                  <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>Sending </button>}

              {errorMsg != '' && <div className="mt-[1%]">❌ Ohoh.. An error occurs: {errorMsg}</div>}


              {isSent &&
                <div className="font-pixel text-xl mt-[5%]">
                  ✅ Successfuly sent!
                </div>}

            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isBattleOpen}
          onRequestClose={toggleBattleModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(45, 45, 65, 1)'
            },

          }}
          ariaHideApp={false}
          contentLabel="BATTLE WINDOW"
        >

          <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleBattleModal}>X</button>
          <div className="text-center">
            <h1 className="font-pixel text-2xl">UNDER CONSTRUCTION</h1>

          </div>
        </Modal>

        <Modal
          isOpen={isUploadOpen}
          onRequestClose={toggleUploadModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(45, 45, 65, 1)'
            },

          }}
          ariaHideApp={false}
          contentLabel="BATTLE WINDOW"
        >

          <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleUploadModal}>X</button>
          <div className="text-center">
            <h1 className="mb-5 text-5xl font-pixel">
              Upload File To Arweave
            </h1>
            <div>
              <form className="mt-[20%] mb-[3%]">
                <label htmlFor="fileUpload" className="btn btn-primary text-white font-spixel text-xl hover:cursor-pointer">
                  Select file
                  <input id="fileUpload" type="file" name="file" onChange={handleUploadFileChange} className="hidden" />
                </label>
              </form>
              {fileUploadName != '' && uri == '' && uploadCost &&
                <div className="text-white font-pixel text-xl mb-[3%]">
                  You will upload <strong>{fileUploadName}</strong> for {uploadCost} SOL
                </div>
              }
              {fileUploadIsSelected && uploadingArweave == false &&
                <button className="text-white font-pixel text-xl rounded-full shadow-xl bg-[#414e63] hover:bg-[#2C3B52] border w-[160px] h-[40px] mb-[3%] uppercase" onClick={UploadFile}>Upload
                </button>
              }
              {uploadingArweave == true &&
                <button className="text-white font-pixel text-xl rounded-full shadow-xl bg-[#2C3B52] border w-[160px] h-[40px] mb-[3%] uppercase" onClick={UploadFile}>
                  <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>Uploading </button>}

              {errorUpload != '' && <div>❌ Ohoh.. An error occurs: {errorUpload}</div>}

              {uri !== '' &&
                <div className="font-pixel text-xl mb-[2%]">
                  ✅ Successfuly uploaded! <br />Don't forget to copy the following link:
                </div>}
              <div className="font-pixel text-xl underline">
                <a target="_blank" rel="noreferrer" href={uri}> {uri}</a>
              </div>
            </div>

          </div>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

const Balance = ({ }) => {
  const [balance, setBalance] = useState("")
  const handleChangeBalance = (val: string) => {
    setBalance(val)
  }
  useEffect(() => {
    (async () => {
      try {
        fetch("https://solana-mainnet.g.alchemy.com/v2/p5DCRRBHKVxuF7b6CfaS0YDyXaialE_Z", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            { "jsonrpc": "2.0", "id": 1, "method": "getBalance", "params": [walletPublicKey] }
          )
        }).then(res => res.json())
          .then(json => {
            handleChangeBalance((json.result?.value / LAMPORTS_PER_SOL).toFixed(4))
          });
      } catch (e) {
        console.log("BALANCE ERROR:" + e)
      }

    })();
  }, [])
  return (
    <div className="flex justify-between text-sm ml-2">
      <p className="font-pixel mr-2">SOL:&nbsp;</p><p className="font-pixel">{balance}◎</p>
    </div>
  )
}

{/*const DomainName = ({ }) => {
  const [domain, setDomain] = useState("loading...")
  const handleChangeDomain = (val: string) => {
    setDomain(val)
  }
  const pupKey = new PublicKey(walletPublicKey);
  useEffect(() => {
    (async () => {
      try {
        const { connection } = useConnection();
        const filters = [
          {
            memcmp: {
              offset: 32,
              bytes: pupKey.toBase58(),
            },
          },
        ];
        const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
          filters,
        })
        const domainKey = new PublicKey(accounts[0].pubkey.toString());
        handleChangeDomain(await performReverseLookup(connection, domainKey) + ".sol")
      } catch (err) {
        console.log("DOMAIN ERROR:" + err)
        handleChangeDomain("none")
      }
    })();
  }, [])

  return (
    <div className="flex justify-between text-sm ml-2"><p className="font-pixel">Domain:&nbsp;</p><p className="font-pixel">{domain}</p></div>
  )
}*/}

type TokenListProps = {
  tokens: string[] | undefined;
  error?: Error;
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

const TokenList = ({ tokens, error, setRefresh }: TokenListProps) => {
  if (error) {
    return null;
  }

  if (!tokens?.length) {
    return (
      <div className="text-center text-2xl">
        No token found in this wallet
      </div>
    );
  }

  return (
    <div>
      {tokens?.map((token, index) => (
        <TokenCard isConnectedWallet={isConnectedWallet} key={index} details={token} mint={token} toBurn={NFTstoBurn} />
      ))}
    </div>
  );
};

type RevokeListProps = {
  tokens: string[] | undefined;
  error?: Error;
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

const RevokeList = ({ tokens, error, setRefresh }: RevokeListProps) => {
  if (error) {
    return null;
  }

  if (!tokens?.length) {
    return (
      <div className="font-pixel text-center text-2xl">
        This wallet has no delegated authority
      </div>
    );
  }

  return (
    <div>
      {tokens?.map((token) => (
        <RevokeCard key={token} mint={token} toRevoke={TokenstoRevoke} />
      ))}
    </div>
  );
};

const SPLTokenView = ({ }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = useWallet();

  const [quantity, setQuantity] = useState(0);
  const [decimals, setDecimals] = useState(9);
  const [tokenName, setTokenName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [metadataURL, setMetadataURL] = useState('')
  const [isChecked, setIsChecked] = useState(false);
  const [metadataMethod, setMetadataMethod] = useState('upload')
  const [tokenDescription, setTokenDescription] = useState('')
  const [file, setFile] = useState<Readonly<{
    buffer: Buffer;
    fileName: string;
    displayName: string;
    uniqueName: string;
    contentType: string | null;
    extension: string | null;
    tags: MetaplexFileTag[];
  }>>()
  const [fileName, setFileName] = useState('')

  const handleFileChange = async (event: any) => {
    const browserFile = event.target.files[0];
    const _file = await toMetaplexFileFromBrowser(browserFile);
    setFile(_file);
    setFileName(_file.fileName)
  }

  return (
    <div className="md:w-[600px] mx-auto text-center">
      <div className="md:w-[480px] flex flex-col m-auto mb-12">
        <div className="my-2 uppercase underline flex font-pixel text-2xl text-center">Create your own scam token</div>
        <div className='flex justify-between'>
          <label className="flex font-pixel">Token Name</label>
          <input className="my-[1%] md:w-[200px] text-left text-black pl-1 border-2 border-black"
            type="text"
            placeholder="Token Name"
            onChange={(e) => setTokenName(e.target.value)}
          />
        </div>

        <div className='flex justify-between'>
          <label className="flex font-pixel">Symbol</label>
          <input className="my-[1%] md:w-[200px] text-left text-black pl-1 border-2 border-black"
            type="text"
            placeholder="Symbol"
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div className='flex justify-between'>
          <label className="flex font-pixel">Number of tokens to mint</label>
          <input className="my-[1%] md:w-[200px] text-left text-black pl-1 border-2 border-black"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className='flex justify-between'>
          <label className="flex font-pixel">Number of decimals</label>
          <input className="my-[1%] md:w-[200px] text-left text-black pl-1 border-2 border-black"
            type="number"
            min="0"
            value={decimals}
            onChange={(e) => setDecimals(parseInt(e.target.value))}
          />
        </div>

        <div className="mt-5 mb-2 uppercase underline flex font-pixel text-2xl"></div>
        <div className="flex justify-center mb-4">
          <label className="mx-2">Enable freeze authority</label>
          <input className="mx-2"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(!isChecked)}
          />
        </div>

        <div className="mt-5 mb-2 uppercase underline flex font-pixel text-2xl">Metadata</div>
        <div className="flex justify-center">
          {metadataMethod == 'url' ?
            <button className="btn btn-primary mr-4">Use an existing medatata URL</button>
            : <button className="btn btn-secondary mr-4" onClick={() => { setMetadataMethod('url'), setTokenDescription('') }}>Use an existing medatata URL</button>
          }
          {metadataMethod == 'upload' ?
            <button className="btn btn-primary">Create the metadata</button>
            : <button className="btn btn-secondary" onClick={() => { setMetadataMethod('upload'), setMetadataURL(''), setFile(undefined), setFileName('') }}>Create the metadata</button>}
        </div>

        {metadataMethod == 'url' &&
          <div>
            <div>
              <label className="mt-2 flex font-pixel">Metadata Url</label>
              <input className="my-[1%] md:w-[480px] text-left text-black pl-1 border-2 border-black"
                type="text"
                placeholder="Metadata Url"
                onChange={(e) => setMetadataURL(e.target.value)}
              />
            </div>

          </div>
        }

        {metadataMethod == 'upload' &&
          <div>
            <div className=''>
              <label className="mt-2 flex font-pixel">Description</label>
              <input className="my-[1%] md:w-[480px] text-left text-black pl-1 border-2 border-black"
                type="text"
                placeholder="Description of the token"
                onChange={(e) => setTokenDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="mt-2 flex"></label>
              <label htmlFor="file" className="text-white font-pixel rounded-full shadow-xl bg-[#414e63] border px-2 py-1 h-[40px] uppercase hover:bg-[#2C3B52] hover:cursor-pointer">
                Upload image
                <input
                  id="file"
                  type="file"
                  name="file"
                  accept="image/*, video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }} />
              </label>
              {fileName != '' && <div className="mt-2" >{fileName}</div>}
            </div>
          </div>
        }
      </div>
      <CreateTokenButton connection={connection} publicKey={publicKey} wallet={wallet} quantity={quantity} decimals={decimals} isChecked={isChecked} tokenName={tokenName} symbol={symbol} metadataURL={metadataURL} description={tokenDescription} file={file} metadataMethod={metadataMethod} />
    </div>
  );
};

//-------------------Close empty accounts-------------------------------------------------
const EmptyAccounts = ({ }) => {
  const { connection } = useConnection();

  const [walletToParsePublicKey, setWalletToParsePublicKey] =
    useState<string>(walletPublicKey);

  const { publicKey } = useWallet();

  const [refresh, setRefresh] = useState(false)

  const onUseWalletClick = () => {
    if (publicKey) {
      setWalletToParsePublicKey(publicKey?.toBase58());
    }
  };

  const { tokens, isLoading, error } = useWalletTokens({
    publicAddress: walletToParsePublicKey,
    connection,
    type: 'empty'
  });


  let errorMessage
  if (error) {
    errorMessage = error.message
  }

  return (
    <div className="w-11/12">
      <div className="">
        {error && errorMessage != "Invalid address: " ? (
          <div>
            <h1>Error Occures</h1>
            {(error as any)?.message}
          </div>
        ) : null}

        {!error && isLoading &&
          <div>
            <Loader />
          </div>
        }
        {!error && !isLoading && !refresh &&
          <AccountList accounts={tokens} error={error} setRefresh={setRefresh} />
        }

      </div>

    </div>
  );
};

type AccountListProps = {
  accounts: string[] | undefined;
  error?: Error;
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

const AccountList = ({ accounts, error, setRefresh }: AccountListProps) => {
  if (error) {
    return null;
  }

  if (!accounts?.length) {
    return (
      <div className="text-center text-2xl pt-16">
        No empty account found in this wallet
      </div>
    );
  }

  return (
    <div>
      {accounts?.map((token) => (
        <EmptyTokenCard key={token} account={token} toClose={AccountstoClose} isConnectedWallet={isConnectedWallet} />
      ))}
    </div>
  );
};






//----------------------------------------------------------SENDER VIEW----------------------------------------------------------------------------------------------------------------------------------



const MultiSenderView = ({ }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [walletToParsePublicKey, setWalletToParsePublicKey] =
    useState<string>(walletPublicKey);
  const { publicKey } = useWallet();

  const onUseWalletClick = () => {
    if (publicKey) {
      setWalletToParsePublicKey(publicKey?.toBase58());
    }
  };

  const [nbToken, setNbToken] = useState('');
  const [CurrencyType, setCurrencyType] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [ReceiverAddress, setReceiverAddress] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSOLChecked, setIsSOLChecked] = useState(false);
  const [Error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [signature, setSignature] = useState('')

  const [quantity, setQuantity] = useState<number>();
  const [quantity1, setQuantity1] = useState<number>();
  const [quantity2, setQuantity2] = useState<number>();
  const [quantity3, setQuantity3] = useState<number>();
  const [quantity4, setQuantity4] = useState<number>();
  const [quantity5, setQuantity5] = useState<number>();
  const [quantity6, setQuantity6] = useState<number>();
  const [quantity7, setQuantity7] = useState<number>();
  const [quantity8, setQuantity8] = useState<number>();
  const [quantity9, setQuantity9] = useState<number>();
  const [quantity10, setQuantity10] = useState<number>();

  const [receiver1, setReceiver1] = useState('');
  const [receiver2, setReceiver2] = useState('');
  const [receiver3, setReceiver3] = useState('');
  const [receiver4, setReceiver4] = useState('');
  const [receiver5, setReceiver5] = useState('');
  const [receiver6, setReceiver6] = useState('');
  const [receiver7, setReceiver7] = useState('');
  const [receiver8, setReceiver8] = useState('');
  const [receiver9, setReceiver9] = useState('');
  const [receiver10, setReceiver10] = useState('');

  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [token3, setToken3] = useState('');
  const [token4, setToken4] = useState('');
  const [token5, setToken5] = useState('');
  const [token6, setToken6] = useState('');
  const [token7, setToken7] = useState('');
  const [token8, setToken8] = useState('');
  const [token9, setToken9] = useState('');
  const [token10, setToken10] = useState('');

  const [csvFileName, setCsvFileName] = useState('')
  const [csvFileIsUploaded, setCsvFileIsUploaded] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvSendingSuccess, setCsvSendingSuccess] = useState(false)

  const [currentTx, setCurrentTx] = useState<number>(0);
  const [totalTx, setTotalTx] = useState<number>(0);


  // allow to reset the states
  const reset = () => {
    setIsChecked(false);
    setIsSOLChecked(false);
    setError('');
    setSignature('');
    setMintAddress('');
    setQuantity(undefined);
    setQuantity1(undefined);
    setQuantity2(undefined);
    setQuantity3(undefined);
    setQuantity4(undefined);
    setQuantity5(undefined);
    setQuantity6(undefined);
    setQuantity7(undefined);
    setQuantity8(undefined);
    setQuantity9(undefined);
    setQuantity10(undefined);
    setReceiver1('');
    setReceiver2('');
    setReceiver3('');
    setReceiver4('');
    setReceiver5('');
    setReceiver6('');
    setReceiver7('');
    setReceiver8('');
    setReceiver9('');
    setReceiver10('');
    setToken1('');
    setToken2('');
    setToken3('');
    setToken4('');
    setToken5('');
    setToken6('');
    setToken7('');
    setToken8('');
    setToken9('');
    setToken10('');
    setCsvFileName('');
    setCsvFileIsUploaded(false);
    setCurrentTx(0);
    setTotalTx(0);
    setCsvSendingSuccess(false);
  }


  // allow to check if the sender has enough tokens in his wallet
  // return true in this case
  const checkBalance = async (Receivers: string[], Amounts: (number | undefined)[], mintAddress: string) => {

    let Balance: number | null

    // SPL TOKEN CASE

    if (CurrencyType == 'SPL') {
      const mint = new PublicKey(mintAddress);

      // get the owner's token account of the token to send in order to get the token balance
      const ownerTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        publicKey!,
      );

      // determine the balance of the token to send
      const getBalance = await connection.getTokenAccountBalance(ownerTokenAccount);
      Balance = getBalance.value.uiAmount;
    }

    // SOL CASE
    else {
      Balance = (await connection.getBalance(publicKey!)) / LAMPORTS_PER_SOL;
    };

    let sendAmount: number = 0;

    // determine the quantity of token that the user wants to send
    if (!isChecked) {
      // in the case where the user wants to send different amount
      for (let i = 0; i < Amounts.length; i++) {
        sendAmount += Amounts[i]!
      };
    }
    // in the case where the user wants to send the same amount to everybody
    else {
      sendAmount = quantity! * Receivers.length;
    }

    if (sendAmount <= Balance!) {
      return true
    };
  };

  const checkBalanceMulti = async (Tokens: string[], Amounts: (number | undefined)[]) => {

    if (isSOLChecked) {
      const SOLBalance = (await connection.getBalance(publicKey!)) / LAMPORTS_PER_SOL;

      if (SOLBalance < quantity!) {
        return false
      }

    }


    for (let i = 0; i < Tokens.length; i++) {
      const ownerTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(Tokens[i]),
        publicKey!,
      );

      const getBalance = await connection.getTokenAccountBalance(ownerTokenAccount);
      const Balance = getBalance.value.uiAmount;
      if (Balance! < Amounts[i]!) {
        return false
      }
    }
    return true


  }

  const checkBalanceCsv = async (CsvData: any[], CsvHeaders: never[]) => {
    try {
      // list that includes all the different tokens that the user wants to send
      const TokenList: string[] = []
      // list that includes the corresponding amount to send
      const CorrespondingAmount: number[] = []

      for (let i = 0; i < CsvData.length; i++) {
        const tokenAddress = CsvHeaders[1]
        const amount = CsvHeaders[2]
        if (TokenList.includes(CsvData[i][tokenAddress])) {
          const indice = TokenList.indexOf(CsvData[i][tokenAddress])
          CorrespondingAmount[indice] += parseFloat(CsvData[i][amount])
        }
        else {
          TokenList.push(CsvData[i][tokenAddress])
          CorrespondingAmount.push(parseFloat(CsvData[i][amount]))
        }
      }
      console.log(TokenList)
      console.log(CorrespondingAmount)

      for (let i = 0; i < TokenList.length; i++) {
        const token = TokenList[i].toString()
        const amountToSend = CorrespondingAmount[i]
        if (token != 'So11111111111111111111111111111111111111112' && !token.includes('.sol')) {
          console.log(i + "/" + TokenList.length + ": " + token)
          const mint = new PublicKey(token)
          // get the owner's token account of the token to send in order to get balance
          const ownerTokenAccount = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            publicKey!,
          );

          // determine the balance of the token to send
          const getBalance = await connection.getTokenAccountBalance(ownerTokenAccount);
          const Balance = getBalance.value.uiAmount;
          if (Balance! < amountToSend) {
            setError('You do not have enough ' + token)
            return false
          }

        }

        else if (token.includes('.sol')) {
          return checkDomainOwnership([token])
        }

        else {
          const Balance = (await connection.getBalance(publicKey!)) / LAMPORTS_PER_SOL;
          if (Balance! < amountToSend) {
            setError("You do not have enough SOL")
            return false
          }
        }

      }

      return true
    }
    catch (error) {
      const err = (error as any)?.message;
      console.log(error)
      setError(err)
      if (err.includes('Invalid public key input')) {
        setError("Invalid address! Please verify the token addresses and receiver's addresses")
      }

    }

  }

  // allow to check if the user owns the solana domain it wants to transfer
  const checkDomainOwnership = async (Domains: string[]) => {


    for (let i = 0; i < Domains.length; i++) {
      const domainName = Domains[i].replace(".sol", "")

      // get the key of the domain name
      const { pubkey } = await getDomainKey(domainName);

      // get the owner 
      const owner = await NameRegistryState.retrieve(
        connection,
        pubkey
      );
      const ownerAddress = owner.registry.owner.toBase58();
      if (ownerAddress != publicKey?.toBase58()) {
        setError('You are not the owner of ' + Domains[i])
        return false
      }
    }
    return true
  }



  // allow to multi send one token to multiple wallets
  const SendOnClick = async () => {
    if (publicKey) {
      setError('');
      setSignature('');

      // init temp lists in order to clean them and remove the inputs with no value
      const _Receivers = [receiver1, receiver2, receiver3, receiver4, receiver5, receiver6, receiver7, receiver8, receiver9, receiver10];
      const _Amounts = [quantity1, quantity2, quantity3, quantity4, quantity5, quantity6, quantity6, quantity7, quantity8, quantity9, quantity10];
      const Receivers: string[] = [];
      const Amounts: (number | undefined)[] = [];

      if (!isChecked) {
        for (let i = 0; i < _Receivers.length; i++) {
          if (_Receivers[i] != '' && _Amounts[i] != undefined) {
            Receivers.push(_Receivers[i]);
            Amounts.push(_Amounts[i]);
          }
        };
      }
      else {
        for (let i = 0; i < _Receivers.length; i++) {
          if (_Receivers[i] != '') {
            Receivers.push(_Receivers[i]);
          }
        }
      }

      // check if the sender has enough tokens
      const enoughToken = await checkBalance(Receivers, Amounts, mintAddress)
      if (enoughToken) {

        try {
          setIsSending(true)

          let Tx = new Transaction()

          //SPL TOKEN CASE

          if (CurrencyType == 'SPL') {
            const mint = new PublicKey(mintAddress);

            // get the owner's token account of the token to send in order to get the number of decimals
            const ownerTokenAccount = await Token.getAssociatedTokenAddress(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              mint,
              publicKey,
            );

            // determine the number of decimals of the token to send
            const balance = await connection.getTokenAccountBalance(ownerTokenAccount)
            const decimals = balance.value.decimals

            for (let i = 0; i < Receivers.length; i++) {
              // determine the token account pubkey of the user
              const source_account = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                mint,
                publicKey,
              );

              let destPubkey: PublicKey;

              // check if it is a SOL domain name
              if (Receivers[i].includes('.sol')) {
                const hashedName = await getHashedName(Receivers[i].replace(".sol", ""));
                const nameAccountKey = await getNameAccountKey(
                  hashedName,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );
                const owner = await NameRegistryState.retrieve(
                  connection,
                  nameAccountKey
                );
                destPubkey = owner.registry.owner;

              }

              // check if it is a twitter handle
              else if (Receivers[i].includes('@')) {
                const handle = Receivers[i].replace("@", "")
                const registry = await getTwitterRegistry(connection, handle);
                destPubkey = registry.owner;

              }
              else {
                destPubkey = new PublicKey(Receivers[i]);
              }

              // determine the token account pubkey of the receiver
              const destination_account = await Token.getAssociatedTokenAddress(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                mint,
                destPubkey
              );

              // get the info of the destination account
              const account = await connection.getAccountInfo(destination_account)

              if (account == null) {
                // if account == null it means that it doesn't exist
                // we have to create it
                // create associate token account instruction
                const createIx = Token.createAssociatedTokenAccountInstruction(
                  ASSOCIATED_TOKEN_PROGRAM_ID,
                  TOKEN_PROGRAM_ID,
                  mint,
                  destination_account,
                  destPubkey,
                  publicKey
                )

                let transferIx: TransactionInstruction;

                if (!isChecked) {
                  // create transfer token instruction
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    Amounts[i]! * 10 ** decimals
                  )
                }
                else {
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    quantity! * 10 ** decimals
                  )
                }
                // Add the instructions in a transaction
                Tx.add(createIx, transferIx);


              }

              else {

                let transferIx: TransactionInstruction;

                if (!isChecked) {

                  // create transfer token instruction
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    Amounts[i]! * 10 ** decimals
                  )
                }
                else {
                  transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    quantity! * 10 ** decimals
                  )
                }

                // Add the instructions in a transaction
                Tx.add(transferIx);
              }
            }
          }
          // SOL CASE
          else {
            for (let i = 0; i < Receivers.length; i++) {

              let transferSOLIx: TransactionInstruction;

              let destPubkey: PublicKey;

              // check if it is a SOL domain name
              if (Receivers[i].includes('.sol')) {
                const hashedName = await getHashedName(Receivers[i].replace(".sol", ""));
                const nameAccountKey = await getNameAccountKey(
                  hashedName,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );
                const owner = await NameRegistryState.retrieve(
                  connection,
                  nameAccountKey
                );
                destPubkey = owner.registry.owner;

              }

              // check if it is a twitter handle
              else if (Receivers[i].includes('@')) {
                const handle = Receivers[i].replace("@", "")
                const registry = await getTwitterRegistry(connection, handle);
                destPubkey = registry.owner;

              }
              else {
                destPubkey = new PublicKey(Receivers[i]);
              }

              if (!isChecked) {

                transferSOLIx = SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: destPubkey,
                  lamports: Amounts[i]! * LAMPORTS_PER_SOL,
                })
              }
              else {
                transferSOLIx = SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: destPubkey,
                  lamports: quantity! * LAMPORTS_PER_SOL,
                })
              };

              Tx.add(transferSOLIx);
            }
          }


          //send the transaction
          const sendSignature = await wallet.sendTransaction(Tx, connection);
          // wait the confirmation
          const confirmed = await connection.confirmTransaction(sendSignature, 'processed');


          if (confirmed) {
            const signature = sendSignature.toString();
            setIsSending(false);
            setSignature(signature)
          }

        } catch (error) {
          const err = (error as any)?.message;
          setError(err);
          setIsSending(false);
        }
      }
      else {
        setError('Not enough token in wallet')
      }
    }
  };

  // allow to multi send multiple tokens to one wallet
  const SendOnClickMulti = async () => {
    if (publicKey) {
      setError('');
      setSignature('');

      // init temp lists in order to clean them and remove the inputs with no value
      const _Tokens = [token1, token2, token3, token4, token5, token6, token7, token8, token9, token10];
      const _Amounts = [quantity1, quantity2, quantity3, quantity4, quantity5, quantity6, quantity6, quantity7, quantity8, quantity9, quantity10];
      const Tokens: string[] = [];
      const Amounts: (number | undefined)[] = [];

      for (let i = 0; i < _Tokens.length; i++) {
        if (_Tokens[i] != '' && _Amounts[i] != undefined) {
          Tokens.push(_Tokens[i]);
          Amounts.push(_Amounts[i]);
        }
      };
      const enoughToken = await checkBalanceMulti(Tokens, Amounts)
      if (enoughToken) {

        try {
          setIsSending(true)

          let destPubkey: PublicKey;

          // check if it is a SOL domain name
          if (ReceiverAddress.includes('.sol')) {
            const hashedName = await getHashedName(ReceiverAddress.replace(".sol", ""));
            const nameAccountKey = await getNameAccountKey(
              hashedName,
              undefined,
              new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
            );
            const owner = await NameRegistryState.retrieve(
              connection,
              nameAccountKey
            );
            destPubkey = owner.registry.owner;

          }
          // check if it is a twitter handle
          else if (ReceiverAddress.includes('@')) {
            const handle = ReceiverAddress.replace("@", "")
            const registry = await getTwitterRegistry(connection, handle);
            destPubkey = registry.owner;

          }
          else {
            destPubkey = new PublicKey(ReceiverAddress);
          }


          let Tx = new Transaction()

          for (let i = 0; i < Tokens.length; i++) {

            // determine the token account pubkey of the user
            // allow to get the number of decimals
            const source_account = await Token.getAssociatedTokenAddress(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              new PublicKey(Tokens[i]),
              publicKey,
            );

            // determine the number of decimals of the token to send
            const balance = await connection.getTokenAccountBalance(source_account)
            const decimals = balance.value.decimals

            // determine the token account pubkey of the receiver
            const destination_account = await Token.getAssociatedTokenAddress(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              new PublicKey(Tokens[i]),
              destPubkey
            );

            // get the info of the destination account
            const account = await connection.getAccountInfo(destination_account)

            if (account == null) {
              // if account == null it means that it doesn't exist
              // we have to create it
              // create associate token account instruction
              const createIx = Token.createAssociatedTokenAccountInstruction(
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                new PublicKey(Tokens[i]),
                destination_account,
                destPubkey,
                publicKey
              )

              // create transfer token instruction
              const transferIx = Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                source_account,
                destination_account,
                publicKey,
                [],
                Amounts[i]! * 10 ** decimals
              )

              // Add the instructions in a transaction
              Tx.add(createIx, transferIx);
            }
            else {
              // create transfer token instruction
              const transferIx = Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                source_account,
                destination_account,
                publicKey,
                [],
                Amounts[i]! * 10 ** decimals
              )
              Tx.add(transferIx);
            }
          }
          if (isSOLChecked) {
            const transferSOLIx = SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: destPubkey,
              lamports: quantity! * LAMPORTS_PER_SOL,
            })

            Tx.add(transferSOLIx)
          }
          //send the transaction
          const sendSignature = await wallet.sendTransaction(Tx, connection);
          // wait the confirmation
          const confirmed = await connection.confirmTransaction(sendSignature, 'processed');


          if (confirmed) {
            const signature = sendSignature.toString();
            setIsSending(false);
            setSignature(signature)
          }
        }

        catch (error) {
          const err = (error as any)?.message;
          setError(err);
          setIsSending(false);
        }

      }
      else {
        setError('Not enough token in wallet')
      }

    }
  }

  // allow to multi send solana domains
  const SendOnClickDomain = async () => {
    if (publicKey) {
      setError('');
      setSignature('');

      // init temp lists in order to clean them and remove the inputs with no value
      const _Domains = [token1, token2, token3, token4, token5, token6, token7, token8, token9, token10];
      const Domains: string[] = [];

      for (let i = 0; i < _Domains.length; i++) {
        if (_Domains[i] != '') {
          Domains.push(_Domains[i]);

        }
      };
      const isOwner = await checkDomainOwnership(Domains);

      if (isOwner) {

        try {
          setIsSending(true)

          let destPubkey: PublicKey;

          // check if it is a SOL domain name
          if (ReceiverAddress.includes('.sol')) {
            const hashedName = await getHashedName(ReceiverAddress.replace(".sol", ""));
            const nameAccountKey = await getNameAccountKey(
              hashedName,
              undefined,
              new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
            );
            const owner = await NameRegistryState.retrieve(
              connection,
              nameAccountKey
            );
            destPubkey = owner.registry.owner;

          }
          // check if it is a twitter handle
          else if (ReceiverAddress.includes('@')) {
            const handle = ReceiverAddress.replace("@", "")
            const registry = await getTwitterRegistry(connection, handle);
            destPubkey = registry.owner;

          }
          else {
            destPubkey = new PublicKey(ReceiverAddress);
          }


          let Tx = new Transaction()

          for (let i = 0; i < Domains.length; i++) {

            const ix = await transferNameOwnership(
              connection,
              Domains[i].replace(".sol", ""),
              destPubkey,
              undefined,
              new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
            );

            Tx.add(ix)

          }
          //send the transaction
          const sendSignature = await wallet.sendTransaction(Tx, connection);
          // wait the confirmation
          const confirmed = await connection.confirmTransaction(sendSignature, 'processed');


          if (confirmed) {
            const signature = sendSignature.toString();
            setIsSending(false);
            setSignature(signature)
          }
        }

        catch (error) {
          const err = (error as any)?.message;
          setError(err);
          setIsSending(false);
        }
      }

    }
  }

  // allow to multi send tokens using a CSV file
  const SendOnClickCsv = async () => {
    const enoughToken = await checkBalanceCsv(csvData, csvHeaders).then()
    if (publicKey) {
      if (enoughToken) {

        try {
          setCurrentTx(0);
          setTotalTx(0);
          setIsSending(true);
          setError('');
          setCsvSendingSuccess(false);
          // define the number of transfers done in one Tx
          const nbPerTx = 6

          // calculate the number of Tx to do
          let nbTx: number
          if (csvData.length % 6 == 0) {
            nbTx = csvData.length / nbPerTx
          }
          else {
            nbTx = Math.floor(csvData.length / nbPerTx) + 1;
          }

          setTotalTx(nbTx);

          for (let i = 0; i < nbTx; i++) {

            // Create a transaction
            let Tx = new Transaction()

            let bornSup: number

            if (i == nbTx - 1) {
              bornSup = csvData.length
            }

            else {
              bornSup = 6 * (i + 1)
            }

            // for each csv line
            for (let j = 6 * i; j < bornSup; j++) {


              const destAddress = csvData[j][csvHeaders[0]]
              console.log(destAddress)
              let destPubkey: PublicKey;
              // check if it is a SOL domain name
              if (destAddress.includes('.sol')) {
                const hashedName = await getHashedName(destAddress.replace(".sol", ""));
                const nameAccountKey = await getNameAccountKey(
                  hashedName,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );
                const owner = await NameRegistryState.retrieve(
                  connection,
                  nameAccountKey
                );
                destPubkey = owner.registry.owner;
              }
              // check if it is a twitter handle
              else if (destAddress.includes('@')) {
                const handle = destAddress.replace("@", "")
                const registry = await getTwitterRegistry(connection, handle);
                destPubkey = registry.owner;

              }
              else {
                destPubkey = new PublicKey(destAddress);
              }

              const token = csvData[j][csvHeaders[1]]
              const amount = parseFloat(csvData[j][csvHeaders[2]])

              if (token == 'So11111111111111111111111111111111111111112') {
                const transferSOLIx = SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: destPubkey,
                  lamports: amount * LAMPORTS_PER_SOL,

                })

                Tx.add(transferSOLIx)

              }

              else if (token.includes('.sol')) {
                const ix = await transferNameOwnership(
                  connection,
                  token.replace(".sol", ""),
                  destPubkey,
                  undefined,
                  new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx") // SOL TLD Authority
                );

                Tx.add(ix)
              }
              else {

                const mint = new PublicKey(token)
                // determine the token account pubkey of the user
                const source_account = await Token.getAssociatedTokenAddress(
                  ASSOCIATED_TOKEN_PROGRAM_ID,
                  TOKEN_PROGRAM_ID,
                  mint,
                  publicKey,
                );

                // determine the number of decimals of the token to send
                const balance = await connection.getTokenAccountBalance(source_account)
                const decimals = balance.value.decimals
                // determine the token account pubkey of the receiver
                const destination_account = await Token.getAssociatedTokenAddress(
                  ASSOCIATED_TOKEN_PROGRAM_ID,
                  TOKEN_PROGRAM_ID,
                  mint,
                  destPubkey
                );

                // get the info of the destination account
                const account = await connection.getAccountInfo(destination_account)

                if (account == null) {
                  // if account == null it means that it doesn't exist
                  // we have to create it
                  // create associate token account instruction
                  const createIx = Token.createAssociatedTokenAccountInstruction(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    mint,
                    destination_account,
                    destPubkey,
                    publicKey
                  )

                  // create transfer token instruction
                  const transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    amount * 10 ** decimals
                  )

                  // Add the instructions in a transaction
                  Tx.add(createIx, transferIx);
                }

                else {
                  // create transfer token instruction
                  const transferIx = Token.createTransferInstruction(
                    TOKEN_PROGRAM_ID,
                    source_account,
                    destination_account,
                    publicKey,
                    [],
                    amount * 10 ** decimals
                  )
                  // Add the instructions in a transaction
                  Tx.add(transferIx);
                }
              }

            }

            // incremente the current transaction
            setCurrentTx(i + 1)

            // send the transaction
            const signature = await wallet.sendTransaction(Tx, connection);

            // get the confirmation of the transaction
            const confirmed = await connection.confirmTransaction(signature, 'processed');
            console.log('success')

          }
          setIsSending(false)
          setCsvSendingSuccess(true)
        }
        catch (error) {
          setIsSending(false)
          console.log(error)
          const err = (error as any)?.message;
          console.log(err)
          if (err.includes('Invalid public key input')) {
            setError("Invalid address! Please verify the token addresses and receiver's addresses")
          }
          else {
            setError(err)
          }
        }
      }

    }

  }

  const handleFileChange = async (event: any) => {
    setError('')
    setCsvSendingSuccess(false)
    const csvFile = event.target.files[0];
    const fileName = csvFile['name']
    setCsvFileName(fileName)
    const fileType = csvFile['type']

    if (fileType != 'text/csv') {
      setError('It is not a CSV file!')
    }
    else {
      setCsvFileIsUploaded(true)
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray: any = [];


          // Iterating data to get column name
          results.data.map((d: any) => {
            rowsArray.push(Object.keys(d));
          });

          // Parsed Data Response in array format
          // @ts-ignore
          setCsvData(results.data);

          // get the headers of the CSV file
          setCsvHeaders(rowsArray[0]);
        },
      });
    }
  }

  return (
    <div className="text-center pt-2">
      <div className="hero min-h-16 p-0 pt-10">
        <div className="text-center hero-content w-full">
          <div className="w-full">
            <h1 className="font-pixel mb-5 text-5xl">
              Multi Send Token
            </h1>
            <h3 className="font-pixel text-xl pb-5" >Supports public address, .sol domain name and Twitter handle with @</h3>

            {nbToken == '' && CurrencyType == '' &&
              <div>
                <div className="max-w-4xl mx-auto">
                  <ul className="text-left leading-10">
                    <li className="m-5" onClick={() => { setNbToken('one'); reset() }}>
                      <div className="p-4 hover:border">
                        <a className="font-pixel text-4xl font-bold mb-5">
                          1 token - Multiple receivers
                        </a>
                        <div className='font-pixel'>Send one token to multiple receivers</div>
                      </div>
                    </li>

                    <li className="m-5" onClick={() => { setNbToken('multi'); reset() }}>
                      <div className="p-4 hover:border">
                        <a className="font-pixel text-4xl font-bold mb-5">
                          Multiple token - 1 receiver
                        </a>
                        <div className='font-pixel'>Send multiple tokens to one receiver</div>
                      </div>
                    </li>
                    <li className="m-5" onClick={() => { setCurrencyType('domain'); reset() }}>
                      <div className="p-4 hover:border">
                        <a className="font-pixel text-4xl font-bold mb-5">
                          Domains transfer
                        </a>
                        <div className='font-pixel'>Transfer multiple Solana domains name to one receiver</div>
                      </div>
                    </li>
                    <li className="m-5" onClick={() => { setCurrencyType('csv'); reset() }}>
                      <div className="p-4 hover:border">
                        <a className="font-pixel text-4xl font-bold mb-5">
                          Upload CSV file
                        </a>
                        <div className='font-pixel'>Use a CSV file to multi send tokens and solana domains</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            }

            {nbToken != '' && CurrencyType == '' &&
              <div className="flex">
                <button className="text-white font-pixel text-xl w-[6rem] h-[2rem] mb-2 bg-[#2C3B52] hover:bg-[#566274] rounded-xl border"
                  onClick={() => { setNbToken(''); setCurrencyType('') }}>← Back</button>
              </div>
            }
            {CurrencyType != '' &&
              <div className="flex">
                <button className="text-white font-pixel text-xl w-[6rem] h-[2rem] mb-2 bg-[#2C3B52] hover:bg-[#566274] rounded-xl border"
                  onClick={() => { setCurrencyType('') }}>← Back</button>
              </div>
            }

            {nbToken == 'one' &&
              <div>
                {CurrencyType == '' &&
                  <div className="max-w-4xl mx-auto">
                    <ul className="text-left leading-10">
                      <li className="m-5" onClick={() => { setCurrencyType('SOL'); reset() }}>
                        <div className="p-4 hover:border">
                          <a className="font-pixel text-4xl font-bold mb-5">
                            SOL sending
                          </a>
                          <div className='font-pixel'>Send SOL to multiple receivers</div>
                        </div>
                      </li>

                      <li className="m-5" onClick={() => { setCurrencyType('SPL'); reset() }}>
                        <div className="p-4 hover:border">
                          <a className="font-pixel text-4xl font-bold mb-5">
                            SPL token sending
                          </a>
                          <div className='font-pixel'>Send one SPL token type to multiple receivers</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                }

                <div>

                  {/* form when SOL is selected */}
                  {CurrencyType == 'SOL' &&
                    <div>

                      <h1 className="font-bold mb-5 text-3xl uppercase">SOL sending</h1>
                      <form className="mt-[3%] mb-[2%]">

                        <div className="flex justify-center mb-[2%]">
                          <div className="my-auto mx-2">Send same amount</div>
                          <input className="my-auto mx-2"
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => { setIsChecked(!isChecked); setQuantity(undefined) }}
                          />
                          {isChecked &&
                            <div className="flex items-center">
                              <input className="w-[150px] mx-4 text-black pl-1 border-2 border-black"
                                type="number"
                                step="any"
                                min="0"
                                required
                                placeholder="Amount"
                                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                style={{
                                  borderRadius:
                                    "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                                }}
                              /></div>
                          }

                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #1"
                            onChange={(e) => setReceiver1(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked &&
                            <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                              type="number"
                              step="any"
                              min="0"
                              required
                              placeholder="Amount #1"
                              onChange={(e) => setQuantity1(parseFloat(e.target.value))}
                              style={{
                                borderRadius:
                                  "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                              }}
                            />}

                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #2"
                            onChange={(e) => setReceiver2(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #2"
                            onChange={(e) => setQuantity2(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>
                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #3"
                            onChange={(e) => setReceiver3(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #3"
                            onChange={(e) => setQuantity3(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #4"
                            onChange={(e) => setReceiver4(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #4"
                            onChange={(e) => setQuantity4(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #5"
                            onChange={(e) => setReceiver5(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #5"
                            onChange={(e) => setQuantity5(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #6"
                            onChange={(e) => setReceiver6(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #6"
                            onChange={(e) => setQuantity6(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #7"
                            onChange={(e) => setReceiver7(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #7"
                            onChange={(e) => setQuantity7(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #8"
                            onChange={(e) => setReceiver8(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #8"
                            onChange={(e) => setQuantity8(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #9"
                            onChange={(e) => setReceiver9(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #9"
                            onChange={(e) => setQuantity9(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #10"
                            onChange={(e) => setReceiver10(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #10"
                            onChange={(e) => setQuantity10(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>


                      </form>
                    </div>
                  }

                  {/* form when SPL is selected */}
                  {CurrencyType == 'SPL' &&
                    <div>

                      <h1 className="font-bold mb-5 text-3xl uppercase">SPL token sending</h1>
                      <form className="mt-[3%] mb-[2%]">

                        <input className="mb-[2%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                          type="text"
                          required
                          placeholder="Token Mint Address"
                          onChange={(e) => setMintAddress(e.target.value)}
                          style={{
                            borderRadius:
                              "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                          }}
                        />
                        <div className="flex justify-center mb-[2%]">
                          <div className="my-auto mx-2">Send same amount</div>
                          <input className="my-auto mx-2"
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(!isChecked)}
                          />
                          {isChecked &&
                            <div className="flex items-center">
                              <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                                type="number"
                                step="any"
                                min="0"
                                required
                                placeholder="Amount"
                                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                style={{
                                  borderRadius:
                                    "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                                }}
                              /></div>
                          }

                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #1"
                            onChange={(e) => setReceiver1(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked &&
                            <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                              type="number"
                              step="any"
                              min="0"
                              required
                              placeholder="Amount #1"
                              onChange={(e) => setQuantity1(parseFloat(e.target.value))}
                              style={{
                                borderRadius:
                                  "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                              }}
                            />}

                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #2"
                            onChange={(e) => setReceiver2(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #2"
                            onChange={(e) => setQuantity2(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>
                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #3"
                            onChange={(e) => setReceiver3(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #3"
                            onChange={(e) => setQuantity3(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #4"
                            onChange={(e) => setReceiver4(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #4"
                            onChange={(e) => setQuantity4(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #5"
                            onChange={(e) => setReceiver5(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #5"
                            onChange={(e) => setQuantity5(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #6"
                            onChange={(e) => setReceiver6(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #6"
                            onChange={(e) => setQuantity6(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #7"
                            onChange={(e) => setReceiver7(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #7"
                            onChange={(e) => setQuantity7(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #8"
                            onChange={(e) => setReceiver8(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #8"
                            onChange={(e) => setQuantity8(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #9"
                            onChange={(e) => setReceiver9(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #9"
                            onChange={(e) => setQuantity9(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>

                        <div>

                          <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                            type="text"
                            required
                            placeholder="Receiver #10"
                            onChange={(e) => setReceiver10(e.target.value)}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />

                          {!isChecked && <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder="Amount #10"
                            onChange={(e) => setQuantity10(parseFloat(e.target.value))}
                            style={{
                              borderRadius:
                                "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />}
                        </div>
                      </form>
                    </div>}

                  {!isSending && CurrencyType != '' &&
                    <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border" onClick={SendOnClick}>Send</button>
                  }
                  {isSending && CurrencyType != '' &&
                    <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border">
                      <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>Sending</button>}


                  {signature != '' && <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent! Check it <a target="_blank" href={'https://solscan.io/tx/' + signature}><strong className="underline">here</strong></a>
                  </div>
                  }


                  {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
                </div>
              </div>
            }

            {nbToken == 'multi' &&
              <div>

                <form className="mt-[3%] mb-[2%]">

                  <input className="mb-[2%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                    type="text"
                    required
                    placeholder="Receiver Address"
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    style={{
                      borderRadius:
                        "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                    }}
                  />
                  <div className="flex justify-center mb-[2%]">
                    <div className="my-auto mx-2">Send SOL</div>
                    <input className="my-auto mx-2"
                      type="checkbox"
                      checked={isSOLChecked}
                      onChange={(e) => { setIsSOLChecked(!isSOLChecked); setQuantity(undefined) }}
                    />
                    {isSOLChecked &&
                      <div className="flex items-center">
                        <input className="mb-[1%] w-[150px] mx-4 text-black pl-1 border-2 border-black"
                          type="number"
                          step="any"
                          min="0"
                          required
                          placeholder="Amount"
                          onChange={(e) => setQuantity(parseFloat(e.target.value))}
                          style={{
                            borderRadius:
                              "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                          }}
                        /></div>
                    }

                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #1"
                      onChange={(e) => setToken1(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #1"
                      onChange={(e) => setQuantity1(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #2"
                      onChange={(e) => setToken2(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #2"
                      onChange={(e) => setQuantity2(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>
                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #3"
                      onChange={(e) => setToken3(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #3"
                      onChange={(e) => setQuantity3(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #4"
                      onChange={(e) => setToken4(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #4"
                      onChange={(e) => setQuantity4(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #5"
                      onChange={(e) => setToken5(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #5"
                      onChange={(e) => setQuantity5(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #6"
                      onChange={(e) => setToken6(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #6"
                      onChange={(e) => setQuantity6(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #7"
                      onChange={(e) => setToken7(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #7"
                      onChange={(e) => setQuantity7(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #8"
                      onChange={(e) => setToken8(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="sm:mb-[1%] mb-2 w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #8"
                      onChange={(e) => setQuantity8(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #9"
                      onChange={(e) => setToken9(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="mb-[1%] w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #9"
                      onChange={(e) => setQuantity9(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>

                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder="Token Mint Address #10"
                      onChange={(e) => setToken10(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />

                    <input className="mb-[1%] w-[150px] mx-4 text-black pl-1 border-2 border-black"
                      type="number"
                      step="any"
                      min="0"
                      required
                      placeholder="Amount #10"
                      onChange={(e) => setQuantity10(parseFloat(e.target.value))}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>


                </form>

                {!isSending &&
                  <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border" onClick={SendOnClickMulti}>Send</button>
                }
                {isSending &&
                  <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Sending</button>}


                {signature != '' &&
                  <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent! Check it <a target="_blank" href={'https://solscan.io/tx/' + signature}><strong className="underline">here</strong></a>
                  </div>
                }

                {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
              </div>}

            {CurrencyType == 'domain' &&
              <div>

                <h1 className="font-bold mb-5 text-3xl uppercase">Domains sending</h1>
                <form className="mt-[3%] mb-[2%]">

                  <input className="mb-[2%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                    type="text"
                    required
                    placeholder="Receiver Address"
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    style={{
                      borderRadius:
                        "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                    }}
                  />

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #1"
                      onChange={(e) => setToken1(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #2"
                      onChange={(e) => setToken2(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #3"
                      onChange={(e) => setToken3(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #4"
                      onChange={(e) => setToken4(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #5"
                      onChange={(e) => setToken5(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #6"
                      onChange={(e) => setToken6(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #7"
                      onChange={(e) => setToken7(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="mb-[1%] md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #8"
                      onChange={(e) => setToken8(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #9"
                      onChange={(e) => setToken9(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>

                  <div>
                    <input className="sm:mb-[1%] mb-2 md:w-[480px] text-center mx-4 text-black pl-1 border-2 border-black"
                      type="text"
                      required
                      placeholder=".sol domain name #10"
                      onChange={(e) => setToken10(e.target.value)}
                      style={{
                        borderRadius:
                          "var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                      }}
                    />
                  </div>
                </form>

                {!isSending &&
                  <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border" onClick={SendOnClickDomain}>Send</button>
                }
                {isSending &&
                  <button className="text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Sending</button>}


                {signature != '' &&
                  <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent! Check it <a target="_blank" href={'https://solscan.io/tx/' + signature + '?cluster=devnet'}><strong className="underline">here</strong></a>
                  </div>
                }

                {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
              </div>}

            {CurrencyType == 'csv' &&
              <div>

                <h1 className="font-bold mb-5 text-3xl uppercase">Upload CSV file</h1>
                <div className="font-pixel text-xl">The file has to respect the following order:<br /> <strong>receiver's address, token address, amount to send</strong></div>
                <form className="mt-[5%] mb-4">
                  <label htmlFor="file" className="text-white font-pixel text-xl rounded-full shadow-xl bg-[#414e63] border px-6 py-2 h-[40px] mb-[3%] uppercase hover:bg-[#2C3B52] hover:cursor-pointer">
                    Select file
                    <input
                      id="file"
                      type="file"
                      name="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      style={{ display: 'none' }} />
                  </label>
                </form>

                {csvFileName != '' &&
                  <div className="text-white font-pixel text-xl mb-2">{csvFileName} uploaded!</div>
                }

                {!isSending && csvFileIsUploaded &&
                  <button className="mt-4 text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border" onClick={SendOnClickCsv}>Send</button>
                }
                {isSending &&
                  <button className="mt-4 text-white font-pixel text-xl bg-[#414e63] hover:bg-[#2C3B52] w-[160px] rounded-full shadow-xl border">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Sending</button>}


                {csvSendingSuccess &&
                  <div className="font-pixel text-xl mt-4">
                    ✅ Successfuly sent!
                  </div>
                }

                {isSending && currentTx != 0 && totalTx != 0 &&
                  <div className='font-pixel mt-4 mb-2 text-xl'>Please confirm Tx: {currentTx}/{totalTx}</div>

                }

                {Error != '' && <div className="mt-4 font-pixel text-xl">❌ {Error}</div>}
              </div>}

          </div>
        </div>
      </div>
    </div>
  );
};