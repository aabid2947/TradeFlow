
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Award } from 'lucide-react';

export const ServiceDetailCard = ({ service, onTryOut, isSubscribed }) => {
    if (!service) {
        return (
            <Card className="h-full flex items-center justify-center border-dashed">
                <CardContent className="text-center p-6">
                    <p className="text-gray-500">Select a service from the left to see details.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
                <CardDescription className="pt-1">{service.category.replace(/_/g, ' ')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className='mt-auto'>
                    <Button onClick={onTryOut} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        {isSubscribed ? <Zap className="w-5 h-5 mr-2" /> : <Award className="w-5 h-5 mr-2" />}
                        {isSubscribed ? "Try It Out" : "Subscribe to Try"}
                    </Button>
                    <p className="text-center text-xs text-gray-500 pt-3">
                        {isSubscribed ? "You have access to our live sandbox for this service." : "A subscription is required to use the live sandbox."}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};