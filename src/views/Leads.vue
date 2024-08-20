<script setup lang="ts">
import { ref, shallowRef, onMounted } from "vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import DataTable from "@/components/common/dataTable.vue";
import ImportData from "@/components/common/importData.vue";
import Lead from "@/components/form/Lead.vue";
import AssignJobs from "@/components/staffs/AssignJobs.vue";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

// for api
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";
const baseUrl = `${import.meta.env.VITE_API_URL}`;
// for api
const isImportData = ref(false);
const bindDataArr = ref([]);
const isLeadForm = ref(false);
const isLeadFormTitle = ref("");
const editData = ref([]);
const isEdit = ref(false);
const snackbar = ref(false);
const msgText = ref("");
const isJobassign = ref(false);
const staffs = ref([]);
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

const selectedDataToassign = ref([]);
const isSelectedData = (data) => {
  selectedDataToassign.value = data;
  console.log(selectedDataToassign.value);
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

const saveData = async (data) => {
  try {
    const response = await fetchWrapper.post(`${baseUrl}/leads/insert.php`, data);
    if (response.status == 201) {
      msgText.value = `Saved Successfully !`;
      snackbar.value = true;
      getLeads();
      isLeadForm.value = false;
    } else {
      throw new Error(response.status || "error...");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};
const updateData = async (data) => {
  try {
    const response = await fetchWrapper.post(`${baseUrl}/leads/update.php`, data);
    if (response.status == 200) {
      getLeads();
      isLeadForm.value = false;
      msgText.value = `Updated Successfully !`;
      snackbar.value = true;
    } else {
      throw new Error(response.status || "error...");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};
const editItem = async (data) => {
  let leadsId = { id: data?.id };
  isLeadFormTitle.value = "Edit ";
  try {
    const response = await fetchWrapper.post(`${baseUrl}/leads/editLeads.php`, leadsId);
    if (response.status == 200) {
      editData.value = response;
      isLeadForm.value = true;
      isEdit.value = true;
    } else {
      throw new Error(response.status || "error...");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const deleteItem = async (data) => {
  try {
    const response = await fetchWrapper.post(`${baseUrl}/leads/insert.php`, data);
    if (response.status == 201) {
      getLeads();
      isLeadForm.value = false;
    } else {
      throw new Error(response.status || "error...");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};
const assignJob = () => {
  isJobassign.value = true;
};

const getLeads = async () => {
  try {
    const leads = await fetchWrapper.get(`${baseUrl}/leads/select.php`);
    if (leads.length > 0) {
      datas.value = leads;
    } else {
      datas.value = [];
    }
  } catch (error) {
    throw error;
  }
};
const getStaffs = async () => {
  try {
    const staffData = await fetchWrapper.get(`${baseUrl}/staffs/select.php`);
    if (staffData.length > 0) {
      staffs.value = staffData;
    } else {
      datas.value = [];
    }
  } catch (error) {
    throw error;
  }
};
const generateUniqueLeadId = () => {
  // Get the current timestamp (in milliseconds)
  let timestamp = Date.now();

  // Generate a random number between 1 and 999999
  let randomNum = Math.floor(Math.random() * 1000000) + 1;

  // Combine timestamp and random number to create a unique ID
  return `${timestamp}${randomNum}`;
};
const addJobToStaff = async (formData) => {
  const ids = selectedDataToassign.value.map((item) => item.id);
  let requestData = {
    lead_id: ids, // Integer: ID of the lead
    staff_id: formData.selectedStaff.id, // Integer: ID of the job
    assigned_by: authStore.user?.data?.name + " - " + authStore.user?.data?.usertype, // Integer: ID of the user assigning the job
    status: "Assigned", // String: Status of the assignment (e.g., 'assigned', 'in progress', etc.)
    notes: formData.remarks, // String: Additional notes or comments (optional)
  };

  try {
    const response = await fetchWrapper.post(
      `${baseUrl}/leads/assignJob.php`,
      requestData
    );

    if (response[0].status == 201) {
      getLeads();
      isJobassign.value = false;
    } else {
      throw new Error(response.status || "error...");
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

onMounted(() => {
  getLeads();
  getStaffs();
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
            @editItem="editItem"
            @deleteItem="deleteItem"
            @assignJob="assignJob"
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
            @closeLeadForm="
              isLeadForm = false;
              isEdit = false;
            "
            @saveData="saveData"
            @updateData="updateData"
            :editData="editData"
            :isEdit="isEdit"
            :statusObj="datas.map((item) => item.status)"
          />
        </v-card-text>
        <!-- :statusObj="datas.map((item) => item.status)" -->
      </v-card>
    </v-dialog>

    <v-dialog v-model="isJobassign" max-width="800">
      <v-card class="text-center">
        <v-card-title class="text-center">Assign Job</v-card-title>

        <v-card-text>
          <AssignJobs
            :stafss="staffs"
            @assignJob="addJobToStaff"
            @closeModal="isJobassign = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" color="success" position="top, end">
      {{ msgText }}

      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </section>
</template>
