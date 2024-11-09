<template>
  <q-btn
    flat
    class="q-px-none details-btn"
    icon-right="arrow_right"
    size="md"
    no-caps
    dense
    :ripple="false"
    label="See Details"
  ></q-btn>
</template>

<style lang="scss" scoped>
.details-btn {
  color: #696868;
}

.details-btn:hover {
  color: $primary;
}

.details-btn:focus-visible {
  box-shadow: 0 0 0 1px rgb(97, 94, 110);
  padding-left: 3px;
}
</style>
