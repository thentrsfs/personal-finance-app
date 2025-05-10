<template>
  <div
    class="donut-container"
    style="position: relative; display: inline-block "
  >
    <vc-donut
      :sections="budgetsStore.sections"
      :size=" 250"
      unit="px"
      :thickness="30"
      :total="budgetsStore.totalBudget"
    >
      <div >
        <div
          class="q-gutter-y-sm"
          style="
            position: absolute;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
          "
         
        >
          <div class="text-preset-1 text-primary">
            ${{ budgetsStore.totalSpent }}
          </div>
          <div class="text-preset-5 text-grey-500">
            of ${{ budgetsStore.totalBudget }} limit
          </div>
        </div>
      </div>
    </vc-donut>
    <div class="donut-inner-overlay"></div>
  </div>
</template>

<script setup>
import { VcDonut } from "vue-css-donut-chart";
import { useBudgetsStore } from "src/stores/budgets-store";

const budgetsStore = useBudgetsStore();
</script>

<style scoped>
.donut-inner-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}
</style>
