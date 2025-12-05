import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
    checkUser();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setIsFirstLaunch(!hasLaunched);
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const checkUser = async () => {
    try {
      // Check for user data in AsyncStorage (from our custom auth)
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // Fallback to Supabase if needed
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: { full_name: fullName }
      //   }
      // });
      // if (error) throw error;
      // setUser(data.user);
      setUser({
        fullName: 'mohammad njt',
        email: 'a@a.com',
        password: 11112222,

      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // if (error) throw error;
      // setUser(data.user);
      setUser({
        fullName: 'mohammad njt',
        email: 'a@a.com',
        password: 11112222,

      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('user_finger');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setUserData = async (userData) => {
    try {
      if (userData === null) {
        await AsyncStorage.removeItem('user_data');
        setUser(null);
      } else {
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirstLaunch,
        completeOnboarding,
        signUp,
        signIn,
        signOut,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
