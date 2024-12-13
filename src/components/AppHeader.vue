<template>
  <header class="header">
    <div class="flex items-center gap-4">
      <router-link to="/home">
        <img src="../assets/img/logo.webp" alt="Logo" class="logo-size cursor-pointer"/>
      </router-link>
      <div>
        <h2 v-if="this.userRole === '0'" class="font-bold text-xl uppercase">Ваша роль: Бригадир</h2>
        <h2 v-if="this.userRole === '1'" class="font-bold text-xl uppercase">Ваша роль: Заказчик</h2>
        <h2 v-if="this.userRole === '2'" class="font-bold text-xl uppercase">Ваша роль: Админ</h2>
        <p class="text-slate-400">Приложение для управления заказами</p>
      </div>
    </div>

    <ul class="flex items-center gap-10">
      <li class="flex items-center gap-3 cursor-pointer" @click="showLogoutModal">
        <img src="/profile.svg" alt="Favorite"/>
        <span>Мой аккаунт</span>
      </li>
    </ul>

    <ModalWindow
        ref="confirmationModal"
        @confirm="logout"
    />
  </header>
</template>

<script>
import ModalWindow from "@/components/ModalWindow.vue";
import axios from "axios";
import {mapActions} from "vuex";

export default {
  components: {
    ModalWindow,
  },
  data() {
    return {
      userRole: localStorage.getItem("userRole"),
    };
  },
  methods: {
    showLogoutModal() {
      this.$refs.confirmationModal.openModal();
    },
    ...mapActions(["logout"]),
    async logout() {
      try {
        await axios.post("https://localhost:7265/Auth/logout");

        this.logout();
        localStorage.removeItem("jwt");
        this.$router.push("/sign-in");

      } catch (error) {
        console.error("Ошибка при выходе из аккаунта:", error);
      }
    },
  },
};
</script>

<style scoped>
.logo-size {
  width: 70px; /* Adjust size as needed */
  height: auto; /* Maintain aspect ratio */
}
</style>
