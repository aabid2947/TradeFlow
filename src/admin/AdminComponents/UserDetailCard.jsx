import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Award, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  Activity,
  CreditCard,
  Settings,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from 'lucide-react';

export const UserDetailsCard = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset to the overview tab whenever a new user is opened
      setActiveTab('overview');
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const getAvatarBgColor = (name) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-indigo-400 to-indigo-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-cyan-400 to-cyan-600'
    ];
    if (!name) return colors[0];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const avatarBg = getAvatarBgColor(user.name);
  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'services', label: 'Services Used', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className={`fixed right-0 top-0 h-full w-132 bg-white shadow-2xl border-l border-blue-100 z-50 transform transition-all duration-300 ease-out flex flex-col ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* User Avatar & Basic Info */}
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${avatarBg} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transform ${
            isAnimating ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
          } transition-all duration-300`}>
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              {user.role === 'admin' && (
                <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  <Crown className="w-3 h-3" />
                  <span>Admin</span>
                </div>
              )}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                user.isVerified 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {user.isVerified ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    <span>Unverified</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Contact Information
              </h4>
              <div className="space-y-3">
                {user.email && (
                  <div className="flex items-center space-x-3 group">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="flex-1 text-gray-700">{user.email}</span>
                    <button
                      onClick={() => copyToClipboard(user.email)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded transition-all"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                )}
                {user.mobile && (
                  <div className="flex items-center space-x-3 group">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="flex-1 text-gray-700">{user.mobile}</span>
                    <button
                      onClick={() => copyToClipboard(user.mobile)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded transition-all"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                )}
                {user.googleId && (
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Google Account</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2 text-indigo-600" />
                Account Details
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded">{user._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-700">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-700">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Promotions */}
            {user.promotedCategories && user.promotedCategories.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2 text-yellow-600" />
                  Promoted Categories ({user.promotedCategories.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.promotedCategories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200"
                    >
                      {category.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
              Active Subscriptions
            </h4>
            {user.activeSubscriptions && user.activeSubscriptions.length > 0 ? (
              user.activeSubscriptions.map((subscription, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-800">{subscription.category}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.plan === 'yearly' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {subscription.plan}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Purchased:</span>
                      <span>{formatDate(subscription.purchasedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span className={new Date(subscription.expiresAt) < new Date() ? 'text-red-600 font-medium' : ''}>
                        {formatDate(subscription.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No active subscriptions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-600" />
              Services Used
            </h4>
            {user.usedServices && user.usedServices.length > 0 ? (
              user.usedServices.map((service, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-gray-800">{service.serviceName}</h5>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {service.usageCount} uses
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Service ID: {service.service}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No services used yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              Security Information
            </h4>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
              <h5 className="font-medium text-gray-800 mb-3">Authentication Status</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Password Set:</span>
                  <span className={user.password ? 'text-green-600' : 'text-red-600'}>
                    {user.password ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email Verified:</span>
                  <span className={user.isVerified ? 'text-green-600' : 'text-red-600'}>
                    {user.isVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Google Account:</span>
                  <span className={user.googleId ? 'text-green-600' : 'text-gray-500'}>
                    {user.googleId ? 'Linked' : 'Not Linked'}
                  </span>
                </div>
              </div>
            </div>

            {(user.emailOtpExpires || user.mobileOtpExpires || user.passwordResetExpires) && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                <h5 className="font-medium text-gray-800 mb-3">Pending Verifications</h5>
                <div className="space-y-2 text-sm">
                  {user.emailOtpExpires && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email OTP Expires:</span>
                      <span className="text-orange-600">{formatDate(user.emailOtpExpires)}</span>
                    </div>
                  )}
                  {user.mobileOtpExpires && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile OTP Expires:</span>
                      <span className="text-orange-600">{formatDate(user.mobileOtpExpires)}</span>
                    </div>
                  )}
                  {user.passwordResetExpires && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Password Reset Expires:</span>
                      <span className="text-orange-600">{formatDate(user.passwordResetExpires)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};