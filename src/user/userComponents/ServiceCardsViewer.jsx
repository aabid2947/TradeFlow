import ServiceCard from "@/cards/ServiceCard";
import PANCardImage from "@/assets/PANCardImage.svg";
import AadharCardImage from "@/assets/AadharCardImage.svg";
import VoterCardImage from "@/assets/VoterCardImage.svg";
import PassportCardImage from "@/assets/PassportCardImage.svg";
import PANAadhaarLinkedCardImage from "@/assets/PANAadharLinkedCardImage.svg";
import PANValidationCardImage from "@/assets/PANValidationCardImage.svg";
import PANLinkedCardImage from "@/assets/PANLinkedCardImage.svg";

const fallbackImages = [
  PANCardImage, AadharCardImage, VoterCardImage, PassportCardImage,
  PANAadhaarLinkedCardImage, PANValidationCardImage, PANLinkedCardImage,
];
const demandLevels = ["Most Demanding", "Average Demanding", "Less Demanding"];

// The component now accepts `services` and `isLoading` as props
export default function ServiceCardsViewer({ services = [], isLoading }) {
 
  const serviceCards = services.map((svc) => {
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
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full" style={{ height: '60vh' }}>
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-xl my-2">KYC Verification API</h1>
      {serviceCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>No services found for this category.</p>
        </div>
      )}
    </div>
  );
}