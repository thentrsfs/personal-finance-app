<template>
  <q-dialog v-model="budgetsStore.deleteBudgetDialog">
    <q-card
      :class="$q.screen.lt.sm ? 'q-px-xs q-pt-xs' : 'q-px-md q-pt-md'"
      style="border-radius: 12px"
    >
      <q-card-section class="flex justify-between items-center">
        <div
          :class="
            $q.screen.lt.sm
              ? 'text-preset-2 text-primary'
              : 'text-preset-1 text-primary'
          "
        >
          Delete '{{ budgetsStore.selectedBudget.label }}'
        </div>
        <q-btn dense unelevated size="md" v-close-popup>
          <q-icon name="img:/images/icon-close-modal.svg"></q-icon>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-grey-500 q-py-xs">
        Are you sure you want to delete this budget? This action cannot be
        reversed, and all the data inside it will be removed forever.
      </q-card-section>

      <q-card-section class="column q-pt-md">
        <AddButton
          class="btn-primary"
          @click="budgetsStore.deleteBudget"
          :ripple="false"
          color="negative"
          label="Yes, Confirm Deletion"
        />
        <div class="text-center" v-close-popup>
          <AddButton
            class="btn-primary"
            :ripple="false"
            text-color="grey-500"
            color="transparent"
            label="No, Go Back"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import AddButton from "../AddButton.vue";
import { useBudgetsStore } from "src/stores/budgets-store";
const budgetsStore = useBudgetsStore();
</script>
