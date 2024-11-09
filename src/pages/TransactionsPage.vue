<template>
  <q-page
    class="bg-accent q-pb-lg q-pt-xs"
    :class="$q.screen.lt.sm ? ' q-px-lg' : 'q-px-xl'"
  >
    <div class="text-preset-1">
      <h4>Transactions</h4>
    </div>

    <q-card flat class="q-py-md custom-border-radius">
      <q-card-section
        v-if="$q.screen.gt.xs"
        class="flex q-px-xl q-pb-none q-pt-lg items-center"
      >
        <SearchInput />
        <q-space></q-space>
        <label for="sort" class="q-px-sm text-grey-500">Sort By</label>
        <q-select
          for="sort"
          v-model="transactionsStore.selectedSort"
          :options="transactionsStore.sortingOptions"
          color="primary"
          dense
          outlined
        />

        <label for="category" class="q-pr-sm q-pl-lg text-grey-500"
          >Category</label
        >
        <q-select
          for="category"
          v-model="transactionsStore.selectedCategory"
          :options="transactionsStore.categoryOptions"
          color="primary"
          dense
          outlined
        />
      </q-card-section>
      <q-card-section
        v-else
        class="flex justify-between q-px-lg q-pb-none q-pt-lg items-center"
      >
        <SearchInput />

        <q-select
          for="sort"
          v-model="transactionsStore.selectedSort"
          :options="transactionsStore.sortingOptions"
          color="primary"
          behavior="menu"
          dense
          dropdown-icon="img:/images/icon-sort-mobile.svg"
          hide-selected
          borderless
        />

        <q-select
          for="category"
          v-model="transactionsStore.selectedCategory"
          :options="transactionsStore.categoryOptions"
          color="primary"
          behavior="menu"
          dense
          dropdown-icon="img:/images/icon-filter-mobile.svg"
          hide-selected
          borderless
        />
      </q-card-section>
      <q-card-section class="q-pt-md">
        <q-list separator :class="$q.screen.lt.sm ? 'q-px-sm' : 'q-px-lg'">
          <q-item v-if="$q.screen.gt.xs" class="text-preset-5 text-grey-500">
            <q-item-section>Recipient / Sender </q-item-section>
            <q-item-section avatar> </q-item-section>
            <q-item-section> Category </q-item-section>
            <q-item-section>Transaction Date </q-item-section>
            <q-item-section side> Amount </q-item-section>
          </q-item>

          <q-item
            v-for="(
              transaction, index
            ) in transactionsStore.paginatedTransactions"
            :key="index"
            :class="$q.screen.lt.sm ? 'q-px-xs q-py-md' : 'q-py-md'"
          >
            <q-item-section avatar>
              <q-avatar :size="$q.screen.lt.sm ? '32px' : '40px'">
                <q-img :src="transaction.avatar" />
              </q-avatar>
            </q-item-section>
            <q-item-section
              class="text-primary text-preset-4-bold"
              :style="$q.screen.lt.sm ? 'margin-left: -0.8rem' : ''"
            >
              <div>
                <div>
                  {{ transaction.name }}
                </div>
                <div v-if="$q.screen.lt.sm" class="text-preset-5 text-grey-500">
                  {{ transaction.category }}
                </div>
              </div>
            </q-item-section>
            <q-item-section
              v-if="$q.screen.gt.xs"
              class="text-preset-5 text-grey-500"
            >
              {{ transaction.category }}
            </q-item-section>
            <q-item-section
              v-if="$q.screen.gt.xs"
              class="text-preset-5 text-grey-500"
            >
              <div class="q-pl-sm">
                {{ transaction.formattedDate }}
              </div>
            </q-item-section>
            <q-item-section
              side
              :class="
                transaction.isPositive
                  ? 'text-positive text-preset-4-bold'
                  : 'text-primary text-preset-4-bold'
              "
              ><div>
                <div class="text-right">
                  {{ transaction.formattedAmount }}
                </div>
                <div v-if="$q.screen.lt.sm" class="text-preset-5 text-grey-500">
                  {{ transaction.formattedDate }}
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section
        :class="
          $q.screen.lt.sm
            ? 'flex justify-between q-px-lg'
            : 'flex justify-between q-px-xl'
        "
      >
        <q-btn
          :class="
            $q.screen.lt.sm
              ? 'pagination-btn'
              : 'pagination-btn q-pr-lg q-pl-sm'
          "
          no-caps
          unelevated
          @click="transactionsStore.prevBtn"
        >
          <q-icon size="md" name="arrow_left" />
          <div v-if="$q.screen.gt.xs">Prev</div>
        </q-btn>
        <q-pagination
          v-model="transactionsStore.currentPage"
          :max-pages="2"
          :max="transactionsStore.totalPages"
          outline
          boundary-numbers
          active-color="primary"
          :size="$q.screen.lt.sm ? '16px' : '20px'"
          :gutter="$q.screen.lt.sm ? '4px' : '8px'"
          @update:model-value="transactionsStore.onPageChange"
        />
        <q-btn
          :class="
            $q.screen.lt.sm
              ? 'pagination-btn'
              : 'pagination-btn q-pr-sm q-pl-lg'
          "
          no-caps
          unelevated
          @click="transactionsStore.nextBtn"
        >
          <div v-if="$q.screen.gt.xs">Next</div>
          <q-icon size="md" name="arrow_right" />
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import SearchInput from "src/components/SearchInput.vue";
import { useTransactionsStore } from "src/stores/transactions-store";
const transactionsStore = useTransactionsStore();
</script>
