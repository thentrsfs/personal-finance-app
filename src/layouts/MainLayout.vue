<template>
  <q-layout
    @keyup.enter="menuStore.maximize"
    view="hHh LpR fFf"
    style="position: relative"
  >
    <q-drawer v-model="menuStore.drawer" v-if="$q.screen.gt.sm" class="drawer">
      <q-img class="heading-desktop" src="images/logo-large.svg" />
      <q-list class="text-preset-3">
        <q-item
          v-for="(item, index) in menuStore.drawerItems"
          :key="index"
          clickable
          :to="item.route"
          :class="
            menuStore.isActiveRoute(item.route)
              ? 'text-primary active-item custom-width'
              : 'custom-width text-grey-300'
          "
        >
          <q-item-section class="items-center q-pl-sm" avatar>
            <q-avatar rounded>
              <component :is="menuStore.iconComponents[item.icon]" />
            </q-avatar>
          </q-item-section>
          <q-item-section class="q-pt-xs">
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-btn
        class="minimize-btn"
        @click="menuStore.minimize"
        :ripple="false"
        flat
        no-caps
        dense
        ><q-icon name="img:/images/icon-minimize-menu.svg"></q-icon>
        <span class="q-pl-md text-preset-3 text-grey-300">Minimize Menu</span>
      </q-btn>
    </q-drawer>
    <div class="hover-area" @mouseover="menuStore.maximize"></div>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer v-if="$q.screen.lt.md" class="mobile-menu">
      <q-list class="text-preset-3 flex justify-evenly">
        <q-item
          v-for="(item, index) in menuStore.drawerItems"
          :key="index"
          clickable
          :to="item.route"
          class="column items-center"
          :class="
            menuStore.isActiveRoute(item.route)
              ? 'text-primary active-item-mobile'
              : ' text-grey-300 item-mobile'
          "
        >
          <q-item-section class="q-px-sm" avatar>
            <q-avatar rounded>
              <component :is="menuStore.iconComponents[item.icon]" />
            </q-avatar>
          </q-item-section>
          <q-item-section
            v-if="!$q.screen.lt.sm"
            class="text-preset-5-bold q-pb-xs"
          >
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useMenuStore } from "src/stores/menu-store";
const menuStore = useMenuStore();
</script>
