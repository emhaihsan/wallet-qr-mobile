import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type ScannerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;

export default function ScannerScreen() {
    const navigation = useNavigation<ScannerScreenNavigationProp>();
    const [camera, setCamera] = useState<any>(null);
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [modalVisible, setModalVisible] = useState(false);
    const [scanResult, setScanResult] = useState({ type: '', data: '' });

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#1a237e', '#0d47a1']}
                    style={styles.gradientBackground}
                >
                    <Text style={styles.message}>We need your permission to show the camera</Text>
                    <TouchableOpacity 
                        style={styles.permissionButton}
                        onPress={requestPermission}
                    >
                        <Text style={styles.buttonText}>GRANT PERMISSION</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;
        setScanned(true);
        setScanResult({ type, data });
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={(ref) => setCamera(ref)}
                style={StyleSheet.absoluteFillObject}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                ratio="16:9"
            >
                <View style={styles.overlay}>
                    <View style={styles.scanFrame}>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                    </View>
                    {scanned && (
                        <TouchableOpacity 
                            style={styles.scanAgainButton}
                            onPress={() => {
                                setScanned(false);
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.buttonText}>SCAN AGAIN</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </CameraView>

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
                        <Text style={styles.modalTitle}>Scan Result</Text>
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultLabel}>Type:</Text>
                            <Text style={styles.resultText}>{scanResult.type}</Text>
                            <Text style={styles.resultLabel}>Data:</Text>
                            <Text style={styles.resultText}>{scanResult.data}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                setScanned(false);
                            }}
                        >
                            <Text style={styles.buttonText}>CLOSE</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Modal>
        </View>
    );
}

const { width } = Dimensions.get('window');
const scanFrameSize = width * 0.7;
const cornerSize = 30;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: scanFrameSize,
        height: scanFrameSize,
        borderRadius: 20,
        position: 'relative',
    },
    cornerTL: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: cornerSize,
        height: cornerSize,
        borderLeftWidth: 3,
        borderTopWidth: 3,
        borderColor: '#4fc3f7',
    },
    cornerTR: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: cornerSize,
        height: cornerSize,
        borderRightWidth: 3,
        borderTopWidth: 3,
        borderColor: '#4fc3f7',
    },
    cornerBL: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: cornerSize,
        height: cornerSize,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderColor: '#4fc3f7',
    },
    cornerBR: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: cornerSize,
        height: cornerSize,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderColor: '#4fc3f7',
    },
    scanAgainButton: {
        backgroundColor: 'rgba(79, 195, 247, 0.9)',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 40,
        elevation: 5,
    },
    permissionButton: {
        backgroundColor: '#4fc3f7',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    message: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
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
    },
    resultLabel: {
        color: '#4fc3f7',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    resultText: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: '#4fc3f7',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignSelf: 'center',
    },
});