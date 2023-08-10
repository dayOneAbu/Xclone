import { GetStaticPathsContext, GetStaticPropsContext } from "next";
import Head from "next/head";
// import { ssgHelper } from "~/utils/ssgHelper";

export default function UserProfile() {
  return (
    <>
      <Head>
        <title>X Clone {user.name}</title>
      </Head>
    </>
  )
}

// export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) => {
//   const id = context?.params?.id
//   if (id == null) {
//     return {
//       redirect: {
//         destination: "/"
//       }
//     }
//   }
//   const ssg = ssgHelper()
//   ssg.tweets()
//   return null
// }
