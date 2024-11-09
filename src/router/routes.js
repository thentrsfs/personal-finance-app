const routes = [
  {
    path: "/",
    redirect: "overview",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true },

    children: [
      {
        path: "overview",
        component: () => import("src/pages/OverviewPage.vue"),
      },
      {
        path: "transactions",
        component: () => import("src/pages/TransactionsPage.vue"),
      },
      {
        path: "budgets",
        component: () => import("src/pages/BudgetsPage.vue"),
      },
      {
        path: "pots",
        component: () => import("src/pages/PotsPage.vue"),
      },
      {
        path: "bills",
        component: () => import("src/pages/RecurringBillsPage.vue"),
      },
    ],
  },
  { path: "/login", component: () => import("src/pages/LoginPage.vue") },
  { path: "/signup", component: () => import("src/pages/SignUpPage.vue") },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
