import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
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

export const SideBar: FC = ({ }) => {
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

    const [open, setOpen] = useState('');
    const unhover = () => {
        setOpen('')
    }
    return (
        <div id="sidebar" className="grid gap-2 p-2">
            <div onMouseOver={() => setOpen('home')} onMouseOut={unhover} className="hover:cursor-pointer">
                <Link passHref href="/">
                    <img src={open === 'home' ? "/static/images/buttons/home_hover.png" : "/static/images/buttons/home.png"} alt="home" className="w-full" />
                </Link>
            </div>
            <div onMouseOver={() => setOpen('tools')} onMouseOut={unhover} className="hover:cursor-pointer">
                <img src={open === 'tools' ? "/static/images/buttons/tools_hover.png" : "/static/images/buttons/tools.png"} alt="tools" className="w-full" />
            </div>
            <div onMouseOver={() => setOpen('mint')} onMouseOut={unhover} className="hover:cursor-pointer">
                <Link passHref href="/mint">
                    <img src={open === 'mint' ? "/static/images/buttons/mint_hover.png" : "/static/images/buttons/mint.png"} alt="mint" className="w-full" />
                </Link>
            </div>
            <div onMouseOver={() => setOpen('info')} onMouseOut={unhover} className="hover:cursor-pointer">
                <a onClick={toggleInfoModal}>
                    <img src={open === 'info' ? "/static/images/buttons/info_hover.png" : "/static/images/buttons/info.png"} alt="info" className="w-full" />
                </a>
            </div>

            <div className="absolute z-50">
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
                                <p className="font-trash uppercase mb-1"></p>
                                <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right mb-1" onClick={toggleInfoModal}>X</button>
                            </div>
                            <div className="text-center">
                                <img src="/static/images/info/1 collection overview.png" useMap="#infomap" />
                                <map id="infomap" name="infomap">
                                    <area shape="rect" coords="59, 103, 236, 280" onClick={() => handleSetSite(1, junks)} className="hover:cursor-pointer" />
                                    <area shape="rect" coords="391, 103, 568, 280" onClick={() => handleSetSite(2, faces)} className="hover:cursor-pointer" />
                                    <area shape="rect" coords="723, 103, 899, 280" onClick={() => handleSetSite(3, smb)} className="hover:cursor-pointer" />

                                    <area shape="rect" coords="59, 328, 236, 505" onClick={() => setSite(4)} className="hover:cursor-pointer" />
                                    <area shape="rect" coords="391, 328, 568, 505" onClick={() => handleSetSite(5, harrddyjunks)} className="hover:cursor-pointer" />
                                    <area shape="rect" coords="723, 328, 899, 505" onClick={() => handleSetSite(6, rektiez)} className="hover:cursor-pointer" />
                                </map>
                                <h1 className="font-trash uppercase">Click frame for NFT collection info</h1>
                            </div>
                        </div>
                    }
                    {site == 1 &&
                        <div>
                            <div className="flex justify-between">
                                <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-trash uppercase">BACK</button>
                                <a href="https://magiceden.io/marketplace/soljunk" target="_blank" className="btn bg-green-500">BUY NOW</a>
                                <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                            </div>
                            <div className="">
                                <Tabs>
                                    <TabList>
                                        <Tab><h1 className="font-trash uppercase">INFO</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY Tabel</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY View</h1></Tab>
                                    </TabList>

                                    <TabPanel>
                                        <img src="/static/images/info/2 soljunk collection card.png" useMap="#workmap" />
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
                                                        <p className="font-trash uppercase text-center">{nft.Name}</p>
                                                    </span>
                                                    <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <div className="rounded font-trash uppercase">👑{nft.Rank}</div>
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
                                                className="flex justify-between font-trash uppercase"
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
                                <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-trash uppercase">BACK</button>
                                <a href="https://magiceden.io/marketplace/faces_of_solana_money_business" target="_blank" className="btn bg-green-500">BUY NOW</a>
                                <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                            </div>
                            <div className="">
                                <Tabs>
                                    <TabList>
                                        <Tab><h1 className="font-trash uppercase">INFO</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY View</h1></Tab>
                                    </TabList>

                                    <TabPanel>
                                        <img src="/static/images/info/4 faces collection card.png" useMap="#workmap" />
                                    </TabPanel>

                                    <TabPanel>
                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                            {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                                <div key={index} className="relative post rounded text-sm">
                                                    <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                    <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <p className="font-trash uppercase text-center">{nft.Name}</p>
                                                    </span>
                                                    <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <div className="rounded font-trash uppercase">👑{nft.Rank}</div>
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
                                                className="flex justify-between font-trash uppercase"
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
                                <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-trash uppercase">BACK</button>
                                <a href="https://magiceden.io/marketplace/solana_money_business" target="_blank" className="btn bg-green-500">BUY NOW</a>
                                <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                            </div>
                            <div className="">
                                <Tabs>
                                    <TabList>
                                        <Tab><h1 className="font-trash uppercase">INFO</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY Table</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY View</h1></Tab>
                                    </TabList>

                                    <TabPanel>
                                        <img src="/static/images/info/5 smb collection card.png" useMap="#workmap" />
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
                                                        <p className="font-trash uppercase text-center">{nft.Name}</p>
                                                    </span>
                                                    <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <div className="rounded font-trash uppercase">👑{nft.Rank}</div>
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
                                                className="flex justify-between font-trash uppercase"
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
                                <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-trash uppercase">BACK</button>
                                <button className="btn bg-green-500 mb-2 mx-2">
                                    <Link href="/mint">
                                        <img src="./button/mint_gen2.png" />
                                    </Link>
                                </button>
                                <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                            </div>
                            <div className="">
                                <Tabs>
                                    <TabList>
                                        <Tab><h1 className="font-trash uppercase">INFO</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY</h1></Tab>
                                    </TabList>

                                    <TabPanel>
                                        <img src="/static/images/info/7 soljunk gen2 collection card.png" useMap="#workmap" />
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
                                <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-trash uppercase">BACK</button>
                                <a href="https://magiceden.io/marketplace/harrddyjunks" target="_blank" className="btn bg-green-500">BUY NOW</a>
                                <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                            </div>
                            <div className="">
                                <Tabs>
                                    <TabList>
                                        <Tab><h1 className="font-trash uppercase">INFO</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY View</h1></Tab>
                                    </TabList>

                                    <TabPanel>
                                        <img src="/static/images/info/9 harrddyjunks collection card.png" useMap="#workmap" />
                                    </TabPanel>

                                    <TabPanel>
                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                            {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                                <div key={index} className="relative post rounded text-sm">
                                                    <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                    <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <p className="font-trash uppercase text-center">{nft.Name}</p>
                                                    </span>
                                                    <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <div className="rounded font-trash uppercase">👑{nft.Rank}</div>
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
                                                className="flex justify-between font-trash uppercase"
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
                                <button onClick={() => setSite(0)} className="btn btn-primary btn-sm font-trash uppercase">BACK</button>
                                <a href="https://magiceden.io/marketplace/lil_rektie" target="_blank" className="btn bg-green-500">BUY NOW</a>
                                <button className="font-trash uppercase text-white btn btn-xs btn-primary text-right" onClick={toggleInfoModal}>X</button>
                            </div>
                            <div className="">
                                <Tabs>
                                    <TabList>
                                        <Tab><h1 className="font-trash uppercase">INFO</h1></Tab>
                                        <Tab><h1 className="font-trash uppercase">RARITY View</h1></Tab>
                                    </TabList>

                                    <TabPanel>
                                        <img src="/static/images/info/10 lil rektie collection card.png" useMap="#workmap" />
                                    </TabPanel>

                                    <TabPanel>
                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-start max-h-[54rem] w-[60rem]">
                                            {pagination.currentData && pagination.currentData.map((nft: any, index) => (
                                                <div key={index} className="relative post rounded text-sm">
                                                    <img className="w-38 rounded" src={nft.Image} loading="lazy" />
                                                    <span className="absolute top-1 left-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <p className="font-trash uppercase text-center">{nft.Name}</p>
                                                    </span>
                                                    <span className="absolute bottom-1 right-1 z-10 flex justify-between bg-gray-900 bg-opacity-70 rounded p-1">
                                                        <div className="rounded font-trash uppercase">👑{nft.Rank}</div>
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
                                                className="flex justify-between font-trash uppercase"
                                            />
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </div>
                    }
                </Modal>
            </div>
        </div>
    );
}; 