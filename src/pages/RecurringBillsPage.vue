<template>
  <q-page
    class="bg-accent q-pb-lg q-pt-xs"
    :class="$q.screen.lt.sm ? ' q-px-lg' : 'q-px-xl'"
  >
    <div class="row items-center text-preset-1">
      <h4>Recurring Bills</h4>
    </div>
    <div :class="$q.screen.lt.md ? 'column' : 'row q-gutter-lg'">
      <div
        :class="$q.screen.lt.md ? 'row ' : 'col'"
        :style="$q.screen.lt.md && $q.screen.gt.xs ? 'gap: 2rem' : ''"
      >
        <q-card
          flat
          class="column col bg-primary q-mb-lg q-pa-lg custom-border-radius text-white"
          :class="$q.screen.lt.sm ? 'col-12' : ''"
        >
          <q-icon
            class="q-pb-lg"
            :class="$q.screen.lt.md && $q.screen.gt.xs ? 'q-pb-xl' : ''"
            size="md"
            name="img:images/icon-recurring-bills.svg"
          />
          <div
            class="column q-gutter-y-md"
            :class="$q.screen.lt.md && $q.screen.gt.xs ? 'q-pt-lg' : ''"
          >
            <div>Total Bills</div>
            <div class="text-preset-1">
              ${{ recurringStore.billAmounts.totalBills }}
            </div>
          </div>
        </q-card>
        <q-card
          flat
          class="col column bg-white custom-border-radius"
          :class="
            $q.screen.lt.sm ? 'q-px-sm q-mb-lg col-12 ' : ' q-pa-sm q-mb-lg   '
          "
        >
          <q-card-section class="text-preset-3 text-primary"
            >Summary</q-card-section
          >
          <q-card-section class="flex justify-between">
            <div class="text-preset-5 text-grey-500">Paid Bills</div>
            <div class="text-preset-5-bold text-primary">
              {{ recurringStore.billAmounts.paidBillsLength }} (${{
                recurringStore.billAmounts.paidBillsAmount
              }})
            </div>
          </q-card-section>
          <q-card-section class="q-py-none">
            <q-separator></q-separator>
          </q-card-section>
          <q-card-section class="flex justify-between">
            <div class="text-preset-5 text-grey-500">Total Upcoming</div>
            <div>
              {{ recurringStore.billAmounts.upcomingBillsLength }} (${{
                recurringStore.billAmounts.upcomingBillsAmount
              }})
            </div>
          </q-card-section>
          <q-card-section class="q-py-none">
            <q-separator></q-separator>
          </q-card-section>
          <q-card-section class="flex justify-between">
            <div class="text-preset-5 text-negative">Due Soon</div>
            <div class="text-preset-5-bold text-negative">
              {{ recurringStore.billAmounts.soonToBePaidLength }} (${{
                recurringStore.billAmounts.soonToBePaidBillsAmount
              }})
            </div>
          </q-card-section>
        </q-card>
      </div>
      <q-card
        flat
        class="bg-white custom-border-radius"
        :class="$q.screen.lt.md ? 'col-12  q-mt-sm' : 'q-pa-md col-8'"
      >
        <q-card-section class="flex justify-between">
          <SearchInput
            v-model="recurringStore.searchInput"
            placeholder="Search bills"
            :style="$q.screen.gt.xs ? 'width: 20rem' : 'width: 15rem'"
          />
          <div class="flex items-center q-gutter-sm">
            <label v-if="$q.screen.gt.xs" for="sort" class="text-grey-500"
              >Sort By</label
            >
            <q-select
              for="sort"
              v-model="recurringStore.selectedSort"
              :options="recurringStore.sortingOptions"
              color="primary"
              dense
              :outlined="$q.screen.lt.sm ? false : true"
              :borderless="$q.screen.lt.sm ? true : false"
              :dropdown-icon="
                $q.screen.lt.sm ? 'img:/images/icon-sort-mobile.svg' : false
              "
              :hide-selected="$q.screen.lt.sm ? true : false"
            />
          </div>
        </q-card-section>
        <q-card-section :class="$q.screen.lt.sm ? 'q-px-none' : ''">
          <q-table
            :columns="recurringStore.columns"
            :rows="recurringStore.sortedItems"
            row-key="name"
            hide-pagination
            :hide-header="$q.screen.gt.xs ? false : true"
            rows-per-page-options="0"
            flat
          >
            <template #body="props">
              <q-tr no-hover :props="props">
                <q-td key="name" :props="props"
                  ><div class="q-py-sm text-preset-4-bold">
                    <q-avatar size="md"
                      ><q-img :src="props.row.avatar" /></q-avatar
                    ><span class="q-pl-md">{{ props.row.name }}</span>
                  </div>
                  <div
                    v-if="$q.screen.lt.sm"
                    class="flex items-center q-pb-sm text"
                    :class="
                      recurringStore.isPaid(props.row)
                        ? 'text-positive'
                        : 'text-grey-500'
                    "
                  >
                    <div>Monthly-{{ props.row.formattedDay }}</div>
                    <div
                      v-if="recurringStore.isPaid(props.row)"
                      class="q-pl-xs flex"
                    >
                      <q-icon
                        color="positive"
                        size="16px"
                        name="check_circle"
                      />
                    </div>
                    <div
                      v-else-if="recurringStore.soonToBePaid(props.row)"
                      class="q-pl-xs flex"
                    >
                      <q-icon color="negative" size="16px" name="error" />
                    </div>
                  </div>
                </q-td>
                <q-td
                  v-if="$q.screen.gt.xs"
                  key="date"
                  :class="
                    recurringStore.isPaid(props.row)
                      ? 'text-positive'
                      : 'text-grey-500'
                  "
                  :props="props"
                  ><div class="flex items-center">
                    <div>Monthly-{{ props.row.formattedDay }}</div>
                    <div
                      v-if="recurringStore.isPaid(props.row)"
                      class="q-pl-xs"
                    >
                      <q-icon
                        color="positive"
                        size="16px"
                        name="check_circle"
                      />
                    </div>
                    <div
                      v-else-if="recurringStore.soonToBePaid(props.row)"
                      class="q-pl-xs"
                    >
                      <q-icon color="negative" size="16px" name="error" />
                    </div>
                  </div>
                </q-td>
                <q-td
                  key="amount"
                  :class="
                    recurringStore.soonToBePaid(props.row)
                      ? 'text-negative text-preset-4-bold'
                      : 'text-primary text-preset-4-bold'
                  "
                  :props="props"
                  >${{ Math.abs(props.row.amount).toFixed(2) }}</q-td
                >
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import SearchInput from "src/components/SearchInput.vue";
import { useRecurringStore } from "src/stores/recurring-bills-store";

const recurringStore = useRecurringStore();
</script>
