import { create } from "zustand"
import { IUser } from "../lib/types"

type Store = {
  authUser: IUser | null
  pageLoading: boolean
  setAuthUser: (user: IUser | null) => void
}

const useStore = create<Store>((set) => ({
  authUser: null,
  pageLoading: false,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
}))

export default useStore
