import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Bell,
  Calendar,
  Heart,
  BookOpen,
  Link,
  ChevronRight,
  RefreshCw,
  LogOut,
  Sparkles,
  Shield,
  Moon,
  Smartphone,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { priorityOptions } from '@/mocks/data';

export default function ProfileScreen() {
  const { preferences, resetOnboarding } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [healthSync, setHealthSync] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset App',
      'This will clear all your preferences and start fresh. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetOnboarding(),
        },
      ]
    );
  };

  const sortedPriorities = preferences.priorities.map((p, index) => {
    const option = priorityOptions.find((o) => o.id === p);
    return { ...option, rank: index + 1 };
  });

  const integrations = [
    { id: 'google', name: 'Google Calendar', icon: Calendar, connected: true, color: Colors.primary },
    { id: 'canvas', name: 'Canvas LMS', icon: BookOpen, connected: true, color: Colors.grades },
    { id: 'apple', name: 'Apple Health', icon: Heart, connected: true, color: Colors.health },
    { id: 'strava', name: 'Strava', icon: RefreshCw, connected: false, color: Colors.warning },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {preferences.name ? preferences.name.charAt(0).toUpperCase() : 'N'}
              </Text>
            </View>
            <View style={styles.avatarBadge}>
              <Sparkles size={14} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.userName}>{preferences.name || 'Nexus User'}</Text>
          <Text style={styles.userSubtitle}>MBA Candidate • Class of 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Priorities</Text>
          <Text style={styles.sectionSubtitle}>
            This is how I optimize your schedule
          </Text>
          <View style={styles.prioritiesCard}>
            {sortedPriorities.map((priority) => (
              <View key={priority?.id} style={styles.priorityRow}>
                <View style={styles.priorityRank}>
                  <Text style={styles.priorityRankText}>{priority?.rank}</Text>
                </View>
                <Text style={styles.priorityEmoji}>{priority?.emoji}</Text>
                <Text style={styles.priorityLabel}>{priority?.label}</Text>
                <View style={[styles.priorityIndicator, { backgroundColor: priority?.color }]} />
              </View>
            ))}
            <TouchableOpacity style={styles.editPrioritiesButton}>
              <RefreshCw size={16} color={Colors.primary} />
              <Text style={styles.editPrioritiesText}>Reorder Priorities</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>
          <View style={styles.integrationsCard}>
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <TouchableOpacity
                  key={integration.id}
                  style={[
                    styles.integrationRow,
                    index < integrations.length - 1 && styles.integrationRowBorder,
                  ]}
                >
                  <View style={[styles.integrationIcon, { backgroundColor: `${integration.color}15` }]}>
                    <Icon size={20} color={integration.color} />
                  </View>
                  <View style={styles.integrationInfo}>
                    <Text style={styles.integrationName}>{integration.name}</Text>
                    <Text style={[styles.integrationStatus, { color: integration.connected ? Colors.success : Colors.textMuted }]}>
                      {integration.connected ? 'Connected' : 'Not connected'}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Bell size={20} color={Colors.textSecondary} />
                <Text style={styles.preferenceLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.cardBorder, true: Colors.primaryLight }}
                thumbColor={notifications ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Moon size={20} color={Colors.textSecondary} />
                <Text style={styles.preferenceLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.cardBorder, true: Colors.primaryLight }}
                thumbColor={darkMode ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Heart size={20} color={Colors.textSecondary} />
                <Text style={styles.preferenceLabel}>Health Data Sync</Text>
              </View>
              <Switch
                value={healthSync}
                onValueChange={setHealthSync}
                trackColor={{ false: Colors.cardBorder, true: Colors.primaryLight }}
                thumbColor={healthSync ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={[styles.preferenceRow, { borderBottomWidth: 0 }]}>
              <View style={styles.preferenceLeft}>
                <Calendar size={20} color={Colors.textSecondary} />
                <Text style={styles.preferenceLabel}>Calendar Sync</Text>
              </View>
              <Switch
                value={calendarSync}
                onValueChange={setCalendarSync}
                trackColor={{ false: Colors.cardBorder, true: Colors.primaryLight }}
                thumbColor={calendarSync ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color={Colors.textSecondary} />
            <Text style={styles.menuItemText}>Privacy & Security</Text>
            <ChevronRight size={20} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Smartphone size={20} color={Colors.textSecondary} />
            <Text style={styles.menuItemText}>About Nexus</Text>
            <ChevronRight size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleResetOnboarding}>
            <RefreshCw size={18} color={Colors.danger} />
            <Text style={styles.dangerButtonText}>Reset Onboarding</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Nexus v1.0.0</Text>
          <Text style={styles.footerSubtext}>Your MBA Co-Pilot 🚀</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  prioritiesCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  priorityRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priorityRankText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  priorityEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  priorityLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  editPrioritiesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  editPrioritiesText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  integrationsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  integrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  integrationRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  integrationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  integrationStatus: {
    fontSize: 13,
  },
  preferencesCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    marginLeft: 12,
  },
  dangerSection: {
    marginTop: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerLight,
    borderRadius: 16,
    padding: 16,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.danger,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
