"use client"

import { useState } from "react"
import ServiceCard from "@/cards/ServiceCard"
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";
import PANAadhaarLinkedCardImage from "@/assets/PANAadharLinkedCardImage.svg";
import PANValidationCardImage from "@/assets/PANValidationCardImage.svg";
import PANLinkedCardImage from "@/assets/PANLinkedCardImage.svg";
import { useGetServicesQuery, useCreateServiceMutation } from "@/app/api/serviceApiSlice";
import AddServiceForm from "./AddServiceForm"; // Import the new form component
import PlusIcon from "@/icons/PlusIcon"; // Import the Plus icon

export default function Services() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fallbackImages = [
      PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage,
      PANAadhaarLinkedCardImage, PANValidationCardImage, PANLinkedCardImage,
    ];
    const demandLevels = ["Most Demanding", "Average Demanding", "Less Demanding"];
    
    const { data: services, isLoading, isError, error } = useGetServicesQuery();
    const [createService, { isLoading: isCreating, isError: isCreateError, error: createError }] = useCreateServiceMutation();

    const handleAddService = async (serviceData) => {
        try {
            await createService(serviceData).unwrap();
            // On success, close the modal
            setIsModalOpen(false);
        } catch (err) {
            // Error is handled by the component's state, but you can log it here
            console.error('Failed to create the service:', err);
        }
    };

    const serviceCards = services?.data?.map((svc) => {
        const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        const randomDemand = demandLevels[Math.floor(Math.random() * demandLevels.length)];

        return {
            id: svc._id,
            imageSrc: svc.imageUrl || randomImage,
            demandLevel: svc.demandLevel || randomDemand,
            serviceName: svc.name,
            verificationCount: svc.globalUsageCount,
            durationDays: 7,
            price: svc.price,
            buttonState: "subscribe",
            serviceId: svc.service_key,
        };
    }) ?? [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full" style={{ height: '60vh' }}>
                <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center w-full bg-red-100 p-4 rounded-md" style={{ height: '60vh' }}>
                <div className="text-red-700 text-center">
                    <h3 className="font-bold text-lg">Oops! Something went wrong.</h3>
                    <p>{error?.data?.message || error?.error || "Failed to fetch services."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-bold text-xl my-2">KYC Verification API</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Add New Service Card */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors duration-300 min-h-[300px]"
                    >
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
                            buttonState={card.buttonState}
                            serviceId={card.serviceId}
                        />
                    ))}
                </div>
            </div>

            {/* Modal for Adding a New Service */}
            {isModalOpen && (
                <AddServiceForm
                    onSubmit={handleAddService}
                    onClose={() => setIsModalOpen(false)}
                    isLoading={isCreating}
                    error={createError}
                />
            )}
        </div>
    )
}
