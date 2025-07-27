import React, { useState } from "react"
import { MoreVertical, Bell, Folder, Edit3, Check, X, User, Mail } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useUpdateProfileMutation } from '@/app/api/authApiSlice'
import userPic from "@/assets/UserImage.svg"

export default function Profile() {
    const user = useSelector(selectCurrentUser)
    const dispatch = useDispatch()
    const [updateProfile, { isLoading }] = useUpdateProfileMutation()
    
    // State for edit modal
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(user?.name || "")
    const [error, setError] = useState("")

    const handleEditClick = () => {
        setIsEditing(true)
        setEditedName(user?.name || "")
        setError("")
    }

    const handleSaveName = async () => {
        if (!editedName.trim()) {
            setError("Name cannot be empty")
            return
        }

        try {
            // Make API call to update profile
            const result = await updateProfile({ name: editedName.trim() }).unwrap()
            
            // Update Redux store with new user data
            dispatch(setCredentials({ data: result }))
            
            setIsEditing(false)
            setError("")
            // You can add a success toast here
            console.log("Profile updated successfully")
        } catch (error) {
            console.error('Failed to update profile:', error)
            setError(error?.data?.message || "Failed to update profile")
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditedName(user?.name || "")
        setError("")
    }

    const handleNameChange = (e) => {
        setEditedName(e.target.value)
        if (error) setError("") // Clear error when user starts typing
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveName()
        } else if (e.key === 'Escape') {
            handleCancelEdit()
        }
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Your Profile Card */}
                <div className="relative w-full min-w-[5rem] mx-auto md:mx-0 border border-[#1A89C1] rounded-3xl shadow-sm p-2 md:p-4 bg-white">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <div className="p-6 pb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Your Profile</h3>
                        </div> 
                        <div className="p-6 pb-2">
                            <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
                                <MoreVertical className="h-5 w-5 text-gray-500" />
                                <span className="sr-only">More options</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center pt-0 p-6">
                        <div className="relative mb-4">
                            <div className="h-24 w-24 border-4 border-white ring-2 ring-blue-500/50 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                <img 
                                    src={userPic} 
                                    alt={`${user?.name} profile picture`} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Progress ring effect */}
                            <div
                                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500"
                                style={{ 
                                    animation: "spin 5s linear infinite"
                                }}
                            ></div>
                        </div>
                        
                        <h2 className="text-xl text-gray-900 mb-1">
                            Good Morning <span className="font-bold">{user?.name}</span>
                        </h2>
                        <p className="text-sm text-gray-400 mb-6">Continue Your Journey And Start Verifying</p>
                        
                        {/* Edit Profile Button */}
                        <button
                            onClick={handleEditClick}
                            className="w-full bg-[#1A89C1] hover:bg-[#1A89C1]/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Edit3 className="h-4 w-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-transparent modal-overlay  bg-opacity-30 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
                            <button
                                onClick={handleCancelEdit}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Profile Picture */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="h-20 w-20 border-4 border-white ring-2 ring-blue-500/50 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                        <img 
                                            src={userPic} 
                                            alt={`${user?.name} profile picture`} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field (Non-editable) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <Mail className="h-4 w-4 inline mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* Name Field (Editable) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <User className="h-4 w-4 inline mr-2" />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={handleNameChange}
                                    onKeyDown={handleKeyPress}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        error ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter your name"
                                    autoFocus
                                />
                                {error && (
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={handleCancelEdit}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveName}
                                disabled={isLoading || !editedName.trim()}
                                className="flex-1 px-4 py-3 bg-[#1A89C1] text-white rounded-xl hover:bg-[#1A89C1]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    )
}