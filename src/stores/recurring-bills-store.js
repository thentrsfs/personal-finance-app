import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useTransactionsStore } from "src/stores/transactions-store";

export const useRecurringStore = defineStore("recurring", () => {
  // Get transactions store
  const transactionsStore = useTransactionsStore();

  // Array for recurring bills. We use a Set to avoid duplicates and a computed property to filter the bills.
  const recurringBills = computed(() => {
    const seen = new Set();
    const bills = transactionsStore.formattedItems.filter(
      (bill) => bill.recurring === true
    );
    return bills.filter((item) => {
      if (seen.has(item.name)) {
        return false;
      }
      seen.add(item.name);
      return true;
    });
  });

  // Array for columns to display in the table.
  const columns = ref([
    {
      name: "name",
      required: true,
      label: "Bill Title",
      align: "left",
      field: (row) => row.name,
    },
    {
      name: "date",
      align: "left",
      label: "Due Date",
      field: "date",
    },
    {
      name: "amount",
      label: "Amount",
      field: "amount",
    },
  ]);

  // Search input
  const searchInput = ref("");

  // Sorting options
  const sortingOptions = [
    "Latest",
    "Oldest",
    "A to Z",
    "Z to A",
    "Highest",
    "Lowest",
  ];

  // Currently selected sorting option
  const selectedSort = ref("Latest");

  // Array of sorted recurring bills to display in the table
  const sortedItems = computed(() => {
    const filteredItems = ref(recurringBills.value);
    const searchQuery = searchInput.value.toLowerCase();

    filteredItems.value = filteredItems.value.filter((item) => {
      const name = item.name.toLowerCase();

      return name.includes(searchQuery);
    });

    return [...filteredItems.value].sort((a, b) => {
      switch (selectedSort.value) {
        case "Latest":
          return new Date(a.date).getDate() - new Date(b.date).getDate(); // Latest first
        case "Oldest":
          return new Date(b.date).getDate() - new Date(a.date).getDate(); // Oldest first
        case "A to Z":
          return a.name.localeCompare(b.name); // Alphabetical A to Z
        case "Z to A":
          return b.name.localeCompare(a.name); // Alphabetical Z to A
        case "Highest":
          return a.amount - b.amount; // Highest amount first
        case "Lowest":
          return b.amount - a.amount; // Lowest amount first
        default:
          return 0; // No sorting
      }
    });
  });

  // Compute the latest transaction date from the transactions list
  const latestTransaction = computed(() => {
    const latest = transactionsStore.formattedItems.reduce(
      (latest, transaction) => {
        const currentTransactionDate = new Date(transaction.date);
        return currentTransactionDate > latest
          ? currentTransactionDate
          : latest;
      },
      new Date(transactionsStore.formattedItems[0].date)
    ); // Initialize with the first date
    return latest;
  });

  // Get the date 5 days from the latest transaction date
  const fiveDaysAfterLatest = computed(() => {
    const date = new Date(latestTransaction.value);
    date.setDate(date.getDate() + 5);
    return date;
  });

  // Filter for paid reccuring bills
  const paidBills = computed(() => {
    return sortedItems.value.filter(
      (item) =>
        new Date(item.date).getDate() < latestTransaction.value.getDate()
    );
  });

  // Filter for soon-to-be-paid reccuring bills (due dates within 5 days of the latest transaction)
  const soonToBePaidBills = computed(() => {
    return sortedItems.value.filter(
      (item) =>
        new Date(item.date).getDate() >= latestTransaction.value.getDate() &&
        new Date(item.date).getDate() <= fiveDaysAfterLatest.value.getDate()
    );
  });

  // Filter for upcoming reccuring bills
  const upcomingBills = computed(() => {
    return sortedItems.value.filter((item) => {
      return new Date(item.date).getDate() >= latestTransaction.value.getDate();
    });
  });

  // Check if a bill is paid
  const isPaid = (bill) => {
    if (paidBills.value.includes(bill)) {
      return true;
    }
    return false;
  };

  // Check if a bill is soon to be paid
  const soonToBePaid = (bill) => {
    if (soonToBePaidBills.value.includes(bill)) {
      return true;
    }
    return false;
  };

  // Calculate the total amount of reccuring bills and total amount for paid, soon-to-be-paid, and upcoming reccuring bills
  const billAmounts = computed(() => {
    let paidBillsCalc = paidBills.value.reduce((acc, bill) => {
      return acc + Math.abs(bill.amount);
    }, 0);
    const paidBillsAmount = Math.abs(paidBillsCalc).toFixed(2);

    let soonToBePaidBillsCalc = soonToBePaidBills.value.reduce((acc, bill) => {
      return acc + Math.abs(bill.amount);
    }, 0);
    const soonToBePaidBillsAmount = Math.abs(soonToBePaidBillsCalc).toFixed(2);

    let upcomingBillsCalc = upcomingBills.value.reduce((acc, bill) => {
      return acc + Math.abs(bill.amount);
    }, 0);
    const upcomingBillsAmount = Math.abs(upcomingBillsCalc).toFixed(2);

    const paidBillsLength = paidBills.value.length;
    const upcomingBillsLength = upcomingBills.value.length;
    const soonToBePaidLength = soonToBePaidBills.value.length;
    const totalBills = computed(() =>
      recurringBills.value.reduce((acc, bill) => {
        return acc + Math.abs(bill.amount);
      }, 0)
    );

    return {
      paidBillsAmount,
      soonToBePaidBillsAmount,
      upcomingBillsAmount,
      paidBillsLength,
      upcomingBillsLength,
      soonToBePaidLength,
      totalBills,
    };
  });

  return {
    recurringBills,
    columns,
    paidBills,
    soonToBePaidBills,
    isPaid,
    soonToBePaid,
    sortingOptions,
    selectedSort,
    sortedItems,
    searchInput,
    billAmounts,
  };
});
