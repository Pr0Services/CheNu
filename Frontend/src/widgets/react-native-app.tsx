// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V20 - React Native App
// Cross-platform mobile app for iOS and Android
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView,
  SafeAreaView, StatusBar, FlatList, Image, ActivityIndicator,
  Dimensions, Platform, Alert, RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ─────────────────────────────────────────────────────────────────────────────
// THEME & CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const themes = {
  dark: {
    bg: { primary: '#0a0d0b', card: '#141917', input: '#1a1f1c' },
    text: { primary: '#f4f0eb', secondary: '#a8a29e', muted: '#6b6560' },
    accent: { primary: '#4ade80', secondary: '#22d3ee' },
    border: '#2a2f2c',
  },
  light: {
    bg: { primary: '#f8faf9', card: '#ffffff', input: '#f1f5f4' },
    text: { primary: '#1a1a1a', secondary: '#4a5568', muted: '#718096' },
    accent: { primary: '#22c55e', secondary: '#0ea5e9' },
    border: '#e2e8f0',
  }
};

const ThemeContext = createContext({ theme: themes.dark, toggleTheme: () => {} });
const AuthContext = createContext({ user: null, login: async () => {}, logout: () => {} });

// ─────────────────────────────────────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = 'https://api.roady.app/v1';

const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  auth: {
    login: (email: string, password: string) => 
      api.fetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => api.fetch('/auth/me'),
  },
  
  projects: {
    list: () => api.fetch('/projects'),
    get: (id: string) => api.fetch(`/projects/${id}`),
    create: (data: any) => api.fetch('/projects', { method: 'POST', body: JSON.stringify(data) }),
  },
  
  calendar: {
    events: (start: string, end: string) => api.fetch(`/calendar/events?start=${start}&end=${end}`),
  },
  
  nova: {
    chat: (message: string) => api.fetch('/nova/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Card = ({ children, style }: any) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.card, { backgroundColor: theme.bg.card, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
};

const Button = ({ title, onPress, variant = 'primary', loading = false }: any) => {
  const { theme } = useContext(ThemeContext);
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[
        styles.button,
        { backgroundColor: isPrimary ? theme.accent.primary : theme.bg.input,
          borderColor: isPrimary ? theme.accent.primary : theme.border }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#000' : theme.text.primary} />
      ) : (
        <Text style={[styles.buttonText, { color: isPrimary ? '#000' : theme.text.primary }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const Input = ({ placeholder, value, onChangeText, secureTextEntry, ...props }: any) => {
  const { theme } = useContext(ThemeContext);
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={theme.text.muted}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[styles.input, { backgroundColor: theme.bg.input, color: theme.text.primary, borderColor: theme.border }]}
      {...props}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────────────────────────────────────

// LOGIN SCREEN
const LoginScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <View style={styles.loginContainer}>
        <Text style={[styles.logo, { color: theme.accent.primary }]}>🚀 ROADY</Text>
        <Text style={[styles.title, { color: theme.text.primary }]}>Welcome Back</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        
        <Button title="Login" onPress={handleLogin} loading={loading} />
        
        <TouchableOpacity style={styles.link}>
          <Text style={{ color: theme.accent.primary }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// DASHBOARD SCREEN
const DashboardScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [stats, setStats] = useState([
    { icon: '💰', value: '$1.2M', label: 'Revenue', change: '+12.5%' },
    { icon: '📁', value: '47', label: 'Projects', change: '+8' },
    { icon: '👥', value: '101', label: 'Team', change: '+3' },
    { icon: '✅', value: '892', label: 'Tasks', change: '+156' },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch fresh data
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.accent.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.screenTitle, { color: theme.text.primary }]}>Dashboard</Text>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <Card key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: theme.text.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.text.muted }]}>{stat.label}</Text>
              <Text style={[styles.statChange, { color: theme.accent.primary }]}>{stat.change}</Text>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.text.primary }]}>⚡ Quick Actions</Text>
          <View style={styles.quickActions}>
            {['📁 New Project', '✅ Add Task', '📅 Schedule', '🤖 Ask Nova'].map((action, i) => (
              <TouchableOpacity key={i} style={[styles.quickAction, { backgroundColor: theme.bg.input }]}>
                <Text style={{ color: theme.text.primary, fontSize: 12 }}>{action}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

// PROJECTS SCREEN
const ProjectsScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const [projects, setProjects] = useState([
    { id: '1', name: 'Downtown Tower', status: 'active', progress: 75, budget: '$2.5M' },
    { id: '2', name: 'Riverside Complex', status: 'active', progress: 45, budget: '$1.8M' },
    { id: '3', name: 'Office Renovation', status: 'planning', progress: 10, budget: '$500K' },
    { id: '4', name: 'Industrial Park', status: 'completed', progress: 100, budget: '$4.2M' },
  ]);
  const [loading, setLoading] = useState(false);

  const renderProject = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}>
      <Card style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <Text style={[styles.projectName, { color: theme.text.primary }]}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#22c55e20' : item.status === 'completed' ? '#3b82f620' : '#f59e0b20' }]}>
            <Text style={{ color: item.status === 'active' ? '#22c55e' : item.status === 'completed' ? '#3b82f6' : '#f59e0b', fontSize: 10 }}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.bg.input }]}>
            <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: theme.accent.primary }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.text.muted }]}>{item.progress}%</Text>
        </View>
        <Text style={[styles.projectBudget, { color: theme.text.secondary }]}>Budget: {item.budget}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.text.primary }]}>Projects</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.accent.primary }]}>
          <Text style={{ color: '#000', fontWeight: '600' }}>+ New</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => {}}
      />
    </SafeAreaView>
  );
};

// CALENDAR SCREEN
const CalendarScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [events, setEvents] = useState([
    { id: '1', title: 'Site Inspection', time: '9:00 AM', type: 'meeting' },
    { id: '2', title: 'Client Call', time: '11:00 AM', type: 'call' },
    { id: '3', title: 'Team Standup', time: '2:00 PM', type: 'meeting' },
    { id: '4', title: 'Budget Review', time: '4:00 PM', type: 'task' },
  ]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <Text style={[styles.screenTitle, { color: theme.text.primary }]}>Calendar</Text>
      <Text style={[styles.dateText, { color: theme.text.muted }]}>{today}</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {events.map(event => (
          <Card key={event.id} style={styles.eventCard}>
            <View style={styles.eventTime}>
              <Text style={[styles.eventTimeText, { color: theme.accent.primary }]}>{event.time}</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={[styles.eventTitle, { color: theme.text.primary }]}>{event.title}</Text>
              <Text style={[styles.eventType, { color: theme.text.muted }]}>{event.type}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// NOVA CHAT SCREEN
const NovaScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([
    { id: '0', role: 'assistant', content: "Hi! I'm Nova, your AI assistant. How can I help? 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1000));
    const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: `I understand you're asking about "${input}". How can I help further?` };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <Text style={[styles.screenTitle, { color: theme.text.primary }]}>🤖 Nova AI</Text>
      
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
        renderItem={({ item }) => (
          <View style={[styles.message, item.role === 'user' ? styles.userMessage : styles.aiMessage, { backgroundColor: item.role === 'user' ? theme.accent.primary : theme.bg.card }]}>
            <Text style={{ color: item.role === 'user' ? '#000' : theme.text.primary }}>{item.content}</Text>
          </View>
        )}
      />
      
      {loading && <ActivityIndicator color={theme.accent.primary} style={{ marginVertical: 10 }} />}
      
      <View style={[styles.chatInput, { backgroundColor: theme.bg.card, borderColor: theme.border }]}>
        <Input placeholder="Ask Nova..." value={input} onChangeText={setInput} style={{ flex: 1, marginBottom: 0 }} />
        <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: theme.accent.primary }]}>
          <Text style={{ color: '#000', fontWeight: '600' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// SETTINGS SCREEN
const SettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, user } = useContext(AuthContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg.primary }]}>
      <Text style={[styles.screenTitle, { color: theme.text.primary }]}>Settings</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>Dark Mode</Text>
            <TouchableOpacity onPress={toggleTheme} style={[styles.toggle, { backgroundColor: theme.accent.primary }]}>
              <Text>🌙</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        <Card>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>Notifications</Text>
            <Text style={{ color: theme.text.muted }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>Privacy</Text>
            <Text style={{ color: theme.text.muted }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text.primary }]}>Help & Support</Text>
            <Text style={{ color: theme.text.muted }}>→</Text>
          </TouchableOpacity>
        </Card>
        
        <Button title="Logout" onPress={logout} variant="secondary" />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.bg.card, borderTopColor: theme.border },
        tabBarActiveTintColor: theme.accent.primary,
        tabBarInactiveTintColor: theme.text.muted,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: () => <Text>📊</Text> }} />
      <Tab.Screen name="Projects" component={ProjectsScreen} options={{ tabBarIcon: () => <Text>📁</Text> }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarIcon: () => <Text>📅</Text> }} />
      <Tab.Screen name="Nova" component={NovaScreen} options={{ tabBarIcon: () => <Text>🤖</Text> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: () => <Text>⚙️</Text> }} />
    </Tab.Navigator>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const theme = isDark ? themes.dark : themes.light;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userData = await api.auth.me();
        setUser(userData);
      }
    } catch (e) {
      await AsyncStorage.removeItem('token');
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await api.auth.login(email, password);
    await AsyncStorage.setItem('token', token);
    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.bg.primary }]}>
        <ActivityIndicator size="large" color={theme.accent.primary} />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setIsDark(!isDark) }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              <Stack.Screen name="Main" component={TabNavigator} />
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  listContent: { padding: 16 },
  
  // Login
  loginContainer: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 32 },
  error: { color: '#ef4444', textAlign: 'center', marginBottom: 16 },
  link: { alignItems: 'center', marginTop: 16 },
  
  // Common
  screenTitle: { fontSize: 24, fontWeight: '700', marginBottom: 16, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  
  // Card
  card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  
  // Button
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1 },
  buttonText: { fontWeight: '600', fontSize: 16 },
  addButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  
  // Input
  input: { padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, fontSize: 16 },
  
  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  statCard: { width: (width - 44) / 2, marginHorizontal: 6, alignItems: 'center' },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  statChange: { fontSize: 12, marginTop: 4 },
  
  // Quick Actions
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickAction: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  
  // Projects
  projectCard: { marginBottom: 12 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  projectName: { fontSize: 16, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressBar: { flex: 1, height: 6, borderRadius: 3, marginRight: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, width: 35 },
  projectBudget: { fontSize: 13 },
  
  // Calendar
  dateText: { fontSize: 14, paddingHorizontal: 16, marginBottom: 16 },
  eventCard: { flexDirection: 'row', alignItems: 'center' },
  eventTime: { width: 70 },
  eventTimeText: { fontWeight: '600' },
  eventContent: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: '500' },
  eventType: { fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  
  // Chat
  chatContent: { padding: 16 },
  message: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiMessage: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  chatInput: { flexDirection: 'row', padding: 12, borderTopWidth: 1, alignItems: 'center' },
  sendButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, marginLeft: 8 },
  
  // Settings
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#2a2f2c' },
  settingLabel: { fontSize: 16 },
  toggle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
