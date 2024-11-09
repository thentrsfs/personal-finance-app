<template>
  <q-dialog v-model="potsStore.editPotDialog">
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
          Edit Pot
        </div>
        <q-btn dense unelevated size="md" v-close-popup>
          <q-icon name="img:/images/icon-close-modal.svg"></q-icon>
        </q-btn>
      </q-card-section>

      <q-card-section class="text-grey-500 q-py-xs">
        Create a pot to set savings targets. These can help keep you on track as
        you save for special purchases.
      </q-card-section>
      <q-card-section>
        <label for="name" class="text-preset-5-bold text-grey-500"
          >Pot Name</label
        >
        <q-input
          for="name"
          v-model="potsStore.selectedPot.label"
          class="q-pb-none q-pt-xs"
          counter
          maxlength="30"
          dense
          outlined
        ></q-input>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <label for="target" class="text-preset-5-bold text-grey-500"
          >Target</label
        >
        <q-input
          for="target"
          v-model.number="potsStore.selectedPot.target"
          class="maximum-spending-input q-pt-xs"
          outlined
          dense
          color="primary"
          type="number"
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
          v-model="potsStore.selectedTheme"
          :options="potsStore.themeOptions"
          color="primary"
          class="q-pt-xs"
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
              :style="{ color: potsStore.selectedTheme.color }"
            />
          </template>
          <template v-slot:option="scope">
            <q-item class="items-center" dense v-bind="scope.itemProps">
              <q-icon
                size="sm"
                name="fiber_manual_record"
                :style="{
                  color: scope.opt.color,
                  opacity: potsStore.isColorUsed(scope.opt.color) ? '0.4' : '1',
                }"
              />

              <div
                :class="
                  potsStore.isColorUsed(scope.opt.color) ? 'text-grey-500' : ''
                "
                class="q-pl-xs text-primary"
              >
                {{ scope.opt.label }}
              </div>
              <q-space></q-space>
              <div
                v-if="
                  !potsStore.isColorUsed(scope.opt.color) &&
                  potsStore.selectedTheme.label === scope.opt.label
                "
              >
                <q-icon name="img:images/icon-selected.svg"></q-icon>
              </div>
              <div
                class="text-grey-500"
                v-if="potsStore.isColorUsed(scope.opt.color)"
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
          @click="potsStore.saveEditPot"
          label="Save Changes"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import AddButton from "../AddButton.vue";
import { usePotsStore } from "src/stores/pots-store";
const potsStore = usePotsStore();
</script>
