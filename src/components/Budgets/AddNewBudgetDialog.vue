<template>
  <q-dialog v-model="budgetsStore.addBudgetDialog">
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
          Add New Budget
        </div>
        <q-btn dense unelevated size="md" v-close-popup>
          <q-icon name="img:/images/icon-close-modal.svg"></q-icon>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-grey-500 q-py-xs">
        Choose a category to set a spending budget. These categories can help
        you monitor spending.
      </q-card-section>
      <q-card-section>
        <label for="category" class="text-preset-5-bold text-grey-500">
          Budget Category
        </label>
        <q-select
          for="category"
          v-model="budgetsStore.newBudget.label"
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
              <span
                :class="
                  budgetsStore.isCategoryUsed(scope.opt) ? 'text-grey-500' : ''
                "
              >
                {{ scope.opt }}
              </span>
              <q-space></q-space>
              <div
                class="text-grey-500"
                v-if="budgetsStore.isCategoryUsed(scope.opt)"
              >
                Already used
              </div>
            </q-item>
            <q-separator inset></q-separator>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <label for="spend" class="text-preset-5-bold text-grey-500">
          Maximum Spend
        </label>
        <q-input
          for="spend"
          v-model.number="budgetsStore.newBudget.value"
          placeholder="e.g. 2000"
          class="maximum-spending-input q-pt-xs"
          outlined
          dense
          color="primary"
          type="number"
          @keyup.enter="budgetsStore.addNewBudget"
        >
          <template #prepend>
            <span class="text-preset-4 text-beige-500 q-px-xs">$</span>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <label for="theme" class="text-preset-5-bold text-grey-500"
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
                :style="{
                  color: scope.opt.color,
                  opacity: budgetsStore.isColorUsed(scope.opt.color)
                    ? '0.4'
                    : '1',
                }"
              />

              <div
                :class="
                  budgetsStore.isColorUsed(scope.opt.color)
                    ? 'text-grey-500'
                    : ''
                "
                class="q-pl-xs text-primary"
              >
                {{ scope.opt.label }}
              </div>
              <q-space></q-space>
              <div
                v-if="
                  !budgetsStore.isColorUsed(scope.opt.color) &&
                  budgetsStore.selectedTheme.label === scope.opt.label
                "
              >
                <q-icon name="img:images/icon-selected.svg"></q-icon>
              </div>
              <div
                class="text-grey-500"
                v-if="budgetsStore.isColorUsed(scope.opt.color)"
              >
                Already used
              </div>
            </q-item>
            <q-separator inset></q-separator>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="column q-pt-xs">
        <AddButton
          class="btn-primary"
          @click="budgetsStore.addNewBudget"
          label="Add Budget"
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
