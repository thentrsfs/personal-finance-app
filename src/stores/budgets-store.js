import { defineStore } from "pinia";
import { ref, onMounted, computed, watch } from "vue";
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
import { useTransactionsStore } from "src/stores/transactions-store";

export const useBudgetsStore = defineStore("budgets", () => {
  // Get transactions store
  const transactionsStore = useTransactionsStore();

  // Budgets firebase collection
  const budgetsCollectionRef = collection(db, "budgets");

  // Array for budgets
  const sections = ref([]);

  // Query for sorting budgets by creation date in ascending order
  const q = query(budgetsCollectionRef, orderBy("createdAt", "asc"));

  // Load budgets from firebase collection
  const loadBudgets = async () => {
    onSnapshot(q, (querySnapshot) => {
      let budgetsFB = [];
      querySnapshot.forEach((doc) => {
        let budget = doc.data();
        budget.id = doc.id;
        budgetsFB.push(budget);
      });
      sections.value = budgetsFB;
    });
  };

  // Selected budget for edit/delete
  const selectedBudget = ref(null);

  // Controls visibility of the dialog for adding/editing/deleting budgets
  const addBudgetDialog = ref(false);
  const editBudgetDialog = ref(false);
  const deleteBudgetDialog = ref(false);

  // Category and theme options for adding and editing budgets
  const categoryOptions = [
    "Entertainment",
    "Bills",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Personal Care",
    "Education",
    "Lifestyle",
    "Shopping",
    "General",
  ];
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

  // Currently selected theme for budget
  const selectedTheme = ref({
    label: themeOptions[0].label,
    color: themeOptions[0].color,
  });

  // Default template for a new budget entry
  const newBudget = ref({
    id: null,
    label: "Entertainment",
    value: null,
    color: selectedTheme.value.color,
  });

  // Watch for changes to the selected theme
  watch(
    () => selectedTheme.value.color,
    (newColor) => {
      newBudget.value.color = newColor;
    }
  );

  // Budgets shown in overview page
  const overviewSections = computed(() => {
    return sections.value.slice(0, 4);
  });

  // Sum of all budgets
  const totalBudget = computed(() => {
    return sections.value.reduce((acc, section) => acc + section.value, 0);
  });

  // Check if the date is from current month
  function isCurrentMonth(date) {
    const currentDate = new Date();
    const transactionDate = new Date(date);

    return (
      currentDate.getMonth() === transactionDate.getMonth() &&
      currentDate.getFullYear() === transactionDate.getFullYear()
    );
  }

  // Get the last three transactions from each category
  const lastThreeTransactionsFromSections = computed(() => {
    const grouped = {};

    sections.value.forEach((section) => {
      const category = section.label;

      const filteredTransactions = transactionsStore.formattedItems.filter(
        (transaction) => transaction.category === category
      );

      const sorted = filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      grouped[category] = sorted.slice(0, 3);
    });
    return grouped;
  });

  // Get the total spent in each category for the current month
  const currentMonthSpent = computed(() => {
    const result = [];

    sections.value.forEach((section) => {
      const category = section.label;

      const filteredTransactions = transactionsStore.formattedItems.filter(
        (transaction) =>
          transaction.category === category && isCurrentMonth(transaction.date)
      );

      const categoryTotal = filteredTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      result[category] = Math.abs(categoryTotal).toFixed(2);
    });

    return result;
  });

  // Get the total spent in all categories
  const totalSpent = computed(() => {
    return Object.values(currentMonthSpent.value)
      .map(Number)
      .reduce((sum, value) => sum + value, 0);
  });

  // Check if a theme color is already in use
  function isColorUsed(color) {
    return sections.value.some((item) => item.color === color);
  }

  // Check if a category is already in use
  function isCategoryUsed(category) {
    return sections.value.some((item) => item.label === category);
  }

  // Show dialog for adding a new budget
  const showAddBudgetDialog = () => {
    newBudget.value = {
      label: "Entertainment",
      value: null,
      color: themeOptions[0].color,
    };
    addBudgetDialog.value = true;
  };

  // Add a new budget to the database
  const addNewBudget = async () => {
    if (
      newBudget.value.label &&
      newBudget.value.value &&
      !isColorUsed(selectedTheme.value.color) &&
      !isCategoryUsed(newBudget.value.label)
    ) {
      await addDoc(budgetsCollectionRef, {
        ...newBudget.value,
        createdAt: serverTimestamp(),
      });
      addBudgetDialog.value = false;
    }
  };

  // Show dialog for editing an existing budget
  const showEditBudgetDialog = (budget) => {
    selectedBudget.value = { ...budget };
    selectedTheme.value =
      themeOptions.find((theme) => theme.color === budget.color) ||
      themeOptions[0];
    editBudgetDialog.value = true;
  };

  // Save edited budget
  const saveEditBudget = async () => {
    await updateDoc(doc(budgetsCollectionRef, selectedBudget.value.id), {
      label: selectedBudget.value.label,
      value: selectedBudget.value.value,
      color: selectedTheme.value.color,
    });
    editBudgetDialog.value = false;
  };

  // Show dialog for deleting a budget
  const showDeleteBudgetDialog = (budget) => {
    selectedBudget.value = budget;
    deleteBudgetDialog.value = true;
  };

  // Confirm deleting a budget
  const deleteBudget = async () => {
    await deleteDoc(doc(budgetsCollectionRef, selectedBudget.value.id));
    deleteBudgetDialog.value = false;
  };

  // Load budgets on component mounting
  onMounted(() => {
    loadBudgets();
  });

  return {
    sections,
    totalBudget,
    lastThreeTransactionsFromSections,
    currentMonthSpent,
    addBudgetDialog,
    showAddBudgetDialog,
    editBudgetDialog,
    showEditBudgetDialog,
    categoryOptions,
    themeOptions,
    selectedTheme,
    deleteBudgetDialog,
    showDeleteBudgetDialog,
    deleteBudget,
    newBudget,
    selectedBudget,
    addNewBudget,
    saveEditBudget,
    isColorUsed,
    isCategoryUsed,
    totalSpent,
    overviewSections,
  };
});
