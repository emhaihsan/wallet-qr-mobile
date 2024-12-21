import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

type DetectedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Detected'>;
type DetectedScreenRouteProp = RouteProp<RootStackParamList, 'Detected'>;

export default function DetectedScreen() {
    const navigation = useNavigation<DetectedScreenNavigationProp>();
    const route = useRoute<DetectedScreenRouteProp>();
    const { qrData } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#1a237e', '#0d47a1']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>QR Code Detected</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={qrData}
                            size={200}
                            backgroundColor="white"
                        />
                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={styles.label}>Scanned Data:</Text>
                        <Text style={styles.data}>{qrData}</Text>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    title: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight: 40,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dataContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        marginTop: 30,
    },
    label: {
        color: '#4fc3f7',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    data: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});
