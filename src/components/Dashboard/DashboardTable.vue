<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
});

const { data, columns } = toRefs(props);
</script>

<template>
  <table class="table">
    <thead>
      <tr v-for="(key, index) in columns" :key="index">
        <th>{{ key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <template v-for="(value, key) in item">
          <td>{{ value }}</td>
        </template>
      </tr>
    </tbody>
  </table>
</template>


<style scoped>
/* Add any relevant styles here */
</style>