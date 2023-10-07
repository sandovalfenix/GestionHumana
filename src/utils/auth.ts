import { auth } from "@/config/firebase";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

/**
 * Inicia sesión con número de teléfono.
 * @param phoneNumber Número de teléfono del usuario.
 * @returns Promise con el objeto ConfirmationResult de Firebase si la verificación del número de teléfono es exitosa.
 * @throws Error si hay algún error durante la verificación del número de teléfono.
 */
export const signInWithPhone = async (phoneNumber: string): Promise<any> => {
  try {
    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    phoneNumber = phoneNumber.replace(/\s/g, "");
    phoneNumber = phoneNumber.startsWith("+57")
      ? phoneNumber
      : "+57" + phoneNumber;
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    return confirmationResult;
  } catch (error: any) {
    throw new Error(
      `Error al iniciar sesión con número de teléfono: ${error.message}`
    );
  }
};

/**
 * Verifica el código de verificación enviado al número de teléfono del usuario.
 * @param confirmationResult Objeto ConfirmationResult de Firebase.
 * @param code Código de verificación enviado al número de teléfono del usuario.
 * @returns Promise con el objeto User de Firebase si la verificación del código es exitosa.
 * @throws Error si hay algún error durante la verificación del código.
 */
export const verifyPhoneNumberCode = async (
  confirmationResult: any,
  code: string
): Promise<any> => {
  try {
    const { user } = await confirmationResult.confirm(code);
    return user;
  } catch (error: any) {
    throw new Error(
      `Error al verificar código de verificación: ${error.message}`
    );
  }
};
