import { useMutation, useQueryClient } from "@tanstack/react-query"
import request from "graphql-request"
import Cookies from "js-cookie"
import { toast } from "./use-toast"
import { LOGOUT_USER } from "../../graphql/queries"
import { useRouter } from "next/navigation"
import useStore from "@/store"

const useLogoutMutation = () => {
  const router = useRouter()
  const store = useStore()

  const { mutate: logoutUser, isPending } = useMutation({
    mutationFn: async () => {
      const token = Cookies.get("authorization")
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      // Perform the logout mutation
      const data = await request(
        process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL!,
        LOGOUT_USER,
        undefined,
        headers
      )
      return data
    },
    onSuccess: () => {
      // Remove the authorization cookie
      router.push("/login")
      Cookies.remove("authorization")
      store.setAuthUser(null)
      return toast({
        title: "Successful!",
        description: "You have successfully logged out",
        variant: "success",
      })
    },
  })

  return { logoutUser, isPending }
}

export default useLogoutMutation
