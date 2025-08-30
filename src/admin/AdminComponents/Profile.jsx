
import React, { useState, useEffect, useRef } from "react"
import {
    MoreVertical, Bell, Edit3, Check, X, User, Mail, ShieldCheck, AlertTriangle, CreditCard,
    Activity, Shield, Award, Settings, Phone, CheckCircle, XCircle, Crown, Upload, Loader2
} from "lucide-react"
import { useSelector } from "react-redux"
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useUpdateProfileMutation, useUpdateAvatarMutation, useRemindSubscriptionMutation } from '@/app/api/authApiSlice'
import { toast } from "react-hot-toast"
import userPic from "@/assets/UserImage.svg"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Generate a random color for the avatar background (same as header)
const generateRandomColor = (name) => {
    if (!name) return '#1987BF';

    const colors = [
        '#1987BF', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#34495e', '#e67e22', '#3498db', '#8e44ad',
        '#27ae60', '#f1c40f', '#e74c3c', '#95a5a6', '#d35400'
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    if (dateString === 'Never') return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function Profile() {
    const user = useSelector(selectCurrentUser)
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()
    const [updateAvatar, { isLoading: isUploadingAvatar }] = useUpdateAvatarMutation()
    const [sendReminder] = useRemindSubscriptionMutation();
    // console.log(user)
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(user?.name || "")
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState('overview');

    // --- NEW: State for image upload ---
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Generate avatar background color
    const avatarBgColor = generateRandomColor(user?.name);

    useEffect(() => {
        if (!user?._id || !user.activeSubscriptions) return;

        const checkAndSendReminders = async () => {
            const now = new Date();
            for (const sub of user.activeSubscriptions) {
                const expiryDate = new Date(sub.expiresAt);
                if (expiryDate > now) {
                    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
                    if (daysRemaining <= 3) {
                        const reminderKey = `reminderSent_${user._id}_${sub.category}`;
                        if (!sessionStorage.getItem(reminderKey)) {
                            try {
                                toast.error(`Your subscription for "${sub.category.replace(/_/g, " ")}" expires in ${daysRemaining} day(s).`, { duration: 8000, icon: '🔔' });
                                await sendReminder({ userId: user._id }).unwrap();
                                sessionStorage.setItem(reminderKey, 'true');
                            } catch (err) {
                                console.error(`Failed to send reminder for ${sub.category}:`, err);
                            }
                        }
                    }
                }
            }
        };
        checkAndSendReminders();
    }, [user, sendReminder]);


    const handleEditClick = () => {
        setIsEditing(true);
        setEditedName(user?.name || "");
        setError("");
    }

    const handleSaveName = async () => {
        if (!editedName.trim()) {
            setError("Name cannot be empty");
            return;
        }
        try {
            await updateProfile({ name: editedName.trim() }).unwrap();
            setIsEditing(false);
            setError("");
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error('Failed to update profile:', error);
            setError(error?.data?.message || "Failed to update profile");
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedName(user?.name || "");
        setError("");
    }

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
        if (error) setError("");
    }

    // --- NEW: Handlers for avatar upload ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCancelAvatar = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAvatarUpload = async () => {
        if (!imageFile) return;
        const formData = new FormData();
        formData.append('avatar', imageFile);

        const toastId = toast.loading("Uploading avatar...");
        try {
            await updateAvatar(formData).unwrap();
            toast.success("Avatar updated successfully!", { id: toastId });
            handleCancelAvatar();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to upload avatar.", { id: toastId });
            console.error('Failed to upload avatar:', err);
        }
    };


    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'subscriptions', label: 'Entitlements', icon: CreditCard },
        { id: 'services', label: 'Services Used', icon: Activity },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    const paidSubCategories = user?.activeSubscriptions?.map(sub => sub.category) || [];

    const promotedSubs = user?.promotedCategories
        ?.filter(cat => !paidSubCategories.includes(cat))
        .map(cat => ({
            category: cat,
            planType: 'Promotional',
            expiresAt: 'Never',
            type: 'promoted'
        })) || [];

    const paidSubs = user?.activeSubscriptions?.map(sub => ({ ...sub, type: 'paid' })) || [];
    const combinedSubscriptions = [...paidSubs, ...promotedSubs];


    return (
        <>
            <div className="space-y-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

                <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="p-4 border-b border-blue-100 flex flex-row items-center justify-between gap-4">
                        {/* ===== START: Left-side content group ===== */}
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png, image/jpeg, image/gif"
                                    className="hidden"
                                />
                                <Avatar className="h-16 w-16 border-2 border-white ring-2 ring-blue-500/20">
                                    {(imagePreview || (user?.avatar && user.avatar.trim() !== '')) && (
                                        <AvatarImage
                                            src={imagePreview || user?.avatar}
                                            alt={`${user?.name} profile picture`}
                                        />
                                    )}
                                    <AvatarFallback
                                        className="text-white text-lg font-medium"
                                        style={{ backgroundColor: avatarBgColor }}
                                    >
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                    className="absolute inset-0 bg-black/50 w-16 h-16 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    {isUploadingAvatar ? (
                                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 text-white" />
                                    )}
                                </button>
                            </div>

                            {/* User Info / Upload Actions */}
                            <div>
                                {imagePreview ? (
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={handleAvatarUpload} disabled={isUploadingAvatar}>
                                            {isUploadingAvatar ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving...</> : <><Check className="w-4 h-4 mr-1" /> Save</>}
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={handleCancelAvatar} disabled={isUploadingAvatar}>
                                            <X className="w-4 h-4 mr-1" /> Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                                        <p className="text-sm text-gray-600">{user?.email}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {user?.role === 'admin' && <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs"><Crown className="w-3 h-3 mr-1" />Admin</Badge>}
                                            {/* <Badge variant={user?.isVerified ? 'default' : 'destructive'} className="text-xs">
                                                {user?.isVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                                {user?.isVerified ? 'Verified' : 'Unverified'}
                                            </Badge> */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* ===== END: Left-side content group ===== */}

                        {/* ===== START: Right-side Edit Button (conditionally rendered) ===== */}
                        {!imagePreview && (
                            <Button
                                size="sm"
                                onClick={handleEditClick}
                                disabled={isUploadingAvatar}
                                className="bg-white text-gray-800 border shadow-sm hover:bg-gray-50 px-3 py-1 text-sm flex-shrink-0"
                            >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edit
                            </Button>
                        )}
                        {/* ===== END: Right-side Edit Button ===== */}
                    </CardHeader>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-blue-600 hover:bg-gray-50'}`}>
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content (No changes needed below this line) */}
                    <CardContent className="p-6">
                        {activeTab === 'overview' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-4">
                                   <h4 className="font-semibold text-gray-800">Contact Information</h4>
                                   <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-600" /><span className="text-gray-700">{user?.email || 'N/A'}</span></div>
                                   {/* <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-blue-600" /><span className="text-gray-700">{user?.mobile || 'N/A'}</span></div> */}
                               </div>
                               <div className="space-y-4">
                                   <h4 className="font-semibold text-gray-800">Account Details</h4>
                                   <div className="flex justify-between text-sm"><span className="text-gray-600">User ID:</span><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{user?._id}</span></div>
                                   <div className="flex justify-between text-sm"><span className="text-gray-600">Joined On:</span><span className="text-gray-700">{formatDate(user?.createdAt)}</span></div>
                               </div>
                           </div>
                        )}
                        {activeTab === 'subscriptions' && (
                            <div className="space-y-4">
                                {combinedSubscriptions.length > 0 ? combinedSubscriptions.map(sub => (
                                    <div key={sub.category} className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between sm:items-center gap-2
                                        ${sub.type === 'paid' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                                        <div className="flex items-center gap-3">
                                            {sub.type === 'paid'
                                                ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                                : <Award className="w-6 h-6 text-amber-600 flex-shrink-0" />}
                                            <div>
                                                <p className={`font-semibold ${sub.type === 'paid' ? 'text-green-900' : 'text-amber-900'}`}>
                                                    {sub.category.replace(/_/g, " ")}
                                                </p>
                                                <p className={`text-xs ${sub.type === 'paid' ? 'text-green-700' : 'text-amber-700'}`}>
                                                    Expires on: {formatDate(sub.expiresAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className={`capitalize ${sub.type === 'paid' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                                            {sub.planType} Plan
                                        </Badge>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">No active or promotional subscriptions.</p>}
                            </div>
                        )}
                        {activeTab === 'services' && (
                            <div className="space-y-4">
                                {user?.usedServices?.length > 0 ? user.usedServices.map(service => (
                                    <div key={service.service} className="flex justify-between items-center p-3 border rounded-lg">
                                        <p className="font-medium text-gray-800">{service.serviceName}</p>
                                        <Badge variant="outline">{service.usageCount} uses</Badge>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">No services used yet.</p>}
                            </div>
                        )}
                        {activeTab === 'security' && (
                           <div className="space-y-3">
                               <div className="flex justify-between items-center p-3 border rounded-lg">
                                   <span className="text-gray-600">Password Status</span><span className={user?.password ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{user?.password ? 'Set' : 'Not Set (Google Sign-In)'}</span>
                               </div>
                               <div className="flex justify-between items-center p-3 border rounded-lg">
                                   <span className="text-gray-600">Account Verified</span><span className={user?.isVerified ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{user?.isVerified ? 'Yes' : 'No'}</span>
                               </div>
                           </div>
                        )}

                        {/*   Admin Tools Tab Content  */}
                        {/* {activeTab === 'admin' && user?.role === 'admin' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Manage Subscriptions</h3>
                                {allSubscriptions.length > 0 ? allSubscriptions.map(sub => (
                                    <div key={sub.category} className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-center gap-4 ${sub.isPromoted ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                                        <div>
                                            <p className={`font-semibold ${sub.isPromoted ? 'text-yellow-800' : 'text-green-800'}`}>{sub.category.replace(/_/g, " ")}</p>
                                            <p className={`text-xs ${sub.isPromoted ? 'text-yellow-600' : 'text-green-600'}`}>Plan: <span className="capitalize">{sub.plan}</span></p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!sub.isPromoted && (
                                                <Button size="sm" variant="outline" onClick={() => setModal({ type: 'extend', sub })}>
                                                    <Calendar className="w-4 h-4 mr-2" /> Extend
                                                </Button>
                                            )}
                                            <Button size="sm" variant="destructive" onClick={() => setModal({ type: 'revoke', sub })}>
                                                <XCircle className="w-4 h-4 mr-2" /> Revoke
                                            </Button>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">No subscriptions to manage.</p>}
                            </div>
                        )} */}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && handleCancelEdit()}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
                            <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="absolute top-3 right-3 z-10"><X className="h-5 w-5" /></Button>
                            <div className="p-6 border-b"><h3 className="text-xl font-semibold">Edit Profile</h3></div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <input type="text" value={editedName} onChange={handleNameChange} className={`w-full px-4 py-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`} autoFocus />
                                    {error && (<p className="text-sm text-red-600 mt-1">{error}</p>)}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"/>
                                </div>
                            </div>
                            <div className="flex gap-3 p-4 bg-gray-50 border-t rounded-b-2xl">
                                <Button variant="outline" className="flex-1" onClick={handleCancelEdit} disabled={isUpdatingProfile}>Cancel</Button>
                               <Button 
  className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300" 
  onClick={handleSaveName} 
  disabled={isUpdatingProfile || !editedName.trim()}
>
  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
</Button>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}