import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import { db } from "src/firebase/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export const usePotsStore = defineStore("pots", () => {
  // Firebase collection for pots
  const potsCollectionRef = collection(db, "pots");

  // Array for pots
  const pots = ref([]);

  // Query for sorting pots by creation date
  const q = query(potsCollectionRef, orderBy("createdAt", "asc"));

  // Load pots from firebase collection
  const loadPots = async () => {
    onSnapshot(q, (querySnapshot) => {
      let potsFB = [];
      querySnapshot.forEach((doc) => {
        let pot = doc.data();
        pot.id = doc.id;
        potsFB.push(pot);
      });
      pots.value = potsFB;
    });
  };

  // Show only four pots in overview page
  const potsOverview = computed(() => {
    return pots.value.slice(0, 4);
  });

  // Total saved amount of all pots
  const totalSavedAmount = computed(() => {
    return pots.value.reduce((acc, pot) => acc + pot.value, 0);
  });

  // Calculate the percentage saved compared to the target amount
  const totalSavedPercent = (a) => {
    return ((a.value / a.target) * 100).toFixed(2);
  };

  // Theme options for adding and editing pots
  const themeOptions = [
    { label: "Green", color: "#277C78" },
    { label: "Yellow", color: "#F2CDAC" },
    { label: "Cyan", color: "#82C9D7" },
    { label: "Navy", color: "#626070" },
    { label: "Red", color: "#C94736" },
    { label: "Purple", color: "#826CB0" },
    { label: "Turquoise", color: "#597C7C" },
    { label: "Brown", color: "#93674F" },
    { label: "Magenta", color: "#934F6F" },
    { label: "Blue", color: "#3F82B2" },
    { label: "Navy Grey", color: "#97A0AC" },
    { label: "Army Green", color: "#7F9161" },
    { label: "Pink", color: "#AF81BA" },
    { label: "Gold", color: "#CAB361" },
    { label: "Orange", color: "#BE6C49" },
  ];

  // Currently selected theme for adding and editing pots
  const selectedTheme = ref({
    label: themeOptions[0].label,
    color: themeOptions[0].color,
  });

  // Watch for changes to the selected theme
  watch(
    () => selectedTheme.value.color,
    (newColor) => {
      newPot.value.color = newColor;
    }
  );

  // Default template for a new pot entry
  const newPot = ref({
    label: "",
    value: null,
    color: selectedTheme.value.color,
    target: null,
  });

  // Check if a theme color is already in use
  function isColorUsed(color) {
    return pots.value.some((item) => item.color === color);
  }

  // Currently selected pot for editing/deleting
  const selectedPot = ref(null);

  // Controls visibility of the dialog for adding/editing/deleting pots
  const addPotDialog = ref(false);
  const editPotDialog = ref(false);
  const deletePotDialog = ref(false);

  // Controls visibility of the dialog for adding/withdrawing money from pot
  const addMoneyDialog = ref(false);
  const withdrawDialog = ref(false);

  // Show dialog for adding money to the pot
  const showAddMoneyDialog = (pot) => {
    selectedPot.value = { ...pot };
    addMoneyDialog.value = true;
  };

  // Show dialog for withdrawing money from the pot
  const showWithdrawDialog = (pot) => {
    selectedPot.value = { ...pot };
    withdrawDialog.value = true;
  };

  // Show dialog for adding a new pot
  const showAddPotDialog = () => {
    newPot.value = {
      label: "",
      value: null,
      color: selectedTheme.value.color,
      target: null,
    };
    addPotDialog.value = true;
  };

  // Add a new pot to the database
  const addNewPot = async () => {
    if (
      newPot.value.label &&
      newPot.value.target &&
      !isColorUsed(selectedTheme.value.color)
    ) {
      await addDoc(potsCollectionRef, {
        ...newPot.value,
        createdAt: serverTimestamp(),
      });
      addPotDialog.value = false;
    }
  };

  // Show dialog for editing an existing pot
  const showEditPotDialog = (pot) => {
    selectedPot.value = { ...pot };
    selectedTheme.value =
      themeOptions.find((theme) => theme.color === pot.color) ||
      themeOptions[0];
    editPotDialog.value = true;
  };

  // Save edited pot
  const saveEditPot = async () => {
    await updateDoc(doc(potsCollectionRef, selectedPot.value.id), {
      label: selectedPot.value.label,
      value: selectedPot.value.value,
      color: selectedTheme.value.color,
      target: selectedPot.value.target,
    });

    editPotDialog.value = false;
  };

  // Show dialog for deleting a pot
  const showDeletePotDialog = (pot) => {
    selectedPot.value = pot;
    deletePotDialog.value = true;
  };

  // Delete a pot
  const deletePot = async () => {
    await deleteDoc(doc(potsCollectionRef, selectedPot.value.id));
    deletePotDialog.value = false;
  };

  // Load pots on component mounting
  onMounted(() => {
    loadPots();
  });

  return {
    pots,
    totalSavedPercent,
    potsOverview,
    totalSavedAmount,
    themeOptions,
    selectedTheme,
    newPot,
    selectedPot,
    addPotDialog,
    showAddPotDialog,
    addNewPot,
    editPotDialog,
    showEditPotDialog,
    saveEditPot,
    deletePotDialog,
    showDeletePotDialog,
    deletePot,
    isColorUsed,
    showAddMoneyDialog,
    showWithdrawDialog,
    addMoneyDialog,
    withdrawDialog,
    potsCollectionRef,
  };
});
