<!-- BrigadeItem.vue -->
<template>
  <div class="brigade-item">
    <p><strong>{{ brigade.name }}</strong></p>
    <p>Количество работников: {{ brigade.workerCount }}</p>
    <button @click="navigateToManagement">Управлять</button>
    <button @click="deleteBrigade" :disabled="isDeleting">
      {{ isDeleting ? "Удаление..." : "Удалить" }}
    </button>

  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    brigade: Object, // Данные бригады, переданные через props
  },
  data() {
    return {
      isDeleting: false, // Состояние для кнопки удаления
    };
  },
  methods: {
    navigateToManagement() {
      // Переход на страницу управления бригадой
      this.$router.push({name: "brigadeDetail", params: {id: this.brigade.id}});
    },
    async deleteBrigade() {
      if (confirm(`Вы уверены, что хотите удалить бригаду "${this.brigade.name}"?`)) {
        this.isDeleting = true; // Устанавливаем состояние загрузки
        try {
          // Выполнение DELETE-запроса к серверу
          await axios.delete(`https://localhost:7265/Brigades/${this.brigade.id}`);
          this.$emit("brigadeDeleted", this.brigade.id); // Сообщаем родителю об удалении
          alert("Бригада успешно удалена!");
        } catch (error) {
          console.error("Ошибка при удалении бригады:", error);
          alert("Не удалось удалить бригаду. Попробуйте снова.");
        } finally {
          this.isDeleting = false; // Сбрасываем состояние загрузки
        }
      }
    },
  },
};
</script>

<style scoped>
.brigade-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brigade-item p {
  margin: 0;
}

button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
