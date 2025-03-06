import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import auth from '../services/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seedData, setSeedData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return {
      isValid: password.length >= 6,
      message: 'Password must be at least 6 characters long 🔑'
    };
  };

  const handleSignup = async () => {
    if (loading) return;

    // Reset error
    setError('');

    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields 📝');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long 👤');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address 📧');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match 🔐');
      return;
    }

    setLoading(true);
    try {
      await auth.signup(email.trim(), password.trim(), name.trim(), seedData);
      router.replace('/(tabs)');
    } catch (error: any) {
      let errorMessage = 'An error occurred during signup';
      
      // Handle specific error cases
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered 📬';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format 📧';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password 🔒';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection 🌐';
      }
      
      setError(errorMessage);
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
          <Text variant="titleMedium" style={styles.subtitle}>Create your account 🚀</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError('');
          }}
          style={styles.input}
          disabled={loading}
          mode="outlined"
          outlineColor="#000"
          activeOutlineColor="#000"
          left={<TextInput.Icon icon="account" color="#000" />}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
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
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
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

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError('');
          }}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          disabled={loading}
          mode="outlined"
          outlineColor="#000"
          activeOutlineColor="#000"
          left={<TextInput.Icon icon="lock-check" color="#000" />}
          right={
            <TextInput.Icon 
              icon={showConfirmPassword ? "eye-off" : "eye"}
              color="#000"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={seedData ? 'checked' : 'unchecked'}
            onPress={() => setSeedData(!seedData)}
            disabled={loading}
            color="#000"
          />
          <Text style={styles.checkboxLabel}>
            Generate sample tasks to help you get started ✨
          </Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor="#000"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
        
        <Button
          mode="text"
          onPress={() => router.push('/(auth)/login')}
          style={styles.linkButton}
          disabled={loading}
          textColor="#000"
        >
          Already have an account? Login ��
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -8,
  },
  checkboxLabel: {
    marginLeft: 8,
    flex: 1,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF453A',
    textAlign: 'center',
  },
}); 