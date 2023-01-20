import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

//1x1 GRIDZ

export const Grid1x1_FTX = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="FTX:BTCPERP"
                interval="240"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "FTX:BTCPERP", "FTX:ETHPERP", "FTX:SOLPERP", "FTX:NEARPERP", "FTX:1INCHPERP", "FTX:AAVEPERP", "FTX:ADAPERP", "FTX:AGLDPERP",
                    "FTX:ALCXPERP", "FTX:ALGOPERP", "FTX:ALICEPERP", "FTX:ALPHAPERP", "FTX:ALTPERP", "FTX:AMPLPERP", "FTX:ANCPERP", "FTX:APEPERP",
                    "FTX:ARPERP", "FTX:ASDPERP", "FTX:ATLASPERP", "FTX:ATOMPERP", "FTX:AUDIOPERP", "FTX:AVAXPERP", "FTX:AXSPERP", "FTX:BADGERPERP",
                    "FTX:BALPERP", "FTX:BANDPERP", "FTX:BAOPERP", "FTX:BATPERP", "FTX:BCHPERP", "FTX:BITPERP", "FTX:BNBPERP", "FTX:BNTPERP",
                    "FTX:BOBAPERP", "FTX:BRZPERP", "FTX:BSVPERP", "FTX:BTTPERP", "FTX:C98PERP", "FTX:CAKEPERP", "FTX:CELOPERP", "FTX:CELPERP",
                    "FTX:CHRPERP", "FTX:CHZPERP", "FTX:CLVPERP", "FTX:COMPPERP", "FTX:CONVPERP", "FTX:CREAMPERP", "FTX:CROPERP", "FTX:CRVPERP",
                    "FTX:CUSDTPERP", "FTX:CVCPERP", "FTX:CVXPERP", "FTX:DASHPERP", "FTX:DAWNPERP", "FTX:DEFIPERP", "FTX:DENTPERP", "FTX:DODOPERP",
                    "FTX:DOGEPERP", "FTX:DOTPERP", "FTX:DRGNPERP", "FTX:DYDXPERP", "FTX:EDENPERP", "FTX:EGLDPERP", "FTX:ENJPERP", "FTX:ENSPERP",
                    "FTX:EOSPERP", "FTX:ETCPERP", "FTX:EXCHPERP", "FTX:FIDAPERP", "FTX:FILPERP", "FTX:FLMPERP", "FTX:FLOWPERP", "FTX:FTMPERP",
                    "FTX:FTTPERP", "FTX:FXSPERP", "FTX:GALAPERP", "FTX:GLMRPERP", "FTX:GMTPERP", "FTX:GRTPERP", "FTX:HBARPERP", "FTX:HNTPERP",
                    "FTX:HOLYPERP", "FTX:HOTPERP", "FTX:HTPERP", "FTX:HUMPERP", "FTX:ICPPERP", "FTX:ICXPERP", "FTX:IMXPERP", "FTX:IOSTPERP",
                    "FTX:IOTAPERP", "FTX:JASMYPERP", "FTX:KAVAPERP", "FTX:KBTTPERP", "FTX:KINPERP", "FTX:KNCPERP", "FTX:KSHIBPERP", "FTX:KSMPERP",
                    "FTX:KSOSPERP", "FTX:LEOPERP", "FTX:LINAPERP", "FTX:LINKPERP", "FTX:LOOKSPERP", "FTX:LRCPERP", "FTX:LTCPERP", "FTX:LUNAPERP",
                    "FTX:MANAPERP", "FTX:MAPSPERP", "FTX:MATICPERP", "FTX:MCBPERP", "FTX:MEDIAPERP", "FTX:MERPERP", "FTX:MIDPERP", "FTX:MINAPERP",
                    "FTX:MKRPERP", "FTX:MNGOPERP", "FTX:MOBPERP", "FTX:MTAPERP", "FTX:MTLPERP", "FTX:MVDA10PERP", "FTX:MVDA25PERP", "FTX:NEOPERP",
                    "FTX:OKBPERP", "FTX:OMGPERP", "FTX:ONEPERP", "FTX:ONTPERP", "FTX:ORBSPERP", "FTX:OXYPERP", "FTX:PAXGPERP", "FTX:PEOPLEPERP",
                    "FTX:PERPPERP", "FTX:POLISPERP", "FTX:PRIVPERP", "FTX:PROMPERP", "FTX:PUNDIXPERP", "FTX:QTUMPERP", "FTX:RAMPPERP", "FTX:RAYPERP",
                    "FTX:REEFPERP", "FTX:RENPERP", "FTX:RNDRPERP", "FTX:RONPERP", "FTX:ROOKPERP", "FTX:ROSEPERP", "FTX:RSRPERP", "FTX:RUNEPERP",
                    "FTX:SANDPERP", "FTX:SCPERP", "FTX:SCRTPERP", "FTX:SECOPERP", "FTX:SHIBPERP", "FTX:SHITPERP", "FTX:SKLPERP", "FTX:SLPPERP",
                    "FTX:SNXPERP", "FTX:SOSPERP", "FTX:SPELLPERP", "FTX:SRMPERP", "FTX:SRNPERP", "FTX:STEPPERP", "FTX:STMXPERP", "FTX:STORJPERP",
                    "FTX:STXPERP", "FTX:SUSHIPERP", "FTX:SXPPERP", "FTX:THETAPERP", "FTX:TLMPERP", "FTX:TOMOPERP", "FTX:TONCOINPERP",
                    "FTX:TRUPERP", "FTX:TRXPERP", "FTX:TRYBPERP", "FTX:TULIPPERP", "FTX:UNIPERP", "FTX:UNISWAPPERP", "FTX:USDTPERP", "FTX:USTPERP",
                    "FTX:VETPERP", "FTX:WAVESPERP", "FTX:XAUTPERP", "FTX:XEMPERP", "FTX:XLMPERP", "FTX:XMRPERP", "FTX:XRPPERP", "FTX:XTZPERP",
                    "FTX:YFIIPERP", "FTX:YFIPERP", "FTX:ZECPERP", "FTX:ZILPERP", "FTX:ZRXPERP"
                ]}
            ></AdvancedRealTimeChart>
        </div>
    )
}

export const Grid1x1_BINANCE_PERP = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="BINANCE:BTCUSDTPERP"
                interval="240"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "BINANCE:BTCUSDTPERP", "BINANCE:ETHUSDTPERP", "BINANCE:SOLUSDTPERP", "BINANCE:XRPUSDTPERP", "BINANCE:EOSUSDTPERP", "BINANCE:LTCUSDTPERP",
                    "BINANCE:TRXUSDTPERP", "BINANCE:ETCUSDTPERP", "BINANCE:LINKUSDTPERP", "BINANCE:XLMUSDTPERP", "BINANCE:ADAUSDTPERP", "BINANCE:XMRUSDTPERP",
                    "BINANCE:DASHUSDTPERP", "BINANCE:ZECUSDTPERP", "BINANCE:XTZUSDTPERP", "BINANCE:BNBUSDTPERP", "BINANCE:ATOMUSDTPERP", "BINANCE:ONTUSDTPERP",
                    "BINANCE:IOTAUSDTPERP", "BINANCE:BATUSDTPERP", "BINANCE:VETUSDTPERP", "BINANCE:NEOUSDTPERP", "BINANCE:QTUMUSDTPERP", "BINANCE:IOSTUSDTPERP",
                    "BINANCE:THETAUSDTPERP", "BINANCE:ALGOUSDTPERP", "BINANCE:ZILUSDTPERP", "BINANCE:KNCUSDTPERP", "BINANCE:ZRXUSDTPERP", "BINANCE:COMPUSDTPERP",
                    "BINANCE:OMGUSDTPERP", "BINANCE:DOGEUSDTPERP", "BINANCE:SXPUSDTPERP", "BINANCE:KAVAUSDTPERP", "BINANCE:BANDUSDTPERP", "BINANCE:RLCUSDTPERP",
                    "BINANCE:WAVESUSDTPERP", "BINANCE:MKRUSDTPERP", "BINANCE:SNXUSDTPERP", "BINANCE:DOTUSDTPERP", "BINANCE:DEFIUSDTPERP", "BINANCE:YFIUSDTPERP",
                    "BINANCE:BALUSDTPERP", "BINANCE:CRVUSDTPERP", "BINANCE:TRBUSDTPERP", "BINANCE:RUNEUSDTPERP", "BINANCE:SUSHIUSDTPERP", "BINANCE:SRMUSDTPERP",
                    "BINANCE:EGLDUSDTPERP", "BINANCE:ICXUSDTPERP", "BINANCE:STORJUSDTPERP", "BINANCE:BLZUSDTPERP", "BINANCE:UNIUSDTPERP", "BINANCE:BCHUSDTPERP",
                    "BINANCE:AVAXUSDTPERP", "BINANCE:FTMUSDTPERP", "BINANCE:HNTUSDTPERP", "BINANCE:ENJUSDTPERP", "BINANCE:FLMUSDTPERP", "BINANCE:TOMOUSDTPERP",
                    "BINANCE:RENUSDTPERP", "BINANCE:KSMUSDTPERP", "BINANCE:NEARUSDTPERP", "BINANCE:AAVEUSDTPERP", "BINANCE:FILUSDTPERP", "BINANCE:RSRUSDTPERP",
                    "BINANCE:LRCUSDTPERP", "BINANCE:MATICUSDTPERP", "BINANCE:OCEANUSDTPERP", "BINANCE:CVCUSDTPERP", "BINANCE:BELUSDTPERP", "BINANCE:CTKUSDTPERP",
                    "BINANCE:AXSUSDTPERP", "BINANCE:ALPHAUSDTPERP", "BINANCE:ZENUSDTPERP", "BINANCE:SKLUSDTPERP", "BINANCE:GRTUSDTPERP", "BINANCE:1INCHUSDTPERP",
                    "BINANCE:BTCBUSDPERP", "BINANCE:AKROUSDTPERP", "BINANCE:CHZUSDTPERP", "BINANCE:SANDUSDTPERP", "BINANCE:ANKRUSDTPERP", "BINANCE:LUNAUSDTPERP",
                    "BINANCE:BTSUSDTPERP", "BINANCE:LITUSDTPERP", "BINANCE:UNFIUSDTPERP", "BINANCE:DODOUSDTPERP", "BINANCE:REEFUSDTPERP", "BINANCE:RVNUSDTPERP",
                    "BINANCE:SFPUSDTPERP", "BINANCE:XEMUSDTPERP", "BINANCE:BTCSTUSDTPERP", "BINANCE:COTIUSDTPERP", "BINANCE:CHRUSDTPERP", "BINANCE:MANAUSDTPERP",
                    "BINANCE:ALICEUSDTPERP", "BINANCE:HBARUSDTPERP", "BINANCE:ONEUSDTPERP", "BINANCE:LINAUSDTPERP", "BINANCE:STMXUSDTPERP", "BINANCE:DENTUSDTPERP",
                    "BINANCE:CELRUSDTPERP", "BINANCE:HOTUSDTPERP", "BINANCE:MTLUSDTPERP", "BINANCE:OGNUSDTPERP", "BINANCE:NKNUSDTPERP", "BINANCE:SCUSDTPERP",
                    "BINANCE:DGBUSDTPERP", "BINANCE:1000SHIBUSDTPERP", "BINANCE:ICPUSDTPERP", "BINANCE:BAKEUSDTPERP", "BINANCE:GTCUSDTPERP", "BINANCE:ETHBUSDPERP",
                    "BINANCE:BTCDOMUSDTPERP", "BINANCE:TLMUSDTPERP", "BINANCE:BNBBUSDPERP", "BINANCE:ADABUSDPERP", "BINANCE:XRPBUSDPERP", "BINANCE:IOTXUSDTPERP",
                    "BINANCE:DOGEBUSDPERP", "BINANCE:AUDIOUSDTPERP", "BINANCE:RAYUSDTPERP", "BINANCE:C98USDTPERP", "BINANCE:MASKUSDTPERP", "BINANCE:ATAUSDTPERP",
                    "BINANCE:SOLBUSDPERP", "BINANCE:FTTBUSDPERP", "BINANCE:DYDXUSDTPERP", "BINANCE:1000XECUSDTPERP", "BINANCE:GALAUSDTPERP", "BINANCE:CELOUSDTPERP",
                    "BINANCE:ARUSDTPERP", "BINANCE:KLAYUSDTPERP", "BINANCE:ARPAUSDTPERP", "BINANCE:CTSIUSDTPERP", "BINANCE:LPTUSDTPERP", "BINANCE:ENSUSDTPERP",
                    "BINANCE:PEOPLEUSDTPERP", "BINANCE:ANTUSDTPERP", "BINANCE:ROSEUSDTPERP", "BINANCE:DUSKUSDTPERP", "BINANCE:FLOWUSDTPERP", "BINANCE:IMXUSDTPERP",
                    "BINANCE:API3USDTPERP",
                ]}
            ></AdvancedRealTimeChart>
        </div>
    )
}

export const Grid1x1_BINANCE_BTC = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="BINANCE:SOLBTC"
                interval="240"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "BINANCE:SOLBTC", "BINANCE:ETHBTC", "BINANCE:LTCBTC", "BINANCE:BNBBTC", "BINANCE:NEOBTC", "BINANCE:GASBTC",
                    "BINANCE:WTCBTC", "BINANCE:LRCBTC", "BINANCE:QTUMBTC", "BINANCE:OMGBTC", "BINANCE:ZRXBTC", "BINANCE:FTTBTC",
                    "BINANCE:KNCBTC", "BINANCE:SNMBTC", "BINANCE:IOTABTC", "BINANCE:LINKBTC", "BINANCE:XVGBTC", "BINANCE:HBARBTC",
                    "BINANCE:MDABTC", "BINANCE:MTLBTC", "BINANCE:EOSBTC", "BINANCE:SNTBTC", "BINANCE:ETCBTC", "BINANCE:DOTBTC",
                    "BINANCE:DNTBTC", "BINANCE:ZECBTC", "BINANCE:BNTBTC", "BINANCE:ASTBTC", "BINANCE:DASHBTC", "BINANCE:OAXBTC",
                    "BINANCE:BTGBTC", "BINANCE:REQBTC", "BINANCE:VIBBTC", "BINANCE:TRXBTC", "BINANCE:POWRBTC", "BINANCE:ARKBTC", "BINANCE:XRPBTC",
                    "BINANCE:ENJBTC", "BINANCE:STORJBTC", "BINANCE:KMDBTC", "BINANCE:NULSBTC", "BINANCE:FTMBTC",
                    "BINANCE:XMRBTC", "BINANCE:AMBBTC", "BINANCE:BATBTC", "BINANCE:ARDRBTC", "BINANCE:COMPBTC",
                    "BINANCE:GXSBTC", "BINANCE:QSPBTC", "BINANCE:BTSBTC", "BINANCE:LSKBTC", "BINANCE:OCEANBTC",
                    "BINANCE:MANABTC", "BINANCE:ADXBTC", "BINANCE:ADABTC", "BINANCE:XLMBTC", "BINANCE:NKNBTC",
                    "BINANCE:WABIBTC", "BINANCE:WAVESBTC", "BINANCE:GTOBTC", "BINANCE:ICXBTC", "BINANCE:AVABTC",
                    "BINANCE:ELFBTC", "BINANCE:AIONBTC", "BINANCE:NEBLBTC", "BINANCE:BRDBTC", "BINANCE:NAVBTC",
                    "BINANCE:RLCBTC", "BINANCE:INSBTC", "BINANCE:PIVXBTC", "BINANCE:IOSTBTC", "BINANCE:CHATBTC",
                    "BINANCE:STEEMBTC", "BINANCE:NANOBTC", "BINANCE:VIABTC", "BINANCE:BLZBTC", "BINANCE:DGBBTC",
                    "BINANCE:ZILBTC", "BINANCE:ONTBTC", "BINANCE:XEMBTC", "BINANCE:NASBTC", "BINANCE:SANDBTC",
                    "BINANCE:VETBTC", "BINANCE:DOCKBTC", "BINANCE:POLYBTC", "BINANCE:GOBTC", "BINANCE:RVNBTC",
                    "BINANCE:DCRBTC", "BINANCE:MITHBTC", "BINANCE:FETBTC", "BINANCE:NMRBTC", "BINANCE:STPTBTC",
                    "BINANCE:CELRBTC", "BINANCE:MATICBTC", "BINANCE:ATOMBTC", "BINANCE:PHBBTC", "BINANCE:TFUELBTC", "BINANCE:ONEBTC",
                    "BINANCE:TOMOBTC", "BINANCE:PERLBTC", "BINANCE:CHZBTC", "BINANCE:BANDBTC", "BINANCE:BEAMBTC", "BINANCE:XTZBTC",
                    "BINANCE:STXBTC", "BINANCE:KAVABTC", "BINANCE:ARPABTC", "BINANCE:CTXCBTC", "BINANCE:BCHBTC", "BINANCE:VITEBTC",
                    "BINANCE:OGNBTC", "BINANCE:DREPBTC", "BINANCE:TCTBTC", "BINANCE:WRXBTC", "BINANCE:LTOBTC", "BINANCE:COTIBTC",
                    "BINANCE:CTSIBTC", "BINANCE:HIVEBTC", "BINANCE:CHRBTC", "BINANCE:MDTBTC", "BINANCE:STMXBTC", "BINANCE:PNTBTC",
                    "BINANCE:SXPBTC", "BINANCE:SNXBTC", "BINANCE:IRISBTC", "BINANCE:MKRBTC", "BINANCE:RUNEBTC", "BINANCE:FIOBTC",
                    "BINANCE:BALBTC", "BINANCE:YFIBTC", "BINANCE:JSTBTC", "BINANCE:SRMBTC", "BINANCE:ANTBTC", "BINANCE:CRVBTC",

                ]}
            ></AdvancedRealTimeChart>
        </div>
    )
}

export const Grid1x1_HUOBI = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="BINANCE:SOLBTC"
                interval="240"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "huobi:btcusdt", "huobi:ethusdt", "huobi:xrpusdtusdt", "huobi:ltcusdt", "huobi:bchusdtusdt", "huobi:etcusdt", "huobi:eosusdtusdt", "huobi:htusdt",
                    "huobi:adausdtusdt", "huobi:omgusdt", "huobi:zecusdtusdt", "huobi:iotausdt", "huobi:dashusdtusdt", "huobi:xmrusdt", "huobi:hb10usdtusdt",
                    "huobi:newusdt", "huobi:bttusdt", "huobi:nanousdt", "huobi:hptusdtusdt", "huobi:aeusdtusdt", "huobi:bsvusdt",
                    "huobi:lambusdtusdt", "huobi:kanusdt", "huobi:lbausdtusdt", "huobi:dogeusdt", "huobi:topusdtusdt", "huobi:trxusdt", "huobi:ontusdtusdt",
                    "huobi:paiusdt", "huobi:iostusdt", "huobi:zilusdtusdt", "huobi:btmusdt", "huobi:dtausdtusdt", "huobi:ocnusdt", "huobi:gxcusdtusdt",
                    "huobi:xlmusdtusdt", "huobi:qtumusdt", "huobi:elfusdtusdt", "huobi:cmtusdt", "huobi:vetusdtusdt", "huobi:neousdt", "huobi:letusdtusdt",
                    "huobi:actusdtusdt", "huobi:bixusdt", "huobi:hitusdt", "huobi:itcusdtusdt", "huobi:socusdt", "huobi:elausdtusdt", "huobi:hcusdtusdt",                    "huobi:ruffusdt", "huobi:cvcusdt", "huobi:thetausdt", "huobi:wiccusdt",
                    "huobi:nasusdtusdt", "huobi:steemusdt", "huobi:ctxcusdtusdt", "huobi:mdsusdt", "huobi:btsusdtusdt", "huobi:gntusdt", "huobi:storjusdtusdt",
                    "huobi:sntusdtusdt", "huobi:smtusdt", "huobi:xemusdtusdt", "huobi:zrxusdt", "huobi:linkusdtusdt", "huobi:wavesusdt", "huobi:dcrusdtusdt",  
                ]}
            ></AdvancedRealTimeChart>
        </div >
    )
}

export const Grid1x1_FOREX = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="CAPITALCOM:DXY"
                interval="240"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "CAPITALCOM:DXY",
                    "FX:EURUSD", "FX:USDCAD",
                    "FX:EURCAD", "FX:USDJPY",
                    "FX:EURJPY", "FX:USDCHF",
                    "FX:EURCHF", "FX:GBPUSD",
                    "FX:EURGBP", "FX:AUDUSD",
                    "FX:NZDUSD", "FX:NZDUSD",
                    "FX:EURNZD", "FX:GBPJPY",
                    "FX:GBPCAD", "FX:GBPAUD",
                    "FX:GBPNZD", "FX:GBPCHF",
                    "FX:CADJPY", "FX:CADCHF",
                    "FX:AUDJPY", "FX:AUDCAD",
                    "FX:AUDNZD", "FX:AUDCHF",
                    "FX:NZDJPY", "FX:NZDCAD",
                    "FX:NZDCHF", "FX:CHFJPY"
                ]}
            ></AdvancedRealTimeChart>
        </div>
    )
}

export const Grid1x1_USSTOCKS = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="NASDAQ:AAPL"
                interval="D"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "NYSE:AA", "NASDAQ:AAPL", "NASDAQ:AMZN", "NYSE:AXP", "NYSE:BA", "NYSE:BABA", "NYSE:BAC", "NYSE:CAT", "NASDAQ:CSCO", "NYSE:CVX",
                    "NYSE:DIS", "NASDAQ:FB", "NYSE:GE", "NASDAQ:GOOG", "NYSE:HD", "NYSE:HPQ", "NYSE:IBM", "NASDAQ:INTC", "NYSE:JNJ", "NYSE:JPM", "NYSE:KO",
                    "NYSE:MCD", "NYSE:MMM", "NYSE:MRK", "NASDAQ:MSFT", "NASDAQ:NFLX", "NYSE:PFE", "NYSE:PG", "NYSE:SNAP", "NYSE:T", "NYSE:TRV", "NASDAQ:TSLA",
                    "NYSE:TWTR", "NYSE:VZ", "NYSE:WMT", "NYSE:XOM"
                ]}
            ></AdvancedRealTimeChart>
        </div>
    )
}

export const Grid1x1_VGSTOCKS = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="FWB:NTO"
                interval="D"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "FWB:AIY", "SWB:7CD", "FWB:CPK", "FWB:KOA", "FWB:NTO", "FWB:N9B", "FWB:ETA", "SWB:TKE", "FWB:UEN", "FWB:RYU", "FWB:HY5A",
                    "FWB:GS2C", "FWB:NEH", "FWB:7NX", "FWB:EI4", "FWB:ZY3", "FWB:SON1", "FWB:GD8A", "FWB:ERT"
                ]}
            ></AdvancedRealTimeChart>
        </div>
    )
}

export const Grid1x1_COMMODITIES = ({ }) => {
    return (
        <div className="h-[53rem]">
            <AdvancedRealTimeChart
                symbol="TVC:GOLD"
                interval="240"
                theme="dark"
                autosize
                show_popup_button={true}
                disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                watchlist={[
                    "TVC:UKOIL", "TVC:USOIL", "TVC:GOLD", "TVC:SILVER", "TVC:PLATINUM", "CAPITALCOM:PALLADIUM", "FX:COPPER,CBOT:ZW1!", "CAPITALCOM:ORANGEJUICE", "CME:H2O1!"
                ]}
            ></AdvancedRealTimeChart>
        </div>
    )
}

//2x2 GRIDZ

export const Grid2x2 = ({ }) => {
    return (
        <div className="grid grid-rows-2">
            <div className="grid grid-cols-2 h-[26.7rem]">
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:BTCUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:ETHUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
            <div className="grid grid-cols-2">
                <AdvancedRealTimeChart
                    symbol="FTX:SOLUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="BINANCE:NEARUSDT"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
        </div>
    )
}

//2x3 GRIDZ

export const Grid2x3 = ({ }) => {
    return (
        <div className="grid grid-rows-2">
            <div className="grid grid-cols-3 h-[26.7rem]">
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:BTCUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:ETHUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:SOLUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
            <div className="grid grid-cols-3">
                <AdvancedRealTimeChart
                    symbol="FTX:NEARUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:GMTUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:GSTUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
        </div>
    )
}

//3x3 GRIDZ

export const Grid3x3 = ({ }) => {
    return (
        <div className="grid grid-rows-3">
            <div className="grid grid-cols-3 h-72">
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:BTCUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:ETHUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:SOLUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
            <div className="grid grid-cols-3">
                <AdvancedRealTimeChart
                    symbol="FTX:NEARUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:GMTUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:GSTUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
            <div className="grid grid-cols-3">
                <AdvancedRealTimeChart
                    symbol="FTX:FIDAUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:ARUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:FTTUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
        </div>
    )
}

//3x4 GRIDZ

export const Grid3x4 = ({ }) => {
    return (
        <div className="grid grid-rows-3">
            <div className="grid grid-cols-4 h-[17.7rem]">
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:BTCUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:ETHUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:LTCUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="BITSTAMP:BCHUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
            <div className="grid grid-cols-4">
                <AdvancedRealTimeChart
                    symbol="FTX:SOLUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:NEARUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:FIDAUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:ARUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
            <div className="grid grid-cols-4">
                <AdvancedRealTimeChart
                    symbol="FTX:SHIBUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:WAVESUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:DOGEUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
                <AdvancedRealTimeChart
                    symbol="FTX:DOTUSD"
                    interval="240"
                    theme="dark"
                    withdateranges={false}
                    autosize
                    disabled_features= {["use_localstorage_for_settings", "create_volume_indicator_by_default", "control_bar"]}
                ></AdvancedRealTimeChart>
            </div>
        </div>
    )
}