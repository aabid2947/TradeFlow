import React, { useState } from 'react'
import { Search, Phone, Video, Info, Smile, Paperclip, Send, MoreVertical, Circle, Star, Shield, TrendingUp, Clock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { SiteHeader } from '../components/SiteHeader'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [newMessage, setNewMessage] = useState('')

  const chatUsers = [
    {
      id: 1,
      name: "Ahmadullah Khan",
      username: "ahmad_trader",
      avatar: "AK",
      lastMessage: "Hey, are you available for a BTC trade?",
      time: "7m ago",
      isActive: true,
      unreadCount: 2,
      isVerified: true,
      trustScore: "98.5%",
      totalTrades: 156,
      lastSeen: "Active now"
    },
    {
      id: 2,
      name: "Paradox",
      username: "paradox_p2p",
      avatar: "PX",
      lastMessage: "The USDT rate looks good today",
      time: "2h ago",
      isActive: false,
      unreadCount: 0,
      isVerified: true,
      trustScore: "97.2%",
      totalTrades: 89,
      lastSeen: "2 hours ago"
    },
    {
      id: 3,
      name: "FiroZ UddiN",
      username: "firoz_crypto",
      avatar: "FU",
      lastMessage: "Thanks for the smooth transaction! 👍",
      time: "18h ago",
      isActive: false,
      unreadCount: 0,
      isVerified: true,
      trustScore: "99.1%",
      totalTrades: 234,
      lastSeen: "18 hours ago"
    },
    {
      id: 4,
      name: "TechieTrader",
      username: "techie007.dev",
      avatar: "TT",
      lastMessage: "Can we discuss the ETH trade details?",
      time: "1d ago",
      isActive: false,
      unreadCount: 1,
      isVerified: false,
      trustScore: "85.3%",
      totalTrades: 23,
      lastSeen: "1 day ago"
    }
  ]

  const messages = {
    1: [
      {
        id: 1,
        sender: "other",
        message: "Hi! I saw your BTC listing. Are you available for a trade?",
        time: "10:30 AM",
        avatar: "AK"
      },
      {
        id: 2,
        sender: "me",
        message: "Yes, I'm available! What amount are you looking to trade?",
        time: "10:32 AM"
      },
      {
        id: 3,
        sender: "other",
        message: "Looking to buy 0.5 BTC. Your rate seems competitive.",
        time: "10:35 AM",
        avatar: "AK"
      },
      {
        id: 4,
        sender: "me",
        message: "Perfect! That works for me. Let's proceed with the trade.",
        time: "10:36 AM"
      },
      {
        id: 5,
        sender: "other",
        message: "Great! Should we use escrow for security?",
        time: "10:38 AM",
        avatar: "AK"
      }
    ],
    2: [
      {
        id: 1,
        sender: "other",
        message: "The USDT rate looks good today. Interested in a large volume trade?",
        time: "2:15 PM",
        avatar: "PX"
      },
      {
        id: 2,
        sender: "me",
        message: "Sure, what volume are we talking about?",
        time: "2:18 PM"
      }
    ]
  }

  const currentUser = chatUsers.find(user => user.id === selectedChat)
  const currentMessages = messages[selectedChat] || []

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-500' : 'bg-gray-400'
  }

  return (
    <>
    <SiteHeader/>
    <div className="h-screen bg-gray-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
 
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-zinc-400 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedChat(user.id)}
              className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-all duration-200 ${
                selectedChat === user.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.isActive)}`}></div>
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 truncate">{user.name}</h3>
                      {user.isVerified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{user.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p>
                    {user.unreadCount > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {user.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {currentUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {currentUser.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(currentUser.isActive)}`}></div>
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-zinc-900">{currentUser.name}</h2>
                      {currentUser.isVerified && (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-xs text-gray-600">{currentUser.trustScore}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      {currentUser.lastSeen}
                      <span className="text-gray-400">•</span>
                      <TrendingUp className="w-3 h-3" />
                      {currentUser.totalTrades} trades
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {/* Date Separator */}
                <div className="flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 shadow-sm">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Today
                  </div>
                </div>

                {/* Messages */}
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'other' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {message.avatar}
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md ${message.sender === 'me' ? 'order-1' : ''}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          message.sender === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-zinc-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 pr-12"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100"
                  >
                    <Smile className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}