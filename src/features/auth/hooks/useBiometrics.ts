import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { useAuthStore } from '../store/auth.store';

export const useBiometrics = () => {
    const { user, registerBiometrics, login } = useAuthStore();

    const register = async () => {
        if (!user) {
            throw new Error("Must be logged in to register biometrics");
        }

        // Safety check for HTTPS/Secure Context
        if (!window.isSecureContext || !navigator.credentials) {
            alert("La autenticación biométrica requiere una conexión segura (HTTPS). Si estás en desarrollo local, usa localhost o configura HTTPS.");
            return false;
        }

        try {
            // In a real app, we would fetch options from the server
            // Here we mock the server response creation
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const userId = new TextEncoder().encode(user.id);

            const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
                challenge,
                rp: {
                    name: "SGBGE Digital Ecosystem",
                    id: window.location.hostname, // Must match current domain
                },
                user: {
                    id: userId,
                    name: user.email,
                    displayName: user.name,
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required",
                },
                timeout: 60000,
                attestation: "direct"
            };

            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            });

            if (credential) {
                console.log("Credential created", credential);
                registerBiometrics(credential.id);
                return true;
            }
        } catch (error) {
            console.error("Biometric registration failed", error);
            throw error;
        }
        return false;
    };

    const authenticate = async () => {
        try {
            // Mock authentication options
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
                challenge,
                timeout: 60000,
                userVerification: "required",
                // In real app, we might pass allowCredentials with registered ID
            };

            const assertion = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            if (assertion) {
                console.log("Biometric auth successful", assertion);
                // In real app, verify assertion on server. 
                // Here we trust the browser success and mock login.

                // We need to know WHO authenticated. 
                // In a real flow, the server tells us or we use a stored user handle.
                // For this simulation, we'll check if there's a last user in local storage 
                // but since we are 'logged out', we might need to rely on the user 
                // entering their email first OR just assume the stored user in persist
                // (which we cleared on logout).

                // ADJUSTMENT: The requirement says "authenticate without asking password"
                // Assuming we might have a user ID input or previous session hint.
                // For this secure simulation, we will prompt a mock user login.

                const mockUser = {
                    id: 'user-123',
                    name: 'Usuario SGBGE',
                    email: 'usuario@sgbge.com',
                    biometricsRegistered: true,
                    credentialId: assertion.id
                };

                login(mockUser);
                return true;
            }
        } catch (error) {
            console.error("Biometric authentication failed", error);
            throw error;
        }
        return false;
    };

    return { register, authenticate };
};
