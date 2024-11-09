<template>
  <q-dialog v-model="potsStore.withdrawDialog" @hide="resetInput">
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
          Withdraw from '{{ potsStore.selectedPot.label }}'
        </div>
        <q-btn dense unelevated size="md" v-close-popup>
          <q-icon name="img:/images/icon-close-modal.svg"></q-icon>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-grey-500 q-py-xs q-pb-md">
        Withdraw from your pot to put money back in your main balance. This will
        reduce the amount you have in this pot.
      </q-card-section>
      <q-card-section class="flex items-center justify-between">
        <div class="text-grey-500 q-pb-xs">New Amount</div>
        <span class="text-preset-1 text-primary">${{ newAmount }}</span>
      </q-card-section>
      <q-card-section class="q-py-none">
        <div class="progress-bar">
          <div
            class="progress-red"
            :style="{ width: oldValuePercent + '%' }"
          ></div>
          <div
            class="progress-black"
            :style="{ width: newValuePercent + '%' }"
          ></div>
        </div>
      </q-card-section>
      <q-card-section class="flex justify-between">
        <div
          class="text-preset-5-bold"
          :style="{ color: potsStore.selectedPot.color }"
        >
          {{ Math.abs(newValuePercent + oldValuePercent).toFixed(2) }}%
        </div>
        <div class="text-preset-5 text-grey-500">
          Target of ${{ potsStore.selectedPot.target.toLocaleString() }}
        </div>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <label for="withdraw" class="text-preset-5-bold text-grey-500">
          Amount to Withdraw
        </label>
        <q-input
          for="withdraw"
          @keyup.enter="withdrawMoney"
          autofocus
          class="q-pt-xs"
          v-model.number="newValue"
          type="number"
          dense
          outlined
          :rules="[maxAmountRule]"
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
          :disabled="!isAmountValid"
          class="btn-primary"
          @click="withdrawMoney"
          label="Confirm Addition"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import AddButton from "../AddButton.vue";
import { doc, updateDoc } from "firebase/firestore";
import { usePotsStore } from "src/stores/pots-store";
const potsStore = usePotsStore();

const newAmount = computed(() => {
  const result = potsStore.selectedPot.value - newValue.value;
  return Math.max(result, 0).toFixed(2);
});
const newValue = ref(null);
const newValuePercent = computed(() => {
  return (newAmount.value / potsStore.selectedPot.target) * 100;
});
const oldValuePercent = computed(() => {
  return (potsStore.selectedPot.value / potsStore.selectedPot.target) * 100;
});

const isAmountValid = computed(() => {
  return newValue.value > 0 && newValue.value <= potsStore.selectedPot.value;
});

const withdrawMoney = async () => {
  if (isAmountValid.value) {
    await updateDoc(
      doc(potsStore.potsCollectionRef, potsStore.selectedPot.id),
      {
        value: potsStore.selectedPot.value - newValue.value,
      }
    );
    potsStore.withdrawDialog = false;
  }
};

const maxAmountRule = (val) => {
  if (val === "" || val === null) return true; // Allow empty input
  return (
    val <= potsStore.selectedPot.value ||
    `Amount cannot exceed ${Math.abs(potsStore.selectedPot.value).toFixed(2)}`
  );
};

const resetInput = () => {
  newValue.value = null;
};
</script>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: $accent;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}

.progress-red {
  height: 100%;
  background-color: $negative;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-black {
  height: 100%;
  background-color: $primary;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
