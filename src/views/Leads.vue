<script setup lang="ts">
import { ref, shallowRef, onMounted } from "vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import DataTable from "@/components/common/dataTable.vue";
import ImportData from "@/components/common/importData.vue";
import Lead from "@/components/form/Lead.vue";
import * as XLSX from "xlsx";
import Papa from "papaparse";

// for api
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
const baseUrl = `${import.meta.env.VITE_API_URL}/leads`;
// for api
const isImportData = ref(false);
const bindDataArr = ref([]);
const isLeadForm = ref(false);
const isLeadFormTitle = ref("");
const headers = ref([
  { title: "Name", align: "start", key: "name" },
  { title: "Mobile", align: "start", key: "mobile" },
  { title: "Email ", align: "start", key: "email" },
  { title: "Plot Name", align: "start", key: "plot" },
  { title: "District", align: "start", key: "district" },
  { title: "Status", align: "center", key: "status" },
  { title: "Actions", align: "center", key: "actions" },
]);
const options = ref({ itemsPerPage: 10, isShowSelect: true, key: "name" });
const datas = ref([]);

const isSelectedData = (data) => {
  console.log(data);
};

const importCallMethod = () => {
  isImportData.value = true;
};
const exportCallMethod = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "data.xlsx");
};

const bindImportData = (data) => {
  if (data) bindDataArr.value = data;
};
const proceedToBindData = () => {
  datas.value.push(...bindDataArr.value);
  isImportData.value = false;
};

const showLeadForm = (val) => {
  isLeadFormTitle.value = val;
  isLeadForm.value = true;
};

const saveData = (data) => {
  console.log(data);
};

const getLeads = async () => {
  try {
    const leads = await fetchWrapper.get(`${baseUrl}/select.php`);
    if (leads.length > 0) {
      datas.value = leads;
    } else {
      datas.value = [];
    }
  } catch (error) {
    throw error;
  }
};
onMounted(() => {
  getLeads();
});
</script>

<template>
  <section>
    <v-row>
      <v-col cols="12">
        <UiParentCard title="Leads">
          <DataTable
            :headers="headers"
            :data="datas"
            :options="options"
            @isSelectedData="isSelectedData"
            @importMethod="importCallMethod"
            @exportMethod="exportCallMethod"
            @showLeadForm="showLeadForm"
            @tablerefresh="getLeads"
          />
        </UiParentCard>
      </v-col>
    </v-row>

    <v-dialog v-model="isImportData" max-width="500">
      <v-card class="text-center">
        <v-card-title class="text-center">Import CSV / XLSX</v-card-title>
        <v-card-text>
          <ImportData @bindData="bindImportData" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="isImportData = false">close</v-btn>
          <v-btn color="success" @click="proceedToBindData()">Proceed</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isLeadForm" max-width="800">
      <v-card class="text-center">
        <v-card-title class="text-center">{{ isLeadFormTitle }} Leads</v-card-title>
        <!-- <v-btn
          class="close-popup"
          icon="tabler-x"
          color="black"
          size="x-small"
          elevation="0"
        /> -->
        <v-card-text>
          <Lead
            @closeLeadForm="isLeadForm = false"
            @saveData="saveData"
            :statusObj="datas.map((item) => item.status)"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
