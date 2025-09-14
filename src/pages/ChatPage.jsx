import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Search, Phone, Video, Info, Smile, Paperclip, Send, Shield, Star, Clock, ArrowLeft, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'
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
  const currentUser = useSelector(selectCurrentUser)
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  // Check for userId in URL params (from trade page)
  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId')
    if (userIdFromUrl) {
      setSelectedChatUserId(userIdFromUrl)
      // Optional: remove the userId from URL after setting it
      // setSearchParams({}, { replace: true });
    }
  }, [searchParams])

  // Get chat list from backend
  const { data: chatsData, isLoading: chatsLoading, error: chatsError } = useGetUserChatsQuery()
  
  // Use Firebase real-time chat for the selected conversation
  const { 
    messages, 
    loading: messagesLoading, 
    sending: sendingMessage,
    connectionStatus,
    sendMessage,
    error: chatError,
    loadOlderMessages,
    loadingOlder,
    hasMoreMessages
  } = useChat(selectedChatUserId)

  const chats = chatsData?.data?.chats || []

  // Get other participant in the chat with proper null/undefined checks
  const getOtherParticipant = (chat) => {
    if (!chat || !chat.participants || !Array.isArray(chat.participants)) {
      return null;
    }
    return chat.participants.find(participant => participant._id !== currentUser?._id);
  }

  // Find the full chat object for the currently selected user
  const currentChat = chats.find(chat => {
    const otherParticipant = getOtherParticipant(chat);
    return otherParticipant?._id === selectedChatUserId;
  });
  
  // Get selected user info
  const selectedUser = selectedChatUserId ? {
    _id: selectedChatUserId,
    username: getOtherParticipant(currentChat)?.username || 'Unknown User'
  } : null

  // Format time for chat list
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

  // Format time for messages
  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Handle chat selection
  const handleChatSelect = (chat) => {
    const otherParticipant = getOtherParticipant(chat)
    if (otherParticipant) {
      setSelectedChatUserId(otherParticipant._id)
    }
  }

  // Handle sending message
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

  // Handle scroll to load older messages
  const handleScroll = (e) => {
    const { scrollTop } = e.target
    
    // Load older messages when scrolled to top
    if (scrollTop === 0 && hasMoreMessages && !loadingOlder) {
      loadOlderMessages()
    }
  }
    
  

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat)
    return otherParticipant?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           chat.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Early return if user is not authenticated
  if (!currentUser) {
    return (
      <>
        <SiteHeader/>
        <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Please log in to access chat.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
    <SiteHeader/>
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
 
      {/* Sidebar - Chat List */}
      {/* On mobile, this is hidden when a chat is selected. On md screens and up, it's always visible. */}
      <div className={`
        w-full md:w-80 md:flex-shrink-0 bg-white border-r border-gray-200 flex-col shadow-lg 
        ${selectedChatUserId ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatsLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : chatsError ? (
            <div className="p-4 text-center text-red-600">Failed to load chats.</div>
          ) : filteredChats.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No conversations</p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat)
              if (!otherParticipant) return null // Skip rendering if participant is missing
              const unreadCount = 0 // Placeholder
              
              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-all duration-200 ${
                    selectedChatUserId === otherParticipant._id ? 'bg-blue-50 md:border-r-2 md:border-r-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {otherParticipant.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-400"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-zinc-900 truncate">{otherParticipant.username}</h3>
                        <span className="text-xs text-gray-500">{formatTime(chat.lastMessageAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage?.content || 'No messages yet'}</p>
                        {unreadCount > 0 && <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">{unreadCount}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {/* On mobile, this is shown only when a chat is selected. On md screens and up, it's always visible. */}
      <div className={`
        flex-1 flex-col bg-white
        ${selectedChatUserId ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedChatUserId && selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3 md:p-4 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  {/* BACK BUTTON - Mobile Only */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedChatUserId(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {selectedUser.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-400"></div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-zinc-900">{selectedUser.username}</h2>
                    <p className="text-xs md:text-sm text-gray-600">Online</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 md:gap-2">
                  <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon"><Info className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
              onScroll={handleScroll}
            >
              <div className="space-y-4">
                {/* Loading indicator for older messages */}
                {loadingOlder && (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading older messages...</span>
                  </div>
                )}

                {/* Beginning of conversation indicator */}
                {!hasMoreMessages && messages.length > 0 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    This is the beginning of your conversation
                  </div>
                )}

                {/* Initial loading state */}
                {messagesLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : messages.length === 0 && !chatError ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe = message.senderId === currentUser?._id
                    const isOptimistic = message.isOptimistic
                    
                    return (
                      <div key={message.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                            {selectedUser?.username?.slice(0, 2).toUpperCase() || 'UN'}
                          </div>
                        )}
                        <div>
                          <div className={`px-4 py-2 rounded-2xl shadow-sm max-w-xs md:max-w-md ${
                              isMe 
                                ? `bg-blue-600 text-white rounded-br-none ${isOptimistic ? 'opacity-70' : ''}` 
                                : 'bg-white text-zinc-900 border border-gray-200 rounded-bl-none'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            {isOptimistic && (
                              <div className="flex items-center mt-1">
                                <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></div>
                                <span className="text-xs opacity-75">Sending...</span>
                              </div>
                            )}
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                 {chatError && <div className="text-center text-red-500 p-4">{chatError}</div>}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full pl-5 pr-12 py-3 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="ghost" size="icon" className="absolute right-12 top-1/2 transform -translate-y-1/2"><Smile className="w-5 h-5 text-gray-500" /></Button>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2"><Paperclip className="w-5 h-5 text-gray-500" /></Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose from existing conversations to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

