<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  columns: {
    type: Array as PropType<Array<{ label: string; key: string }>>,
    required: true,
  },
  rows: {
    type: Array as PropType<Record<string, unknown>[]>,
    required: true,
  },
});
</script>

<template>
  <div class="admin-table">
    <table class="admin-table__table">
      <thead class="admin-table__head">
        <tr>
          <th
            v-for="column in props.columns"
            :key="column.key"
            class="admin-table__header-cell"
          >
            {{ column.label }}
          </th>
          <th class="admin-table__header-cell">عملیات</th>
        </tr>
      </thead>
      <tbody class="admin-table__body">
        <tr
          v-for="row in props.rows"
          :key="String(row.id || row.slug || row.name)"
        >
          <td
            v-for="column in props.columns"
            :key="column.key"
            class="admin-table__cell"
          >
            {{ row[column.key] }}
          </td>
          <td class="admin-table__cell">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-table {
  @apply overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm;
}

.admin-table__table {
  @apply min-w-full border-collapse;
}

.admin-table__head {
  @apply bg-slate-50;
}

.admin-table__header-cell,
.admin-table__cell {
  @apply border-b border-slate-200 px-4 py-4 text-sm text-slate-700;
}

.admin-table__header-cell {
  @apply text-left font-semibold text-slate-900;
}

.admin-table__body tr:hover {
  @apply bg-slate-50;
}
</style>
