"use client"

import useStore from "@/store"
import Link from "next/link"
import React from "react"
import useLogoutMutation from "@/hooks/useLogout"

const Navbar = () => {
  const store = useStore()
  const user = store.authUser
  const { logoutUser } = useLogoutMutation()

  const handleLogOut = () => {
    logoutUser()
  }

  return (
    <nav className='w-full py-4 px-10 bg-slate-100 border-b border-gray-200'>
      <div className='flex justify-between h-full items-center'>
        <Link href={"/"} className='text-2xl font-mono font-bold'>
          🛡️GQL_
        </Link>
        {user ? (
          <div>
            <Link
              href={"#"}
              onClick={handleLogOut}
              className='font-medium hover:text-gray-600 transition-all duration-150'
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className='flex space-x-4'>
            <Link
              href={"/login"}
              className='font-medium hover:text-gray-600 transition-all duration-150'
            >
              Login
            </Link>
            <Link
              href={"/register"}
              className='font-medium hover:text-gray-600 transition-all duration-150'
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
