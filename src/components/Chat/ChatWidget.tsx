import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Users, Search, Phone, Video, MoreVertical, Minimize2, ArrowLeft } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatWidgetProps {
  currentUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

export function ChatWidget({ currentUser }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - En producción vendría de la API
  const [users] = useState<User[]>([
    {
      id: '1',
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@empresa.com',
      status: 'online'
    },
    {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
      status: 'away'
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana.lopez@empresa.com',
      status: 'offline',
      lastSeen: new Date(Date.now() - 3600000) // 1 hora atrás
    },
    {
      id: '4',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@empresa.com',
      status: 'online'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      receiverId: currentUser.id,
      content: '¡Hola! ¿Cómo va el proyecto de TechCorp?',
      timestamp: new Date(Date.now() - 1800000), // 30 min atrás
      read: false
    },
    {
      id: '2',
      senderId: currentUser.id,
      receiverId: '1',
      content: 'Muy bien, ya enviamos la cotización. Esperamos respuesta esta semana.',
      timestamp: new Date(Date.now() - 1740000), // 29 min atrás
      read: true
    },
    {
      id: '3',
      senderId: '1',
      receiverId: currentUser.id,
      content: 'Perfecto, mantengamos el seguimiento. ¿Necesitas ayuda con algo más?',
      timestamp: new Date(Date.now() - 300000), // 5 min atrás
      read: false
    },
    {
      id: '4',
      senderId: '1',
      receiverId: currentUser.id,
      content: 'También revisé los números del trimestre, se ven muy prometedores.',
      timestamp: new Date(Date.now() - 240000), // 4 min atrás
      read: false
    },
    {
      id: '5',
      senderId: currentUser.id,
      receiverId: '1',
      content: 'Excelente, me alegra escuchar eso. ¿Podemos programar una reunión para la próxima semana?',
      timestamp: new Date(Date.now() - 180000), // 3 min atrás
      read: true
    },
    {
      id: '6',
      senderId: '1',
      receiverId: currentUser.id,
      content: 'Claro, ¿qué tal el martes a las 10:00 AM?',
      timestamp: new Date(Date.now() - 120000), // 2 min atrás
      read: false
    },
    {
      id: '7',
      senderId: '2',
      receiverId: currentUser.id,
      content: 'Revisé los reportes del mes, todo se ve bien.',
      timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
      read: true
    },
    {
      id: '8',
      senderId: currentUser.id,
      receiverId: '2',
      content: 'Perfecto Carlos, gracias por la revisión.',
      timestamp: new Date(Date.now() - 7140000), // 1h 59min atrás
      read: true
    },
    {
      id: '9',
      senderId: '2',
      receiverId: currentUser.id,
      content: '¿Necesitas que prepare algo especial para la presentación del viernes?',
      timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
      read: false
    }
  ]);

  // Crear conversaciones basadas en mensajes
  const conversations: Conversation[] = users.map(user => {
    const userMessages = messages.filter(
      msg => (msg.senderId === user.id && msg.receiverId === currentUser.id) ||
             (msg.senderId === currentUser.id && msg.receiverId === user.id)
    );
    
    const lastMessage = userMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    const unreadCount = userMessages.filter(msg => msg.senderId === user.id && !msg.read).length;

    return {
      id: user.id,
      participants: [user],
      lastMessage,
      unreadCount
    };
  }).filter(conv => conv.lastMessage); // Solo mostrar conversaciones con mensajes

  const filteredConversations = conversations.filter(conv =>
    conv.participants[0].firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants[0].lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeConversationData = conversations.find(conv => conv.id === activeConversation);
  const activeUser = activeConversationData?.participants[0];

  const conversationMessages = messages.filter(
    msg => activeConversation && (
      (msg.senderId === activeConversation && msg.receiverId === currentUser.id) ||
      (msg.senderId === currentUser.id && msg.receiverId === activeConversation)
    )
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      receiverId: activeConversation,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (user: User) => {
    switch (user.status) {
      case 'online': return 'En línea';
      case 'away': return 'Ausente';
      case 'offline': 
        return user.lastSeen 
          ? `Visto ${user.lastSeen.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
          : 'Desconectado';
      default: return 'Desconectado';
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
    }
  };

  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-[#FF6200] text-white p-4 shadow-lg hover:bg-orange-600 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
          {totalUnreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center">
              {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white border border-gray-200 shadow-xl transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-96 w-80'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#FF6200] text-white">
          <div className="flex items-center">
            <button
              onClick={() => setActiveConversation(null)}
              className="p-1 hover:bg-orange-600 transition-colors mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-medium">
              {activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-orange-600 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-orange-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex h-80">
            {/* Lista de conversaciones */}
            <div className={`${activeConversation ? 'hidden' : 'w-full'} border-r border-gray-200 flex flex-col`}>
              {/* Búsqueda */}
              {!activeConversation && (
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Lista de usuarios */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => {
                  const user = conversation.participants[0];
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation.id)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        activeConversation === conversation.id ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-orange-100 flex items-center justify-center">
                            {user.avatar ? (
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium text-[#FF6200]">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white ${getStatusColor(user.status)}`}></div>
                        </div>
                        
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-[#FF6200] text-white text-xs px-2 py-1 ml-2">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-600 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {getStatusText(user)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Área de chat */}
            {activeConversation && (
              <div className="w-full flex flex-col">
                {/* Info del usuario activo */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-8 h-8 bg-orange-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-[#FF6200]">
                            {activeUser?.firstName.charAt(0)}{activeUser?.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-2 h-2 border border-white ${getStatusColor(activeUser?.status || 'offline')}`}></div>
                      </div>
                          ? 'bg-[#FF6200] text-white' 
                          : 'bg-gray-200 text-gray-900'
                          {activeUser?.firstName} {activeUser?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activeUser && getStatusText(activeUser)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {conversationMessages.map((message) => {
                    const isOwn = message.senderId === currentUser.id;
                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 text-sm ${
                          isOwn 
                            ? 'bg-[#FF6200] text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de mensaje */}
                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-[#FF6200] text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}