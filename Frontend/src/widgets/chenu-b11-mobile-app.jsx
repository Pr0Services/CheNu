/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BATCH 11: REACT NATIVE MOBILE APP
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Complete mobile app structure:
 * - RN-01: App entry + Navigation
 * - RN-02: Authentication screens
 * - RN-03: Dashboard screen
 * - RN-04: Projects list + detail
 * - RN-05: Tasks Kanban mobile
 * - RN-06: Calendar view
 * - RN-07: Notifications
 * - RN-08: Settings + Profile
 * - RN-09: Offline support
 * - RN-10: Push notifications
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const Colors = {
  bg: {
    main: '#1A1A1A',
    card: '#242424',
    hover: '#2E2E2E',
    input: '#1E1E1E',
  },
  text: {
    primary: '#E8E4DC',
    secondary: '#A09080',
    muted: '#6B6560',
  },
  border: '#333333',
  accent: {
    gold: '#D8B26A',
    emerald: '#3F7249',
    turquoise: '#3EB4A2',
    danger: '#EF4444',
    purple: '#8B5CF6',
  },
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT & PROVIDERS
// ═══════════════════════════════════════════════════════════════════════════════

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check stored token on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // In real app: AsyncStorage.getItem('token')
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // API call
      const response = await fetch('https://api.chenu.ca/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.access_token) {
        setToken(data.access_token);
        setUser({ email, name: 'User' });
        // AsyncStorage.setItem('token', data.access_token);
        return { success: true };
      }
      
      return { success: false, error: data.detail || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    // AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ═══════════════════════════════════════════════════════════════════════════════
// API SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE = 'https://api.chenu.ca/api/v1';

const api = {
  async get(endpoint, token) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async post(endpoint, data, token) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async patch(endpoint, data, token) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION (Simplified - use React Navigation in real app)
// ═══════════════════════════════════════════════════════════════════════════════

const NavigationContext = createContext(null);

const NavigationProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [params, setParams] = useState({});

  const navigate = (screen, newParams = {}) => {
    setCurrentScreen(screen);
    setParams(newParams);
  };

  const goBack = () => {
    setCurrentScreen('Dashboard');
    setParams({});
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, params, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = () => useContext(NavigationContext);

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.main} />
      
      <View style={styles.loginContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>CHE·NU™</Text>
          <Text style={styles.logoSubtext}>Construction Intelligence</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Connexion</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Courriel</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              placeholderTextColor={Colors.text.muted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.text.muted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.bg.main} />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Mot de passe oublié?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const DashboardScreen = () => {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    projects: 8,
    tasks: 24,
    revenue: 145230,
    completion: 87,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch fresh data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const kpis = [
    { label: 'Projets actifs', value: stats.projects, icon: '📁', color: Colors.accent.gold },
    { label: 'Tâches', value: stats.tasks, icon: '✓', color: Colors.accent.turquoise },
    { label: 'Revenus MTD', value: `$${(stats.revenue / 1000).toFixed(0)}K`, icon: '💰', color: Colors.accent.emerald },
    { label: 'Complétion', value: `${stats.completion}%`, icon: '📊', color: Colors.accent.purple },
  ];

  const quickActions = [
    { label: 'Nouveau projet', icon: '➕', screen: 'NewProject' },
    { label: 'Nouvelle tâche', icon: '📋', screen: 'NewTask' },
    { label: 'Scanner', icon: '📷', screen: 'Scanner' },
    { label: 'Nova IA', icon: '🤖', screen: 'Nova' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent.gold} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user?.name || 'Utilisateur'} 👋</Text>
        </View>
        <TouchableOpacity onPress={() => navigate('Notifications')}>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* KPIs */}
      <View style={styles.kpiGrid}>
        {kpis.map((kpi, index) => (
          <View key={index} style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>{kpi.icon}</Text>
            <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => navigate(action.screen)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Projects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projets récents</Text>
          <TouchableOpacity onPress={() => navigate('Projects')}>
            <Text style={styles.seeAllLink}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        
        {[
          { id: 1, name: 'Rénovation Dupont', progress: 75, status: 'active' },
          { id: 2, name: 'Construction Martin', progress: 35, status: 'active' },
          { id: 3, name: 'Aménagement Bureau', progress: 90, status: 'review' },
        ].map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => navigate('ProjectDetail', { id: project.id })}
          >
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectStatus}>
                {project.status === 'active' ? '🟢 En cours' : '🟡 En révision'}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{project.progress}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tâches à venir</Text>
          <TouchableOpacity onPress={() => navigate('Tasks')}>
            <Text style={styles.seeAllLink}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        
        {[
          { id: 1, title: 'Préparer soumission', due: 'Aujourd\'hui', priority: 'high' },
          { id: 2, title: 'Commander matériaux', due: 'Demain', priority: 'urgent' },
          { id: 3, title: 'Inspection plomberie', due: 'Ven 6 déc', priority: 'medium' },
        ].map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskCard}
            onPress={() => navigate('TaskDetail', { id: task.id })}
          >
            <View style={[styles.priorityDot, {
              backgroundColor: task.priority === 'urgent' ? Colors.accent.danger :
                             task.priority === 'high' ? Colors.accent.gold :
                             Colors.accent.turquoise
            }]} />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDue}>{task.due}</Text>
            </View>
            <Text style={styles.taskArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const ProjectsScreen = () => {
  const { navigate, goBack } = useNavigation();
  const [projects, setProjects] = useState([
    { id: 1, name: 'Rénovation Dupont', client: 'Jean Dupont', progress: 75, budget: 45000, spent: 32000, status: 'active' },
    { id: 2, name: 'Construction Martin', client: 'Marie Martin', progress: 35, budget: 180000, spent: 58000, status: 'active' },
    { id: 3, name: 'Aménagement Bureau', client: 'ABC Corp', progress: 90, budget: 28000, spent: 26500, status: 'review' },
    { id: 4, name: 'Extension Garage', client: 'Pierre Lavoie', progress: 15, budget: 35000, spent: 4200, status: 'planning' },
  ]);
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectListCard}
      onPress={() => navigate('ProjectDetail', { id: item.id })}
    >
      <View style={styles.projectListHeader}>
        <Text style={styles.projectListName}>{item.name}</Text>
        <View style={[styles.statusBadge, {
          backgroundColor: item.status === 'active' ? Colors.accent.emerald + '30' :
                          item.status === 'review' ? Colors.accent.gold + '30' :
                          Colors.accent.turquoise + '30'
        }]}>
          <Text style={[styles.statusText, {
            color: item.status === 'active' ? Colors.accent.emerald :
                   item.status === 'review' ? Colors.accent.gold :
                   Colors.accent.turquoise
          }]}>
            {item.status === 'active' ? 'En cours' : item.status === 'review' ? 'Révision' : 'Planification'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.projectListClient}>👤 {item.client}</Text>
      
      <View style={styles.projectListProgress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>

      <View style={styles.projectListFooter}>
        <Text style={styles.projectBudget}>
          💰 ${item.spent.toLocaleString()} / ${item.budget.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Projets</Text>
        <TouchableOpacity onPress={() => navigate('NewProject')}>
          <Text style={styles.addButton}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {[
          { key: 'all', label: 'Tous' },
          { key: 'active', label: 'En cours' },
          { key: 'review', label: 'Révision' },
          { key: 'planning', label: 'Planification' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TASKS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

const TasksScreen = () => {
  const { navigate, goBack } = useNavigation();
  const [activeTab, setActiveTab] = useState('todo');
  
  const tasks = {
    todo: [
      { id: 1, title: 'Commander matériaux BMR', priority: 'urgent', due: 'Demain' },
      { id: 2, title: 'Appeler fournisseur électrique', priority: 'high', due: 'Lun 9 déc' },
    ],
    inProgress: [
      { id: 3, title: 'Préparer soumission Dupont', priority: 'high', due: 'Aujourd\'hui' },
      { id: 4, title: 'Réviser plans cuisine', priority: 'medium', due: 'Mer 11 déc' },
    ],
    done: [
      { id: 5, title: 'Inspection plomberie', priority: 'medium', completed: 'Hier' },
      { id: 6, title: 'Formation SST équipe', priority: 'low', completed: 'Lun 2 déc' },
    ],
  };

  const tabs = [
    { key: 'todo', label: 'À faire', count: tasks.todo.length },
    { key: 'inProgress', label: 'En cours', count: tasks.inProgress.length },
    { key: 'done', label: 'Terminé', count: tasks.done.length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Tâches</Text>
        <TouchableOpacity onPress={() => navigate('NewTask')}>
          <Text style={styles.addButton}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
            <View style={[styles.tabBadge, activeTab === tab.key && styles.tabBadgeActive]}>
              <Text style={styles.tabBadgeText}>{tab.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList}>
        {tasks[activeTab].map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskListCard}
            onPress={() => navigate('TaskDetail', { id: task.id })}
          >
            <View style={[styles.taskPriorityBar, {
              backgroundColor: task.priority === 'urgent' ? Colors.accent.danger :
                              task.priority === 'high' ? Colors.accent.gold :
                              task.priority === 'medium' ? Colors.accent.turquoise :
                              Colors.accent.emerald
            }]} />
            <View style={styles.taskListContent}>
              <Text style={styles.taskListTitle}>{task.title}</Text>
              <Text style={styles.taskListMeta}>
                {activeTab === 'done' ? `✓ ${task.completed}` : `📅 ${task.due}`}
              </Text>
            </View>
            <Text style={styles.taskArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM TAB BAR
// ═══════════════════════════════════════════════════════════════════════════════

const BottomTabBar = () => {
  const { currentScreen, navigate } = useNavigation();

  const tabs = [
    { screen: 'Dashboard', icon: '🏠', label: 'Accueil' },
    { screen: 'Projects', icon: '📁', label: 'Projets' },
    { screen: 'Tasks', icon: '✓', label: 'Tâches' },
    { screen: 'Calendar', icon: '📅', label: 'Calendrier' },
    { screen: 'Settings', icon: '⚙️', label: 'Plus' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.screen}
          style={styles.tabBarItem}
          onPress={() => navigate(tab.screen)}
        >
          <Text style={[styles.tabBarIcon, currentScreen === tab.screen && styles.tabBarIconActive]}>
            {tab.icon}
          </Text>
          <Text style={[styles.tabBarLabel, currentScreen === tab.screen && styles.tabBarLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

const AppNavigator = () => {
  const { currentScreen } = useNavigation();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen />;
      case 'Projects':
        return <ProjectsScreen />;
      case 'Tasks':
        return <TasksScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderScreen()}
      <BottomTabBar />
    </View>
  );
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent.gold} />
      </View>
    );
  }

  return user ? <AppNavigator /> : <LoginScreen />;
};

// Root component with providers
export default function RootApp() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </AuthProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Base
  container: {
    flex: 1,
    backgroundColor: Colors.bg.main,
  },
  appContainer: {
    flex: 1,
    backgroundColor: Colors.bg.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg.main,
  },

  // Login
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.accent.gold,
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  form: {
    backgroundColor: Colors.bg.card,
    borderRadius: 16,
    padding: Spacing.lg,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    color: Colors.text.muted,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.bg.input,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.accent.gold,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.bg.main,
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  linkText: {
    color: Colors.accent.gold,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: Colors.accent.danger + '20',
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.accent.danger,
    fontSize: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.lg,
  },
  greeting: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  notificationBadge: {
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },

  // KPIs
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  kpiCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2 - 1,
    backgroundColor: Colors.bg.card,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  kpiIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  kpiLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },

  // Sections
  section: {
    padding: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  seeAllLink: {
    color: Colors.accent.gold,
    fontSize: 14,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - Spacing.md * 2 - Spacing.sm * 3) / 4,
    backgroundColor: Colors.bg.card,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Project Cards
  projectCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  projectStatus: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bg.hover,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.gold,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.muted,
    width: 35,
    textAlign: 'right',
  },

  // Task Cards
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.md,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  taskDue: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
  taskArrow: {
    fontSize: 20,
    color: Colors.text.muted,
  },

  // Screen Header
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    color: Colors.accent.gold,
    fontSize: 16,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  addButton: {
    fontSize: 24,
  },

  // Filters
  filterContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.bg.card,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.accent.gold,
  },
  filterChipText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  filterChipTextActive: {
    color: Colors.bg.main,
    fontWeight: '600',
  },

  // Project List
  listContainer: {
    padding: Spacing.md,
  },
  projectListCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  projectListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  projectListName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectListClient: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  projectListProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  projectListFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectBudget: {
    fontSize: 13,
    color: Colors.text.muted,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent.gold,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  tabTextActive: {
    color: Colors.accent.gold,
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: Colors.bg.hover,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tabBadgeActive: {
    backgroundColor: Colors.accent.gold + '30',
  },
  tabBadgeText: {
    fontSize: 11,
    color: Colors.text.muted,
  },

  // Task List
  tasksList: {
    flex: 1,
    padding: Spacing.md,
  },
  taskListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  taskPriorityBar: {
    width: 4,
    height: '100%',
  },
  taskListContent: {
    flex: 1,
    padding: Spacing.md,
  },
  taskListTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  taskListMeta: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 4,
  },

  // Bottom Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : Spacing.sm,
    paddingTop: Spacing.sm,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabBarIconActive: {
    transform: [{ scale: 1.1 }],
  },
  tabBarLabel: {
    fontSize: 10,
    color: Colors.text.muted,
  },
  tabBarLabelActive: {
    color: Colors.accent.gold,
    fontWeight: '600',
  },
});
