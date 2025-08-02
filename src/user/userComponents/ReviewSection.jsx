"use client";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Star, Edit, Trash2, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectCurrentUser } from "@/features/auth/authSlice";
import {
  useGetReviewsByServiceQuery, // UPDATED: Use specific query
  useGetMyReviewsQuery,
  useDeleteReviewMutation,
} from "@/app/api/reviewApiSlice.js";
import ReviewModal from "./ReviewModal";
import ReviewSkeleton from "@/components/skeletons/ReviewSkeleton"; 
import { toast } from "react-hot-toast";
import { useGetAllReviewsQuery } from "../../app/api/reviewApiSlice";

// --- UI COMPONENTS (Unchanged) ---
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

function ReviewCard({ review, isCurrentUserReview, onEdit, onDelete }) {
  const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";

  return (
    <Card className={cn("p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md", isCurrentUserReview && "border-2 border-blue-500 bg-blue-50/80")}>
      <CardContent className="p-0">
        <div className="flex items-start gap-4 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user?.avatar || defaultAvatar} alt={review.user?.name} />
            <AvatarFallback>{review.user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{isCurrentUserReview ? "Your Review" : review.user?.name}</h3>
            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
            {isCurrentUserReview && (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(review)}><Edit className="h-4 w-4 text-blue-600" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(review._id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  );
}

// --- MAIN COMPONENT ---
export default function ReviewSection({ serviceId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const currentUser = useSelector(selectCurrentUser);

  // UPDATED: Fetch reviews specific to the serviceId

  const { data: serviceReviewsData, isLoading: isLoadingServiceReviews } =   useGetAllReviewsQuery();

  const [deleteReview] = useDeleteReviewMutation();
  const isLoading = isLoadingServiceReviews;

  // UPDATED: Process reviews based on the current user's ID
  const { myReviews, otherReviews } = useMemo(() => {
    const allServiceReviews = serviceReviewsData?.data || [];
    if (!currentUser) {
      return { myReviews: [], otherReviews: allServiceReviews };
    }
    const myOwnReviews = allServiceReviews.filter(r => r.user?._id === currentUser._id || r.user === currentUser._id);
    const others = allServiceReviews.filter(r => r.user?._id !== currentUser._id && r.user !== currentUser._id);
    return { myReviews: myOwnReviews, otherReviews: others };
  }, [serviceReviewsData, currentUser]);

  // --- HANDLER FUNCTIONS (Unchanged) ---
  const handleOpenModal = () => {
    setEditingReview(null);
    setIsModalOpen(true);
  };
  const handleEdit = (review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  }
  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        await deleteReview(reviewId).unwrap();
        toast.success("Review deleted.");
      } catch (err) {
        toast.error(err.data?.error || "Failed to delete review.");
      }
    }
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  }

  return (
    <>
      {isModalOpen && currentUser && <ReviewModal existingReview={editingReview} onClose={handleCloseModal} />}
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          {currentUser && (
            <Button onClick={handleOpenModal} className="bg-blue-600 hover:bg-blue-700">
              <Share2 className="h-4 w-4 mr-2" /> Share Your Experience
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <><ReviewSkeleton /><ReviewSkeleton /><ReviewSkeleton /></>
          ) : (
            <>
              {myReviews.length > 0 && myReviews.map((review) => (
                <ReviewCard key={review._id} review={review} isCurrentUserReview={true} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
              {myReviews.length > 0 && otherReviews.length > 0 && <hr className="my-6 border-gray-200" />}
              {otherReviews.length > 0 ? (
                otherReviews.map((review) => <ReviewCard key={review._id} review={review} />)
              ) : (
                myReviews.length === 0 && <p className="text-center text-gray-500 py-8">No customer reviews yet. Be the first!</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}