import React, { FC } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { ReplyIcon } from '@heroicons/react/solid';

type Props = {
  num: any;
  index: any;
};

export const FeedObject: FC<Props> = ({
  num,
  index,
}) => {
  return (
    (num.eventType == 1 ? (
      <div className="border-2 border-yellow-300 rounded-lg w-full mb-2 p-2">
        <div className="flex">
          <img src={num.pfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
          <div className="grid w-full">
            <div className="block mb-5">
              <div className="flex">
                <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                  <div className="uppercase mr-5 text-xl hover:text-primary hover:cursor-pointer">{num.name}</div>
                </Link>
                <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                <div className="text-gray-500 mr-2 ml-2">·</div>
                <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
              </div>
            </div>
            <div className="uppercase text-left">New user account created - Welcome to the trash!</div>
          </div>
        </div>
      </div>
    ) : (
      (num.eventType == 2 ? (
        <div className="border-2 border-green-500 rounded-lg w-full mb-2 p-2">
          <div className="flex">
            <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
            <div className="grid w-full">
              <div className="block mb-5">
                <div className="flex">
                  <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                    <div className="uppercase mr-5 text-xl hover:text-primary hover:cursor-pointer">{num.name}</div>
                  </Link>
                  <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                  <div className="text-gray-500 mr-2 ml-2">·</div>
                  <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                </div>
              </div>
              <div className="uppercase text-left">User claimed account</div>
            </div>
          </div>
        </div>
      ) : (
        (num.eventType == 3 ? (
          <div className="border-2 border-red-500 rounded-lg w-full mb-2 p-2">
            <div className="flex">
              <img src={num.authorPfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
              <div className="grid w-full">
                <div className="block mb-5">
                  <div className="flex">
                    <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                      <div className="uppercase mr-5 text-xl hover:text-primary hover:cursor-pointer">{num.authorName}</div>
                    </Link>
                    <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                    <div className="text-gray-500 mr-2 ml-2">·</div>
                    <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                  </div>
                </div>
                <div className="uppercase text-left mb-2 flex">Commented wallet '
                  <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                    <div className="text-yellow-300 hover:text-primary hover:cursor-pointer">{num.name}</div>
                  </Link>'
                  <div className="text-gray-500 ml-2">({num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)})</div>:</div>
                <div className="flex">
                  <div className="uppercase text-left border-2 border-opacity-20 rounded p-2 w-full">{num.content}</div>
                  <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                    <Link passHref href={`/discussion/${num.contentId}`}>
                      <ReplyIcon className="w-6 h-6" />
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          (num.eventType == 4 ? (
            <div className="border-2 border-purple-500 rounded-lg w-full mb-2 p-2">
              <div className="flex">
                <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                <div className="grid w-full">
                  <div className="block mb-5">
                    <div className="flex">
                      <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                        <div className="uppercase mr-5 text-xl hover:text-primary hover:cursor-pointer">{num.authorName}</div>
                      </Link>
                      <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                      <div className="text-gray-500 mr-2 ml-2">·</div>
                      <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                    </div>
                  </div>
                  <div className="uppercase text-left mb-2 flex">
                    <Link key={index} passHref href={`/token/${num.pubKey}`}>
                      <div className="text-center border-2 border-opacity-20 rounded mr-2 hover:cursor-pointer hover:border-primary">Commented the NFT
                        <img src={num.authorPfp} alt="tmp" className="w-40 h-40" />
                        <div className="text-yellow-300">{num.name}</div>
                        <div className="text-gray-500 ml-2">({num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)})</div>
                      </div>
                    </Link>
                    <div className="uppercase text-left border-2 border-opacity-20 rounded p-2 w-full mr-5">
                      <div className="underline">MESSAGE:</div>
                      <div className="">{num.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            (num.eventType == 5 ? (
              <div className="border-2 border-blue-500 rounded-lg w-full mb-2 p-2">
                <div className="flex">
                  <img src={num.authorPfp} alt="tmp" className='w-12 h-12 rounded-full border-2 mr-2' />
                  <div className="grid w-full">
                    <div className="block mb-5">
                      <div className="flex">
                        <Link key={index} passHref href={`/wallet/${num.authorPubKey}`}>
                          <div className="uppercase mr-5 text-xl hover:text-primary hover:cursor-pointer">{num.authorName}</div>
                        </Link>
                        <div className="text-gray-500">{num.authorPubKey.slice(0, 6)}...{num.authorPubKey.slice(-6)}</div>
                        <div className="text-gray-500 mr-2 ml-2">·</div>
                        <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                      </div>
                    </div>
                    <div className="uppercase text-left mb-2 flex">Wrote into discussion for '
                      <Link key={index} passHref href={`/discussion/${num.pubKey}`}>
                        <div className="text-yellow-300 hover:text-primary hover:cursor-pointer">{num.pubKey}</div>
                      </Link>'
                      :</div>
                    <div className="flex">
                      <div className="uppercase text-left border-2 border-opacity-20 rounded p-2 w-full">{num.content}</div>
                      <button className="rounded hover:bg-gray-800 w-8 p-1 text-center">
                        <Link passHref href={`/discussion/${num.pubKey}`}>
                          <ReplyIcon className="w-6 h-6" />
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              (num.eventType == 6 ? (
                <div className="border-2  border-indigo-500 rounded-lg w-full mb-2 p-2">
                  <div className="flex">
                    <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                    <div className="grid w-full">
                      <div className="block mb-5">
                        <div className="flex">
                          <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                            <div className="uppercase mr-5 text-xl hover:text-primary hover:cursor-pointer">{num.name}</div>
                          </Link>
                          <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                          <div className="text-gray-500 mr-2 ml-2">·</div>
                          <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                        </div>
                      </div>
                      <div className="text-left uppercase flex">User changed Name from <div className="text-yellow-300 ml-2 mr-2">{num.authorName}</div> to <div className="text-yellow-300 ml-2 mr-2">{num.name}</div></div>
                    </div>
                  </div>
                </div>
              ) : (
                (num.eventType == 7 ? (
                  <div className="border-2 border-pink-500 rounded-lg w-full mb-2 p-2">
                    <div className="flex">
                      <div className=""><QuestionMarkCircleIcon className="w-6 h-6 mr-2" /></div>
                      <div className="grid w-full">
                        <div className="block mb-5">
                          <div className="flex">
                            <Link key={index} passHref href={`/wallet/${num.pubKey}`}>
                              <div className="uppercase mr-5 text-xl hover:text-primary hover:cursor-pointer">{num.name}</div>
                            </Link>
                            <div className="text-gray-500">{num.pubKey.slice(0, 6)}...{num.pubKey.slice(-6)}</div>
                            <div className="text-gray-500 mr-2 ml-2">·</div>
                            <ReactTimeAgo date={num.time} locale="en-US" timeStyle="round" className="uppercase text-gray-500" />
                          </div>
                        </div>
                        <div className="flex items-center">
                          USER CHANGED PFP INTO
                          <img src={num.content} alt="" className="w-20 h-20 ml-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  null
                ))
              ))
            ))
          ))
        ))
      ))
    ))
  )
}