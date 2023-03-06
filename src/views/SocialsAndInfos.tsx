import Link from "next/link";
import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Zoom from 'react-img-zoom'
import ReactPaginate from 'react-paginate';

import { LoadRarityFile } from 'utils/LoadRarityFiles'
const junks: any = LoadRarityFile(0)
const smb: any = LoadRarityFile(1)
const faces: any = LoadRarityFile(2)
const rektiez: any = LoadRarityFile(3)
const harrddyjunks: any = LoadRarityFile(4)

export const SocialsAndInfo: React.FC = ({ }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    function toggleInfoModal() {
        setSite(0)
        setIsInfoOpen(!isInfoOpen);
    }

    const [site, setSite] = useState(0)
    const handleSetSite = (num: any, col: any) => {
        setSite(num)
        handleChangeCollection(col, true)
    }

    const [collection, setCollection] = useState(junks)

    const handleChangeCollection = (val: any, rank: boolean) => {
        setCollection(val)
        const mode = rank == true ? val[0].nfts : val[0].edition
        setPagination((prevState) => ({
            ...prevState,
            offset: 0,
            data: mode,
            pageCount: mode.length / prevState.numberPerPage,
            currentData: mode.slice(pagination.offset, pagination.offset + pagination.numberPerPage)
        }))
    }
    const [pagination, setPagination] = useState({
        data: collection[0].nfts,
        offset: 0,
        numberPerPage: 18,
        pageCount: 0,
        currentData: []
    });
    useEffect(() => {
        setPagination((prevState) => ({
            ...prevState,
            pageCount: prevState.data.length / prevState.numberPerPage,
            currentData: prevState.data.slice(pagination.offset, pagination.offset + pagination.numberPerPage)
        }))
    }, [pagination.numberPerPage, pagination.offset])
    const handlePageClick = (event: { selected: any; }) => {
        const selected = event.selected;
        const offset = selected * pagination.numberPerPage
        setPagination({ ...pagination, offset })
    }

    return (
        <div className="">
            <div className="grid">
                
                <button className="btn btn-ghost w-16t mb-2">
                    <a href="http://mintgame.soljunks.io/" target="_blank">
                        <img src="./button/game.png" className="w-8" />
                    </a>
                </button>
                <button className="btn btn-ghost w-16 mb-2" onClick={toggleInfoModal}>
                    <p className="font-pixel text-xl">ℹ️</p>
                </button>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-1 h-10 flex justify-between lg:hidden">
                <div className="dropdown dropdown-top">
                    <div tabIndex={0} className="btn btn-sm mr-1 bg-green-500 text-xl"><img className="w-12" src="./button/buy_button.png" alt="cs" /></div>
                    <ul tabIndex={0} className="mt-1 text-md shadow menu dropdown-content bg-base-300 rounded border border-gray-500 w-[12rem]">
                        <li>
                            <a>
                                <Link href="https://magiceden.io/marketplace/soljunk">
                                    <p className="font-pixel text-sm uppercase">BUY SolJunk GEN1</p>
                                </Link>
                            </a>
                        </li>
                        <li>
                            <a>
                                <Link href="https://magiceden.io/marketplace/solana_money_business">
                                    <p className="font-pixel text-sm uppercase">BUY $MB</p>
                                </Link>
                            </a>
                        </li>
                        <li>
                            <a>
                                <Link href="https://magiceden.io/marketplace/faces_of_solana_money_business">
                                    <p className="font-pixel text-sm uppercase">BUY Faces of $MB</p>
                                </Link>
                            </a>
                        </li>
                        <li>
                            <a>
                                <Link href="https://magiceden.io/marketplace/lil_rektie">
                                    <p className="font-pixel text-sm uppercase">BUY Lil Rektie</p>
                                </Link>
                            </a>
                        </li>
                        <li>
                            <a>
                                <Link href="https://magiceden.io/marketplace/harrddyjunks">
                                    <p className="font-pixel text-sm uppercase">BUY HarrddyJunks</p>
                                </Link>
                            </a>
                        </li>
                        <li>
                            <button className="btn bg-green-500 mb-2 mx-2">
                                <Link href="/mint">
                                    <img src="./button/mint_gen2.png" />
                                </Link>
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="grid items-center">
                    <div className="text-center">
                        <h1 className="font-pixel text-xs">DegenBags V0.1_AlPHA</h1>
                        <h1 className="font-pixel text-xs">Get more options on desktop</h1>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isInfoOpen}
                onRequestClose={toggleInfoModal}
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
                contentLabel="INFO WINDOW"
            >

                {site == 0 &&
                    <div>
                        <div className="flex justify-between">
                            <p className="font-pixel mb-1"></p>
                            <button className="font-pixel text-white btn btn-xs btn-primary text-right mb-1" onClick={toggleInfoModal}>X</button>
                        </div>
                        <div className="text-center">
                            <img src="./info/1 collection overview.png" useMap="#infomap" />
                            <map id="infomap" name="infomap">
                                <area shape="rect" coords="59, 103, 236, 280" onClick={() => handleSetSite(1, junks)} className="hover:cursor-pointer" />
                                <area shape="rect" coords="391, 103, 568, 280" onClick={() => handleSetSite(2, faces)} className="hover:cursor-pointer" />
                                <area shape="rect" coords="723, 103, 899, 280" onClick={() => handleSetSite(3, smb)} className="hover:cursor-pointer" />

                                <area shape="rect" coords="59, 328, 236, 505" onClick={() => setSite(4)} className="hover:cursor-pointer" />
                                <area shape="rect" coords="391, 328, 568, 505" onClick={() => handleSetSite(5, harrddyjunks)} className="hover:cursor-pointer" />
                                <area shape="rect" coords="723, 328, 899, 505" onClick={() => handleSetSite(6, rektiez)} className="hover:cursor-pointer" />
                            </map>
                            <h1 className="font-pixel">Click frame for NFT collection info</h1>
                        </div>
                    </div>
                }
                {site == 1 &&
                    <div>
                        <div className="flex justify-between">
                            <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-pixel">BACK</button>
                            <a href="https://magiceden.io/marketplace/soljunk" target="_blank" className="btn bg-green-500"><img src="./button/buy_button.png" /></a>
                            <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                        </div>
                        <div className="">
                            <Tabs>
                                <TabList>
                                    <Tab><h1 className="font-pixel">INFO</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY Tabel</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY View</h1></Tab>
                                </TabList>

                                <TabPanel>
                                    <img src="./info/2 soljunk collection card.png" useMap="#workmap" />
                                </TabPanel>

                                <TabPanel>
                                    <Zoom
                                        img="./info/3 soljunk rarity.png"
                                        zoomScale={3}
                                        width={960}
                                        height={520}
                                        className="rounded"
                                    />
                                </TabPanel>

                                <TabPanel>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                        {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                            <div key={index} className="relative post rounded text-sm">
                                                <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <p className="font-pixel text-center">{nft.Name}</p>
                                                </span>
                                                <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <div className="rounded font-pixel">👑{nft.Rank}</div>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded mt-1 bg-base-300 w-[60rem]">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={pagination.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                            className="flex justify-between font-pixel"
                                        />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                }

                {site == 2 &&
                    <div>
                        <div className="flex justify-between">
                            <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-pixel">BACK</button>
                            <a href="https://magiceden.io/marketplace/faces_of_solana_money_business" target="_blank" className="btn bg-green-500"><img src="./button/buy_button.png" /></a>
                            <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                        </div>
                        <div className="">
                            <Tabs>
                                <TabList>
                                    <Tab><h1 className="font-pixel">INFO</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY View</h1></Tab>
                                </TabList>

                                <TabPanel>
                                    <img src="./info/4 faces collection card.png" useMap="#workmap" />
                                </TabPanel>

                                <TabPanel>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                        {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                            <div key={index} className="relative post rounded text-sm">
                                                <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <p className="font-pixel text-center">{nft.Name}</p>
                                                </span>
                                                <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <div className="rounded font-pixel">👑{nft.Rank}</div>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded mt-1 bg-base-300 w-[60rem]">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={pagination.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                            className="flex justify-between font-pixel"
                                        />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                }

                {site == 3 &&
                    <div>
                        <div className="flex justify-between">
                            <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-pixel">BACK</button>
                            <a href="https://magiceden.io/marketplace/solana_money_business" target="_blank" className="btn bg-green-500"><img src="./button/buy_button.png" /></a>
                            <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                        </div>
                        <div className="">
                            <Tabs>
                                <TabList>
                                    <Tab><h1 className="font-pixel">INFO</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY Table</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY View</h1></Tab>
                                </TabList>

                                <TabPanel>
                                    <img src="./info/5 smb collection card.png" useMap="#workmap" />
                                </TabPanel>

                                <TabPanel>
                                    <Zoom
                                        img="./info/6 smb rarity.png"
                                        zoomScale={3}
                                        width={960}
                                        height={540}
                                        className="rounded"
                                    />
                                </TabPanel>

                                <TabPanel>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                        {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                            <div key={index} className="relative post rounded text-sm">
                                                <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <p className="font-pixel text-center">{nft.Name}</p>
                                                </span>
                                                <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <div className="rounded font-pixel">👑{nft.Rank}</div>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded mt-1 bg-base-300 w-[60rem]">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={pagination.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                            className="flex justify-between font-pixel"
                                        />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                }

                {site == 4 &&
                    <div>
                        <div className="flex justify-between">
                            <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-pixel">BACK</button>
                            <button className="btn bg-green-500 mb-2 mx-2">
                                <Link href="/mint">
                                    <img src="./button/mint_gen2.png" />
                                </Link>
                            </button>
                            <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                        </div>
                        <div className="">
                            <Tabs>
                                <TabList>
                                    <Tab><h1 className="font-pixel">INFO</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY</h1></Tab>
                                </TabList>

                                <TabPanel>
                                    <img src="./info/7 soljunk gen2 collection card.png" useMap="#workmap" />
                                </TabPanel>

                                <TabPanel>
                                    <Zoom
                                        img="./info/8 soljunk gen2 rarity.png"
                                        zoomScale={3}
                                        width={960}
                                        height={540}
                                        className="rounded"
                                    />
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                }

                {site == 5 &&
                    <div>
                        <div className="flex justify-between">
                            <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-pixel">BACK</button>
                            <a href="https://magiceden.io/marketplace/harrddyjunks" target="_blank" className="btn bg-green-500"><img src="./button/buy_button.png" /></a>
                            <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                        </div>
                        <div className="">
                            <Tabs>
                                <TabList>
                                    <Tab><h1 className="font-pixel">INFO</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY View</h1></Tab>
                                </TabList>

                                <TabPanel>
                                    <img src="./info/9 harrddyjunks collection card.png" useMap="#workmap" />
                                </TabPanel>

                                <TabPanel>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                        {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                            <div key={index} className="relative post rounded text-sm">
                                                <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <p className="font-pixel text-center">{nft.Name}</p>
                                                </span>
                                                <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <div className="rounded font-pixel">👑{nft.Rank}</div>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded mt-1 bg-base-300 w-[60rem]">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={pagination.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                            className="flex justify-between font-pixel"
                                        />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                }

                {site == 6 &&
                    <div>
                        <div className="flex justify-between">
                            <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-pixel">BACK</button>
                            <a href="https://magiceden.io/marketplace/lil_rektie" target="_blank" className="btn bg-green-500"><img src="./button/buy_button.png" /></a>
                            <button className="font-pixel text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                        </div>
                        <div className="">
                            <Tabs>
                                <TabList>
                                    <Tab><h1 className="font-pixel">INFO</h1></Tab>
                                    <Tab><h1 className="font-pixel">RARITY View</h1></Tab>
                                </TabList>

                                <TabPanel>
                                    <img src="./info/10 lil rektie collection card.png" useMap="#workmap" />
                                </TabPanel>

                                <TabPanel>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                        {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                            <div key={index} className="relative post rounded text-sm">
                                                <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <p className="font-pixel text-center">{nft.Name}</p>
                                                </span>
                                                <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                    <div className="rounded font-pixel">👑{nft.Rank}</div>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="rounded mt-1 bg-base-300 w-[60rem]">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={pagination.pageCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageClick}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                            className="flex justify-between font-pixel"
                                        />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                }
            </Modal>
        </div >
    )
}