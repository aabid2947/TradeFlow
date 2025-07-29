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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from 'react-hot-toast';

// --- Import RTK Query Hooks ---
import { useGetAllUsersQuery, usePromoteUserCategoryMutation, useDemoteUserCategoryMutation } from '@/app/api/authApiSlice';
import { useGetServicesQuery } from '@/app/api/serviceApiSlice';


// Loading Skeleton Component
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


// Promotion Modal Component
const PromotionModal = ({ user, allCategories, isOpen, onClose }) => {
    const [selectedCategories, setSelectedCategories] = useState(new Set(user.promotedCategories || []));
    const [promoteUser, { isLoading: isPromoting }] = usePromoteUserCategoryMutation();
    const [demoteUser, { isLoading: isDemoting }] = useDemoteUserCategoryMutation();

    useEffect(() => {
        setSelectedCategories(new Set(user.promotedCategories || []));
    }, [user]);

    const handleCheckboxChange = (category) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const handleSaveChanges = async () => {
        const originalCategories = new Set(user.promotedCategories || []);
        const newCategories = selectedCategories;

        const toAdd = [...newCategories].filter(cat => !originalCategories.has(cat));
        const toRemove = [...originalCategories].filter(cat => !newCategories.has(cat));

        const promises = [];

        toAdd.forEach(category => {
            promises.push(promoteUser({ userId: user._id, category }).unwrap());
        });

        toRemove.forEach(category => {
            promises.push(demoteUser({ userId: user._id, category }).unwrap());
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0">
            <Card className="w-full max-w-md m-4 bg-white p-2 md:p-4 animate-in z-69 zoom-in-95">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Manage Promotions</CardTitle>
                        <p className="text-gray-600">For user: <span className="font-semibold">{user.name}</span></p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        <p className="font-semibold text-gray-800">Available Service Categories:</p>
                        {allCategories.map(category => (
                            <div key={category} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                                <Checkbox
                                    id={`cat-${category}`}
                                    checked={selectedCategories.has(category)}
                                    onCheckedChange={() => handleCheckboxChange(category)}
                                />
                                <Label htmlFor={`cat-${category}`} className="flex-1 cursor-pointer">{category.replace(/_/g, " ")}</Label>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button 
                            onClick={handleSaveChanges} 
                            disabled={isPromoting || isDemoting}
                        >
                            {(isPromoting || isDemoting) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


// User Card Component
const UserCard = ({ user, onPromote }) => {
    const getRoleStyle = (role) => {
        switch (role?.toLowerCase()) {
          case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getAvatarBgColor = (name) => {
        const colors = [ 'from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-red-500 to-red-600' ];
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
                <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors">
                {user.name || 'Unknown User'}
                </h3>
                <p className="text-gray-500 text-sm truncate">{user.email || user.mobile}</p>
            </div>
            </div>

            <div className="flex items-center justify-between">
                <Badge className={`${getRoleStyle(user.role)} font-medium`}>{user.role || 'User'}</Badge>
                <Badge variant={user.isVerified ? 'default' : 'destructive'}>{user.isVerified ? 'Verified' : 'Not Verified'}</Badge>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all" onClick={() => onPromote(user)}>
                    <Award className="w-4 h-4 mr-2" />
                    Promote User
                </Button>
                {(user.promotedCategories && user.promotedCategories.length > 0) && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 whitespace-nowrap">
                        {user.promotedCategories.length} Promo{user.promotedCategories.length > 1 ? 's' : ''}
                    </Badge>
                )}
            </div>
        </CardContent>
        </Card>
    );
};

// Main Component
export default function AllUser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch data using RTK Query
    const { data: usersData, isLoading: isLoadingUsers, isError: isUsersError, refetch } = useGetAllUsersQuery();
    const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();

    // Memoize and derive unique categories from services
    const allCategories = useMemo(() => {
        if (!servicesData?.data) return [];
        const categories = servicesData.data.map(service => service.category);
        return [...new Set(categories)];
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        refetch(); // Refetch user data to show updated promotions on cards
    };

    const isLoading = isLoadingUsers || isLoadingServices;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                        <p className="text-gray-600">Manage and view all registered users and their promotions</p>
                        </div>
                        <div className="flex gap-3">
                        <Button variant="outline" onClick={refetch} disabled={isLoadingUsers}><RefreshCw className={`w-4 h-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} /> Refresh</Button>
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
                        <UserCard key={user._id} user={user} onPromote={handlePromoteClick} />
                        ))}
                    </div>
                    )}
                </CardContent>
                </Card>
            </div>
            
            {selectedUser && (
                <PromotionModal 
                    user={selectedUser} 
                    allCategories={allCategories}
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
};