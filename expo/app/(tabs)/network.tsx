import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Mail,
  Calendar,
  ChevronRight,
  Flame,
  Thermometer,
  Snowflake,
  Plus,
  MessageSquare,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { contacts, Contact } from '@/mocks/data';

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'hot':
      return { icon: Flame, color: Colors.danger, label: 'Hot Lead', bg: Colors.dangerLight };
    case 'warm':
      return { icon: Thermometer, color: Colors.warning, label: 'Warm', bg: Colors.accentLight };
    default:
      return { icon: Snowflake, color: Colors.info, label: 'Cold', bg: Colors.primaryLight };
  }
};

export default function NetworkScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { id: null, label: 'All' },
    { id: 'hot', label: '🔥 Hot' },
    { id: 'warm', label: '🌡️ Warm' },
    { id: 'cold', label: '❄️ Cold' },
  ];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || contact.priority === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const upcomingMeetings = contacts.filter((c) => c.nextMeeting);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Network</Text>
            <Text style={styles.headerSubtitle}>{contacts.length} connections</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id ?? 'all'}
              style={[styles.filterChip, activeFilter === filter.id && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {upcomingMeetings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Coming Up</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upcomingScroll}
            >
              {upcomingMeetings.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.upcomingCard}
                  onPress={() => setSelectedContact(contact)}
                >
                  <Image source={{ uri: contact.avatar }} style={styles.upcomingAvatar} />
                  <Text style={styles.upcomingName} numberOfLines={1}>
                    {contact.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.upcomingTime}>{contact.nextMeeting}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Contacts</Text>
          {filteredContacts.map((contact) => {
            const priorityConfig = getPriorityConfig(contact.priority);
            const PriorityIcon = priorityConfig.icon;

            return (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => setSelectedContact(contact)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
                <View style={styles.contactInfo}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.bg }]}>
                      <PriorityIcon size={12} color={priorityConfig.color} />
                    </View>
                  </View>
                  <Text style={styles.contactRole}>
                    {contact.role} @ {contact.company}
                  </Text>
                  {contact.lastMeeting && (
                    <Text style={styles.contactLastMeeting}>Last met: {contact.lastMeeting}</Text>
                  )}
                  <View style={styles.tagsContainer}>
                    {contact.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedContact && (
        <View style={styles.detailOverlay}>
          <TouchableOpacity
            style={styles.overlayBackdrop}
            onPress={() => setSelectedContact(null)}
          />
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Image source={{ uri: selectedContact.avatar }} style={styles.detailAvatar} />
              <View style={styles.detailHeaderInfo}>
                <Text style={styles.detailName}>{selectedContact.name}</Text>
                <Text style={styles.detailRole}>
                  {selectedContact.role} @ {selectedContact.company}
                </Text>
              </View>
            </View>

            <View style={styles.detailActions}>
              <TouchableOpacity style={styles.detailActionButton}>
                <Mail size={20} color={Colors.primary} />
                <Text style={styles.detailActionText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailActionButton}>
                <Calendar size={20} color={Colors.primary} />
                <Text style={styles.detailActionText}>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailActionButton}>
                <MessageSquare size={20} color={Colors.primary} />
                <Text style={styles.detailActionText}>Notes</Text>
              </TouchableOpacity>
            </View>

            {selectedContact.nextMeeting && (
              <View style={styles.nextMeetingCard}>
                <Calendar size={16} color={Colors.success} />
                <Text style={styles.nextMeetingText}>
                  Next meeting: {selectedContact.nextMeeting}
                </Text>
              </View>
            )}

            <View style={styles.notesSection}>
              <Text style={styles.notesSectionTitle}>Meeting Notes</Text>
              {selectedContact.notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <View style={styles.noteBullet} />
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tagsSection}>
              <Text style={styles.tagsSectionTitle}>Tags</Text>
              <View style={styles.tagsWrap}>
                {selectedContact.tags.map((tag, index) => (
                  <View key={index} style={styles.tagLarge}>
                    <Text style={styles.tagLargeText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedContact(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  filtersScroll: {
    marginTop: 12,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  upcomingScroll: {
    gap: 12,
  },
  upcomingCard: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    width: 100,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  upcomingAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  upcomingName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  upcomingTime: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  priorityBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactRole: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  contactLastMeeting: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  detailOverlay: {
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
  detailCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
  detailHeaderInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  detailRole: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  detailActionButton: {
    alignItems: 'center',
    gap: 6,
  },
  detailActionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  nextMeetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.secondaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  nextMeetingText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.secondary,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesSectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 10,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  noteBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  noteText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsSectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 10,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagLarge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagLargeText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
});
