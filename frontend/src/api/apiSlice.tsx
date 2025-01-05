import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dbApi = createApi({
    reducerPath: "dbApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080"}),
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (name) => `/users/${name}`
        }),
        createUser: builder.mutation({
            query: (user) => ({
                url: `/users`,
                method:   `POST`,
                body: user,
            }),
        }),
        getPages: builder.query({
            query: () => `/pages`,
        }),
        getPage: builder.query({
            query: (pagename) => `/pages/${pagename}`
        }),
        createPage: builder.mutation({
            query: (page) => ({
                url: `/pages`,
                method:    `POST`,
                body: page
            })
        }),
        createPost: builder.mutation({
            query: (post) => ({
                url: `/posts`,
                method:     `POST`,
                body: post
            })
            
        }),
        getPagePosts: builder.query({
            query: (pagename) => `posts/page/${pagename}`
        }),
        createTags: builder.mutation({
            query: (tags) => ({
                url: `/tags`,
                method:    `POST`,
                body: tags
            })
        })
    }),
});

export const { 
    useLazyGetUserQuery,
    useGetUserQuery,
    useCreateUserMutation, 
    useGetPagesQuery, 
    useCreatePageMutation,
    useCreatePostMutation,
    useLazyGetPageQuery,
    useGetPagePostsQuery,
    useCreateTagsMutation
} = dbApi;