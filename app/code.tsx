import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  Play, 
  Copy, 
  Download, 
  FileText, 
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const sampleCode = `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>
      <Text style={styles.count}>{count}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setCount(count - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});`;

export default function CodeScreen() {
  const [activeTab, setActiveTab] = useState('editor');
  const [code, setCode] = useState(sampleCode);

  const platforms = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
    { id: 'web', icon: Globe, label: 'Web' },
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
  ];

  const actions = [
    { id: 'run', icon: Play, label: 'Run', color: '#00ff88' },
    { id: 'copy', icon: Copy, label: 'Copy', color: '#ff6b6b' },
    { id: 'export', icon: Download, label: 'Export', color: '#4dabf7' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <FileText size={24} color="#00ff88" />
        <Text style={styles.headerTitle}>Code Editor</Text>
        
        <View style={styles.platformSelector}>
          {platforms.map((platform, index) => (
            <Animated.View
              key={platform.id}
              entering={FadeInRight.duration(400).delay(index * 100)}
            >
              <TouchableOpacity style={styles.platformButton}>
                <platform.icon size={16} color="#888" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.tabContainer}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'editor' && styles.activeTab]}
          onPress={() => setActiveTab('editor')}
        >
          <Text style={[styles.tabText, activeTab === 'editor' && styles.activeTabText]}>
            Editor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'preview' && styles.activeTab]}
          onPress={() => setActiveTab('preview')}
        >
          <Text style={[styles.tabText, activeTab === 'preview' && styles.activeTabText]}>
            Preview
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.content}>
        {activeTab === 'editor' ? (
          <Animated.View 
            style={styles.editorContainer}
            entering={FadeInDown.duration(400)}
          >
            <ScrollView style={styles.editor} showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.codeInput}
                value={code}
                onChangeText={setCode}
                multiline
                placeholder="Start coding..."
                placeholderTextColor="#666"
                textAlignVertical="top"
              />
            </ScrollView>
            
            <View style={styles.lineNumbers}>
              {code.split('\n').map((_, index) => (
                <Text key={index} style={styles.lineNumber}>
                  {index + 1}
                </Text>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            style={styles.previewContainer}
            entering={FadeInDown.duration(400)}
          >
            <View style={styles.phoneFrame}>
              <View style={styles.phoneScreen}>
                <Text style={styles.previewText}>Preview Mode</Text>
                <Text style={styles.previewSubtext}>
                  Your app preview would appear here
                </Text>
                <View style={styles.mockApp}>
                  <Text style={styles.mockTitle}>Counter App</Text>
                  <Text style={styles.mockCount}>0</Text>
                  <View style={styles.mockButtons}>
                    <View style={styles.mockButton} />
                    <View style={styles.mockButton} />
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      <Animated.View 
        style={styles.actionBar}
        entering={FadeInDown.duration(600).delay(400)}
      >
        {actions.map((action, index) => (
          <Animated.View
            key={action.id}
            entering={FadeInRight.duration(400).delay(index * 100)}
          >
            <TouchableOpacity style={styles.actionButton}>
              <action.icon size={20} color={action.color} />
              <Text style={[styles.actionText, { color: action.color }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>
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
  platformSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  platformButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#00ff88',
  },
  content: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  lineNumbers: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  lineNumber: {
    fontSize: 14,
    color: '#666',
    height: 20,
    textAlign: 'right',
  },
  editor: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  codeInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'monospace',
    padding: 16,
    lineHeight: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  phoneFrame: {
    width: 280,
    height: 500,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  previewSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  mockApp: {
    alignItems: 'center',
  },
  mockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  mockCount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 30,
  },
  mockButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  mockButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});