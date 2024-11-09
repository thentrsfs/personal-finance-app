import { defineStore } from "pinia";
import { ref, watchEffect, markRaw } from "vue";
import { useRoute } from "vue-router";
import OverviewIcon from "src/components/icons/OverviewIcon.vue";
import TransactionsIcon from "src/components/icons/TransactionsIcon.vue";
import BudgetsIcon from "src/components/icons/BudgetsIcon.vue";
import PotsIcon from "src/components/icons/PotsIcon.vue";
import RecurringBillsIcon from "src/components/icons/RecurringBillsIcon.vue";

export const useMenuStore = defineStore("menu", () => {
  // Desktop drawer boolean
  const drawer = ref(true);

  // Minimize drawer
  const minimize = () => {
    drawer.value = false;
  };

  // Maximize drawer
  const maximize = () => {
    drawer.value = true;
  };

  // Drawer menu navigation items
  const drawerItems = ref([
    {
      label: "Overview",
      icon: "OverviewIcon",
      route: "/overview",
    },
    {
      label: "Transactions",
      icon: "TransactionsIcon",
      route: "/transactions",
    },
    {
      label: "Budgets",
      icon: "BudgetsIcon",
      route: "/budgets",
    },
    { label: "Pots", icon: "PotsIcon", route: "/pots" },
    {
      label: "Recurring bills",
      icon: "RecurringBillsIcon",
      route: "/bills",
    },
  ]);

  // Drawer items icons
  const iconComponents = markRaw({
    OverviewIcon,
    TransactionsIcon,
    BudgetsIcon,
    PotsIcon,
    RecurringBillsIcon,
  });

  // Get the active route path from the router
  const route = useRoute();
  const activeRoute = ref(route.path);

  // Watch for changes in the active route and update the activeRoute ref accordingly
  watchEffect(() => {
    activeRoute.value = route.path;
  });

  // Check if the item is active
  const isActiveRoute = (itemRoute) => {
    return activeRoute.value === itemRoute;
  };

  // Get the icon component for a given icon name
  const getIconComponent = (iconName) => {
    return iconComponents[iconName];
  };

  return {
    drawer,
    drawerItems,
    activeRoute,
    iconComponents,
    getIconComponent,
    isActiveRoute,
    minimize,
    maximize,
  };
});
