import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import auth from "../services/auth";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (loading) return;

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields 📝');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address 📧');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long 🔑');
      return;
    }

    setLoading(true);
    try {
      await auth.signin(email.trim(), password.trim());
      router.replace('/(tabs)');
    } catch (error: any) {
      let title = 'Login Error';
      let message = 'An error occurred during login';
      
      // Handle specific error cases
      if (error.message === 'Invalid credentials') {
        title = 'Invalid Credentials';
        message = 'The email or password you entered is incorrect 🔒';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email 🔍';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password 🔒';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format 📧';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later ⏳';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your connection 🌐';
      }
      
      Alert.alert(title, message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={64} color="#30D158" />
          <Text variant="displaySmall" style={styles.title}>TaskEase</Text>
          <Text variant="titleMedium" style={styles.subtitle}>Welcome back! 👋</Text>
        </View>
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          disabled={loading}
          mode="outlined"
          outlineColor="#000"
          activeOutlineColor="#000"
          left={<TextInput.Icon icon="email" color="#000" />}
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          disabled={loading}
          mode="outlined"
          outlineColor="#000"
          activeOutlineColor="#000"
          left={<TextInput.Icon icon="lock" color="#000" />}
          right={
            <TextInput.Icon 
              icon={showPassword ? "eye-off" : "eye"}
              color="#000"
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor="#000"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        
        <Button
          mode="text"
          onPress={() => router.push('/(auth)/signup')}
          style={styles.linkButton}
          disabled={loading}
          textColor="#000"
        >
          Don&apos;t have an account? Sign Up 🚀
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    color: '#666',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
    height: 48,
  },
  buttonContent: {
    height: 48,
  },
  linkButton: {
    marginTop: 16,
  }
}); 