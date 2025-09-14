import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Search, Phone, Video, Info, Smile, Paperclip, Send, MoreVertical, Circle, Star, Shield, TrendingUp, Clock, ArrowLeft, Menu, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { SiteHeader } from '../components/SiteHeader'
import { selectCurrentUser } from '../features/auth/authSlice'
import { 
  useGetUserChatsQuery
} from '../features/api/apiSlice'
import { useToast } from '../hooks/use-toast'
import { useChat } from '../hooks/useChat'

export default function ChatPage() {
  const [selectedChatUserId, setSelectedChatUserId] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showChatList, setShowChatList] = useState(true) // For mobile view toggle
  const [isMobile, setIsMobile] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const { toast } = useToast()
  const [searchParams] = useSearchParams()

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
      if (window.innerWidth >= 768) {
        setShowChatList(true) // Always show chat list on desktop
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Check for userId in URL params (from trade page)
  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId')
    if (userIdFromUrl && userIdFromUrl !== selectedChatUserId) {
      setSelectedChatUserId(userIdFromUrl)
      if (isMobile) {
        setShowChatList(false) // Hide chat list on mobile when selecting chat
      }
    }
  }, [searchParams, selectedChatUserId, isMobile])

  // Get chat list from backend (for user discovery)
  const { data: chatsData, isLoading: chatsLoading, error: chatsError } = useGetUserChatsQuery()
  
  // Use Firebase real-time chat for the selected conversation
  const { 
    messages, 
    loading: messagesLoading, 
    sending: sendingMessage,
    connectionStatus,
    sendMessage,
    error: chatError 
  } = useChat(selectedChatUserId)

  const chats = chatsData?.data?.chats || []

  // Get other participant in the chat
  const getOtherParticipant = (chat) => {
    return chat.participants?.find(participant => participant._id !== currentUser?._id)
  }

  // Get current chat details and other participant
  const currentChatUser = chats.find(chat => {
    const otherParticipant = getOtherParticipant(chat)
    return otherParticipant?._id === selectedChatUserId
  })

  // Get selected user info (for when user is selected but not in chat list yet)
  const selectedUser = selectedChatUserId ? {
    _id: selectedChatUserId,
    username: currentChatUser ? getOtherParticipant(currentChatUser)?.username : 'Unknown User'
  } : null

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    
    return date.toLocaleDateString()
  }

  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Handle chat selection
  const handleChatSelect = async (chat) => {
    const otherParticipant = getOtherParticipant(chat)
    setSelectedChatUserId(otherParticipant?._id)
    if (isMobile) {
      setShowChatList(false) // Hide chat list on mobile
    }
  }

  // Handle back to chat list (mobile)
  const handleBackToChatList = () => {
    if (isMobile) {
      setShowChatList(true)
      setSelectedChatUserId(null)
    }
  }

  // Handle sending message using Firebase
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChatUserId) {
      try {
        await sendMessage(newMessage.trim())
        setNewMessage('')
      } catch (error) {
        toast({
          title: "Error",
          description: chatError || "Failed to send message. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat)
    return otherParticipant?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           chat.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-500' : 'bg-gray-400'
  }

  // Chat List Component
  const ChatListComponent = () => (
    <div className={`${isMobile ? 'w-full' : 'w-80'} bg-white ${isMobile ? '' : 'border-r border-gray-200'} flex flex-col shadow-lg`}>
      {/* Sidebar Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Messages</h1>
          {isMobile && (
            <Button variant="ghost" size="sm" className="p-2">
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-all duration-200 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatsLoading ? (
          // Loading skeleton
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-3 sm:p-4 border-b border-gray-100 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : chatsError ? (
          <div className="p-4 text-center text-red-600 text-sm">
            Failed to load chats. Please try again.
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-gray-500">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg font-medium mb-2">No conversations</p>
            <p className="text-xs sm:text-sm">Start trading to begin conversations with other users</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherParticipant = getOtherParticipant(chat)
            const unreadCount = 0 // You might want to implement this in your backend
            
            return (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-all duration-200 ${
                  selectedChatUserId === getOtherParticipant(chat)?._id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {otherParticipant?.username?.slice(0, 2).toUpperCase() || 'UN'}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white bg-gray-400`}></div>
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-zinc-900 truncate text-sm sm:text-base">
                          {otherParticipant?.username || 'Unknown User'}
                        </h3>
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      {unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  // Chat Window Component
  const ChatWindowComponent = () => (
    <div className="flex-1 flex flex-col bg-white">
      {selectedChatUserId ? (
        <>
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Back button for mobile */}
                {isMobile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBackToChatList}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                
                {/* Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {selectedUser?.username?.slice(0, 2).toUpperCase() || 'UN'}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white bg-gray-400`}></div>
                </div>

                {/* User Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-zinc-900 text-sm sm:text-base truncate">
                      {selectedUser?.username || 'Unknown User'}
                    </h2>
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <div className="hidden sm:flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="text-xs text-gray-600">Online</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <span className="hidden sm:inline">Real-time chat enabled</span>
                    <span className="sm:hidden">Online</span>
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <TrendingUp className="w-3 h-3" />
                    <span className="hidden sm:inline">Firebase powered</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 p-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 p-2">
                  <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 p-2">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50">
            <div className="space-y-3 sm:space-y-4">
              {/* Date Separator */}
              <div className="flex items-center justify-center">
                <div className="bg-white px-3 sm:px-4 py-2 rounded-full border border-gray-200 text-xs sm:text-sm text-gray-600 shadow-sm">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Real-time Chat
                  {connectionStatus && (
                    <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500' :
                      connectionStatus === 'connecting' ? 'bg-yellow-500' :
                      connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></span>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {chatError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mx-2 sm:mx-4">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <Circle className="w-4 h-4 fill-current" />
                    <span className="font-semibold text-sm">Connection Error</span>
                  </div>
                  <p className="text-red-700 text-xs sm:text-sm">{chatError}</p>
                  <div className="mt-2 sm:mt-3 text-xs text-red-600">
                    <p>Troubleshooting steps:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Check if Firestore is enabled in Firebase Console</li>
                      <li>Verify your internet connection</li>
                      <li>Make sure you're authenticated</li>
                      <li>Check browser console for more details</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Messages */}
              {messagesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 && !chatError ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : !chatError ? (
                messages.map((message) => {
                  const isMe = message.senderId === currentUser?._id
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 sm:gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          {selectedUser?.username?.slice(0, 2).toUpperCase() || 'UN'}
                        </div>
                      )}
                      <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md ${isMe ? 'order-1' : ''}`}>
                        <div
                          className={`px-3 sm:px-4 py-2 rounded-2xl shadow-sm ${
                            isMe
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-zinc-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-xs sm:text-sm break-words">{message.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : null}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 p-2 hidden sm:flex">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 pr-10 sm:pr-12 text-sm sm:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                  disabled={sendingMessage}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 p-1 sm:p-2 hidden sm:flex"
                >
                  <Smile className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg font-medium">Select a conversation</p>
            <p className="text-xs sm:text-sm">Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <SiteHeader />
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Mobile: Show either chat list OR chat window */}
        {isMobile ? (
          <>
            {showChatList ? (
              <ChatListComponent />
            ) : (
              <ChatWindowComponent />
            )}
          </>
        ) : (
          /* Desktop: Show both side by side */
          <>
            <ChatListComponent />
            <ChatWindowComponent />
          </>
        )}
      </div>
    </>
  )
}