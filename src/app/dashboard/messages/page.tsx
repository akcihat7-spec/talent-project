'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'file' | 'image'
  fileName?: string
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantRole: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'user1',
    participantName: 'Sarah Johnson',
    participantAvatar: 'SJ',
    participantRole: 'Client',
    lastMessage: 'The project looks great! Can we schedule a call?',
    lastMessageTime: '2 hours ago',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: 'SJ',
        content: 'Hi! I wanted to discuss the React project we talked about.',
        timestamp: '3 hours ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        content: 'Hi Sarah! Yes, I\'d be happy to discuss it. What aspects are you most interested in?',
        timestamp: '2.5 hours ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm3',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: 'SJ',
        content: 'The project looks great! Can we schedule a call?',
        timestamp: '2 hours ago',
        isRead: false,
        type: 'text'
      }
    ]
  },
  {
    id: '2',
    participantId: 'user2',
    participantName: 'Mike Chen',
    participantAvatar: 'MC',
    participantRole: 'Talent',
    lastMessage: 'Thanks for the opportunity! I\'ll send the proposal.',
    lastMessageTime: '5 hours ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm4',
        senderId: 'user2',
        senderName: 'Mike Chen',
        senderAvatar: 'MC',
        content: 'Hello! I saw your job posting for the Python automation project.',
        timestamp: '6 hours ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm5',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        content: 'Hi Mike! Thanks for your interest. Can you share your experience with similar projects?',
        timestamp: '5.5 hours ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm6',
        senderId: 'user2',
        senderName: 'Mike Chen',
        senderAvatar: 'MC',
        content: 'Thanks for the opportunity! I\'ll send the proposal.',
        timestamp: '5 hours ago',
        isRead: true,
        type: 'text'
      }
    ]
  },
  {
    id: '3',
    participantId: 'user3',
    participantName: 'Emily Davis',
    participantAvatar: 'ED',
    participantRole: 'Client',
    lastMessage: 'The payment has been processed. Thank you!',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm7',
        senderId: 'user3',
        senderName: 'Emily Davis',
        senderAvatar: 'ED',
        content: 'Hi! I wanted to confirm the payment for the completed project.',
        timestamp: '1 day ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm8',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        content: 'Hi Emily! Yes, the payment has been processed on our end.',
        timestamp: '1 day ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm9',
        senderId: 'user3',
        senderName: 'Emily Davis',
        senderAvatar: 'ED',
        content: 'The payment has been processed. Thank you!',
        timestamp: '1 day ago',
        isRead: true,
        type: 'text'
      }
    ]
  },
  {
    id: '4',
    participantId: 'user4',
    participantName: 'Alex Thompson',
    participantAvatar: 'AT',
    participantRole: 'Talent',
    lastMessage: 'I\'m available for the project. When can we start?',
    lastMessageTime: '2 days ago',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 'm10',
        senderId: 'user4',
        senderName: 'Alex Thompson',
        senderAvatar: 'AT',
        content: 'Hello! I\'m interested in your mobile app development project.',
        timestamp: '2 days ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm11',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        content: 'Hi Alex! Great to hear from you. Do you have experience with React Native?',
        timestamp: '2 days ago',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm12',
        senderId: 'user4',
        senderName: 'Alex Thompson',
        senderAvatar: 'AT',
        content: 'I\'m available for the project. When can we start?',
        timestamp: '2 days ago',
        isRead: false,
        type: 'text'
      }
    ]
  }
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(mockConversations)

  useEffect(() => {
    if (selectedConversation) {
      // Mark messages as read
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                unreadCount: 0,
                messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
              }
            : conv
        )
      )
    }
  }, [selectedConversation])

  useEffect(() => {
    const filtered = conversations.filter(conv =>
      conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredConversations(filtered)
  }, [searchTerm, conversations])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'ME',
      content: newMessage,
      timestamp: 'Just now',
      isRead: true,
      type: 'text'
    }

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: 'Just now',
              messages: [...conv.messages, newMsg]
            }
          : conv
      )
    )

    setSelectedConversation(prev =>
      prev ? {
        ...prev,
        lastMessage: newMessage,
        lastMessageTime: 'Just now',
        messages: [...prev.messages, newMsg]
      } : null
    )

    setNewMessage('')
  }

  const getRoleColor = (role: string) => {
    return role === 'Client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  return (
    <DashboardLayout title="Messages" subtitle="Communicate with clients and talents">
      <div className="h-full flex flex-col lg:flex-row gap-6">
        {/* Conversations List */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Conversations</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search conversations..."
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  selectedConversation?.id === conversation.id ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {conversation.participantAvatar}
                        </span>
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participantName}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(conversation.participantRole)}`}>
                        {conversation.participantRole}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{conversation.lastMessageTime}</span>
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {selectedConversation.participantAvatar}
                      </span>
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{selectedConversation.participantName}</p>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.isOnline ? 'Active now' : `Last seen ${selectedConversation.lastMessageTime}`}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedConversation.participantRole)}`}>
                    {selectedConversation.participantRole}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-end space-x-2 ${message.senderId === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                              {message.senderAvatar}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              message.senderId === 'me'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${message.senderId === 'me' ? 'text-right' : 'text-left'}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
