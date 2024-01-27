"use client"

import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"
import { GET_USER } from "../../../graphql/queries"
import Cookies from "js-cookie"
import useStore from "@/store"
import { IUser } from "@/lib/types"
import { Button } from "@/components/ui/button"
import useLogoutMutation from "@/hooks/useLogout"
import ButtonLoader from "@/components/ui/buttonLoader"
import PageHeader from "../components/PageHeader"

const Profile = () => {
  const cookie = getAuthTokenFromCookie()
  const store = useStore()
  // logout
  const { logoutUser, isPending } = useLogoutMutation()

  const { data, status, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const headers = {
        Authorization: `Bearer ${cookie}`,
      }
      const data = await request(
        process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL!,
        GET_USER,
        undefined,
        headers
      )

      //@ts-ignore
      const { id, username, email, token } = data.user
      store.setAuthUser({ username, email, token, id } as IUser)

      return data
    },
    enabled: true,
  })

  if (status === "pending") return <LoadingSkeleton />
  if (status === "error") return <div>{error.message}</div>
  //@ts-ignore
  const userData: IUser = data.user

  const firstCharacter = userData?.username.charAt(0)
  const lastCharacter = userData?.username.charAt(userData.username.length - 1)

  const handleLogout = async () => {
    logoutUser()
  }

  return (
    <div className='w-full max-w-lg mx-auto'>
      <div className='my-20'>
        <PageHeader title='Profile' subheader='Awesome, you made it here 👏' />
        <div className='border border-slate-200 rounded-xl h-full min-h-[20rem] flex flex-col justify-between shadow-sm'>
          <div className='w-full py-5 flex flex-col gap-10 px-5'>
            <div className='bg-emerald-500 uppercase flex items-center justify-center h-16 w-16 mx-auto rounded-full font-semibold text-white text-center text-2xl flex-shrink-0'>
              {firstCharacter}
              {lastCharacter}
            </div>
            <div className='flex flex-col md:flex-row w-full gap-4 items-center'>
              <div className='rounded-lg px-2 py-2.5 font-semibold text-gray-500 border border-slate-200 w-full capitalize'>
                {userData.username}
              </div>
              <div className='rounded-lg px-2 py-2.5 font-semibold text-gray-500 border border-slate-200 w-full'>
                {userData.email}
              </div>
            </div>
          </div>
          <div className='border-t border-slate-200 bg-zinc-100 p-4'>
            <Button
              disabled={isPending}
              variant='destructive'
              size='lg'
              className='rounded-lg'
              onClick={handleLogout}
            >
              {isPending ? (
                <span className='flex space-x-2 items-center'>
                  <ButtonLoader />
                  Processing...
                </span>
              ) : (
                " Logout"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

const getAuthTokenFromCookie = () => {
  const token = Cookies.get("authorization")
  return token
}

const LoadingSkeleton = () => {
  return (
    <div className='w-full max-w-lg mx-auto my-20'>
      <div className='border border-slate-200 rounded-lg my-20 h-full min-h-[20rem] flex flex-col justify-between shadow-sm'>
        <div className='w-full py-5 flex flex-col gap-10 px-5'>
          <div className='bg-slate-300 animate-pulse uppercase flex items-center justify-center h-16 w-16 rounded-full font-semibold text-white text-center text-2xl flex-shrink-0'></div>
          <div className='flex flex-col md:flex-row w-full gap-4 items-center'>
            <div className='rounded-lg px-2 py-2.5 animate-pulse border border-slate-200 w-full h-12 bg-slate-200'></div>
            <div className='rounded-lg px-2 py-2.5 animate-pulse border border-slate-200 w-full h-12 bg-slate-200'></div>
          </div>
        </div>
        <div className='border-t border-slate-200 bg-zinc-100 p-4'>
          <div className='bg-slate-400 w-40 h-12 rounded-lg px-2 py-2.5 animate-pulse border border-slate-200 w-full'></div>
        </div>
      </div>
    </div>
  )
}
