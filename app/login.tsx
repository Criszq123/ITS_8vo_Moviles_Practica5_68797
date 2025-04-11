import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/auth';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Correo inválido', 'Por favor ingresa un correo válido');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            await auth.login(email, password);
            router.replace('/');
        } catch (error) {
            Alert.alert('Error al iniciar sesión', 'Verifica tus credenciales');
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

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/register')}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
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
    loginButton: {
        backgroundColor: '#0a66c2',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10, // Añadido margen inferior para separar los botones
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    registerButton: {
        backgroundColor: '#28a745', // Un color verde para diferenciarlo
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
    },
    registerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});