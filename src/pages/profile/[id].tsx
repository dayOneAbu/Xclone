import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { ssgHelper } from "~/utils/ssgHelper";
import ErrorPage from "next/error"
import Link from "next/link";
import { FollowBtn, IconHoverEffect } from "~/components/Button";
import { VscArrowLeft } from "react-icons/vsc";
import ProfileImg from "~/components/ProfileImg";
import InfiniteTweetList from "~/components/InfiniteTweetList";

const UserProfile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ id }) => {
  const { data: profile } = api.profile.getProfileById.useQuery({ id })
  const tweets = api.tweets.infiniteProfileFeed.useInfiniteQuery({ userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor })
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ followed }) => {
      const trpcUtils = api.useContext()
      trpcUtils.profile.getProfileById.setData({ id }, oldData => {
        if (!oldData) return
        const countModifier = followed ? 1 : -1
        return {
          ...oldData,
          isFollowing: followed,
          followerCount: oldData.followerCount + 1
        }
      })
      console.log(followed)
    }
  })


  if (!profile || !profile.name) return (<ErrorPage statusCode={404} />)
  return (
    <>
      <Head>
        <title>X Clone {profile?.name}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href={".."}>
          <IconHoverEffect>
            <VscArrowLeft className="h-8 w-8" />
          </IconHoverEffect>
        </Link>
        <ProfileImg src={profile.image} className="flex flex-shrink-0 " />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetCount} {" "}
            {getPluralWord(profile.tweetCount, "tweet", "tweets")}-{" "}
            {profile.followerCount} {" "}
            {getPluralWord(profile.followerCount, "Follower", "Followers")}-{" "}
            {profile.followsCount} Following
          </div>
        </div>
        <FollowBtn isFollowing={profile.isFollowing}
          userId={id}
          isLoading={toggleFollow.isLoading}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweets.data?.pages.flatMap(item => item.tweets)}
          isLoading={tweets.isLoading}
          isError={tweets.isError}
          hasMore={tweets.hasNextPage ?? false}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  )
}

const pluralRule = Intl.PluralRules()
export default UserProfile
function getPluralWord(number: number, singular: string, plural: string) {
  return pluralRule.select(number) == "one" ? singular : plural
}

export function getStaticPath() {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) {
  const id = context?.params?.id
  if (id == null) {
    return {
      redirect: {
        destination: "/"
      }
    }
  }
  const ssg = ssgHelper()
  await ssg.profile.getProfileById.prefetch({ id })
  return {
    props: {
      id,
      trpcState: ssg.dehydrate()
    }
  }
}
