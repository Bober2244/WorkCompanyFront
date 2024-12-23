<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import AdminScreen from "./Screens/AdminScreen.vue";
import CustomerScreen from "./Screens/CustomerScreen.vue";
import BrigadeControllerScreen from "./Screens/BrigadeControllerScreen.vue";
import AppHeader from "@/components/AppHeader.vue";

const store = useStore();

const userRole = computed(() => store.getters.getUserRole);
const userId = computed(() => store.getters.getUserId);

// Функция для проверки первой загрузки
const handleFirstLoad = () => {
  const isFirstLoad = localStorage.getItem("isFirstLoad");
  if (!isFirstLoad) {
    localStorage.setItem("isFirstLoad", "true");
    location.reload(); // Перезагружаем страницу
  }
};

onMounted(() => {
  handleFirstLoad();
  console.log("UserRole:", userRole.value);
  console.log("UserId:", userId.value);
});
</script>

<template>
  <AppHeader />
  <div>
    <div v-if="userRole === '2'">
    <AdminScreen />
  </div>
  <div v-else-if="userRole === '1'">
  <CustomerScreen />
  </div>
  <div v-else-if="userRole === '0'">
  <BrigadeControllerScreen />
  </div>
  </div>
</template>

<style scoped>
</style>
