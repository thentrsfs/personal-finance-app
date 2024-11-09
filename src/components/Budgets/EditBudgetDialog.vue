<template>
  <q-dialog v-model="budgetsStore.editBudgetDialog">
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
          Edit Budget
        </div>
        <q-btn dense unelevated size="md" v-close-popup>
          <q-icon name="img:/images/icon-close-modal.svg"></q-icon>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-grey-500 q-py-xs">
        As your budgets change, feel free to update your spending limits.
      </q-card-section>
      <q-card-section>
        <label for="category" class="text-preset-5-bold text-grey-500">
          Budget Category
        </label>
        <q-select
          for="category"
          v-model="budgetsStore.selectedBudget.label"
          :options="budgetsStore.categoryOptions"
          class="q-pt-xs"
          color="primary"
          dense
          outlined
          popup-content-style="height: 16rem"
          :menu-offset="[0, 13]"
        >
          <template v-slot:option="scope">
            <q-item class="items-center" dense v-bind="scope.itemProps">
              <span>
                {{ scope.opt }}
              </span>
            </q-item>
            <q-separator inset></q-separator>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <label for="spend" class="text-preset-5-bold text-grey-500 q-pb-xs">
          Maximum Spend
        </label>
        <q-input
          for="spend"
          v-model.number="budgetsStore.selectedBudget.value"
          placeholder="e.g. 2000"
          class="maximum-spending-input q-pt-xs"
          outlined
          dense
          color="primary"
          type="number"
          @keyup.enter="budgetsStore.saveEditBudget"
        >
          <template #prepend>
            <span class="text-preset-4 text-beige-500 q-px-xs">$</span>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <label for="theme" class="text-preset-5-bold text-grey-500 q-pb-xs"
          >Theme</label
        >
        <q-select
          for="theme"
          v-model="budgetsStore.selectedTheme"
          :options="budgetsStore.themeOptions"
          class="q-pt-xs"
          color="primary"
          label-color="blue"
          dense
          outlined
          popup-content-style="height: 16rem"
          :menu-offset="[0, 13]"
        >
          <template #prepend>
            <q-icon
              class="q-ml-xs"
              size="sm"
              name="fiber_manual_record"
              :style="{ color: budgetsStore.selectedTheme.color }"
            />
          </template>

          <template v-slot:option="scope">
            <q-item class="items-center" dense v-bind="scope.itemProps">
              <q-icon
                size="sm"
                name="fiber_manual_record"
                :style="{ color: scope.opt.color }"
              />

              <div class="q-pl-xs text-primary">
                {{ scope.opt.label }}
              </div>
              <q-space></q-space>
              <div
                v-show="budgetsStore.selectedTheme.label === scope.opt.label"
              >
                <q-icon name="img:images/icon-selected.svg"></q-icon>
              </div>
            </q-item>
            <q-separator inset></q-separator>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="column q-pt-xs">
        <AddButton
          class="btn-primary"
          @click="budgetsStore.saveEditBudget"
          label="Save Changes"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import AddButton from "../AddButton.vue";
import { useBudgetsStore } from "src/stores/budgets-store";
const budgetsStore = useBudgetsStore();
</script>
