<template>
  <q-page
    class="bg-accent q-pb-lg q-pt-xs"
    :class="$q.screen.lt.sm ? ' q-px-lg' : 'q-px-xl'"
  >
    <div class="row items-center text-preset-1">
      <h4>Pots</h4>
      <q-space></q-space>
      <AddButton
        label="+ Add New Pot"
        class="btn-primary"
        @click="potsStore.showAddPotDialog"
      />
    </div>
    <AddNewPot />
    <EditPot />
    <DeletePot />
    <AddMoney />
    <WithdrawFrom />
    <div
      class=""
      :class="$q.screen.lt.md ? 'column q-gutter-y-lg ' : 'row q-gutter-lg'"
    >
      <q-card
        flat
        v-for="(pot, index) in potsStore.pots"
        :key="index"
        class="bg-white pot custom-border-radius"
        :class="$q.screen.lt.md ? 'col-xs-12 q-px-sm' : 'q-px-md'"
      >
        <q-card-section class="flex items-center justify-between">
          <q-card-section class="flex items-center q-gutter-x-sm q-px-none">
            <q-icon
              class="q-ml-xs"
              size="sm"
              name="fiber_manual_record"
              :style="{ color: pot.color }"
            />
            <span class="text-preset-2">{{ pot.label }}</span>
          </q-card-section>

          <q-btn class="menu-btn" color="grey-300" dense flat icon="more_horiz">
            <q-menu auto-close class="custom-border-radius q-px-sm">
              <q-item @click="potsStore.showEditPotDialog(pot)" clickable>
                <q-item-section
                  ><span class="text-primary">Edit Pot</span></q-item-section
                >
              </q-item>
              <q-separator inset></q-separator>
              <q-item @click="potsStore.showDeletePotDialog(pot)" clickable>
                <q-item-section
                  ><span class="text-negative text-no-wrap"
                    >Delete Pot</span
                  ></q-item-section
                >
              </q-item>
            </q-menu></q-btn
          >
        </q-card-section>
        <q-card-section class="flex items-center justify-between">
          <span class="text-grey-500">Total Saved</span>
          <span class="text-preset-1 text-primary"
            >${{ Math.abs(pot.value).toFixed(2) }}</span
          >
        </q-card-section>
        <q-card-section class="q-py-none">
          <q-linear-progress
            :value="pot.value / pot.target"
            :style="{
              backgroundColor: '#f8f4f0',
              color: pot.color,
              borderRadius: '10px',
            }"
            size="8px"
          />
        </q-card-section>
        <q-card-section class="flex justify-between">
          <div class="text-preset-5-bold text-grey-500">
            {{ potsStore.totalSavedPercent(pot) }}%
          </div>
          <div class="text-preset-5 text-grey-500">
            Target of ${{ pot.target.toLocaleString() }}
          </div>
        </q-card-section>
        <q-card-section class="row q-gutter-lg q-mb-sm">
          <AddButton
            @click="potsStore.showAddMoneyDialog(pot)"
            class="btn-pots col text-primary"
            label="+ Add Money"
          />
          <AddButton
            @click="potsStore.showWithdrawDialog(pot)"
            class="btn-pots col text-primary"
            label="Withdraw"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import AddButton from "src/components/AddButton.vue";
import AddNewPot from "src/components/Pots/AddNewPotDialog.vue";
import EditPot from "src/components/Pots/EditPotDialog.vue";
import DeletePot from "src/components/Pots/DeletePotDialog.vue";
import AddMoney from "src/components/Pots/AddMoneyDialog.vue";
import WithdrawFrom from "src/components/Pots/WithdrawFromDialog.vue";
import { usePotsStore } from "src/stores/pots-store";
const potsStore = usePotsStore();
</script>
