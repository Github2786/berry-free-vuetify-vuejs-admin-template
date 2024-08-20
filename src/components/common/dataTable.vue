<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { SearchIcon, UserPlusIcon } from "vue-tabler-icons";
import { toPascalCase, getStatusColor } from "@/common/general.js";
const emits = defineEmits([
  "showLeadForm",
  "isSelectedData",
  "importMethod",
  "exportMethod",
  "tablerefresh",
  "editItem",
  "deleteItem",
  "assignJob",
]);
const props = defineProps({
  title: String,
  headers: {
    type: [Object, Array],
    default: () => [],
  },
  data: {
    type: [Object, Array],
    default: () => [],
  },
  options: {
    type: [Object, Array],
    default: () => [],
  },
  others: {
    type: [Object, Array],
    default: () => [],
  },
});

const selected = ref([]);
const isloading = ref(false);
const search = ref("");
const filteredData = computed(() => {
  if (!search.value) return props.data;

  return props.data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const formatedDate = () => {
  let date = new Date();

  // Extract the day, month, and year
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  let year = date.getFullYear();

  // Format the date as dd/mm/yyyy
  return `${day}/${month}/${year}`;
};
const importTrigger = () => {
  emits("importMethod");
};
const exportTrigger = () => {
  if (selected.value.length > 0) {
    emits("exportMethod", selected.value);
  } else {
    emits("exportMethod", filteredData.value);
  }
};

const onShowLeadForm = () => {
  emits("showLeadForm", "Add New");
};

const refresh = () => {
  emits("tablerefresh");
};
const editItem = (item: DataItem) => emits("editItem", item);
const assignJob = () => {
  if (selected.value.length > 0) {
    emits("assignJob");
  } else {
    alert("please select a lead then proceed !");
  }
};

const deleteItem = (item: DataItem) => emits("deleteItem", item);

watch(
  () => selected.value,
  (newValue, oldValue) => {
    console.log(selected.value);
    emits("isSelectedData", newValue);
  }
);
</script>

<template>
  <section>
    <v-card-title class="d-flex align-center pe-2">
      <v-btn size="small" color="success" @click="importTrigger()">
        <DownloadIcon class="icon" size="15" /> Import
      </v-btn>
      <v-btn size="small" color="success" class="ml-2" @click="exportTrigger()">
        <UploadIcon class="icon" size="15" /> Export
      </v-btn>
      <v-spacer />
      <v-spacer />
      <v-btn
        size="small"
        class="mr-2 ml-2"
        color="warning"
        title="Assign Job "
        @click="assignJob()"
      >
        <UserPlusIcon class="icon" size="15" />
      </v-btn>
      <v-btn size="small" color="success" title="Add New" @click="onShowLeadForm()">
        <PlusIcon class="icon" size="15" />
      </v-btn>
      <v-btn size="small" color="info" class="mr-2 ml-2" title="Refresh">
        <RefreshIcon class="icon" size="15" @click="refresh()" :loading="isloading" />
      </v-btn>
      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        :prepend-inner-icon="`tabler-search`"
        variant="solo-filled"
        flat
        Icon
        hide-details
        single-line
      >
        <template #prepend-inner>
          <SearchIcon class="icon" size="15" />
        </template>
      </v-text-field>
    </v-card-title>
    <v-data-table
      search
      v-model="selected"
      :headers="props.headers"
      :items="filteredData"
      :items-per-page="props.options.itemsPerPage"
      return-object
      :show-select="props.options.isShowSelect"
    >
      <template #item.name="{ item }">
        <div class="d-flex flex-column">
          <span>{{ item.name }}</span>
          <v-chip size="x-small" color="primary">
            {{ item.date?.split(" ")[0] || formatedDate() }}
          </v-chip>
        </div>
      </template>
      <template #item.status="{ item }">
        <v-chip size="small" :color="getStatusColor(item.status)">
          {{ toPascalCase(item.status) }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          :disabled="item.status != `pending`"
          size="x-small"
          color="success"
          @click="editItem(item)"
        >
          <BallpenIcon class="icon" size="15" />
        </v-btn>
        <v-btn
          :disabled="item.status != `pending`"
          size="x-small"
          color="error"
          @click="deleteItem(item)"
          class="ml-2"
        >
          <TrashIcon class="icon" size="15" />
        </v-btn>
      </template>
    </v-data-table>
  </section>
</template>
