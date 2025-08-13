import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Search,
    Users,
    Shield,
    UserPlus,
    Filter,
    RefreshCw,
    Award,
    MoreVertical,
    X,
    Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'react-hot-toast';

// --- MODIFIED: Updated RTK Query Hook Imports ---
import {
    useGetAllUsersQuery,
    usePromoteUserToSubcategoryMutation, // Hook for promotion
    useRevokeSubscriptionMutation // Re-using this for demotion
} from '@/app/api/authApiSlice';
import { useGetServicesQuery } from '@/app/api/serviceApiSlice';

import { UserDetailsCard } from './UserDetailCard';

// Custom Checkbox Component
const CustomCheckbox = ({ id, checked, onChange, children }) => {
    return (
        <div className="flex items-center space-x-3">
            <div className="relative">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only"
                />
                <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                        checked
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={onChange}
                >
                    {checked && (
                        <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </div>
            </div>
            <label htmlFor={id} className="cursor-pointer flex-1">
                {children}
            </label>
        </div>
    );
};

// Custom Number Input Component
const CustomNumberInput = ({ value, onChange, placeholder = "Count", disabled = false }) => {
    return (
        <input
            type="number"
            min="1"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
        />
    );
};

// Loading Skeleton Component (No changes)
const UserCardSkeleton = () => (
    <Card className="animate-pulse shadow-lg bg-white/50">
        <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
            <div className="space-y-3 mt-4">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="h-10 bg-gray-300 rounded-lg"></div>
            </div>
        </CardContent>
    </Card>
);

// --- MODIFIED: Completely redesigned Promotion Modal with custom components ---
const PromotionModal = ({ user, allSubcategories, isOpen, onClose }) => {
    const [selectedSubcategories, setSelectedSubcategories] = useState(new Set(user.promotedCategories || []));
    const [multipliers, setMultipliers] = useState({}); // State for multipliers

    const [promoteUser, { isLoading: isPromoting }] = usePromoteUserToSubcategoryMutation();
    const [revokeAccess, { isLoading: isRevoking }] = useRevokeSubscriptionMutation();

    useEffect(() => {
        // Reset state when modal opens or user changes
        if (isOpen) {
            setSelectedSubcategories(new Set(user.promotedCategories || []));
            setMultipliers({});
        }
    }, [user, isOpen]);

    const handleCheckboxChange = (subcategory) => {
        setSelectedSubcategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(subcategory)) {
                newSet.delete(subcategory);
            } else {
                newSet.add(subcategory);
            }
            return newSet;
        });
    };

    const handleMultiplierChange = (subcategory, e) => {
        const value = e.target.value;
        setMultipliers(prev => ({
            ...prev,
            [subcategory]: parseInt(value, 10) || 1
        }));
    };

    const handleSaveChanges = async () => {
        const originalSubcategories = new Set(user.promotedCategories || []);
        const newSubcategories = selectedSubcategories;

        const toAdd = [...newSubcategories].filter(sub => !originalSubcategories.has(sub));
        const toRemove = [...originalSubcategories].filter(sub => !newSubcategories.has(sub));

        const promises = [];

        toAdd.forEach(subcategory => {
            const multiplier = multipliers[subcategory] || 1; // Default to 1 if not entered
            promises.push(promoteUser({ userId: user._id, subcategory, multiplier }).unwrap());
        });

        toRemove.forEach(subcategory => {
            promises.push(revokeAccess({ userId: user._id, category: subcategory }).unwrap());
        });

        try {
            await Promise.all(promises);
            toast.success(`Promotions for ${user.name} updated successfully!`);
            onClose();
        } catch (error) {
            toast.error("Failed to update some promotions. Please try again.");
            console.error("Promotion update error:", error);
        }
    };

    if (!isOpen) return null;

    const isLoading = isPromoting || isRevoking;
    const originalSubcategories = new Set(user.promotedCategories || []);
    const toAdd = [...selectedSubcategories].filter(sub => !originalSubcategories.has(sub));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl m-4 bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
                {/* Custom Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Manage Promotions</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            For user: <span className="font-medium text-gray-900">{user.name}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-6">
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-4">Available Service Subcategories:</h3>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {allSubcategories.map(subcategory => (
                            <div 
                                key={subcategory} 
                                className="grid grid-cols-5 gap-3 items-center p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                            >
                                {/* 80% width (4 columns) for subcategory name and checkbox */}
                                <div className="col-span-4">
                                    <CustomCheckbox
                                        id={`subcat-${subcategory}`}
                                        checked={selectedSubcategories.has(subcategory)}
                                        onChange={() => handleCheckboxChange(subcategory)}
                                    >
                                        <span className="text-gray-700 font-medium">
                                            {subcategory.replace(/_/g, " ")}
                                        </span>
                                    </CustomCheckbox>
                                </div>
                                
                                {/* 20% width (1 column) for number input */}
                                <div className="col-span-1">
                                    {selectedSubcategories.has(subcategory) && (
                                        <CustomNumberInput
                                            value={multipliers[subcategory] || '1'}
                                            onChange={(e) => handleMultiplierChange(subcategory, e)}
                                            placeholder="Count"
                                            disabled={!toAdd.includes(subcategory)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// User Card Component (No changes)
const UserCard = ({ user, onPromote, onNameClick }) => {
    const getRoleStyle = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getAvatarBgColor = (name) => {
        const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-red-500 to-red-600'];
        if (!name) return colors[0];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const avatarBg = getAvatarBgColor(user.name);
    const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

    return (
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-semibold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors cursor-pointer"
                            onClick={() => onNameClick(user)}
                        >
                            {user.name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-500 text-sm truncate">{user.email || user.mobile}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Badge className={`${getRoleStyle(user.role)} font-medium`}>{user.role || 'User'}</Badge>
                    <Badge variant={user.isVerified ? 'default' : 'destructive'}>{user.isVerified ? 'Verified' : 'Not Verified'}</Badge>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all" onClick={() => onPromote(user)}>
                        <Award className="w-4 h-4 mr-2" />
                        Promote User
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Main Component (No changes)
export default function AllUser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
    const [detailUser, setDetailUser] = useState(null);

    // Fetch data using RTK Query
    const { data: usersData, isLoading: isLoadingUsers, isError: isUsersError, refetch } = useGetAllUsersQuery();
    const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();

    // --- MODIFIED: Derive unique subcategories from services ---
    const allSubcategories = useMemo(() => {
        if (!servicesData?.data) return [];
        // Filter for services that have a subcategory, then create a unique set
        const subcategories = servicesData.data
            .map(service => service.subcategory)
            .filter(Boolean); // filter(Boolean) removes null, undefined, and empty strings
        return [...new Set(subcategories)];
    }, [servicesData]);

    const filteredUsers = useMemo(() => {
        if (!usersData?.data) return [];
        return usersData.data.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.mobile && user.mobile.includes(searchTerm))
        );
    }, [usersData, searchTerm]);

    const handlePromoteClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleUserDetailClick = (user) => {
        setDetailUser(user);
        setIsDetailCardOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        refetch(); // Refetch user data to show updated promotions on cards
    };

    const handleCloseDetailCard = () => {
        setIsDetailCardOpen(false);
        setTimeout(() => setDetailUser(null), 300); // Allow animation to finish
    };

    const isLoading = isLoadingUsers || isLoadingServices;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared Dashboard</h1>
                            <p className="text-gray-600">Manage and view all registered users and their promotions</p>
                        </div>
                    </div>
                </div>

                <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input placeholder="Search users by name, email, or mobile..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 p-2 md:p-4 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-gray-100 bg-white/50">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                            All Users ({filteredUsers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => <UserCardSkeleton key={i} />)}
                            </div>
                        ) : isUsersError ? (
                            <div className="text-center py-12 text-red-600">
                                <p className="text-lg font-medium">Failed to load users.</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-600">{searchTerm ? 'Try adjusting your search terms.' : 'No users have been registered yet.'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredUsers.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        onPromote={handlePromoteClick}
                                        onNameClick={handleUserDetailClick}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {selectedUser && (
                <PromotionModal
                    user={selectedUser}
                    allSubcategories={allSubcategories} // Pass subcategories to the modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}

            <UserDetailsCard
                user={detailUser}
                isOpen={isDetailCardOpen}
                onClose={handleCloseDetailCard}
            />
        </div>
    );
}