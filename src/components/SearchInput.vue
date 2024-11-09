<template>
  <q-input
    v-model="transactionsStore.searchInput"
    color="primary"
    input-class="text-primary"
    outlined
    dense
    placeholder="Search transaction"
    class="search-input"
  >
    <template v-slot:append>
      <q-icon color="primary" name="search"></q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { useTransactionsStore } from "src/stores/transactions-store";
const transactionsStore = useTransactionsStore();
</script>
