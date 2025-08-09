import { apiSlice } from './apiSlice';

const BLOGS_URL = '/blogs';

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all published blogs with pagination and filtering
    getBlogs: builder.query({
      query: ({ page = 1, limit = 12, category = 'all' } = {}) => ({
        url: BLOGS_URL,
        method: 'GET',
        params: { page, limit, category }
      }),
      providesTags: ['Blog'],
      keepUnusedDataFor: 300, // Keep data for 5 minutes
    }),

    // Query to get all blogs for admin (including drafts)
    getBlogsAdmin: builder.query({
      query: () => ({
        url: `${BLOGS_URL}/admin/all`,
        method: 'GET',
      }),
      providesTags: ['Blog'],
    }),

    // Query to get a single blog by its slug
    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: `${BLOGS_URL}/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Blog', id: arg }],
    }),

    // Query to get blog categories
    getBlogCategories: builder.query({
      query: () => ({
        url: `${BLOGS_URL}/categories`,
        method: 'GET',
      }),
      providesTags: ['BlogCategory'],
    }),

    // Query to get related blogs
    getRelatedBlogs: builder.query({
      query: (slug) => ({
        url: `${BLOGS_URL}/${slug}/related`,
        method: 'GET',
      }),
      providesTags: ['Blog'],
    }),

    // Mutation to create a new blog post (for admins)
    createBlog: builder.mutation({
      query: (formData) => ({
        url: BLOGS_URL,
        method: 'POST',
        body: formData, // FormData is sent directly
      }),
      invalidatesTags: ['Blog', 'BlogCategory'],
    }),

    // Mutation to update an existing blog post (for admins)
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${BLOGS_URL}/${id}`,
        method: 'PUT',
        body: formData, // FormData is sent directly
      }),
      invalidatesTags: (result, error, arg) => [
        'Blog', 
        'BlogCategory',
        { type: 'Blog', id: arg.id }
      ],
    }),

    // Mutation to delete a blog post (for admins)
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${BLOGS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog', 'BlogCategory'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogsAdminQuery,
  useGetBlogBySlugQuery,
  useGetBlogCategoriesQuery,
  useGetRelatedBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApiSlice;