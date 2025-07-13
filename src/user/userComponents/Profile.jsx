import { MoreVertical, Bell, Folder, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import userPic from "@/assets/UserImage.svg"
export default function Profile() {
    const recentVerifications = [
        {
            id: 1,
            name: "Rahul Kumar",
            role: "Software Developer",
            status: "Verified",
            avatar: userPic, // Placeholder for Rahul Kumar
        },
        {
            id: 2,
            name: "Preeti Senan",
            role: "Manager",
            status: "Verified",
            avatar: userPic, // Placeholder for Preeti Senan
        },
        {
            id: 3,
            name: "Kumar Shiv",
            role: "Cleaner",
            status: "Verified",
            avatar: userPic, // Placeholder for Kumar Shiv
        },
        {
            id: 4,
            name: "Raju Kumar",
            role: "Front-End Developer",
            status: "Pending",
            avatar: userPic, // Placeholder for Raju Kumar
        },
        {
            id: 5,
            name: "Krishna",
            role: "Cleaner",
            status: "Verified",
            avatar: userPic, // Placeholder for Krishna
        },
    ]

    return (
        <div className="flex flex-col gap-6 ">
            {/* Your Profile Card */}
            <Card className="relative w-full max-w-sm mx-auto md:mx-0 border border-[#1A89C1] rounded-[34rem] shadow-sm p-2 md:p-4">
                <div className="flex flex-row items-center justify-between pb-2">
                    <CardHeader >
                        <CardTitle className="text-lg font-semibold text-gray-800">Your Profile</CardTitle>

                    </CardHeader> 
                      <CardHeader >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-8 w-8 text-gray-500" />
                            <span className="sr-only">More options</span>
                        </Button>
                    </CardHeader>
                </div>
                <CardContent className="flex flex-col items-center text-center pt-0">
                    <div className="relative mb-4">
                        <Avatar className="h-24 w-24 border-4 border-white ring-2 ring-blue-500/50">
                            <AvatarImage src={userPic} alt="Rahul's profile picture" />
                            <AvatarFallback>RH</AvatarFallback>
                        </Avatar>
                        {/* This div creates the blue progress ring effect */}
                        <div
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin-slow"
                            style={{ animationDuration: "5s" }}
                        ></div>
                    </div>
                    <h2 className="text-xl  text-gray-900 mb-1">Good Morning <span className="font-bold">Rahul</span> </h2>
                    <p className="text-sm text-gray-400 mb-6">Continue Your Journey And Start Verifying</p>
                    <div className="flex justify-center gap-4 w-full">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                        >
                            <Folder className="h-5 w-5" />
                            <span className="sr-only">Documents</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                        >
                            <Folder className="h-5 w-5" />
                            <span className="sr-only">Files</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Verifications Section */}
            <div className="w-full max-w-sm mx-auto md:mx-0">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Recent Verifications</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add new verification</span>
                    </Button>
                </div>
                <div className="space-y-4">
                    {recentVerifications.map((verification) => (
                        <div
                            key={verification.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={verification.avatar || "/placeholder.svg"} alt={verification.name} />
                                    <AvatarFallback>
                                        {verification.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900">{verification.name}</p>
                                    <p className="text-sm text-gray-500">{verification.role}</p>
                                </div>
                            </div>
                            <Badge
                                className={`px-3 py-1 rounded-full text-xs font-medium ${verification.status === "Verified" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {verification.status}
                            </Badge>
                        </div>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Button
                        variant="outline"
                        className="w-full max-w-[200px] border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full px-6 py-2 bg-transparent"
                    >
                        See All
                    </Button>
                </div>
            </div>
        </div>
    )
}
