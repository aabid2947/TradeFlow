"use client";
import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// RTK Query Hooks
import { useCreateReviewMutation, useUpdateReviewMutation } from "@/app/api/reviewApiSlice";

// --- UI COMPONENTS (assumed to be in your project) ---
const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded ${className}`} {...props}>
    {children}
  </button>
);

const Textarea = ({ className, ...props }) => (
  <textarea className={`w-full p-3 border rounded-lg resize-none ${className}`} {...props} />
);

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

const CardContent = ({ children, className }) => (
  <div className={`px-6 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className }) => (
  <div className={`p-6 pt-4 ${className}`}>{children}</div>
);

function StarRatingInput({ rating, setRating }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        const isActive = ratingValue <= (hoveredRating || rating);

        return (
          <motion.button
            type="button"
            key={ratingValue}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHoveredRating(ratingValue)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                rotate: isActive ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <Star
                className={`h-9 w-9 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
              />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}


// --- MAIN COMPONENT ---
export default function ReviewModal({ existingReview, onClose, serviceId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const isEditing = !!existingReview;

  // --- DATA FETCHING ---
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (isEditing) {
      setRating(existingReview.rating || 0);
      setComment(existingReview.comment || "");
    }
  }, [existingReview, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    try {
      if (isEditing) {
        await updateReview({ reviewId: existingReview._id, rating, comment }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        const reviewPayload = {
          serviceId,
          rating,
          comment,
        };

        await createReview(reviewPayload).unwrap();
        toast.success("Thank you for your review!");
      }
      onClose();
    } catch (err) {
      const errorMessage = err.data?.error || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            mass: 0.8
          }}
          className="w-full max-w-lg mx-auto relative h-auto max-h-[90vh]"
        >
          <Card className="rounded-2xl shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white via-white to-gray-50/80 backdrop-blur-sm h-full flex flex-col">
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </motion.button>

            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100/50">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <CardTitle className="text-2xl font-bold text-gray-800 pr-12">
                  {isEditing ? "✨ Edit Your Review" : "⭐ Share Your Review"}
                </CardTitle>
              </motion.div>
            </CardHeader>

            <div className="flex-1 overflow-y-auto">
              <CardContent className="space-y-8 py-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center space-y-4"
                >
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100">
                    <StarRatingInput rating={rating} setRating={setRating} />
                    {rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-gray-600 mt-3 font-medium"
                      >
                        {['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Great', '🤩 Excellent'][rating]}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Transaction selection has been removed */}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="block text-sm font-semibold text-gray-700 mb-3">
                    Tell us more about your experience 💭
                    <span className="text-gray-500 font-normal"> (optional)</span>
                  </div>
                  <Textarea
                    placeholder="What did you like most? Any suggestions for improvement? Your feedback helps others make informed decisions..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400 bg-gradient-to-br from-white to-gray-50"
                  />
                  <div className="text-right mt-2">
                    <span className="text-xs text-gray-400">
                      {comment.length}/500 characters
                    </span>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg"
                    >
                      <div className="flex items-center">
                        <div className="text-red-400 mr-3">⚠️</div>
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </div>

            <CardFooter className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-100/50">
              <motion.div
                className="w-full"
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-300 ${
                    isSubmitting || rating === 0
                      ? "bg-gray-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isEditing ? "💫 Update Review" : "🚀 Submit Review"}
                    </span>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}