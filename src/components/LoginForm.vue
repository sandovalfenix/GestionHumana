<script setup lang="ts">
import { signInWithPhone, verifyPhoneNumberCode } from "@/utils/auth";
import { ref, type Ref } from "vue";

declare global {
  interface Window {
    confirmationResult: any;
  }
}

const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true,
  },
});


const phoneNumber: Ref<string> = ref("");
const verificationCode: Ref<string> = ref("");
const codeForm: Ref<boolean> = ref(false);


const sendCode = async () => {
  try {
    const confirmationResult = await signInWithPhone(phoneNumber.value);
    window.confirmationResult = confirmationResult;
    console.log("Código de verificación enviado");
    codeForm.value = true;
  } catch (error) {
    console.error(error);
  }
};

const verifyCode = async () => {
  try {
    const user = await verifyPhoneNumberCode(
      window.confirmationResult,
      verificationCode.value
    );
    props.handleSubmit();
  } catch (error) {
    console.error(error);
  }
};
</script>
<template>
  <form @submit.prevent="verifyCode">
    <div v-if="!codeForm" class="form-group">
      <label for="phone-number">Número de teléfono</label>
      <input type="tel" class="form-control" v-model="phoneNumber" placeholder="Ingrese su número de teléfono"
        pattern="[0-9]{10}" title="Ingrese un número de teléfono válido" required>

      <a href="javascript:;" class="btn btn-primary btn-block mt-4" @click="sendCode">Enviar
        código</a>
      <div id="recaptcha-container"></div>
    </div>

    <div v-else class="form-group mt-4">
      <label for="verification-code">Código de verificación</label>
      <input type="text" class="form-control" v-model="verificationCode" placeholder="Ingrese el código de verificación"
        required>
      <button type="submit" class="btn btn-primary btn-block mt-4">Verificar
        código</button>
    </div>
  </form>
</template>

