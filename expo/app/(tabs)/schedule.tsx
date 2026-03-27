import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Clock,
  Navigation,
  Car,
  Train,
  Footprints,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { todayEvents, Event } from '@/mocks/data';

const { width } = Dimensions.get('window');
const HOUR_HEIGHT = 80;

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'drive':
      return Car;
    case 'transit':
      return Train;
    default:
      return Footprints;
  }
};

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const getEventPosition = (time: string) => {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hour = hours;
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return (hour + (minutes || 0) / 60) * HOUR_HEIGHT;
  };

  const getEventDuration = (start: string, end?: string) => {
    if (!end) return HOUR_HEIGHT;
    const startPos = getEventPosition(start);
    const endPos = getEventPosition(end);
    return endPos - startPos;
  };

  const weekDates = getWeekDates();
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <Text style={styles.headerSubtitle}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <View style={styles.weekContainer}>
        <TouchableOpacity style={styles.weekNavButton}>
          <ChevronLeft size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.weekDays}>
          {weekDates.map((date, index) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const today = isToday(date);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                  {weekDays[date.getDay()]}
                </Text>
                <View style={[styles.dayNumber, today && !isSelected && styles.dayNumberToday]}>
                  <Text
                    style={[
                      styles.dayNumberText,
                      isSelected && styles.dayNumberTextSelected,
                      today && !isSelected && styles.dayNumberTextToday,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.weekNavButton}>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scheduleContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scheduleContent}
      >
        <View style={styles.timeline}>
          {hours.map((hour) => (
            <View key={hour} style={styles.hourRow}>
              <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
              <View style={styles.hourLine} />
            </View>
          ))}

          {todayEvents.map((event) => {
            const top = getEventPosition(event.time);
            const height = getEventDuration(event.time, event.endTime);
            const ModeIcon = event.commute ? getModeIcon(event.commute.mode) : Footprints;

            return (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventCard,
                  {
                    top,
                    height: Math.max(height, 60),
                    backgroundColor: `${event.color}15`,
                    borderLeftColor: event.color,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedEvent(event)}
              >
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventTitle, { color: event.color }]} numberOfLines={1}>
                    {event.title}
                  </Text>
                  {event.isHardBlock && (
                    <View style={styles.hardBlockBadge}>
                      <AlertCircle size={10} color={Colors.danger} />
                    </View>
                  )}
                </View>
                <Text style={styles.eventTime}>
                  {event.time} - {event.endTime}
                </Text>
                {event.location && (
                  <View style={styles.eventLocation}>
                    <MapPin size={10} color={Colors.textMuted} />
                    <Text style={styles.eventLocationText} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                )}
                {event.commute && (
                  <View style={styles.commuteInfo}>
                    <ModeIcon size={12} color={Colors.primary} />
                    <Text style={styles.commuteText}>
                      {event.commute.duration} • {event.commute.distance}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedEvent && (
        <View style={styles.eventDetailOverlay}>
          <TouchableOpacity
            style={styles.overlayBackdrop}
            onPress={() => setSelectedEvent(null)}
          />
          <View style={styles.eventDetailCard}>
            <View style={[styles.eventDetailAccent, { backgroundColor: selectedEvent.color }]} />
            <View style={styles.eventDetailContent}>
              <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
              <View style={styles.eventDetailRow}>
                <Clock size={16} color={Colors.textSecondary} />
                <Text style={styles.eventDetailText}>
                  {selectedEvent.time} - {selectedEvent.endTime}
                </Text>
              </View>
              {selectedEvent.location && (
                <View style={styles.eventDetailRow}>
                  <MapPin size={16} color={Colors.textSecondary} />
                  <Text style={styles.eventDetailText}>{selectedEvent.location}</Text>
                </View>
              )}
              {selectedEvent.commute && (
                <View style={styles.commuteCard}>
                  <View style={styles.commuteHeader}>
                    <Navigation size={16} color={Colors.primary} />
                    <Text style={styles.commuteTitle}>Commute Info</Text>
                  </View>
                  <View style={styles.commuteDetails}>
                    <View style={styles.commuteDetailItem}>
                      <Text style={styles.commuteDetailLabel}>Distance</Text>
                      <Text style={styles.commuteDetailValue}>{selectedEvent.commute.distance}</Text>
                    </View>
                    <View style={styles.commuteDetailItem}>
                      <Text style={styles.commuteDetailLabel}>Duration</Text>
                      <Text style={styles.commuteDetailValue}>{selectedEvent.commute.duration}</Text>
                    </View>
                    <View style={styles.commuteDetailItem}>
                      <Text style={styles.commuteDetailLabel}>Mode</Text>
                      <Text style={styles.commuteDetailValue}>
                        {selectedEvent.commute.mode.charAt(0).toUpperCase() + selectedEvent.commute.mode.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.directionsButton}>
                    <Navigation size={16} color={Colors.white} />
                    <Text style={styles.directionsButtonText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedEvent(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  weekNavButton: {
    padding: 8,
  },
  weekDays: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 40,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: Colors.white,
  },
  dayNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumberToday: {
    backgroundColor: Colors.primaryLight,
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  dayNumberTextSelected: {
    color: Colors.white,
  },
  dayNumberTextToday: {
    color: Colors.primary,
  },
  scheduleContainer: {
    flex: 1,
  },
  scheduleContent: {
    paddingBottom: 40,
  },
  timeline: {
    position: 'relative',
    marginLeft: 60,
    marginRight: 16,
  },
  hourRow: {
    height: HOUR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hourLabel: {
    position: 'absolute',
    left: -55,
    width: 45,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.cardBorder,
  },
  eventCard: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderRadius: 12,
    padding: 10,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    flex: 1,
  },
  hardBlockBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  eventLocationText: {
    fontSize: 10,
    color: Colors.textMuted,
    flex: 1,
  },
  commuteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  commuteText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  eventDetailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  overlayBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  eventDetailCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  eventDetailAccent: {
    height: 4,
  },
  eventDetailContent: {
    padding: 24,
  },
  eventDetailTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  eventDetailText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  commuteCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  commuteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  commuteTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  commuteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  commuteDetailItem: {
    alignItems: 'center',
  },
  commuteDetailLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  commuteDetailValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  directionsButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  directionsButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
});
