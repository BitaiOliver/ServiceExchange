import React, { createContext, useState, useContext, useEffect } from 'react';
//import { base44 } from '@/api/base44Client';
import { appParams } from './app-params';
//import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();
const STORAGE_KEY = 'user_data';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Contains only { id, public_settings }

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      /*const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token: appParams.token, // Include token if available
        interceptResponses: true
      }); obi12: replace later with actual api client creation*/
      
      try {
        /*const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        // If we got the app public settings successfully, check if user is authenticated
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        }* obi12: replace later with actual api call to get public settings and check auth*/
        await checkUserAuth(); // obi12: for now we just check user auth directly without first checking public settings, since we don't have a real api yet. Later we will replace this with the actual flow where we first get public settings and then check auth if token is present.
          
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);
        
        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const currentUser = JSON.parse(stored);
          // console.log('User data:', currentUser);
          setIsAuthenticated(true);
          setIsLoadingAuth(false);
          setAuthChecked(true);
          setUser(currentUser);
        } catch (error) {
          console.error('Parsing stored user data failed:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      else {
        //console.log('User data: None');
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }

    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      // If user auth fails, it might be an expired token
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const login = (newUser) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);

    } catch (error) {
      console.error('Login failed:', error);
    }
  };


  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      // base44.auth.logout(window.location.href); obi12: replace later with actual logout call
    } else {
      // Just remove the token without redirect
      // base44.auth.logout(); obi12: replace later with actual logout call without redirect
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    // base44.auth.redirectToLogin(window.location.href); obi12: replace later with actual redirect call
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      login,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
