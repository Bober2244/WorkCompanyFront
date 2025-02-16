<template>
  <div class="brigade-management">
    <h3>Управление бригадой</h3>
    <p><strong>Название бригады:</strong> {{ brigade.name }}</p>
    <p><strong>Количество работников:</strong> {{ brigade.workerCount }}</p>
    <p><strong>Список работников:</strong></p>
    <ul v-if="brigade.workers && brigade.workers.length > 0">
      <li v-for="worker in brigade.workers" :key="worker.id">
        {{ worker.fullName }} ({{ worker.position }})
      </li>
    </ul>
    <p v-else>В бригаде нет работников.</p>



    <div class="actions">
      <button @click="goBack">Вернуться назад</button>
      <button
          v-if="countIsNormal"
          @click="toggleAddWorkerModal"
      >
        Добавить работника
      </button>
      <!-- Удаление работника -->
      <div v-if="brigade.workers && brigade.workers.length > 0" class="delete-worker">
        <label for="worker-select">Выберите работника для удаления:</label>
        <select id="worker-select" v-model="selectedWorkerId" class="form-control">
          <option v-for="worker in brigade.workers" :value="worker.id" :key="worker.id">
            {{ worker.fullName }}
          </option>
        </select>
        <button @click="deleteWorker" :disabled="!selectedWorkerId" class="btn btn-danger">
          Удалить работника
        </button>
      </div>
    </div>

    <add-worker
        v-if="showAddWorkerModal"
        :brigade-id="brigade.id"
        @close="toggleAddWorkerModal"
        @workerAdded="loadBrigade"
    />
  </div>
</template>

<script>
import axios from "axios";
import AddWorker from "@/components/AddWorker.vue";

export default {
  components: {AddWorker},
  props: {
    id: Number, // ID бригады, переданный через маршруты
  },
  data() {
    return {
      showAddWorkerModal: false,
      brigade: {}, // Данные бригады
      selectedWorkerId: null,
      countIsNormal: true,
    };
  },
  methods: {
    deleteWorker() {
      if (!this.selectedWorkerId) return;

      const workerId = this.selectedWorkerId;
      axios
          .delete(`https://localhost:7265/Workers/${workerId}`)
          .then(() => {
            alert("Работник успешно удален.");
            this.loadBrigade(); // Обновляем данные бригады
          })
          .catch((error) => {
            console.error("Ошибка при удалении работника:", error);
            alert("Произошла ошибка при удалении работника.");
          });
    },
    toggleAddWorkerModal() {
      this.showAddWorkerModal = !this.showAddWorkerModal;
    },
    loadBrigade() {
      axios
          .get(`https://localhost:7265/Brigades/${this.id}`)
          .then((response) => {
            this.brigade = response.data;
            this.countIsNormal = this.brigade.workers.length < this.brigade.workerCount;
            console.log("Dsa", this.brigade);
          })
          .catch((error) => {
            console.error("Ошибка при загрузке данных бригады:", error);
          });
    },
    goBack() {
      this.$router.back();
    },
  },
  mounted() {
    this.loadBrigade();
  },
};
</script>

<style scoped>
.brigade-management {
  padding: 20px;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
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
