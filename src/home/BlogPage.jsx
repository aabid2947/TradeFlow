import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Link2 as LinkIcon,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetBlogBySlugQuery, useGetRelatedBlogsQuery } from "@/app/api/blogApiSlice";
import Header from "./homeComponents/Header";
import Footer from "./homeComponents/Footer";

// Custom styles for rich text content
const richTextStyles = {
  maxWidth: 'none',
  lineHeight: '1.75',
  fontSize: '1.125rem',
  color: '#374151',
};

export default function BlogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const { data: blogResponse, isLoading, error } = useGetBlogBySlugQuery(slug);
  const { data: relatedResponse } = useGetRelatedBlogsQuery(slug, {
      skip: !blogResponse?.data, // Skip fetching related blogs until the main blog is loaded
  });

  const blog = blogResponse?.data;
  const relatedBlogs = relatedResponse?.data || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Set meta tags for SEO
  useEffect(() => {
    if (blog) {
      document.title = blog.metaTitle || blog.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', blog.metaDescription || blog.excerpt);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = blog.metaDescription || blog.excerpt;
        document.head.appendChild(newMeta);
      }
    }
  }, [blog]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
    }
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1987BF]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Header />
        <div className="text-center flex-grow flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog post not found</h1>
            <p className="text-gray-600">The article you're looking for doesn't exist or has been moved.</p>
            <Button className="mt-4" onClick={() => navigate('/blog')}>
                <ArrowLeft className="w-4 h-4 mr-2"/>
                Back to Blog
            </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/blog" className="hover:text-[#1987BF] transition-colors">Blog</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 truncate">{blog.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-[#1987BF] text-white mb-6 text-sm font-medium">
                {blog.category}
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-slate-300 mb-8">
                <div className="flex items-center gap-2"><User className="w-5 h-5" /><span>{blog.author}</span></div>
                {/* <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /><span>{new Date(blog.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span></div> */}
                {/* <div className="flex items-center gap-2"><Clock className="w-5 h-5" /><span>{blog.readingTime} min read</span></div> */}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-slate-300 border-slate-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4">
                <Button onClick={() => navigate(-1)} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                {/* <div className="relative">
                  <Button onClick={() => setShowShareMenu(!showShareMenu)} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button> */}
                  
                  {/* {showShareMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border p-2 z-10 w-40">
                      <Button onClick={() => handleShare('facebook')} variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:bg-blue-50"><Facebook className="w-4 h-4 mr-2 text-blue-600" />Facebook</Button>
                      <Button onClick={() => handleShare('twitter')} variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:bg-blue-50"><Twitter className="w-4 h-4 mr-2 text-blue-400" />Twitter</Button>
                      <Button onClick={() => handleShare('linkedin')} variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:bg-blue-50"><Linkedin className="w-4 h-4 mr-2 text-blue-700" />LinkedIn</Button>
                      <Button onClick={() => handleShare('copy')} variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:bg-gray-50"><LinkIcon className="w-4 h-4 mr-2 text-gray-600" />Copy Link</Button>
                    </div>
                  )}
                </div> */}

                {/* <Button onClick={() => setIsBookmarked(!isBookmarked)} variant="outline" className={`border-slate-600 ${isBookmarked ? 'bg-[#1987BF] text-white border-[#1987BF]' : 'text-slate-300 hover:bg-slate-800'}`}>
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Saved' : 'Save'}
                </Button> */}
              </div>
            </motion.div>
          </div>
        </div>

        {blog.featuredImage?.url && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10"
            >
                <img src={blog.featuredImage.url} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-2xl" />
            </motion.div>
            </div>
        )}

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div 
              className="prose prose-lg prose-gray max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
                prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-[#1987BF] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ol:my-4
                prose-li:text-gray-700 prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-[#1987BF] 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8"
              style={richTextStyles}
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </motion.div>
        </article>

        {relatedBlogs.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {relatedBlogs.map((relatedBlog, index) => (
                  <motion.div
                    key={relatedBlog._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 * index }}
                  >
                    <Link to={`/blog/${relatedBlog.slug}`} className="block group">
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
                        <div className="relative overflow-hidden">
                          <img src={relatedBlog.featuredImage?.url || 'https://placehold.co/800x400/e2e8f0/e2e8f0'} alt={relatedBlog.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute top-4 left-4"><Badge className="bg-black/50 text-white border-0">{relatedBlog.category}</Badge></div>
                          <div className="absolute top-4 right-4"><Badge className="bg-black/50 text-white border-0"><Clock className="w-3 h-3 mr-1" />{relatedBlog.readingTime} min</Badge></div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1987BF] transition-colors line-clamp-2">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed line-clamp-3">
                            {relatedBlog.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}