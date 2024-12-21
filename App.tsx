import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import DetectedScreen from './src/screens/DetectedScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'QR Scanner' }}
        />
        <Stack.Screen 
          name="Scanner" 
          component={ScannerScreen}
          options={{ title: 'Scan QR' }}
        />
        <Stack.Screen 
          name="Detected" 
          component={DetectedScreen}
          options={{ 
            title: 'QR Code Detected',
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}