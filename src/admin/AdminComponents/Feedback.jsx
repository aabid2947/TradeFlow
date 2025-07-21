"use client";
import { Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetAllReviewsQuery, useDeleteReviewMutation } from "@/app/api/reviewApiSlice.js";
import { toast } from "react-hot-toast";

//  UI COMPONENTS 

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300")}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton loader component that mimics the layout of a feedback card.
 * This is shown to the user while the review data is being fetched.
 */
function FeedbackSkeleton() {
  return (
    <div className="p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start gap-4 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-300"></div>
              <div className="h-3 w-48 rounded bg-gray-300"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="h-8 w-8 rounded bg-gray-300"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

//  MAIN COMPONENT 

export default function Feedback() {
  const { data: reviewsData, isLoading, isError, error } = useGetAllReviewsQuery();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      try {
        await deleteReview(reviewId).unwrap();
        toast.success("Review deleted successfully.");
      } catch (err) {
        toast.error(err.data?.error || "Failed to delete review.");
      }
    }
  };

  const reviews = reviewsData?.data || [];
  const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp"; // Default user image

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Customer Feedback</h1>
        <p className="text-gray-500">Admin panel to manage all reviews across services.</p>
      </div>

      <div className="space-y-4">
        {isLoading && (
          // Show skeleton loaders while fetching data
          <>
            <FeedbackSkeleton />
            <FeedbackSkeleton />
            <FeedbackSkeleton />
            <FeedbackSkeleton />
          </>
        )}
        
        {isError && <p className="text-red-500">Error fetching reviews: {error.toString()}</p>}
        
        {!isLoading && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id} className="p-4 rounded-lg shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user?.avatar || defaultAvatar} alt={review.user?.name} />
                    <AvatarFallback>{review.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900">{review.user?.name || "Anonymous"}</h3>
                            <p className="text-xs text-gray-500">
                                On Service: <span className="font-medium">{review.service?.name || "Unknown"}</span>
                                {' · '}
                                {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <StarRating rating={review.rating} />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
                                onClick={() => handleDelete(review._id)}
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
            !isLoading && !isError && <p className="text-center text-gray-500 py-10">No reviews found.</p>
        )}
      </div>
    </div>
  );
}