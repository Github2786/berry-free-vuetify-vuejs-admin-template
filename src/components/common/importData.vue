<script setup>
import { ref, defineEmits } from "vue";
import * as XLSX from "xlsx";
import Papa from "papaparse";
const emits = defineEmits(["bindData"]);

const jsonData = ref([]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileType = file.type;

  if (fileType.includes("sheet")) {
    parseXLSX(file);
  } else if (fileType.includes("csv")) {
    parseCSV(file);
  } else {
    console.error("Unsupported file type");
  }
};

const parseXLSX = (file) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    jsonData.value = json;
    console.log(jsonData.value);
    emits("bindData", jsonData.value);
  };

  reader.readAsArrayBuffer(file);
};

const parseCSV = (file) => {
  Papa.parse(file, {
    complete: (results) => {
      jsonData.value = results.data;
      emits("bindData", jsonData.value);
    },
    header: true, // Set this to true if your CSV has headers
  });
};
</script>
<template>
  <section>
    <div>
      <input type="file" @change="handleFileUpload" />
      <!-- <pre v-if="jsonData.length > 0">{{ jsonData }}</pre> -->
    </div>
  </section>
</template>
