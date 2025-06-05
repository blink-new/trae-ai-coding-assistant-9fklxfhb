import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import {
  FolderTree,
  Folder,
  FolderOpen,
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  Code,
  Image,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileItem[];
  isExpanded?: boolean;
  size?: string;
  modified?: string;
}

const mockFileStructure: FileItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    isExpanded: true,
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        isExpanded: true,
        children: [
          { id: '3', name: 'Button.tsx', type: 'file', extension: 'tsx', size: '2.1 KB', modified: '2 min ago' },
          { id: '4', name: 'Header.tsx', type: 'file', extension: 'tsx', size: '1.8 KB', modified: '5 min ago' },
          { id: '5', name: 'Modal.tsx', type: 'file', extension: 'tsx', size: '3.2 KB', modified: '1 hour ago' },
        ],
      },
      {
        id: '6',
        name: 'screens',
        type: 'folder',
        isExpanded: false,
        children: [
          { id: '7', name: 'Home.tsx', type: 'file', extension: 'tsx', size: '4.5 KB', modified: '10 min ago' },
          { id: '8', name: 'Profile.tsx', type: 'file', extension: 'tsx', size: '3.1 KB', modified: '1 hour ago' },
        ],
      },
      { id: '9', name: 'App.tsx', type: 'file', extension: 'tsx', size: '1.2 KB', modified: '30 min ago' },
      { id: '10', name: 'index.ts', type: 'file', extension: 'ts', size: '0.8 KB', modified: '1 hour ago' },
    ],
  },
  {
    id: '11',
    name: 'assets',
    type: 'folder',
    isExpanded: false,
    children: [
      { id: '12', name: 'logo.png', type: 'file', extension: 'png', size: '45 KB', modified: '2 days ago' },
      { id: '13', name: 'icon.svg', type: 'file', extension: 'svg', size: '12 KB', modified: '1 day ago' },
    ],
  },
  { id: '14', name: 'package.json', type: 'file', extension: 'json', size: '2.3 KB', modified: '3 hours ago' },
  { id: '15', name: 'README.md', type: 'file', extension: 'md', size: '1.5 KB', modified: '1 day ago' },
];

export default function FilesScreen() {
  const [fileStructure, setFileStructure] = useState(mockFileStructure);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return Code;
      case 'png':
      case 'jpg':
      case 'svg':
        return Image;
      case 'json':
        return SettingsIcon;
      default:
        return FileText;
    }
  };

  const toggleFolder = (id: string, items: FileItem[]): FileItem[] => {
    return items.map(item => {
      if (item.id === id && item.type === 'folder') {
        return { ...item, isExpanded: !item.isExpanded };
      }
      if (item.children) {
        return { ...item, children: toggleFolder(id, item.children) };
      }
      return item;
    });
  };

  const handleFolderToggle = (id: string) => {
    setFileStructure(prev => toggleFolder(id, prev));
  };

  const renderFileItem = (item: FileItem, depth: number = 0, index: number = 0) => {
    const IconComponent = item.type === 'folder' 
      ? (item.isExpanded ? FolderOpen : Folder)
      : getFileIcon(item.extension);

    return (
      <Animated.View 
        key={item.id}
        entering={FadeInRight.duration(300).delay(index * 50)}
      >
        <TouchableOpacity
          style={[
            styles.fileItem,
            { paddingLeft: 16 + depth * 20 },
            selectedFile === item.id && styles.selectedFileItem,
          ]}
          onPress={() => {
            if (item.type === 'folder') {
              handleFolderToggle(item.id);
            } else {
              setSelectedFile(item.id);
            }
          }}
        >
          <IconComponent 
            size={16} 
            color={item.type === 'folder' ? '#4dabf7' : '#00ff88'} 
          />
          <Text style={styles.fileName}>{item.name}</Text>
          {item.type === 'file' && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileSize}>{item.size}</Text>
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal size={14} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        
        {item.children && item.isExpanded && (
          <View>
            {item.children.map((child, childIndex) => 
              renderFileItem(child, depth + 1, childIndex)
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  const filteredFiles = fileStructure.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <FolderTree size={24} color="#4dabf7" />
        <Text style={styles.headerTitle}>Project Files</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#00ff88" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={styles.searchContainer}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <Search size={16} color="#666" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search files..."
          placeholderTextColor="#666"
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View 
          style={styles.statsBar}
          entering={FadeInDown.duration(600).delay(300)}
        >
          <Text style={styles.statsText}>12 files • 3 folders</Text>
          <Text style={styles.statsText}>Updated 2 min ago</Text>
        </Animated.View>

        <ScrollView style={styles.fileList} showsVerticalScrollIndicator={false}>
          {(searchQuery ? filteredFiles : fileStructure).map((item, index) =>
            renderFileItem(item, 0, index)
          )}
        </ScrollView>
      </View>

      {selectedFile && (
        <Animated.View 
          style={styles.bottomPanel}
          entering={FadeInDown.duration(400)}
        >
          <Text style={styles.panelTitle}>File Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.closeButton]}
              onPress={() => setSelectedFile(null)}
            >
              <Text style={[styles.actionButtonText, styles.closeButtonText]}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  fileList: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  selectedFileItem: {
    backgroundColor: '#2a2a2a',
  },
  fileName: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
  bottomPanel: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 20,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00ff88',
  },
  closeButton: {
    backgroundColor: '#ff6b6b',
  },
  closeButtonText: {
    color: '#fff',
  },
});