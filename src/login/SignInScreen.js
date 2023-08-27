import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {API} from '../constants/api';
import {setToken, getToken} from '../helpers/TokenHelper';
import {AuthContext} from '../context/AuthContext';

const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const {setUser} = useContext(AuthContext); // get setUser from AuthContext

  useEffect(() => {
    // Check if the user is already logged in when the component is mounted
    const checkUserLoggedIn = async () => {
      const token = await getToken();
      if (token) {
        setUser(true);
      }
      setIsChecking(false);
    };
    checkUserLoggedIn();
  }, []);

  const signIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({identifier: email, password}),
      });

      const data = await response.json();
      if (data?.error) {
        throw data?.error;
      } else {
        setToken(data.jwt);
        setUser(true);
      }
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <View style={[styles.container, styles.center]}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/companylogo.png')}
        />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // If user is not logged in show login form
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/companylogo.png')}
        />
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ddd"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ddd"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={signIn}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 50,
  },
  input: {
    width: '100%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  linkText: {
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
  },
});

export default SignInScreen;
