import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Calendar, Clock, Sparkles, Mic } from 'lucide-react-native';
import { z } from 'zod';
import { createRorkTool, useRorkAgent } from '@rork-ai/toolkit-sdk';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { todayEvents, healthData, assignments, contacts } from '@/mocks/data';

const SYSTEM_CONTEXT = `You are Nexus, a friendly and helpful AI assistant for MBA students. You help them manage their schedule, track priorities, and optimize their time.

Current user context:
- Today's events: ${JSON.stringify(todayEvents.map(e => ({ title: e.title, time: e.time, type: e.type, location: e.location })))}
- Health data: Sleep ${healthData.sleep}h, Recovery ${healthData.recovery}%, Steps ${healthData.steps}
- Pending assignments: ${JSON.stringify(assignments.filter(a => a.status !== 'completed').map(a => ({ title: a.title, course: a.course, dueDate: a.dueDate })))}
- Key contacts: ${contacts.slice(0, 3).map(c => c.name + ' at ' + c.company).join(', ')}

Be conversational, supportive, and use casual language. Help them make smart decisions about their time. When they ask to make changes, use the available tools.`;

export default function ChatScreen() {
  const { preferences } = useUser();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const inputAnim = useRef(new Animated.Value(0)).current;

  const { messages, sendMessage, status } = useRorkAgent({
    system: SYSTEM_CONTEXT,
    tools: {
      viewSchedule: createRorkTool({
        description: 'View today\'s schedule or upcoming events',
        zodSchema: z.object({
          timeframe: z.enum(['today', 'tomorrow', 'week']).describe('The timeframe to view'),
        }),
        execute(input) {
          console.log('Viewing schedule for:', input.timeframe);
          return { success: true, events: todayEvents };
        },
      }),
      rescheduleEvent: createRorkTool({
        description: 'Reschedule an event to a new time',
        zodSchema: z.object({
          eventTitle: z.string().describe('The title of the event to reschedule'),
          newTime: z.string().describe('The new time for the event'),
          reason: z.string().optional().describe('Reason for rescheduling'),
        }),
        execute(input) {
          console.log('Rescheduling:', input.eventTitle, 'to', input.newTime);
          return { success: true, message: `Rescheduled "${input.eventTitle}" to ${input.newTime}` };
        },
      }),
      addEvent: createRorkTool({
        description: 'Add a new event to the calendar',
        zodSchema: z.object({
          title: z.string().describe('Event title'),
          time: z.string().describe('Event time'),
          type: z.enum(['class', 'assignment', 'recruiting', 'social', 'health', 'personal']).describe('Event type'),
          location: z.string().optional().describe('Event location'),
        }),
        execute(input) {
          console.log('Adding event:', input);
          return { success: true, message: `Added "${input.title}" at ${input.time}` };
        },
      }),
      getHealthInsights: createRorkTool({
        description: 'Get health and wellness insights',
        zodSchema: z.object({}),
        execute() {
          console.log('Getting health insights');
          return { 
            success: true, 
            data: healthData,
            recommendation: healthData.recovery < 70 
              ? 'Consider lighter activities today' 
              : 'You\'re good for intense work!'
          };
        },
      }),
      suggestOptimization: createRorkTool({
        description: 'Suggest schedule optimizations based on priorities and health',
        zodSchema: z.object({
          focus: z.enum(['productivity', 'wellness', 'balance']).describe('What to optimize for'),
        }),
        execute(input) {
          console.log('Suggesting optimization for:', input.focus);
          return { 
            success: true, 
            suggestions: [
              'Move gym to morning for better energy',
              'Add 15-min buffer before coffee chat',
              'Block 2 hours for deep work on case prep'
            ]
          };
        },
      }),
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    
    Animated.sequence([
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    sendMessage(inputText.trim());
    setInputText('');
  };

  const quickActions = [
    { label: "What's my day look like?", icon: Calendar },
    { label: "Optimize my schedule", icon: Sparkles },
    { label: "How's my energy?", icon: Clock },
  ];

  const renderMessage = (message: typeof messages[0], index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.botAvatar}>
              <Bot size={18} color={Colors.white} />
            </View>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}>
          {message.parts.map((part, partIndex) => {
            if (part.type === 'text') {
              return (
                <Text
                  key={`${message.id}-${partIndex}`}
                  style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.assistantText,
                  ]}
                >
                  {part.text}
                </Text>
              );
            }
            if (part.type === 'tool') {
              if (part.state === 'output-available') {
                return null;
              }
              return (
                <View key={`${message.id}-${partIndex}`} style={styles.toolIndicator}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.toolText}>Working on it...</Text>
                </View>
              );
            }
            return null;
          })}
        </View>
        {isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.userAvatar}>
              <User size={18} color={Colors.white} />
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Bot size={24} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Nexus AI</Text>
            <Text style={styles.headerSubtitle}>Your MBA co-pilot</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Sparkles size={40} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Hey {preferences.name || 'there'}! 👋</Text>
              <Text style={styles.emptySubtitle}>
                I'm Nexus, your AI assistant. Ask me anything about your schedule, priorities, or let me help optimize your day.
              </Text>
              <View style={styles.quickActionsContainer}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickAction}
                    onPress={() => {
                      setInputText(action.label);
                      setTimeout(() => {
                        sendMessage(action.label);
                        setInputText('');
                      }, 100);
                    }}
                    activeOpacity={0.7}
                  >
                    <action.icon size={16} color={Colors.primary} />
                    <Text style={styles.quickActionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
          )}
          {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
            <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
              <View style={styles.avatarContainer}>
                <View style={styles.botAvatar}>
                  <Bot size={18} color={Colors.white} />
                </View>
              </View>
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.micButton}
              activeOpacity={0.7}
            >
              <Mic size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              styles.sendButtonContainer,
              {
                transform: [
                  {
                    scale: inputAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.9],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Send size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.card,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  quickActionsContainer: {
    width: '100%',
    gap: 10,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    alignSelf: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.white,
  },
  assistantText: {
    color: Colors.text,
  },
  toolIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 12,
    gap: 10,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  micButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButtonContainer: {
    alignSelf: 'flex-end',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
});
