import ServiceCard from "@/cards/ServiceCard";
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";
import PANAadhaarLinkedCardImage from "@/assets/PANAadharLinkedCardImage.svg";
import PANValidationCardImage from "@/assets/PANValidationCardImage.svg";
import PANLinkedCardImage from "@/assets/PANLinkedCardImage.svg";
import { useGetServicesQuery } from "@/app/api/serviceApiSlice";

const fallbackImages = [
  PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage,
  PANAadhaarLinkedCardImage, PANValidationCardImage, PANLinkedCardImage,
];
const demandLevels = ["Most Demanding", "Average Demanding", "Less Demanding"];

export default function ServiceCardsViewer() {
  const { data: services, isLoading, isError, error } = useGetServicesQuery();

  const serviceCards = services?.data?.map((svc) => {
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    const randomDemand = demandLevels[Math.floor(Math.random() * demandLevels.length)];

    return {
      id: svc.service_key,
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
    <div>
      <h1 className="font-bold text-xl my-2">KYC Verification API</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            // Each card should link to its detailed service page
            serviceId={card.serviceId}
          />
        ))}
      </div>
    </div>
  );
}