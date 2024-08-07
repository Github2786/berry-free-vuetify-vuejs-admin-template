<script setup>
import { ref, onMounted, defineEmits, defineExpose, defineProps } from "vue";
const emits = defineEmits(["showLeadForm", "saveData", "importMethod", "closeLeadForm"]);

const props = defineProps({
  statusObj: {
    type: [Object, Array],
    default: () => [],
  },
});

const name = ref("");
const mobile = ref("");
const email = ref("");
const plot = ref("");
const district = ref("");
const status = ref(null);

const statusOptions = ref([]);

const rules = {
  required: (value) => !!value || "Required.",
  email: (value) => {
    const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
    return pattern.test(value) || "Invalid e-mail.";
  },
  phone: (value) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(value) || "Invalid phone number.";
  },
};

const Save = () => {
  if (
    name.value &&
    mobile.value &&
    email.value &&
    plot.value &&
    district.value &&
    status.value
  ) {
    let formObj = {
      name: name.value,
      mobile: mobile.value,
      email: email.value,
      plot: plot.value,
      district: district.value,
      status: status.value,
    };

    emits("saveData", formObj);
  } else {
    alert("Please fill out all required fields.");
  }
};

const resetForm = () => {
  name.value = "";
  mobile.value = "";
  email.value = "";
  plot.value = "";
  district.value = "";
  status.value = null;
  emits("closeLeadForm");
};

onMounted(() => {
  statusOptions.value = [...new Set(props.statusObj)];
});
</script>
<template>
  <v-container>
    <v-form v-model="valid" ref="form">
      <v-row>
        <!-- {{ props.statusObj }} -->
        <v-col cols="12" md="6">
          <v-text-field
            class=""
            v-model.trim="name"
            label="Name"
            required
            dense
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="primary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            type="number"
            v-model.trim="mobile"
            label="Mobile"
            required
            dense
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="primary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model.trim="email"
            label="Email"
            required
            dense
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="primary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model.trim="plot"
            label="Plot Name"
            required
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="primary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model.trim="district"
            label="District"
            required
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="primary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-combobox
            v-model.trim="status"
            clearable
            label="Combobox"
            :items="statusOptions"
            required
            dense
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="primary"
          ></v-combobox>
        </v-col>
        <v-col cols="12" md="12">
          <v-card-actions class="text-right" style="display: flex; justify-content: end">
            <v-btn @click="resetForm" variant="outlined">close</v-btn>
            <v-btn color="success" variant="outlined" @click="Save()">Save</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
