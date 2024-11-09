<template>
  <q-page
    class="bg-accent q-pb-lg q-pt-xs"
    :class="$q.screen.lt.sm ? ' q-px-lg' : 'q-px-xl'"
  >
    <div class="row items-center text-preset-1">
      <h4>Budgets</h4>
      <q-space></q-space>
      <AddButton
        class="btn-primary"
        @click="budgetsStore.showAddBudgetDialog"
      />
    </div>
    <AddNewBudget />
    <EditBudget />
    <DeleteBudget />

    <div :class="$q.screen.lt.md ? 'column' : 'row '">
      <q-card
        class="col-md-5 col-xs-12 custom-border-radius budgets-spending-summary"
        style="height: max-content"
        flat
      >
        <q-card-section class="flex flex-center">
          <DonutChart />
        </q-card-section>
        <q-card-section>
          <div class="text-preset-2 q-mb-sm q-mt-lg">Spending Summary</div>
          <q-list separator>
            <q-item
              v-for="section in budgetsStore.sections"
              :key="section.id"
              class="q-py-md q-pr-none"
            >
              <q-item-section
                class="custom-decoration text-grey-500"
                :style="{ '--custom-bg-color': section.color }"
              >
                {{ section.label }}
              </q-item-section>
              <q-item-section class="col-auto">
                <div class="q-gutter-x-xs">
                  <span class="text-preset-3 text-primary"
                    >${{ budgetsStore.currentMonthSpent[section.label] }}</span
                  >
                  <span class="text-preset-5 text-grey-500"
                    >of ${{ section.value }}.00</span
                  >
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <div class="col q-gutter-y-lg">
        <q-card
          v-for="section in budgetsStore.sections"
          :key="section.id"
          class="col custom-border-radius q-gutter-y-lg q-pb-md"
          :class="$q.screen.lt.sm ? 'q-px-sm' : 'q-px-md'"
          flat
        >
          <q-card-section class="column q-px-lg q-gutter-y-md">
            <div class="flex justify-between items-center">
              <div class="flex items-center q-gutter-x-sm">
                <q-icon
                  class="q-ml-xs"
                  size="sm"
                  name="fiber_manual_record"
                  :style="{ color: section.color }"
                />
                <span class="text-preset-2">
                  {{ section.label }}
                </span>
              </div>
              <q-btn
                :ripple="false"
                color="grey-300"
                dense
                flat
                class="menu-btn"
                icon="more_horiz"
              >
                <q-menu auto-close class="custom-border-radius q-px-sm">
                  <q-item
                    @click="budgetsStore.showEditBudgetDialog(section)"
                    clickable
                  >
                    <q-item-section
                      ><span class="text-primary"
                        >Edit Budget</span
                      ></q-item-section
                    >
                  </q-item>
                  <q-separator inset></q-separator>
                  <q-item
                    @click="budgetsStore.showDeleteBudgetDialog(section)"
                    clickable
                  >
                    <q-item-section
                      ><span class="text-negative text-no-wrap"
                        >Delete Budget</span
                      ></q-item-section
                    >
                  </q-item>
                </q-menu>
              </q-btn>
            </div>

            <div class="text-grey-500">Maximum of ${{ section.value }}.00</div>
            <q-linear-progress
              rounded
              :style="{
                border: '5px solid #f8f4f0',
                backgroundColor: '#f8f4f0',
                borderRadius: '10px',
                color: section.color,
              }"
              size="32px"
              :value="
                budgetsStore.currentMonthSpent[section.label] / section.value
              "
            />

            <div class="row">
              <div
                class="col custom-decoration q-ml-md"
                :style="{ '--custom-bg-color': section.color }"
              >
                <div class="text-preset-5 text-grey-500 q-pb-sm">Spent</div>
                <div class="text-preset-4-bold text-primary">
                  ${{ budgetsStore.currentMonthSpent[section.label] }}
                </div>
              </div>

              <div
                class="col custom-decoration q-ml-md"
                :style="{ '--custom-bg-color': '#f8f4f0' }"
              >
                <div class="text-preset-5 text-grey-500 q-pb-sm">Remaining</div>
                <div class="text-preset-4-bold text-primary">
                  ${{
                    Math.abs(
                      Math.max(
                        0,
                        section.value -
                          budgetsStore.currentMonthSpent[section.label]
                      )
                    ).toFixed(2)
                  }}
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="bg-accent q-px-lg custom-border-radius">
              <div class="flex items-center justify-between q-pt-md">
                <div class="text-preset-3 text-primary">Latest Spendings</div>
                <DetailsButton
                  label="See All"
                  @click="selectCategory(section.label)"
                  to="transactions"
                  class="q-px-none"
                />
              </div>
              <q-list separator>
                <q-item
                  v-for="transaction in budgetsStore
                    .lastThreeTransactionsFromSections[section.label]"
                  :key="transaction.id"
                  class="q-px-none q-py-md"
                >
                  <q-item-section v-if="$q.screen.gt.xs" avatar>
                    <q-avatar>
                      <q-img :src="transaction.avatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="text-preset-5-bold text-primary">
                    {{ transaction.name }}
                  </q-item-section>

                  <q-item-section class="q-gutter-y-xs col-auto">
                    <div class="text-preset-5-bold text-primary self-end">
                      {{ transaction.formattedAmount }}
                    </div>
                    <div class="text-preset-5 text-grey-500">
                      {{ transaction.formattedDate }}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import AddButton from "src/components/AddButton.vue";
import AddNewBudget from "src/components/Budgets/AddNewBudgetDialog.vue";
import DonutChart from "src/components/DonutChart.vue";
import DetailsButton from "src/components/DetailsButton.vue";
import EditBudget from "src/components/Budgets/EditBudgetDialog.vue";
import DeleteBudget from "src/components/Budgets/DeleteBudgetDialog.vue";
import { useBudgetsStore } from "src/stores/budgets-store";
import { useTransactionsStore } from "src/stores/transactions-store";

const budgetsStore = useBudgetsStore();
const transactionsStore = useTransactionsStore();

const selectCategory = (category) => {
  transactionsStore.selectedCategory = category;
};
</script>
