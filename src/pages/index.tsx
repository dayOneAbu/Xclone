import { useState } from "react";
import { unknown } from "zod";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import NewTweetForm from "~/components/NewTweetForm";
import { RouterOutputs, api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const


export default function Home() {
  const [selectedTab, setSelectedTab] = useState<typeof TABS[number]>()
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white px-2 py-2">
        <h1 className="mx-1 mb-4 py-4 font-medium text-xl">Home</h1>
        {TABS && TABS.map(tab => (
          <button key={tab}
            className={`focus-visible:bg-gray-300 hover:bg-gray-300 px-4 py-4
            flex-grow ${selectedTab === tab ? "border-b-4 border-blue-600 font-bold" : ""}
            `}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </header>
      <NewTweetForm />
      {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
    </>
  );
}
function RecentTweets() {
  const { data: tweets, isLoading, isError, hasNextPage, fetchNextPage } = api.tweets.infiniteTweetFeed.useInfiniteQuery({},
    { getNextPageParam: lastPage => lastPage.nextCursor })
  return (
    <InfiniteTweetList
      tweets={tweets?.pages.flatMap(item => item.tweets)}
      isLoading={isLoading}
      isError={isError}
      hasMore={hasNextPage ?? false}
      fetchNewTweets={fetchNextPage || undefined}
    />
  )
}
function FollowingTweets() {
  const tweetFeeds = api.tweets.infiniteTweetFeed.useInfiniteQuery({ followingTweets: true },
    { getNextPageParam: lastPage => lastPage.nextCursor })

  return (
    <InfiniteTweetList
      tweets={tweetFeeds.data?.pages.flatMap(item => item.tweets)}
      isLoading={tweetFeeds.isLoading}
      isError={tweetFeeds.isError}
      hasMore={tweetFeeds.hasNextPage ?? false}
      fetchNewTweets={tweetFeeds.fetchNextPage}
    />
  )
}
