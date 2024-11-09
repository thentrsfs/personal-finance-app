<template>
  <q-page
    class="bg-accent q-pb-lg q-pt-xs"
    :class="$q.screen.lt.sm ? ' q-px-lg' : 'q-px-xl'"
  >
    <div class="text-preset-1 flex items-center justify-between">
      <h4>Overview</h4>
      <div class="text-preset-3 text-primary column">
        <div>
          User:
          {{
            $q.screen.lt.md ? loginStore.firstLetter : loginStore.currentUser
          }}
        </div>
        <AddButton
          @click="loginStore.signOutFunction"
          size="sm"
          label="Sign Out"
          color="primary"
        />
      </div>
    </div>
    <div
      class="row"
      :class="$q.screen.lt.sm ? 'q-gutter-y-lg' : 'q-gutter-x-lg'"
    >
      <q-card
        flat
        class="col-xs-12 col-sm bg-primary text-white custom-border-radius q-px-md q-py-xs"
      >
        <q-card-section class="q-pb-none">Current Balance</q-card-section>
        <q-card-section class="text-preset-1"
          >${{
            Number(transactionsStore.currentBalance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}</q-card-section
        >
      </q-card>

      <q-card
        flat
        class="col-xs-12 col-sm custom-border-radius q-px-md q-py-xs"
      >
        <q-card-section class="q-pb-none text-grey-500">Income</q-card-section>
        <q-card-section class="text-preset-1 text-primary"
          >${{ transactionsStore.totalIncome }}</q-card-section
        >
      </q-card>

      <q-card
        flat
        class="col-xs-12 col-sm custom-border-radius q-px-md q-py-xs"
      >
        <q-card-section class="q-pb-none text-grey-500"
          >Expenses</q-card-section
        >
        <q-card-section class="text-preset-1"
          >${{ transactionsStore.totalExpenses }}</q-card-section
        >
      </q-card>
    </div>
    <div class="row q-pt-lg">
      <div
        class="col-xs-12 col-md-7 q-mb-lg"
        :class="$q.screen.gt.sm ? 'q-pr-lg' : ''"
      >
        <q-card flat class="custom-border-radius q-px-sm q-pb-sm">
          <q-card-section
            class="flex q-pl-lg q-pt-lg q-pb-none items-center justify-between"
            ><div class="text-preset-2 text-primary">Pots</div>

            <DetailsButton to="pots" />
          </q-card-section>
          <q-card-section
            :class="$q.screen.lt.sm ? 'column q-gutter-y-md' : 'row'"
          >
            <div
              class="flex col-6 bg-accent custom-border-radius items-center q-px-lg"
            >
              <q-icon size="lg" name="img:images/icon-pot.svg"></q-icon>
              <div class="q-gutter-sm q-ml-md q-px-xs q-py-lg">
                <div class="text-grey-500">Total Saved</div>
                <div class="text-preset-1 text-primary">
                  ${{ potsStore.totalSavedAmount }}
                </div>
              </div>
            </div>
            <div
              class="flex q-gutter-x-xl col"
              :class="$q.screen.lt.sm ? 'q-pl-lg' : ' q-pl-xl'"
              style="max-width: 20rem"
            >
              <div
                v-for="(pot, index) in potsStore.potsOverview"
                :key="index"
                class="q-py-sm"
                style="width: 5rem"
              >
                <div>
                  <div>
                    <div
                      class="custom-decoration q-gutter-y-xs"
                      :style="{ '--custom-bg-color': pot.color }"
                    >
                      <div class="text-grey-500 text-preset-5">
                        {{ pot.label }}
                      </div>
                      <div class="text-preset-4-bold text-primary">
                        ${{ pot.value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div class="col-xs-12 col-md-7 q-pt-lg">
          <q-card flat class="custom-border-radius q-px-sm">
            <q-card-section
              class="flex justify-between items-center q-px-md q-pt-lg q-pb-none"
            >
              <div class="text-preset-2">Transactions</div>
              <DetailsButton label="View All" to="transactions" />
            </q-card-section>
            <q-card-section>
              <q-list separator class="q-px-xs">
                <q-item
                  class="q-px-none q-py-lg"
                  v-for="(
                    transaction, index
                  ) in transactionsStore.limitedTransactions"
                  :key="index"
                >
                  <q-item-section avatar>
                    <q-avatar :size="$q.screen.lt.sm ? '32px' : '40px'">
                      <q-img
                        alt="transaction-avatar"
                        :src="transaction.avatar"
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section
                    :style="$q.screen.lt.sm ? 'margin-left: -0.8rem' : ''"
                    class="text-preset-4-bold"
                  >
                    {{ transaction.name }}
                  </q-item-section>
                  <q-item-section side class="q-gutter-y-xs">
                    <div
                      :class="
                        transaction.isPositive
                          ? 'text-positive text-preset-4-bold'
                          : 'text-primary text-preset-4-bold'
                      "
                    >
                      {{ transaction.formattedAmount }}
                    </div>
                    <div class="text-preset-5 text-grey-500">
                      {{ transaction.formattedDate }}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="col-xs-12 col-md-5 q-mb-lg">
        <q-card flat class="custom-border-radius q-px-md">
          <q-card-section
            class="flex items-center q-px-sm q-pt-lg justify-between"
          >
            <div class="text-preset-2 text-primary">Budgets</div>

            <DetailsButton to="budgets" />
          </q-card-section>
          <q-card-section
            class="overview-budgets"
            :class="$q.screen.lt.md ? 'flex-center' : ''"
          >
            <DonutChart />
            <div
              class="custom-legend column justify-between q-py-sm"
              :class="$q.screen.lt.md ? 'q-gutter-md' : ''"
            >
              <div
                v-for="(budget, index) in budgetsStore.overviewSections"
                :key="index"
                class="custom-decoration"
                :style="{ '--custom-bg-color': budget.color }"
              >
                <div class="text-preset-5 text-grey-500 q-pb-xs">
                  {{ budget.label }}
                </div>
                <div class="text-preset-4-bold text-primary">
                  ${{ budget.value }}.00
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div class="col-xs-12 col-md-5 q-pt-lg">
          <q-card flat class="custom-border-radius q-px-sm q-py-xs">
            <q-card-section
              class="flex items-center q-px-md q-pt-lg justify-between"
            >
              <div class="text-preset-2 text-primary">Recurring Bills</div>

              <DetailsButton to="bills" />
            </q-card-section>
            <q-card-section class="column q-gutter-y-md q-py-lg">
              <div
                class="bg-accent custom-border-radius q-pa-lg flex justify-between paid-bills-border"
                :style="{ '--custom-bg-color': 'red' }"
              >
                <div class="text-grey-500">Paid Bills</div>
                <div class="text-preset-4-bold text-primary">
                  ${{ recurringStore.billAmounts.paidBillsAmount }}
                </div>
              </div>
              <div
                class="bg-accent custom-border-radius q-pa-lg flex justify-between upcoming-bills-border"
              >
                <div class="text-grey-500">Total Upcoming</div>
                <div class="text-preset-4-bold text-primary">
                  ${{ recurringStore.billAmounts.upcomingBillsAmount }}
                </div>
              </div>
              <div
                class="bg-accent custom-border-radius q-pa-lg flex justify-between due-soon-border"
              >
                <div class="text-grey-500">Due Soon</div>
                <div class="text-preset-4-bold text-primary">
                  ${{ recurringStore.billAmounts.soonToBePaidBillsAmount }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import DonutChart from "src/components/DonutChart.vue";
import DetailsButton from "src/components/DetailsButton.vue";
import { useTransactionsStore } from "src/stores/transactions-store";
import { useBudgetsStore } from "src/stores/budgets-store";
import { usePotsStore } from "src/stores/pots-store";
import { useRecurringStore } from "src/stores/recurring-bills-store";
import AddButton from "src/components/AddButton.vue";
import { useLoginStore } from "src/stores/login-store";

const recurringStore = useRecurringStore();
const potsStore = usePotsStore();
const transactionsStore = useTransactionsStore();
const budgetsStore = useBudgetsStore();
const loginStore = useLoginStore();
</script>
