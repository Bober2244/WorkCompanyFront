<template>
  <div class="add-brigade-modal">
    <h3>Добавить бригаду</h3>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Название бригады:</label>
        <input
            type="text"
            id="name"
            v-model="brigadeDto.name"
            class="form-control"
            required
        />
      </div>

      <div class="form-group">
        <label for="workerCount">Количество работников:</label>
        <input
            type="number"
            id="workerCount"
            v-model="brigadeDto.workerCount"
            class="form-control"
            required
            min="1"
        />
      </div>

      <div class="form-actions">
        <div class="buttons-container">
          <button type="submit" class="btn btn-primary">Сохранить</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Отменить</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    close: Function, // Expected event for closing the modal
  },
  data() {
    return {
      brigadeDto: {
        name: "", // Name of the brigade
        workerCount: 1, // Number of workers
        userId: null,
      },
    };
  },
  methods: {
    submitForm() {
      const userId = localStorage.getItem('userId');

      this.brigadeDto.userId = userId;
      // Send data to the server to add the new brigade
      axios
          .post("https://localhost:7265/Brigades", this.brigadeDto)
          .then(() => {
            // Assuming the backend returns the created brigade's location
            alert(`Бригада успешно добавлена!`);
            this.$emit("added"); // Emit event for successful addition
            this.closeModal(); // Close the modal
          })
          .catch(error => {
            console.error("Ошибка при добавлении бригады:", error);
            alert("Произошла ошибка при добавлении бригады.");
          });
    },
    closeModal() {
      this.$emit("close"); // Emit event to close the modal
    },
  },
};
</script>

<style scoped>
.add-brigade-modal {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.buttons-container {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  gap: 10px; /* Add space between buttons */
}

button {
  padding: 8px 15px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: none;
}

.btn-secondary:hover {
  background-color: #ddd;
}
</style>
