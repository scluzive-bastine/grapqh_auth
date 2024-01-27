"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LoginRequest, LoginValidator } from "@/lib/validators/login"
import { LOGIN_USER } from "../../../../graphql/mutations"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import ButtonLoader from "@/components/ui/buttonLoader"
import { useMutation } from "@tanstack/react-query"
import request from "graphql-request"
import useStore from "@/store"
import { IUser } from "@/lib/types"
import Cookies from "js-cookie"
import Link from "next/link"

const LoginForm = () => {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const store = useStore()

  const form = useForm({
    resolver: zodResolver(LoginValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async ({ email, password }: LoginRequest) => {
      const payload: LoginRequest = {
        email,
        password,
      }
      const data = await request(process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL!, LOGIN_USER, payload)
      return data
    },
    onSuccess(data: any) {
      const { code, message } = data.login
      if (code === 401) {
        return toast({
          title: "An Error occured!",
          description: message,
          variant: "destructive",
        })
      } else {
        const { id, username, email, token } = data.login.user

        store.setAuthUser({ id, username, email, token } as IUser)
        Cookies.set("authorization", token)
        router.push("/profile")
        return toast({
          title: "Successful!",
          description: "Welcome to GQL_ Auth!",
          variant: "success",
        })
      }
    },
    onError(error: any) {
      // Handle generic errors
      return toast({
        title: "There was a problem!",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = async (data: LoginRequest) => {
    loginUser({
      email: data.email,
      password: data.password,
    })
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    isClient && (
      <div className='w-full max-w-md border border-slate-200 rounded-xl mx-auto p-4 mt-10 shadow-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='email'>Email</Label>
                  <FormControl>
                    <Input placeholder='E.g jane@example.com' {...field} className='py-5' />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='password'>Password</Label>
                  <FormControl>
                    <Input
                      placeholder='Enter your password'
                      type='password'
                      {...field}
                      className='py-5'
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              className='w-contain'
              size='lg'
              onClick={form.handleSubmit(onSubmit)}
            >
              {isPending ? (
                <span className='flex space-x-2 items-center'>
                  <ButtonLoader />
                  Processing...
                </span>
              ) : (
                " Login"
              )}
            </Button>
          </form>
        </Form>
        <div className='mt-2 text-sm '>
          Not registered yet?{" "}
          <Link href='/register' className='text-blue-600'>
            Register Now!
          </Link>
        </div>
      </div>
    )
  )
}

export default LoginForm
