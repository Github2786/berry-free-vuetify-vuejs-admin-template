<script setup lang="ts">
import { ref } from "vue";
import Google from "@/assets/images/auth/social-google.svg";
import { useAuthStore } from "@/stores/auth";
import { Form } from "vee-validate";

const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
//const logform = ref();
const password = ref("admin@123");
const username = ref("admin@gmail.com");
const passwordRules = ref([
  (v: string) => !!v || "Password is required",
  (v: string) => (v && v.length <= 10) || "Password must be less than 10 characters",
]);
const emailRules = ref([
  (v: string) => !!v || "Username is required",
  (v: string) => /.+@.+\..+/.test(v) || "Username must be valid",
]);

/* eslint-disable @typescript-eslint/no-explicit-any */

function validate(values: any, { setErrors }: any) {
  const authStore = useAuthStore();
  return authStore
    .login(username.value, password.value)
    .then((res) => {})
    .catch((error) => {
      // Assuming error.response.data.message contains the error message from API
      setErrors({
        apiError:
          error.response?.data?.message || "Something went wrong. Please try again.",
      });
    });
}
</script>

<template>
  <div>
    <h5 class="text-h5 text-center my-4 mb-8">Sign in</h5>
    <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
      <v-text-field
        v-model="username"
        :rules="emailRules"
        label="Email Address / Username"
        class="mt-4 mb-8"
        required
        density="comfortable"
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        required
        density="comfortable"
        variant="outlined"
        color="primary"
        hide-details="auto"
        :append-icon="show1 ? '$eye' : '$eyeOff'"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
        class="pwdInput"
      ></v-text-field>
      <v-divider></v-divider>
      <v-divider></v-divider>

      <v-btn
        color="secondary"
        :loading="isSubmitting"
        block
        class="mt-6"
        variant="flat"
        size="large"
        :disabled="valid"
        type="submit"
      >
        Sign In</v-btn
      >
      <div v-if="errors.apiError" class="mt-2">
        <v-alert color="error">{{ errors.apiError }}</v-alert>
      </div>
    </Form>
  </div>
</template>
<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
