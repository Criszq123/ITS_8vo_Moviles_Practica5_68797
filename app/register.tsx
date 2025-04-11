import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/auth';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Correo inválido', 'Por favor ingresa un correo válido');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Contraseña muy corta', 'Debe tener al menos 8 caracteres');
            return;
        }

        try {
            await auth.register(email, password);
            Alert.alert('Registro exitoso', 'Ya puedes iniciar sesión');
            router.back();
        } catch (error) {
            Alert.alert('Error al registrar', 'No se pudo crear la cuenta');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Correo"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Contraseña"
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.showPasswordButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.showPasswordText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLinkText}>¿Ya tienes una cuenta? Iniciar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 15,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: 'transparent',
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        width: '100%',
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    showPasswordButton: {
        paddingHorizontal: 10,
    },
    showPasswordText: {
        color: '#0a66c2',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#28a745', // Usando el color verde para el botón de registro
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10, // Añadido margen inferior para el enlace de inicio de sesión
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    loginLinkText: {
        color: '#0a66c2',
        fontSize: 16,
        marginTop: 15,
    },
});