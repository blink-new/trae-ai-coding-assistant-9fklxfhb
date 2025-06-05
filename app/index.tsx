import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Send, Bot, User, Loader2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Anon Key is missing. Check your environment variables.');
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Trae AI, your coding assistant. I can help you with coding tasks, debugging, code review, and more. What would you like to work on today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      setIsLoading(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      const currentInput = inputText.trim();
      setInputText('');

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: { message: currentInput },
        });

        if (error) {
          throw error;
        }

        if (data && data.response) {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: data.response,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: "Sorry, I couldn't get a response. Please try again.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      } catch (err: any) {
        console.error("Error calling Supabase function:", err);
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `Error: ${err.message || 'Failed to connect to AI. Please check your connection and API key.'}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  };

  const renderMessage = (message: Message, index: number) => (
    <Animated.View
      key={message.id}
      entering={FadeInDown.duration(400).delay(index * 100)}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View style={styles.messageHeader}>
        {message.isUser ? (
          <User size={16} color="#00ff88" />
        ) : (
          <Bot size={16} color="#ff6b6b" />
        )}
        <Text style={styles.senderText}>
          {message.isUser ? 'You' : 'Trae AI'}
        </Text>
      </View>
      <Text style={styles.messageText}>{message.text}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={styles.header}
        entering={FadeInUp.duration(600)}
      >
        <Bot size={28} color="#00ff88" />
        <Text style={styles.headerTitle}>Trae AI Assistant</Text>
        <View style={styles.statusIndicator}>
          {isLoading ? (
            <Loader2 size={16} color="#00ff88" style={styles.loadingIcon} />
          ) : (
            <View style={styles.statusDot} />
          )}
          <Text style={styles.statusText}>{isLoading ? 'Thinking...' : 'Online'}</Text>
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        <Animated.View
          style={styles.inputContainer}
          entering={FadeInUp.duration(600).delay(200)}
        >
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={isLoading ? "Trae AI is thinking..." : "Ask me anything about coding..."}
            placeholderTextColor="#666"
            multiline
            maxLength={1000}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: inputText.trim() && !isLoading ? 1 : 0.5 },
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 size={20} color="#1a1a1a" style={styles.loaderIcon} />
            ) : (
              <Send size={20} color="#1a1a1a" />
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
    marginRight: 6,
  },
  loadingIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#00ff88',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2a2a2a',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginLeft: 6,
  },
  messageText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    color: '#fff',
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#444',
  },
  sendButton: {
    backgroundColor: '#00ff88',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderIcon: {
    // For rotating animation if needed
  },
});