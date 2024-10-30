import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function ChatView({ title = 'Blank' }: Props) {
  const [sharedChats, setSharedChats] = useState<string[]>([]);
  const [personalChats, setPersonalChats] = useState<string[]>([]);
  const [newChatName, setNewChatName] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ [key: string]: { position: string; text: string; id: string }[] }>({});
  const [inputMessage, setInputMessage] = useState('');
  const [chatType, setChatType] = useState<'shared' | 'personal'>('shared');

  const handleCreateChat = () => {
    if (newChatName.trim()) {
      if (chatType === 'shared') {
        setSharedChats([...sharedChats, newChatName]);
      } else {
        setPersonalChats([...personalChats, newChatName]);
      }
      setChatMessages((prev) => ({
        ...prev,
        [newChatName]: [],
      }));
      setNewChatName('');
    }
  };

  const handleSelectChat = (chatName: string) => {
    setActiveChat(chatName);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && activeChat) {
      const newMessage = { position: 'right', text: inputMessage, id: 'You' };
      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), newMessage],
      }));

      // 添加自动回复
      const autoReply = generateAutoReply(inputMessage);
      setChatMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), autoReply],
      }));

      setInputMessage('');
    }
  };

  // 生成自动回复
  const generateAutoReply = (userMessage: string) => {
    let replyText = "I didn't understand that."; // 默认回复

    // 简单的自动回复逻辑
    if (userMessage.includes('hi') || userMessage.includes('hello')) {
      replyText = "Hello! How can I assist you today?";
    } else if (userMessage.includes('help')) {
      replyText = "Sure, I’m here to help! What do you need?";
    } else if (userMessage.includes('bye')) {
      replyText = "Goodbye! Have a great day!";
    }

    return { position: 'left', text: replyText, id: 'Bot' };
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>

      <Box sx={{ display: 'flex', mt: 5, height: 600 }}>
        {/* 聊天历史区域 */}
        <Box
          sx={{
            width: 240,
            borderRight: (theme) => `solid 1px ${theme.vars.palette.divider}`,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['100'], 0.2),
          }}
        >
          <Typography variant="h6">Chat History</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Shared Chats</Typography>
          {sharedChats.map((chat, index) => (
            <Button
              variant="text"
              color="primary"
              key={index}
              onClick={() => handleSelectChat(chat)}
              sx={{ cursor: 'pointer', mb: 1 }}
            >
              {chat}
            </Button>
          ))}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Personal Chats</Typography>
          {personalChats.map((chat, index) => (
            <Button
              variant="text"
              color="secondary"
              key={index}
              onClick={() => handleSelectChat(chat)}
              sx={{ cursor: 'pointer', mb: 1 }}
            >
              {chat}
            </Button>
          ))}

          <TextField
            variant="outlined"
            size="small"
            placeholder="New Chat Name"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            sx={{ mt: 2 }}
          />
          
          {/* 聊天类型选择 */}
          <Box sx={{ mt: 1, mb: 1 }}>
            <Button 
              variant={chatType === 'shared' ? 'contained' : 'outlined'} 
              color="primary" 
              onClick={() => setChatType('shared')}
            >
              Shared
            </Button>
            <Button 
              variant={chatType === 'personal' ? 'contained' : 'outlined'} 
              color="secondary" 
              onClick={() => setChatType('personal')}
              sx={{ ml: 1 }}
            >
              Personal
            </Button>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateChat}
            sx={{ mt: 1 }}
          >
            Create Chat
          </Button>
        </Box>

        {/* 聊天框区域 */}
        <Box
          sx={{
            flex: 1,
            borderRadius: 2,
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['200'], 0.8),
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 消息列表 */}
          <Box sx={{ flex: 1, overflow: 'auto', padding: 2, display: 'flex', flexDirection: 'column' }}>
            {activeChat && chatMessages[activeChat]?.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignSelf: msg.position === 'right' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.position === 'right' ? '#cfe9ff' : '#e0e0e0',
                  borderRadius: 4,
                  padding: 1,
                  margin: 1,
                  maxWidth: '70%',
                }}
              >
                <Avatar
                  sx={{ width: 24, height: 24, marginRight: 1 }}
                  // src={msg.position === 'right' ? '' : 'https://i.pravatar.cc/300'}
                />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {msg.id}
                  </Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* 输入框和发送按钮 */}
          <Box
            sx={{
              display: 'flex',
              padding: 1,
              borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              sx={{ ml: 1 }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </DashboardContent>
  );
}
