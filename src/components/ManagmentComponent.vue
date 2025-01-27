<template>
  <div class="management">
    <h3>Управление бригадами</h3>

    <!-- Кнопка для возвращения назад -->
    <div class="back-button">
      <button @click="goBack">Вернуться назад</button>
    </div>

    <!-- Список бригад -->
    <div class="brigades-list">
      <brigade-item
          v-for="brigade in brigades"
          :key="brigade.id"
          :brigade="brigade"
          @manage="manageBrigade"
          @brigadeDeleted="removeBrigade"
      />
    </div>

    <!-- Кнопка для добавления новой бригады -->
    <div class="add-brigade">
      <button @click="openAddBrigadeModal">Добавить бригаду</button>
    </div>

    <!-- Модальное окно для добавления бригады -->
    <add-brigade
        v-if="isAddBrigadeModalOpen"
        @close="closeAddBrigadeModal"
        @added="loadBrigades"
    />
  </div>
</template>

<script>
import AddBrigade from "@/components/AddBrigade.vue";
import BrigadeItem from "@/components/BrigadeItem.vue";
import axios from "axios";

export default {
  components: {
    AddBrigade,
    BrigadeItem, // Import the new BrigadeItem component
  },
  data() {
    return {
      brigades: [], // Список бригад
      isAddBrigadeModalOpen: false, // Состояние модального окна для добавления бригады
    };
  },
  methods: {
    removeBrigade(id) {
      this.brigades = this.brigades.filter((brigade) => brigade.id !== id);
    },
    loadBrigades() {
      const userId = localStorage.getItem('userId');
      console.log(userId); // Вывод userId, если он сохранён

      axios
          .get(`https://localhost:7265/Brigades/user-brigade/${userId}`)
          .then((response) => {
            this.brigades = [response.data]; // Добавляем в массив, так как возвращается одна бригада
          })
          .catch((error) => {
            console.error("Ошибка при загрузке бригады:", error);
          });
    },
    openAddBrigadeModal() {
      this.isAddBrigadeModalOpen = true;
    },
    closeAddBrigadeModal() {
      this.isAddBrigadeModalOpen = false;
    },
    manageBrigade(brigadeId) {
      // Логика управления бригадой
      console.log("Управление бригадой с ID:", brigadeId);
      // Например, перенаправление на страницу с детальной информацией
      this.$router.push({ name: "brigadeDetail", params: { brigadeId } });
    },
    goBack() {
      this.$router.go(-1); // Или используйте this.$router.back()
    },
  },
  mounted() {
    this.loadBrigades();
  },
};
</script>

<style scoped>
.management {
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
}

.brigades-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.add-brigade {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
