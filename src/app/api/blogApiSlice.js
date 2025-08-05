import { apiSlice } from './apiSlice';

const BLOGS_URL = '/blogs';

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all blogs for the landing page
    getBlogs: builder.query({
      query: () => ({
        url: BLOGS_URL,
        method: 'GET',
      }),
      providesTags: ['Blog'],
      keepUnusedDataFor: 5, // Keep data for 5 seconds after unmount
    }),

    // Query to get a single blog by its slug
    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: `${BLOGS_URL}/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Blog', id: arg }],
    }),

    // Mutation to create a new blog post (for admins)
    createBlog: builder.mutation({
      query: (formData) => ({
        url: BLOGS_URL,
        method: 'POST',
        body: formData, // FormData is sent directly
      }),
      invalidatesTags: ['Blog'],
    }),

    // Mutation to update an existing blog post (for admins)
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${BLOGS_URL}/${id}`,
        method: 'PUT',
        body: formData, // FormData is sent directly
      }),
      invalidatesTags: (result, error, arg) => ['Blog', { type: 'Blog', id: arg.id }],
    }),

    // Mutation to delete a blog post (for admins)
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${BLOGS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApiSlice;