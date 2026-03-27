import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sun,
  Moon,
  Battery,
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Zap,
  BedDouble,
  Footprints,
  Heart,
  Coffee,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { todayEvents, healthData, insights, assignments } from '@/mocks/data';

export default function TodayScreen() {
  const { preferences } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun, emoji: '☀️' };
    if (hour < 17) return { text: 'Good afternoon', icon: Sun, emoji: '🌤️' };
    return { text: 'Good evening', icon: Moon, emoji: '🌙' };
  };

  const greeting = getGreeting();
  const userName = preferences.name || 'there';

  const getRecoveryColor = (recovery: number) => {
    if (recovery >= 70) return Colors.success;
    if (recovery >= 50) return Colors.warning;
    return Colors.danger;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <BedDouble size={20} color={Colors.health} />;
      case 'recruiting':
        return <Coffee size={20} color={Colors.recruiting} />;
      case 'grades':
        return <TrendingUp size={20} color={Colors.grades} />;
      case 'social':
        return <Heart size={20} color={Colors.social} />;
      default:
        return <Zap size={20} color={Colors.primary} />;
    }
  };

  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = preferences.priorities;
    const aIndex = priorityOrder.indexOf(a.type as any);
    const bIndex = priorityOrder.indexOf(b.type as any);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const nextEvent = todayEvents[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting.emoji} {greeting.text},
            </Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </View>

        <Animated.View style={[styles.quickStatsCard, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.quickStatsHeader}>
            <Text style={styles.quickStatsTitle}>Your Vibe Check</Text>
            <View style={[styles.recoveryBadge, { backgroundColor: getRecoveryColor(healthData.recovery) }]}>
              <Battery size={14} color={Colors.white} />
              <Text style={styles.recoveryText}>{healthData.recovery}%</Text>
            </View>
          </View>
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStat}>
              <BedDouble size={18} color={Colors.textSecondary} />
              <Text style={styles.quickStatValue}>{healthData.sleep}h</Text>
              <Text style={styles.quickStatLabel}>Sleep</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Footprints size={18} color={Colors.textSecondary} />
              <Text style={styles.quickStatValue}>{(healthData.steps / 1000).toFixed(1)}k</Text>
              <Text style={styles.quickStatLabel}>Steps</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Clock size={18} color={Colors.textSecondary} />
              <Text style={styles.quickStatValue}>{todayEvents.length}</Text>
              <Text style={styles.quickStatLabel}>Events</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <TrendingUp size={18} color={Colors.textSecondary} />
              <Text style={styles.quickStatValue}>{assignments.filter(a => a.status !== 'completed').length}</Text>
              <Text style={styles.quickStatLabel}>Due Soon</Text>
            </View>
          </View>
        </Animated.View>

        {nextEvent && (
          <TouchableOpacity style={styles.upNextCard} activeOpacity={0.8}>
            <View style={styles.upNextHeader}>
              <Text style={styles.upNextLabel}>UP NEXT</Text>
              <Text style={styles.upNextTime}>{nextEvent.time}</Text>
            </View>
            <Text style={styles.upNextTitle}>{nextEvent.title}</Text>
            {nextEvent.location && (
              <View style={styles.upNextLocation}>
                <MapPin size={14} color={Colors.textSecondary} />
                <Text style={styles.upNextLocationText}>{nextEvent.location}</Text>
                {nextEvent.commute && (
                  <Text style={styles.upNextCommute}>
                    • {nextEvent.commute.duration} {nextEvent.commute.mode}
                  </Text>
                )}
              </View>
            )}
            <View style={[styles.upNextAccent, { backgroundColor: nextEvent.color }]} />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's on my mind for you</Text>
          <Text style={styles.sectionSubtitle}>
            Sorted by your priorities • Here's what needs attention
          </Text>
          {sortedInsights.map((insight, index) => (
            <TouchableOpacity key={insight.id} style={styles.insightCard} activeOpacity={0.8}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIconContainer}>
                  {getInsightIcon(insight.type)}
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightMessage}>{insight.message}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.insightAction}>
                <Text style={styles.insightActionText}>{insight.action}</Text>
                <ChevronRight size={16} color={Colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming up today</Text>
          <View style={styles.timelineContainer}>
            {todayEvents.slice(0, 4).map((event, index) => (
              <TouchableOpacity key={event.id} style={styles.timelineItem} activeOpacity={0.8}>
                <View style={styles.timelineLeft}>
                  <Text style={styles.timelineTime}>{event.time}</Text>
                  <View style={[styles.timelineDot, { backgroundColor: event.color }]} />
                  {index < 3 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{event.title}</Text>
                  {event.location && (
                    <View style={styles.timelineLocation}>
                      <MapPin size={12} color={Colors.textMuted} />
                      <Text style={styles.timelineLocationText}>{event.location}</Text>
                    </View>
                  )}
                  {event.commute && (
                    <View style={styles.commuteTag}>
                      <Text style={styles.commuteText}>
                        🚶 {event.commute.duration} • {event.commute.distance}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  dateContainer: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  quickStatsCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickStatsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  recoveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  recoveryText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  quickStatLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.cardBorder,
  },
  upNextCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  upNextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  upNextLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: 1,
  },
  upNextTime: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  upNextTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  upNextLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upNextLocationText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  upNextCommute: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  upNextAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  insightHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  insightActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  timelineContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 70,
  },
  timelineLeft: {
    width: 60,
    alignItems: 'center',
  },
  timelineTime: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.cardBorder,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  timelineLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  timelineLocationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  commuteTag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  commuteText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  bottomPadding: {
    height: 20,
  },
});
