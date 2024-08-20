<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";

const emits = defineEmits(["closeModal", "assignJob"]);

const staffData = ref([]);
const selectedStaff = ref(null);
const remarks = ref("");

const props = defineProps({
  stafss: {
    type: Array,
    default: () => [],
  },
});

const save = () => {
  let Obj = {
    selectedStaff: selectedStaff.value,
    remarks: remarks.value,
  };
  console.log("Selected staff:", Obj);
  emits("assignJob", Obj);
};

const resetForm = () => {
  selectedStaff.value = null;
  emits("closeModal");
};

onMounted(() => {
  staffData.value = props.stafss.map((item) => ({
    id: item.id,
    name: item.name,
  }));
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-combobox
          v-model="selectedStaff"
          :items="staffData"
          :item-value="(item) => item.id"
          :item-title="(item) => item.name"
          label="Select Staff"
          clearable
          required
          dense
          hide-details="auto"
          variant="outlined"
          color="primary"
        >
        </v-combobox>
      </v-col>
      <v-col cols="12">
        <v-textarea
          label="Remarks"
          v-model="remarks"
          clearable
          required
          dense
          hide-details="auto"
          variant="outlined"
          color="primary"
        ></v-textarea>
      </v-col>
      <v-col cols="12" md="12">
        <v-card-actions class="text-right" style="display: flex; justify-content: end">
          <v-btn @click="resetForm" variant="outlined">Close</v-btn>
          <v-btn color="success" variant="outlined" @click="save">Ok</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </div>
</template>
