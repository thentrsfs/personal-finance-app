import { defineStore } from "pinia";
import { ref, computed } from "vue";
import data from "../data.json";
import { usePotsStore } from "./pots-store";

export const useTransactionsStore = defineStore("transactions", () => {
  // Get transactions list
  const transactionsList = data.transactions;

  // Get pots store
  const potsStore = usePotsStore();

  // Current page number for pagination
  const currentPage = ref(1);

  // Formatted transactions list
  const formattedItems = computed(() =>
    transactionsList.map((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const formattedAmount =
        (item.amount >= 0 ? "+$" : "-$") + Math.abs(item.amount).toFixed(2);
      const isPositive = item.amount >= 0;
      const formattedDay = computed(() => {
        const day = new Date(formattedDate).getDate();
        const j = day % 10;
        const k = day % 100;

        if (j === 1 && k !== 11) {
          return day + "st";
        }
        if (j === 2 && k !== 12) {
          return day + "nd";
        }
        if (j === 3 && k !== 13) {
          return day + "rd";
        }
        return day + "th";
      });

      return {
        ...item,
        formattedDate,
        formattedAmount,
        isPositive,
        formattedDay,
      };
    })
  );

  // Total income from transactions
  const totalIncome = computed(() => {
    return formattedItems.value
      .filter((transaction) => transaction.amount > 0)
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  });

  // Total expenses from transactions
  const totalExpenses = computed(() => {
    let expenses = formattedItems.value
      .filter((transaction) => transaction.amount < 0)
      .reduce((total, transaction) => total + transaction.amount, 0);

    return Math.abs(expenses).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });

  // Current balance after all transactions and savings with added $3572.25 as initial balance (to be precise for frontend mentor challenge)
  const currentBalance = computed(() => {
    let balance = formattedItems.value.reduce(
      (total, transaction) => total + transaction.amount,
      3572.25
    );
    let fixedBalance = balance - potsStore.totalSavedAmount;

    return fixedBalance;
  });

  // Limit the transactions list to the first 5 items
  const limitedTransactions = computed(() => {
    return formattedItems.value.slice(0, 5);
  });

  // Previous pagination button
  const prevBtn = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  // Next pagination button
  const nextBtn = () => {
    if (currentPage.value < 5) {
      currentPage.value++;
    }
  };

  // Update current page on page change
  function onPageChange(page) {
    currentPage.value = page;
  }

  // Search input
  const searchInput = ref("");

  // Sorting and category options
  const sortingOptions = [
    "Latest",
    "Oldest",
    "A to Z",
    "Z to A",
    "Highest",
    "Lowest",
  ];
  const categoryOptions = [
    "All Transactions",
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

  // Selected category and sort options for filtering and sorting transactions
  const selectedCategory = ref("All Transactions");
  const selectedSort = ref("Latest");

  // Filtered and sorted transactions list based on selected category, sort, and search input
  const sortedItems = computed(() => {
    const filteredItems = ref(formattedItems.value);
    const searchQuery = searchInput.value.toLowerCase();

    filteredItems.value = filteredItems.value.filter((item) => {
      const name = item.name.toLowerCase();

      return name.includes(searchQuery);
    });

    if (selectedCategory.value !== "All Transactions") {
      filteredItems.value = filteredItems.value.filter(
        (item) => item.category === selectedCategory.value
      );
    }
    return [...filteredItems.value].sort((a, b) => {
      switch (selectedSort.value) {
        case "Latest":
          return new Date(b.date) - new Date(a.date); // Latest first
        case "Oldest":
          return new Date(a.date) - new Date(b.date); // Oldest first
        case "A to Z":
          return a.name.localeCompare(b.name); // Alphabetical A to Z
        case "Z to A":
          return b.name.localeCompare(a.name); // Alphabetical Z to A
        case "Highest":
          return b.amount - a.amount; // Highest amount first
        case "Lowest":
          return a.amount - b.amount; // Lowest amount first
        default:
          return 0; // No sorting
      }
    });
  });

  // Total number of pages based on the sorted items list length
  const totalPages = computed(() => Math.ceil(sortedItems.value.length / 10));

  // Paginated transactions list based on the current page number
  const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * 10;
    const end = start + 10;
    return sortedItems.value.slice(start, end);
  });

  return {
    formattedItems,
    limitedTransactions,
    totalPages,
    currentPage,
    paginatedTransactions,
    prevBtn,
    nextBtn,
    onPageChange,
    selectedSort,
    sortingOptions,
    selectedCategory,
    categoryOptions,
    searchInput,
    totalIncome,
    totalExpenses,
    currentBalance,
    transactionsList,
  };
});
