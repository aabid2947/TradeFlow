"use client"

import { useState } from "react"
import ServiceCard from "./ServiceCard"
import ServiceList from "./ServiceList" // Import the new list component
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
import { List, Grid } from 'lucide-react'; // Import icons for view toggle

export default function Services() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [serviceToUpdate, setServiceToUpdate] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

    const fallbackImages = [
      PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage,
      PANAadhaarLinkedCardImage, PANValidationCardImage, PANLinkedCardImage,
    ];
    const demandLevels = ["Most Demanding", "Average Demanding", "Less Demanding"];

    const { data: services, isLoading, isError, error } = useGetServicesQuery();
    const [createService, { isLoading: isCreating, error: createError }] = useCreateServiceMutation();
    const [updateService, { isLoading: isUpdating, error: updateError }] = useUpdateServiceMutation();

    const handleOpenUpdateModal = (service) => {
        setServiceToUpdate(service);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setServiceToUpdate(null);
    };

    // Generic function to create FormData from service data object
    const createServiceFormData = (data, imageFile) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            const value = data[key];
            // Stringify objects and arrays before appending
            if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        return formData;
    };

    const handleAddService = async (serviceData, imageFile) => {
        const formData = createServiceFormData(serviceData, imageFile);
        try {
            await createService(formData).unwrap();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to create the service:', err);
        }
    };

    const handleUpdateService = async (serviceData, imageFile) => {
        const { _id, ...changes } = serviceData;
        const formData = createServiceFormData(changes, imageFile);
        try {
            await updateService({ id: _id, formData }).unwrap();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to update the service:', err);
        }
    };

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

    const renderServices = () => {
        if (viewMode === 'grid') {
            return (
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
                            serviceDbId={card.id}
                            onUpdateClick={() => handleOpenUpdateModal(card)}
                        />
                    ))}
                </div>
            );
        } else {
            return (
                <div className="space-y-4">
                    <div onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 hover:border-blue-500 transition-colors duration-300">
                        <PlusIcon className="w-8 h-8 text-gray-400" />
                        <span className="ml-3 text-base font-medium text-gray-600">Add New Service</span>
                    </div>
                    {serviceCards.map((card) => (
                        <ServiceList
                            key={card.id}
                            imageSrc={card.imageSrc}
                            demandLevel={card.demandLevel}
                            serviceName={card.serviceName}
                            verificationCount={card.verificationCount}
                            durationDays={card.durationDays}
                            price={card.price}
                            serviceId={card.serviceId}
                            serviceDbId={card.id}
                            onUpdateClick={() => handleOpenUpdateModal(card)}
                        />
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center my-8">
                    <h1 className="font-bold text-xl">Service Management</h1>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2  mt-3 rounded-md ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                            aria-label="List view"
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 mt-3 rounded-md ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                            aria-label="Grid view"
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {renderServices()}
            </div>

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