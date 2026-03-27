import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { Priority } from '@/mocks/data';

interface UserPreferences {
  priorities: Priority[];
  hasCompletedOnboarding: boolean;
  name: string;
}

const defaultPreferences: UserPreferences = {
  priorities: [],
  hasCompletedOnboarding: false,
  name: '',
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPrefs: UserPreferences) => {
    try {
      await AsyncStorage.setItem('user_preferences', JSON.stringify(newPrefs));
      setPreferences(newPrefs);
    } catch (error) {
      console.log('Error saving preferences:', error);
    }
  };

  const updatePriorities = useCallback((priorities: Priority[]) => {
    const newPrefs = { ...preferences, priorities };
    savePreferences(newPrefs);
  }, [preferences]);

  const completeOnboarding = useCallback((name: string, priorities: Priority[]) => {
    const newPrefs = { 
      ...preferences, 
      name, 
      priorities, 
      hasCompletedOnboarding: true 
    };
    savePreferences(newPrefs);
  }, [preferences]);

  const resetOnboarding = useCallback(async () => {
    await AsyncStorage.removeItem('user_preferences');
    setPreferences(defaultPreferences);
  }, []);

  return {
    preferences,
    isLoading,
    updatePriorities,
    completeOnboarding,
    resetOnboarding,
  };
});
