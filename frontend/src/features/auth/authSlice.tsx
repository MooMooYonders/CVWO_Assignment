import { createAppSlice } from "../../app/createAppSlice"
import { PayloadAction } from "@reduxjs/toolkit"




export interface AuthSliceState {
    isauth: boolean,
    name: string, 
    status: "idle" | "loading" | "failed"
}

const initialState: AuthSliceState = {
    isauth: false,
    name: "",
    status: "idle",
}


export const authSlice = createAppSlice({
    name: "auth",
    
    initialState,
    
    reducers: create => ({
      changeAuth: create.reducer(
        (state, action: PayloadAction<boolean>) => {
        state.isauth = action.payload
      }),
      changeName: create.reducer(
        (state, action: PayloadAction<string>) => {
          state.name = action.payload
        }
      )
    }),
    selectors: {
        selectAuth: auth => auth.isauth,
        selectName: auth => auth.name,
      },

  })

  export const { selectAuth, selectName } = authSlice.selectors

  export const { 
    changeAuth,
    changeName 
  } = authSlice.actions


