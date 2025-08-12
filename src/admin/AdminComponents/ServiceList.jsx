import { Heart, Shield, Clock, Pencil, Trash2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useDeleteServiceMutation } from "../../app/api/serviceApiSlice";

// Skeleton component for when no image is available
const ImageSkeleton = () => (
  <div className="w-24 h-24 bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
    <ImageOff className="w-10 h-10 text-gray-400" />
  </div>
);

export default function ServiceList({
  imageSrc,
  alt = "",
  demandLevel,
  serviceName,
  verificationCount,
  durationDays,
  price,
  serviceId, // This is the service_key, used for navigation
  serviceDbId, // This is the database _id, used for mutations
  onUpdateClick, // Function to call when update is clicked
}) {
  const navigate = useNavigate();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDeleteService = async (e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      // Use the database _id for the delete mutation
      await deleteService(serviceDbId).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete service. Please try again.");
    }
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    onUpdateClick();
  };

  return (
    <div onClick={() => navigate(`/user/service/${serviceId}`)} className="flex items-center bg-white border border-[#1A89C1] p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 cursor-pointer">
      <div className="flex-shrink-0 w-32 h-32 mr-6">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt || serviceName}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ImageSkeleton />
        )}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 truncate">
                {serviceName}
            </h3>
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                {demandLevel}
            </Badge>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600 my-3">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>{verificationCount} Verifications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{durationDays} days</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3">
          <div className="text-2xl font-bold text-orange-500">₹ {price}</div>

        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-3 ml-6">
            <Button
              size="icon"
              variant="outline"
              onClick={handleUpdate}
              className="w-10 h-10 text-blue-600 border-gray-300 hover:bg-blue-50"
              aria-label="Update service"
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={isDeleting}
              onClick={handleDeleteService}
              className="w-10 h-10 text-red-600 border-gray-300 hover:bg-red-50 disabled:opacity-50"
              aria-label="Delete service"
            >
              {isDeleting ? "..." : <Trash2 className="w-5 h-5" />}
            </Button>
          </div>
    </div>
  );
}