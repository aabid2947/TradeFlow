"use client"

import { useState } from "react"
import ServiceCard from "./ServiceCard"
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";
import PANAadhaarLinkedCardImage from "@/assets/PANAadharLinkedCardImage.svg";
import PANValidationCardImage from "@/assets/PANValidationCardImage.svg";
import PANLinkedCardImage from "@/assets/PANLinkedCardImage.svg";
import { useGetServicesQuery, useCreateServiceMutation, useUpdateServiceMutation } from "@/app/api/serviceApiSlice";
import AddServiceForm from "./AddServiceForm";
import PlusIcon from "@/icons/PlusIcon";

export default function Services() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [serviceToUpdate, setServiceToUpdate] = useState(null);

    const fallbackImages = [
      PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage,
      PANAadhaarLinkedCardImage, PANValidationCardImage, PANLinkedCardImage,
    ];
    const demandLevels = ["Most Demanding", "Average Demanding", "Less Demanding"];
    
    const { data: services, isLoading, isError, error } = useGetServicesQuery();
    const [createService, { isLoading: isCreating, error: createError }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating, error: updateError }] = useUpdateServiceMutation();

    const handleAddService = async (serviceData) => {
        try {
            await createService(serviceData).unwrap();
            setIsAddModalOpen(false); 
        } catch (err) {
            console.error('Failed to create the service:', err);
        }
    };

    const handleUpdateService = async (serviceData) => {
        try {
            console.log(serviceData)
            await updateService({ id: serviceData._id, changes: serviceData }).unwrap();
            setServiceToUpdate(null); 
        } catch (err) {
            console.error('Failed to update the service:', err);
        }
    };

    const handleOpenUpdateModal = (service) => {
        setServiceToUpdate(service);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setServiceToUpdate(null);
    };

    // Spread the original service object `svc` to ensure all its data is preserved
    const serviceCards = services?.data?.map((svc) => {
        const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        const randomDemand = demandLevels[Math.floor(Math.random() * demandLevels.length)];

        return {
            ...svc,
            id: svc._id,
            imageSrc: svc.imageUrl || randomImage,
            demandLevel: svc.demandLevel || randomDemand,
            serviceName: svc.name,
            verificationCount: svc.globalUsageCount,
            durationDays: 7,
            price: svc.price,
            serviceId: svc.service_key,
        };
    }) ?? [];

    if (isLoading) {
        return <div className="flex justify-center items-center h-[60vh]"><div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div></div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center h-[60vh] bg-red-100 p-4 rounded-md"><div className="text-red-700 text-center"><h3 className="font-bold text-lg">Oops! Something went wrong.</h3><p>{error?.data?.message || "Failed to fetch services."}</p></div></div>;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="font-bold text-xl my-4">KYC Verification API</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => setIsAddModalOpen(true)} className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors duration-300 min-h-[300px]">
                        <PlusIcon className="w-12 h-12 text-gray-400" />
                        <span className="mt-2 text-sm font-medium text-gray-600">Add New Service</span>
                    </div>

                    {serviceCards.map((card) => (
                        <ServiceCard
                            key={card.id}
                            imageSrc={card.imageSrc}
                            demandLevel={card.demandLevel}
                            serviceName={card.serviceName}
                            verificationCount={card.verificationCount}
                            durationDays={card.durationDays}
                            price={card.price}
                            serviceId={card.serviceId}
                            serviceDbId={card.id} // Pass the database _id
                            onUpdateClick={() => handleOpenUpdateModal(card)} // Pass the handler
                        />
                    ))}
                </div>
            </div>

            {/* Modal for Adding OR Updating a Service */}
            {(isAddModalOpen || serviceToUpdate) && (
                <AddServiceForm
                    initialData={serviceToUpdate}
                    onSubmit={serviceToUpdate ? handleUpdateService : handleAddService}
                    onClose={handleCloseModal}
                    isLoading={isCreating || isUpdating}
                    error={serviceToUpdate ? updateError : createError}
                />
            )}
        </div>
    );
}