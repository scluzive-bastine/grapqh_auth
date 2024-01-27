"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import ButtonLoader from "@/components/ui/buttonLoader"
import { toast } from "@/hooks/use-toast"
import { RegisterRequest, RegisterValidator } from "@/lib/validators/register"
import request from "graphql-request"
import { REGISTER_USER } from "../../../../graphql/mutations"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useEffect, useState } from "react"

const RegisterForm = () => {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: async ({ email, username, password }: RegisterRequest) => {
      const payload: RegisterRequest = {
        email,
        username,
        password,
      }
      const data = await request(
        process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL!,
        REGISTER_USER,
        payload
      )

      return data
    },
    onSuccess(data: any) {
      const { code, message } = data.register
      if (code === 422) {
        return toast({
          title: "An Error occured!",
          description: message,
          variant: "destructive",
        })
      } else {
        router.push("/profile")
        return toast({
          title: "Successful!",
          description: "Welcome to GQL_ Auth!",
          variant: "success",
        })
      }
    },
    onError(error: any) {
      return toast({
        title: "There was a problem!",
        description: "Something went wrong",
        variant: "destructive",
      })
    },
  })

  const form = useForm({
    resolver: zodResolver(RegisterValidator),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterRequest) => {
    registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
    })
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    isClient && (
      <div className='w-full max-w-lg border border-slate-200 rounded-xl mx-auto p-4 mt-10 shadow-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='username'>Username</Label>
                  <FormControl>
                    <Input placeholder='Jane' {...field} className='py-5' />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='email'>Email</Label>
                  <FormControl>
                    <Input placeholder='jane@example.com' {...field} className='py-5' />
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
                    <Input type='password' {...field} className='py-5' />
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
                " Register"
              )}
            </Button>
          </form>
        </Form>
        <div className='mt-2 text-sm '>
          Already registered yet?{" "}
          <Link href='/login' className='text-blue-600'>
            Login
          </Link>
        </div>
      </div>
    )
  )
}

export default RegisterForm
