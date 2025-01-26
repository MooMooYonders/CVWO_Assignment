import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const dbApi = createApi({
    reducerPath: "dbApi",
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL}),
    tagTypes: ["PagePosts", "PostComments"],
    endpoints: (builder) => ({
        //Users
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
        getLastSeen: builder.query({
            query: (username) => `/users/last_seen/${username}`
        }),
        updateLastSeen: builder.mutation({
            query: (username) => ({
                url: `/users/${username}`,
                method: `PATCH`,
                body: {},
            })
        }),

        //Pages
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
        //Posts
        createPost: builder.mutation({
            query: (post) => ({
                url: `/posts`,
                method:     `POST`,
                body: post
            })
            
        }),
        getPagePostsAsc: builder.query({
            query: (pagename) => `/posts/page/${pagename}/asc`,
            providesTags: (result, error, pagename) => [{type: "PagePosts", id: pagename}],
        }),
        getPagePostsDesc: builder.query({
            query: (pagename) => `/posts/page/${pagename}/desc`,
            providesTags: (result, error, pagename) => [{type: "PagePosts", id: pagename}],
        }),
        getPostByPostID: builder.query({
            query: (post_id) => `/posts/${post_id}`
        }),
        getPostsLikeTitleAsc: builder.query({
            query: (req) => ({
                url: `/posts/page/title/asc`,
                method: `POST`,
                body: req,
            })
        }),
        getPostsLikeTitleDesc: builder.query({
            query: (req) => ({
                url: `/posts/page/title/desc`,
                method: `POST`,
                body: req,
            })
        }),
        getPostsByTagsAsc: builder.mutation({
            query: (req) => ({
                url: `/posts/page/tags/asc`,
                method: `POST`,
                body: req,
            })
        }),
        getPostsByTagsDesc: builder.mutation({
            query: (req) => ({
                url: `/posts/page/tags/desc`,
                method: `POST`,
                body: req,
            })
        }),
        getUserPostsAsc: builder.query({
            query: (username) => `/posts/user/${username}/asc`
        }),
        getUserPostsDesc: builder.query({
            query: (username) => `/posts/user/${username}/desc`
        }),
        getUserPostsByPagename: builder.mutation({
            query: (req) => ({
                url: "posts/user/pagename",
                method: "POST",
                body: req
            })
        }),
        getUserPostsByNotifications: builder.query({
            query: (username) => `/posts/user/${username}/notifications`
        }),
        //Tags
        createTags: builder.mutation({
            query: (tags) => ({
                url: `/tags`,
                method:    `POST`,
                body: tags
            })
        }),
        createPostTags: builder.mutation({
            query: (ids) => ({
                url: `/post_tags`,
                method:     `POST`,
                body: ids
            })
        }),
        getTagsByPostId: builder.query({
            query: (post_id) => `/tags/${post_id}`
        }),
        getTagsByPage: builder.query({
            query: (pagename) => `/tags/page/${pagename}`
        }),
        getPopularTagsByPage: builder.query({
            query: (pagename) => `/tags/page/${pagename}/popular`
        }),
        getTagsLikeNameAndByPage: builder.mutation({
            query: (req) => ({
                url: `/tags/name/page`,
                method: `POST`,
                body: req,
            })
        }),
        //Comments
        createComment: builder.mutation({
            query: (comment) => ({
                url: `/comments`,
                method:     `POST`,
                body: comment
            })
        }),
        getCommentsByPostID: builder.query({
            query: (post_id) => `/comments/post/${post_id}`,
            providesTags: (result, error, post_id) => [{type: "PostComments", id: post_id}],
        }),
        getCommentByID: builder.query({
            query: (comment_id) => `/comments/comment/${comment_id}`
        }),
        getUnreadCommentsByPostID: builder.query({
            query: (post_id) => `/comments/unread/${post_id}`
        }),
        getReadCommentsByPostID: builder.query({
            query: (post_id) => `/comments/read/${post_id}`
        }),
        UpdateCommentsUserLastSeen: builder.mutation({
            query: (post_id) => ({
                url: `/comments/user_last_seen/${post_id}`,
                method: `PUT`,
                body: {},
            })
        }),
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
    useGetPagePostsAscQuery,
    useCreateTagsMutation,
    useCreatePostTagsMutation,
    useGetTagsByPostIdQuery,
    useCreateCommentMutation,
    useGetCommentsByPostIDQuery,
    useGetPostByPostIDQuery,
    useGetCommentByIDQuery,
    useLazyGetCommentByIDQuery,
    useLazyGetPagePostsAscQuery,
    useLazyGetPagePostsDescQuery,
    useLazyGetTagsByPostIdQuery,
    useLazyGetPostsLikeTitleAscQuery,
    useLazyGetPostsLikeTitleDescQuery,
    useGetPostsByTagsAscMutation,
    useGetPostsByTagsDescMutation,
    useGetTagsLikeNameAndByPageMutation,
    useLazyGetLastSeenQuery,
    useUpdateLastSeenMutation,
    useLazyGetUserPostsAscQuery,
    useLazyGetUserPostsDescQuery,
    useLazyGetUnreadCommentsByPostIDQuery,
    useUpdateCommentsUserLastSeenMutation,
    useLazyGetCommentsByPostIDQuery,
    useLazyGetReadCommentsByPostIDQuery,
    useLazyGetTagsByPageQuery,
    useLazyGetUserPostsByNotificationsQuery,
    useGetUserPostsByPagenameMutation,
    useGetPopularTagsByPageQuery,
    useLazyGetPopularTagsByPageQuery,
    useLazyGetPagesQuery
} = dbApi;