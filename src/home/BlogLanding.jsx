import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  FileText,
  Search,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetBlogsQuery, useGetBlogCategoriesQuery } from "@/app/api/blogApiSlice";
import Header from "./homeComponents/Header";
import Footer from "./homeComponents/Footer";
import SubscriptionComponent from "./homeComponents/SubsciptionSection";


export default function BlogLandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredBlogPosts, setFilteredBlogPosts] = useState([]);

  // Debounce search term to avoid making API calls on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data: blogData, isLoading, isFetching, error } = useGetBlogsQuery({
    page: currentPage,
    category: selectedCategory,
    search: debouncedSearchTerm,
    limit: 9,
  });

  const { data: categoriesData } = useGetBlogCategoriesQuery();

  const blogPosts = blogData?.data || [];
  const pagination = blogData?.pagination || {};
  const categories = categoriesData?.data || [];

  useEffect(() => {
      if (blogPosts) {
          const filtered = blogPosts.filter(post =>
              post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              (post.tags && post.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())))
          );
          setFilteredBlogPosts(filtered);
      }
  }, [debouncedSearchTerm, blogPosts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Technology": return <Briefcase className="w-4 h-4" />;
      case "Security": return <Briefcase className="w-4 h-4" />;
      case "Compliance": return <FileText className="w-4 h-4" />;
      case "Global": return <Briefcase className="w-4 h-4" />;
      case "Business": return <Briefcase className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technology": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Security": return "bg-red-100 text-red-800 border-red-200";
      case "Compliance": return "bg-green-100 text-green-800 border-green-200";
      case "Global": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Business": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
        setCurrentPage(page);
    }
  };

  const displayPosts = debouncedSearchTerm ? filteredBlogPosts : blogPosts;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-white">
        {/* Hero Section */}
   <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
                      <div className="max-w-4xl mx-auto px-6">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="text-center"
                        >
                          <h1 className="text-4xl md:text-5xl font-bold mb-4"> Blog</h1>
                           <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Stay ahead with expert insights on identity verification, compliance, and digital security.
              </p>
                        </motion.div>
                      </div>
                    </div>

        {/* Blog Posts Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {(isLoading || isFetching) && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1987BF] mx-auto"></div>
                <p className="text-gray-600 mt-4 text-lg">Loading articles...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 text-xl font-semibold mb-2">
                  Error loading articles
                </div>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            )}

            {!isLoading && !isFetching && !error && (
              <>
                {/* Results Header with Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">
                            {selectedCategory === "all" ? "Latest Articles" : `${selectedCategory} Articles`}
                        </h2>
                        <p className="text-gray-600">
                            {displayPosts.length} {displayPosts.length === 1 ? 'article' : 'articles'} found
                        </p>
                    </div>
                    <div className="w-full md:w-auto max-w-md mt-4 md:mt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 bg-white border-gray-300 focus:ring-1 focus:ring-[#1987BF] focus:border-[#1987BF]"
                            />
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                {displayPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {displayPosts.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                      >
                        <Link to={`/blog/${post.slug}`} className="block group">
                          <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white transform hover:-translate-y-2 group">
                            <div className="relative overflow-hidden">
                              <img
                                src={post.featuredImage?.url || 'https://placehold.co/800x400/e2e8f0/e2e8f0'}
                                alt={post.title}
                                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              <div className="absolute top-4 left-4">
                                <Badge className={`${getCategoryColor(post.category)} border font-medium`}>
                                  {getCategoryIcon(post.category)}
                                  <span className="ml-1">{post.category}</span>
                                </Badge>
                              </div>
                            </div>

                            <CardContent className="p-6 flex flex-col">
                              <div className="flex-grow">
                                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {post.author}
                                  </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1987BF] transition-colors duration-300 line-clamp-2">
                                  {post.title}
                                </h3>
                                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                  {post.excerpt}
                                </p>
                              </div>

                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs text-gray-600">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && !debouncedSearchTerm && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {[...Array(pagination.totalPages).keys()].map((i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 ${currentPage === page ? "bg-[#1987BF] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <SubscriptionComponent />
      </main>
      <Footer />
    </div>
  );
}
