<template>
  <q-layout class="bg-accent">
    <q-page-container>
      <q-page class="flex">
        <div
          v-if="$q.screen.lt.md"
          class="bg-primary tablet-login-logo flex flex-center"
        >
          <q-img width="121px" height="21px" src="images/logo-large.svg" />
        </div>
        <div
          v-if="$q.screen.gt.sm"
          class="q-px-md q-pt-md"
          style="position: relative"
        >
          <q-img
            class="custom-border-radius"
            width="560px"
            fit="contain"
            src="images/illustration-authentication.svg"
          >
          </q-img>
          <q-img class="login-logo" src="images/logo-large.svg" />
          <div class="login-text column q-gutter-y-lg">
            <div class="text-preset-1">
              Keep track of your money and save for your future
            </div>
            <div>
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </div>
          </div>
        </div>
        <div class="col flex flex-center">
          <q-card
            flat
            class="q-pa-lg q-mx-md custom-border-radius"
            style="width: 560px; height: 422px"
          >
            <q-form
              @submit.prevent="loginStore.signInWithEmail"
              class="column q-gutter-y-md q-px-md"
              style="position: relative"
            >
              <div class="text-preset-1 text-primary q-py-md">Login</div>
              <div>
                <label class="text-preset-5-bold text-grey-500" for="email"
                  >Email</label
                >
                <q-input
                  for="email"
                  dense
                  outlined
                  type="email"
                  v-model="loginStore.credentials.email"
                ></q-input>
              </div>
              <div class="q-pb-sm">
                <label class="text-preset-5-bold text-grey-500" for="password"
                  >Password</label
                >
                <q-input
                  v-model="loginStore.credentials.password"
                  for="password"
                  dense
                  :error="!!loginStore.errorMessage"
                  :error-message="loginStore.errorMessage"
                  outlined
                  bottom-slots
                  :type="loginStore.showPassword ? 'text' : 'password'"
                  :append="
                    loginStore.showPassword ? 'visibility' : 'visibility_off'
                  "
                >
                  <template #append>
                    <q-icon
                      size="xs"
                      @click="loginStore.togglePasswordVisibility"
                      :name="
                        loginStore.showPassword
                          ? 'visibility_off'
                          : 'visibility'
                      "
                    ></q-icon>
                  </template>
                </q-input>
              </div>
              <AddButton
                label="Login"
                class="btn-primary q-mt-lg"
                type="submit"
              />
            </q-form>
            <div class="flex flex-center q-pt-lg">
              <span class="text-grey-500">Need to create an account?</span>
              <q-btn
                :ripple="false"
                flat
                dense
                label="Sign Up"
                to="signup"
                @click="loginStore.resetCredentials"
                no-caps
                class="text-preset-4-bold text-primary q-pl-sm"
                style="text-decoration: underline"
              ></q-btn>
            </div>
            <q-btn
              @click="loginStore.signInAsGuest"
              :ripple="false"
              flat
              dense
              label="or continue as a guest"
              no-caps
              class="text-preset-5 text-primary guest-btn"
            ></q-btn>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AddButton from "src/components/AddButton.vue";
import { useLoginStore } from "src/stores/login-store";

const loginStore = useLoginStore();
</script>
