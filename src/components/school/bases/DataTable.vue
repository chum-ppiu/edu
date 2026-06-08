<script setup>
import { computed, ref } from 'vue'
import Selection from './Selection.vue' // Double-check this path matches your directory setup

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
  searchKeys: {
    type: Array,
    default: () => [],
  },
  filters: {
    type: Array,
    default: () => [],
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  pageSize: {
    type: Number,
    default: 5,
  },
  actionLabels: {
    type: Object,
    default: () => ({
      view: 'View details',
      edit: 'Edit',
      delete: 'Delete',
    }),
  },
})

const emit = defineEmits(['view', 'edit', 'delete'])

const searchText = ref('')
const activeFilters = ref({})
const currentPage = ref(1)

const normalizedRows = computed(() => props.rows ?? [])

const searchableKeys = computed(() => {
  if (props.searchKeys.length > 0) {
    return props.searchKeys
  }

  return props.columns.map((column) => column.key)
})

const filteredRows = computed(() => {
  const query = searchText.value.trim().toLowerCase()

  return normalizedRows.value.filter((row) => {
    const matchesSearch =
      query.length === 0 ||
      searchableKeys.value.some((key) => {
        const value = getRowValue(row, key)
        return String(value ?? '').toLowerCase().includes(query)
      })

    const matchesFilters = props.filters.every((filter) => {
      const selectedValue = activeFilters.value[filter.key] ?? 'all'
      if (selectedValue === 'all') {
        return true
      }

      const filterValue = getRowValue(row, filter.key)
      return String(filterValue ?? '') === String(selectedValue)
    })

    return matchesSearch && matchesFilters
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / props.pageSize)))

const pagedRows = computed(() => {
  const startIndex = (currentPage.value - 1) * props.pageSize
  return filteredRows.value.slice(startIndex, startIndex + props.pageSize)
})

const pageItems = computed(() => {
  const pages = []
  const lastPage = totalPages.value

  if (lastPage <= 7) {
    for (let pageNumber = 1; pageNumber <= lastPage; pageNumber += 1) {
      pages.push(pageNumber)
    }
    return pages
  }

  pages.push(1)

  const leftBound = Math.max(2, currentPage.value - 1)
  const rightBound = Math.min(lastPage - 1, currentPage.value + 1)

  if (leftBound > 2) {
    pages.push('ellipsis-left')
  }

  for (let pageNumber = leftBound; pageNumber <= rightBound; pageNumber += 1) {
    pages.push(pageNumber)
  }

  if (rightBound < lastPage - 1) {
    pages.push('ellipsis-right')
  }

  pages.push(lastPage)
  return pages
})

const startRecord = computed(() => (filteredRows.value.length === 0 ? 0 : (currentPage.value - 1) * props.pageSize + 1))
const endRecord = computed(() => Math.min(currentPage.value * props.pageSize, filteredRows.value.length))

function getRowValue(row, key) {
  return typeof key === 'function' ? key(row) : row?.[key]
}

function resetPage() {
  currentPage.value = 1
}

function setSearch(value) {
  searchText.value = value
  resetPage()
}

// Intercepts the custom Selection emit to map string labels seamlessly back to their values
function handleFilterSelection(filter, chosenLabel) {
  if (chosenLabel === filter.allLabel || chosenLabel === `All ${filter.label}`) {
    setFilter(filter.key, 'all')
    return
  }
  
  const foundOption = filter.options.find(opt => opt.label === chosenLabel)
  if (foundOption) {
    setFilter(filter.key, foundOption.value)
  }
}

function setFilter(filterKey, value) {
  activeFilters.value = { ...activeFilters.value, [filterKey]: value }
  resetPage()
}

function setPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages.value) {
    return
  }

  currentPage.value = pageNumber
}

function clearFilters() {
  searchText.value = ''
  activeFilters.value = {}
  currentPage.value = 1
}

function emitAction(action, row) {
  emit(action, row)
}

// Maps static definitions to linear string arrays for Selection.vue consumption
const getFilterOptionsList = (filter) => {
  const defaultLabel = filter.allLabel || `All ${filter.label}`
  return [defaultLabel, ...filter.options.map(opt => opt.label)]
}

const getCurrentFilterLabel = (filter) => {
  const currentValue = activeFilters.value[filter.key] ?? 'all'
  if (currentValue === 'all') {
    return filter.allLabel || `All ${filter.label}`
  }
  const match = filter.options.find(opt => opt.value === currentValue)
  return match ? match.label : (filter.allLabel || `All ${filter.label}`)
}

defineExpose({
  clearFilters,
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div>
        <div class="card-title">{{ title }}</div>
        <div v-if="subtitle" style="font-size:12px;color:var(--text3);margin-top:4px;">{{ subtitle }}</div>
      </div>

      <div class="filter-bar" style="margin:0;flex:1;justify-content:flex-end;align-items:center;">
        <input
          class="filter-input"
          :placeholder="searchPlaceholder"
          :value="searchText"
          style="flex:1;max-width:280px;"
          @input="setSearch($event.target.value)"
        />

        <div 
          v-for="filter in filters" 
          :key="filter.key"
          class="custom-table-filter-wrapper"
        >
          <Selection
            :modelValue="getCurrentFilterLabel(filter)"
            :options="getFilterOptionsList(filter)"
            :placeholder="filter.allLabel || `All ${filter.label}`"
            :appendToBody="true"
            @update:modelValue="handleFilterSelection(filter, $event)"
          />
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
            <th v-if="showActions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in pagedRows" :key="row[rowKey]">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row" :value="getRowValue(row, column.key)">
                <span :class="column.valueClass ? column.valueClass(row) : ''">{{ getRowValue(row, column.key) }}</span>
              </slot>
            </td>
            <td v-if="showActions">
              <div class="actions">
                <slot name="actions" :row="row">
                  <button
                    class="action-btn"
                    type="button"
                    :title="actionLabels.view"
                    @click="emitAction('view', row)"
                  >
                    👁
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    :title="actionLabels.edit"
                    @click="emitAction('edit', row)"
                  >
                    ✏️
                  </button>
                  <button
                    class="action-btn danger"
                    type="button"
                    :title="actionLabels.delete"
                    @click="emitAction('delete', row)"
                  >
                    🗑
                  </button>
                </slot>
              </div>
            </td>
          </tr>
          <tr v-if="pagedRows.length === 0">
            <td :colspan="columns.length + (showActions ? 1 : 0)" style="text-align:center;padding:28px 16px;color:var(--text3);">
              No matching records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="padding:14px 16px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
      <span style="font-size:12px;color:var(--text3)">
        Showing {{ startRecord }}-{{ endRecord }} of {{ filteredRows.length }} records
      </span>
      <div style="display:flex;gap:4px;flex-wrap:wrap;">
        <button class="action-btn" type="button" :disabled="currentPage === 1" @click="setPage(currentPage - 1)">‹</button>
        <button
          v-for="page in pageItems"
          :key="page"
          class="action-btn"
          type="button"
          :disabled="typeof page !== 'number'"
          :style="page === currentPage ? 'background:var(--accent);color:white;border-color:var(--accent);' : ''"
          @click="typeof page === 'number' && setPage(page)"
        >
          <span v-if="typeof page === 'number'">{{ page }}</span>
          <span v-else>…</span>
        </button>
        <button class="action-btn" type="button" :disabled="currentPage === totalPages" @click="setPage(currentPage + 1)">›</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── NEW LAYOUT RULES FOR SELECTION MIGRATION ── */
.custom-table-filter-wrapper {
  min-width: 140px;
  max-width: 220px;
}

:deep(.custom-select-trigger) {
  border: 1px solid var(--border-strong, #334155);
  border-radius: 6px;
  padding: 6px 12px;
  height: 34px; /* Matches standard UI filter layouts perfectly */
  background: var(--bg3, #0f172a);
}

:deep(.selected-text),
:deep(.placeholder-text) {
  font-size: 13px;
}
</style>