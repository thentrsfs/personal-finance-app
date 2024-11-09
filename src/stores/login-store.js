import { defineStore } from "pinia";
import { ref, reactive, computed, onMounted } from "vue";
import { auth } from "src/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter, useRoute } from "vue-router";

export const useLoginStore = defineStore("login", () => {
  // Login/register credentials
  const credentials = reactive({
    email: "",
    password: "",
    name: "",
  });

  // Error message
  const errorMessage = ref("");

  // Router instance and route instance
  const router = useRouter();
  const route = useRoute();

  // Current logged user
  const currentUser = ref(null);

  // Password visibility toggle
  const showPassword = ref(false);

  // Toggle password visibility button
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  // Get the first letter from current user's email to show in mobile app
  const firstLetter = computed(() => {
    return currentUser.value ? currentUser.value.charAt(0).toUpperCase() : "";
  });

  // Reset all fields
  const resetCredentials = () => {
    credentials.email = "";
    credentials.password = "";
    credentials.name = "";
    errorMessage.value = "";
    showPassword.value = false;
  };

  // Creating a new password validation
  const validateCreatingPassword = (val) => {
    const hasUppercase = /[A-Z]/.test(val);
    const hasNumber = /\d/.test(val);
    const minLength = val.length >= 8;

    if (!minLength) return "Password must be at least 8 characters ";
    if (!hasUppercase)
      return "Password must contain at least one uppercase letter";
    if (!hasNumber) return "Password must contain at least one number";

    return true; // Validation passed
  };

  // Register with email and password
  const register = async () => {
    await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
      .then(() => {
        console.log("Register successfull");
        resetCredentials();
        router.push("/login");
      })
      .catch((error) => {
        errorMessage.value = error.message;
      });
  };

  // Login with email and password
  const signInWithEmail = async () => {
    errorMessage.value = "";
    await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
      .then(() => {
        // Signed in
        resetCredentials();
        const redirectPath = route.query.redirect || "/overview";
        router.push(redirectPath);
        // ...
      })
      .catch((error) => {
        errorMessage.value = "Invalid email or password";
      });
  };

  // Login as guest (anonymously)
  const signInAsGuest = async () => {
    await signInAnonymously(auth)
      .then(() => {
        console.log("User signed in as guest");
        currentUser.value = "Guest";
        resetCredentials();
        router.push("overview");
      })
      .catch((error) => {
        console.log(error.message, error.code);
      });
  };

  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user.isAnonymous ? "Guest" : user.email;

      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  // Sign out function
  const signOutFunction = async () => {
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User signed out");
        errorMessage.value = "";
        resetCredentials();
        router.push("/login");
      })
      .catch((error) => {});
  };

  return {
    credentials,
    showPassword,
    togglePasswordVisibility,
    register,
    signInWithEmail,
    signOutFunction,
    errorMessage,
    validateCreatingPassword,
    signInAsGuest,
    currentUser,
    resetCredentials,
    firstLetter,
  };
});
