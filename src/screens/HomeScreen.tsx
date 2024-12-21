import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Modal 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const [scanResult, setScanResult] = useState({ type: '', data: '' });
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setLoading(true);
                setModalVisible(true);

                try {
                    // Load and process the image
                    const manipResult = await manipulateAsync(
                        result.assets[0].uri,
                        [],
                        { compress: 1, format: SaveFormat.PNG }
                    );
                    
                    // Use Camera.scanFromURLAsync to scan QR codes
                    const scannedCodes = await Camera.scanFromURLAsync(
                        manipResult.uri,
                        ['qr']
                    );
                    if (scannedCodes && scannedCodes.length > 0) {
                        const { type, data } = scannedCodes[0];
                        setScanResult({ type, data });
                    } else {
                        alert('No QR code found in the image');
                        setModalVisible(false);
                    }
                } catch (error) {
                    console.error('Error scanning QR code:', error);
                    alert('Error reading QR code from image');
                    setModalVisible(false);
                }
                setLoading(false);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Error selecting image');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#1a237e', '#0d47a1']}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Wallet QR</Text>
                        <Text style={styles.subtitle}>Scan or Upload QR Code</Text>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => navigation.navigate('Scanner')}
                        >
                            <LinearGradient
                                colors={['#4fc3f7', '#0288d1']}
                                style={styles.buttonGradient}
                            >
                                <Ionicons name="scan-outline" size={32} color="#fff" />
                                <Text style={styles.buttonText}>Scan with Camera</Text>
                                <Text style={styles.buttonSubtext}>Use your camera to scan QR code</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.button}
                            onPress={pickImage}
                        >
                            <LinearGradient
                                colors={['#4fc3f7', '#0288d1']}
                                style={styles.buttonGradient}
                            >
                                <Ionicons name="image-outline" size={32} color="#fff" />
                                <Text style={styles.buttonText}>Upload QR Image</Text>
                                <Text style={styles.buttonSubtext}>Select QR code from gallery</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['#1a237e', '#0d47a1']}
                        style={styles.modalContent}
                    >
                        <Text style={styles.modalTitle}>
                            {loading ? 'Reading QR Code...' : 'Scan Result'}
                        </Text>
                        <View style={styles.resultContainer}>
                            {loading ? (
                                <Text style={styles.loadingText}>Processing image...</Text>
                            ) : (
                                <View style={styles.resultContent}>
                                    <Text style={styles.resultText}>{scanResult.data}</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity 
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                setScanResult({ type: '', data: '' });
                            }}
                        >
                            <Text style={styles.buttonText}>CLOSE</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Modal>
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
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#4fc3f7',
        opacity: 0.9,
    },
    buttonContainer: {
        width: '100%',
        gap: 20,
    },
    button: {
        width: '100%',
        height: 120,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonGradient: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    buttonSubtext: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        width: width * 0.85,
        padding: 20,
        borderRadius: 20,
        elevation: 5,
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    resultContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        minHeight: 150,
        justifyContent: 'center',
    },
    resultContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    resultText: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#4fc3f7',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignSelf: 'center',
    },
});