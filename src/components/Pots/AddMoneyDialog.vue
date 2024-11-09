<template>
  <q-dialog v-model="potsStore.addMoneyDialog" @hide="resetInput">
    <q-card
      :class="$q.screen.lt.sm ? 'q-pa-xs' : 'q-pa-md'"
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
          Add to '{{ potsStore.selectedPot.label }}'
        </div>
        <q-btn dense unelevated size="md" v-close-popup>
          <q-icon name="img:/images/icon-close-modal.svg"></q-icon>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-grey-500 q-py-xs q-pb-md">
        Add money to your pot to keep it separate from your main balance. As
        soon as you add this money, it will be deducted from your current
        balance.
      </q-card-section>
      <q-card-section class="flex items-center justify-between">
        <div class="text-grey-500 q-pb-xs">New Amount</div>
        <span class="text-preset-1 text-primary">${{ newAmount }}</span>
      </q-card-section>
      <q-card-section class="q-py-none">
        <div class="row no-wrap" style="height: 8px">
          <div
            class="bg-primary text-white flex flex-center"
            style="border-radius: 10px 0 0 10px"
            :style="oldProgress"
          ></div>
          <div class="text-white flex flex-center" :style="newProgress"></div>
          <div
            class="bg-accent col flex flex-center"
            style="border-radius: 0 10px 10px 0"
          ></div>
        </div>
      </q-card-section>
      <q-card-section class="flex justify-between">
        <div class="text-preset-5-bold text-positive">
          {{ Math.abs(newValuePercent + oldValuePercent).toFixed(2) }}%
        </div>
        <div class="text-preset-5 text-grey-500">
          Target of ${{ potsStore.selectedPot.target.toLocaleString() }}
        </div>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <label for="add" class="text-preset-5-bold text-grey-500">
          Amount to Add
        </label>
        <q-input
          for="add"
          @keyup.enter="addPotMoney"
          class="q-pt-xs"
          autofocus
          v-model.number="newValue"
          type="number"
          dense
          outlined
          :rules="[validateAddingMoney]"
        >
          <template #prepend>
            <span class="text-preset-4 text-beige-500 q-px-xs"
              >$</span
            ></template
          >
        </q-input>
      </q-card-section>
      <q-card-section class="column">
        <AddButton
          class="btn-primary"
          @click="addPotMoney"
          label="Confirm Addition"
          :disabled="!validateAddingMoney"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import AddButton from "../AddButton.vue";
import { usePotsStore } from "src/stores/pots-store";
import { useTransactionsStore } from "src/stores/transactions-store";
import { doc, updateDoc } from "firebase/firestore";
const potsStore = usePotsStore();
const transactionsStore = useTransactionsStore();

const newAmount = computed(() => {
  return Math.abs(potsStore.selectedPot.value + newValue.value).toFixed(2);
});
const newValue = ref(null);
const newValuePercent = computed(() => {
  return (newValue.value / potsStore.selectedPot.target) * 100;
});
const oldValuePercent = computed(() => {
  return (potsStore.selectedPot.value / potsStore.selectedPot.target) * 100;
});

const oldProgress = computed(
  () => `width:${potsStore.totalSavedPercent(potsStore.selectedPot)}%`
);
const newProgress = computed(
  () =>
    `width:${newValuePercent.value}%; background-color:${potsStore.selectedPot.color}; margin-left: 3px; border-radius: 0 10px 10px 0`
);

const isAmountValid = computed(() => {
  return (
    newValue.value > 0 && newValue.value <= transactionsStore.currentBalance
  );
});

const addPotMoney = async () => {
  if (isAmountValid.value) {
    await updateDoc(
      doc(potsStore.potsCollectionRef, potsStore.selectedPot.id),
      {
        value: potsStore.selectedPot.value + newValue.value,
      }
    );
    potsStore.addMoneyDialog = false;
  }
};

const validateAddingMoney = (val) => {
  if (val === "" || val === null) return true; // Allow empty input
  return (
    val <= transactionsStore.currentBalance || `There is not enough balance.  `
  );
};

const resetInput = () => {
  newValue.value = null;
};
</script>
