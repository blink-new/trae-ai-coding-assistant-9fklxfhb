import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Zap,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bot,
  Code,
  Moon,
  Volume2,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  color?: string;
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [autoComplete, setAutoComplete] = useState(true);

  const settingsSections = [
    {
      title: 'AI Assistant',
      items: [
        {
          id: 'ai-model',
          title: 'AI Model',
          subtitle: 'GPT-4 Turbo',
          icon: Bot,
          type: 'navigation' as const,
          color: '#00ff88',
        },
        {
          id: 'auto-complete',
          title: 'Auto Complete',
          subtitle: 'Smart code suggestions',
          icon: Zap,
          type: 'toggle' as const,
          value: autoComplete,
          onPress: () => setAutoComplete(!autoComplete),
          color: '#ff6b6b',
        },
      ],
    },
    {
      title: 'Editor',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          subtitle: 'Dark Mode',
          icon: Palette,
          type: 'navigation' as const,
          color: '#4dabf7',
        },
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Better for low light',
          icon: Moon,
          type: 'toggle' as const,
          value: darkMode,
          onPress: () => setDarkMode(!darkMode),
          color: '#9775fa',
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Push notifications',
          icon: Bell,
          type: 'toggle' as const,
          value: notifications,
          onPress: () => setNotifications(!notifications),
          color: '#ffd43b',
        },
        {
          id: 'sound',
          title: 'Sound Effects',
          subtitle: 'Keyboard & UI sounds',
          icon: Volume2,
          type: 'toggle' as const,
          value: soundEffects,
          onPress: () => setSoundEffects(!soundEffects),
          color: '#51cf66',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          subtitle: 'Manage your account',
          icon: User,
          type: 'navigation' as const,
          color: '#339af0',
        },
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Data protection settings',
          icon: Shield,
          type: 'navigation' as const,
          color: '#f76707',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get assistance',
          icon: HelpCircle,
          type: 'navigation' as const,
          color: '#748ffc',
        },
        {
          id: 'logout',
          title: 'Sign Out',
          subtitle: 'Exit your account',
          icon: LogOut,
          type: 'action' as const,
          color: '#ff6b6b',
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem, index: number) => (
    <Animated.View
      key={item.id}
      entering={FadeInRight.duration(400).delay(index * 50)}
    >
      <TouchableOpacity
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <item.icon size={20} color={item.color} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>

        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{ false: '#333', true: '#00ff88' }}
            thumbColor={item.value ? '#fff' : '#666'}
          />
        )}

        {item.type === 'navigation' && (
          <ChevronRight size={16} color="#666" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <SettingsIcon size={24} color="#9775fa" />
        <Text style={styles.headerTitle}>Settings</Text>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={styles.profileCard}
          entering={FadeInDown.duration(600).delay(200)}
        >
          <View style={styles.avatar}>
            <User size={24} color="#00ff88" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Trae AI User</Text>
            <Text style={styles.profileEmail}>developer@traeai.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>

        {settingsSections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            style={styles.section}
            entering={FadeInDown.duration(600).delay(300 + sectionIndex * 100)}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => 
                renderSettingItem(item, itemIndex)
              )}
            </View>
          </Animated.View>
        ))}

        <Animated.View 
          style={styles.footer}
          entering={FadeInDown.duration(600).delay(800)}
        >
          <Text style={styles.footerText}>Trae AI Coding Assistant</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
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
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  versionText: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});