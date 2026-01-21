import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, ChevronRight, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { priorityOptions, Priority } from '@/mocks/data';
import { useUser } from '@/contexts/UserContext';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const togglePriority = (priority: Priority) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(priority)) {
        return prev.filter((p) => p !== priority);
      }
      return [...prev, priority];
    });
  };

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (step === 0 && name.trim()) {
      animateTransition(() => setStep(1));
    } else if (step === 1 && selectedPriorities.length > 0) {
      completeOnboarding(name.trim(), selectedPriorities);
      router.replace('/(tabs)');
    }
  };

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.emojiContainer}>
        <Text style={styles.welcomeEmoji}>👋</Text>
      </View>
      <Text style={styles.title}>Hey there!</Text>
      <Text style={styles.subtitle}>
        I'm Nexus, your MBA co-pilot. Let's get you set up so I can help you crush it this semester.
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>What should I call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your first name"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
        />
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.emojiContainer}>
        <Text style={styles.welcomeEmoji}>🎯</Text>
      </View>
      <Text style={styles.title}>What matters most?</Text>
      <Text style={styles.subtitle}>
        Rank your priorities so I know how to optimize your schedule. Don't worry, you can always change this later!
      </Text>
      <View style={styles.prioritiesContainer}>
        {priorityOptions.map((option, index) => {
          const isSelected = selectedPriorities.includes(option.id);
          const selectionIndex = selectedPriorities.indexOf(option.id);
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.priorityCard,
                isSelected && { borderColor: option.color, backgroundColor: `${option.color}10` },
              ]}
              onPress={() => togglePriority(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.priorityContent}>
                <Text style={styles.priorityEmoji}>{option.emoji}</Text>
                <View style={styles.priorityText}>
                  <Text style={[styles.priorityLabel, isSelected && { color: option.color }]}>
                    {option.label}
                  </Text>
                  <Text style={styles.priorityDescription}>{option.description}</Text>
                </View>
              </View>
              {isSelected && (
                <View style={[styles.selectionBadge, { backgroundColor: option.color }]}>
                  <Text style={styles.selectionNumber}>{selectionIndex + 1}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.hint}>
        Tap in order of importance • Selected: {selectedPriorities.length}/4
      </Text>
    </View>
  );

  const canProceed = step === 0 ? name.trim().length > 0 : selectedPriorities.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Sparkles size={24} color={Colors.primary} />
              <Text style={styles.logoText}>Nexus</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, step >= 0 && styles.progressDotActive]} />
              <View style={[styles.progressBar, step >= 1 && styles.progressBarActive]} />
              <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
            </View>
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {step === 0 ? renderStep0() : renderStep1()}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !canProceed && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!canProceed}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {step === 0 ? "Let's go" : "Start my journey"}
            </Text>
            <ChevronRight size={20} color={Colors.white} />
          </TouchableOpacity>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 16,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.cardBorder,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressBar: {
    width: 60,
    height: 3,
    backgroundColor: Colors.cardBorder,
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  stepContainer: {
    alignItems: 'center',
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  prioritiesContainer: {
    width: '100%',
    gap: 12,
  },
  priorityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  priorityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  priorityText: {
    flex: 1,
  },
  priorityLabel: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  priorityDescription: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  selectionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionNumber: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  hint: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.cardBorder,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.white,
  },
});
