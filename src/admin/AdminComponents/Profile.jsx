import React, { useState, useEffect } from "react"
import { 
    Wrench as Tool, Bell, Edit3, Check, X, User, Mail, Calendar, GitPullRequest, ShieldCheck, AlertTriangle, CreditCard, Activity, Shield, Award, Settings, Phone, CheckCircle, XCircle, Crown
} from "lucide-react"
import { useSelector } from "react-redux"
import { selectCurrentUser } from '@/features/auth/authSlice'
// --- MODIFIED: Import new hooks for admin actions ---
import { 
    useUpdateProfileMutation, 
    useRemindSubscriptionMutation,
    useExtendSubscriptionMutation,
    useRevokeSubscriptionMutation
} from '@/app/api/authApiSlice' 
import { toast } from "react-hot-toast"
import userPic from "@/assets/UserImage.svg"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// --- NEW: Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isLoading }) => {
    if (!isOpen) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b"><h3 className="text-xl font-semibold text-gray-900">{title}</h3></div>
                <div className="p-6 text-gray-600">{children}</div>
                <div className="flex gap-3 p-4 bg-gray-50 border-t rounded-b-2xl">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button variant="destructive" className="flex-1" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Confirming...' : 'Confirm'}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- NEW: Extend Subscription Modal Component ---
const ExtendModal = ({ isOpen, onClose, onConfirm, sub, isLoading }) => {
    const [duration, setDuration] = useState({ unit: 'months', value: 1 });
    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b"><h3 className="text-xl font-semibold">Extend Subscription</h3></div>
                <div className="p-6 space-y-4">
                    <p>Extend <strong>{sub.category.replace(/_/g, " ")}</strong> subscription for:</p>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 3, 6].map(month => (
                             <Button key={month} variant={duration.value === month ? 'default' : 'outline'} onClick={() => setDuration({ unit: 'months', value: month })}>
                                {month} Month{month > 1 ? 's' : ''}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3 p-4 bg-gray-50 border-t rounded-b-2xl">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button className="flex-1" onClick={() => onConfirm(duration)} disabled={isLoading}>
                        {isLoading ? 'Extending...' : 'Extend'}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function Profile() {
    const user = useSelector(selectCurrentUser)
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation()
    const [sendReminder] = useRemindSubscriptionMutation();
    // --- NEW: Hooks for admin actions ---
    const [extendSubscription, { isLoading: isExtending }] = useExtendSubscriptionMutation();
    const [revokeSubscription, { isLoading: isRevoking }] = useRevokeSubscriptionMutation();

    
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(user?.name || "")
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState('overview');
    // --- NEW: State for modals ---
    const [modal, setModal] = useState({ type: null, sub: null }); // type: 'extend' | 'revoke'
    
    // Auto-reminder logic (no change)
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
                                await sendReminder({ userId: user._id }).unwrap();
                                toast.error(`Your subscription for "${sub.category.replace(/_/g, " ")}" expires in ${daysRemaining} day(s).`, { duration: 8000, icon: '🔔' });
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
        if (!editedName.trim()) { setError("Name cannot be empty"); return; }
        try {
            await updateProfile({ name: editedName.trim() }).unwrap();
            setIsEditing(false);
            setError("");
            toast.success("Profile updated successfully!");
        } catch (error) {
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
    
    // --- MODIFIED: Add Admin Tools tab if user is admin ---
    let tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'services', label: 'Services Used', icon: Activity },
        { id: 'security', label: 'Security', icon: Shield }
    ];
    if (user?.role === 'admin') {
        tabs.push({ id: 'admin', label: 'Admin Tools', icon: Tool });
    }

    const allSubscriptions = [
        ...(user?.activeSubscriptions?.map(sub => ({ ...sub, isPromoted: false })) || []),
        ...(user?.promotedCategories
            ?.filter(cat => !user.activeSubscriptions.some(sub => sub.category === cat))
            ?.map(cat => ({ category: cat, plan: 'Promotional', expiresAt: 'N/A', isPromoted: true })) || [])
    ];
    
    // --- NEW: Handlers for modal actions ---
    const handleRevokeConfirm = async () => {
        if (!modal.sub) return;
        try {
            await revokeSubscription({ userId: user._id, category: modal.sub.category }).unwrap();
            toast.success(`Subscription for "${modal.sub.category.replace(/_/g, ' ')}" revoked.`);
            setModal({ type: null, sub: null });
        } catch (err) {
            toast.error(err.data?.message || 'Failed to revoke subscription.');
        }
    };

    const handleExtendConfirm = async (duration) => {
        if (!modal.sub) return;
        try {
            await extendSubscription({ userId: user._id, category: modal.sub.category, duration }).unwrap();
            toast.success(`Subscription for "${modal.sub.category.replace(/_/g, ' ')}" extended.`);
            setModal({ type: null, sub: null });
        } catch (err) {
            toast.error(err.data?.message || 'Failed to extend subscription.');
        }
    };

    return (
        <>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                
                <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className=" p-6 border-b border-blue-100 flex-col md:flex-row items-center gap-6">
                         <div className="relative">
                            <img src={user.avatar} alt="User" className="h-24 w-24 border-4 border-white ring-4 ring-blue-500/20 rounded-full"/>
                         </div>
                         <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
                               {user?.role === 'admin' && <Badge variant="secondary" className="bg-purple-100 text-purple-700"><Crown className="w-3 h-3 mr-1" />Admin</Badge>}
                               <Badge variant={user?.isVerified ? 'default' : 'destructive'}>
                                   {user?.isVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                   {user?.isVerified ? 'Verified' : 'Unverified'}
                               </Badge>
                            </div>
                         </div>
                         <Button onClick={handleEditClick} className="bg-white text-gray-800 border shadow-sm hover:bg-gray-50">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    </CardHeader>

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
                    
                    <CardContent className="p-6">
                        {/* Overview, Subscriptions, Services, Security tabs (no change in their content) */}
                        {activeTab === 'overview' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-4">
                                   <h4 className="font-semibold text-gray-800">Contact Information</h4>
                                   <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-600" /><span className="text-gray-700">{user?.email || 'N/A'}</span></div>
                                   <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-blue-600" /><span className="text-gray-700">{user?.mobile || 'N/A'}</span></div>
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
                                {allSubscriptions.length > 0 ? allSubscriptions.map(sub => (
                                    <div key={sub.category} className={`p-4 rounded-lg border ${sub.isPromoted ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                                        <div className="flex justify-between items-center">
                                            <p className={`font-semibold ${sub.isPromoted ? 'text-yellow-800' : 'text-green-800'}`}>{sub.category.replace(/_/g, " ")}</p>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${sub.isPromoted ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{sub.plan}</span>
                                        </div>
                                        <p className={`text-xs mt-1 ${sub.isPromoted ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {sub.expiresAt !== 'N/A' ? `Expires on: ${formatDate(sub.expiresAt)}` : 'Does not expire'}
                                        </p>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">No active subscriptions.</p>}
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

                        {/* --- NEW: Admin Tools Tab Content --- */}
                        {activeTab === 'admin' && user?.role === 'admin' && (
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
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancelEdit}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                             <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="absolute top-3 right-3 z-10"><X className="h-5 w-5"/></Button>
                            <div className="p-6 border-b"><h3 className="text-xl font-semibold">Edit Profile</h3></div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" value={user?.email || ""} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <input type="text" value={editedName} onChange={handleNameChange} className={`w-full px-4 py-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`} autoFocus/>
                                    {error && (<p className="text-sm text-red-600 mt-1">{error}</p>)}
                                </div>
                            </div>
                            <div className="flex gap-3 p-4 bg-gray-50 border-t rounded-b-2xl">
                                <Button variant="outline" className="flex-1" onClick={handleCancelEdit} disabled={isUpdatingProfile}>Cancel</Button>
                                <Button className="flex-1" onClick={handleSaveName} disabled={isUpdatingProfile || !editedName.trim()}>
                                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <ConfirmationModal 
                isOpen={modal.type === 'revoke'}
                onClose={() => setModal({ type: null, sub: null })}
                onConfirm={handleRevokeConfirm}
                title="Revoke Subscription"
                isLoading={isRevoking}
            >
                Are you sure you want to revoke the <strong>{modal.sub?.category.replace(/_/g, ' ')}</strong> subscription? This action cannot be undone.
            </ConfirmationModal>

            <ExtendModal 
                isOpen={modal.type === 'extend'}
                onClose={() => setModal({ type: null, sub: null })}
                onConfirm={handleExtendConfirm}
                sub={modal.sub}
                isLoading={isExtending}
            />
        </>
    )
}