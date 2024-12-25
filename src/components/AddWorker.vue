<template>
  <div class="add-worker-modal">
    <h3>Добавить работника</h3>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="fullName">ФИО:</label>
        <input
            type="text"
            id="fullName"
            v-model="workerDto.fullName"
            class="form-control"
            required
        />
      </div>

      <div class="form-group">
        <label for="position">Должность:</label>
        <input
            type="text"
            id="position"
            v-model="workerDto.position"
            class="form-control"
            required
        />
      </div>

      <div class="form-group">
        <label for="phoneNumber">Телефон:</label>
        <input
            type="tel"
            id="phoneNumber"
            v-model="workerDto.phoneNumber"
            class="form-control"
            required
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
            type="email"
            id="email"
            v-model="workerDto.email"
            class="form-control"
            required
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
    brigadeId: Number, // ID бригады для привязки работника
    close: Function, // Функция для закрытия модального окна
  },
  data() {
    return {
      workerDto: {
        fullName: "",
        position: "",
        phoneNumber: "",
        email: "",
        brigadeId: this.brigadeId, // Связь с бригадой
      },
    };
  },
  methods: {
    submitForm() {
      axios
          .post("https://localhost:7265/Workers", this.workerDto)
          .then(() => {
            alert("Работник успешно добавлен!");
            this.$emit("workerAdded"); // Сообщить родителю о добавлении работника
            this.closeModal(); // Закрыть модальное окно
          })
          .catch((error) => {
            console.error("Ошибка при добавлении работника:", error);
            alert("Произошла ошибка при добавлении работника.");
          });
    },
    closeModal() {
      this.$emit("close"); // Сообщить родителю о закрытии модального окна
    },
  },
};
</script>

<style scoped>
.add-worker-modal {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  width: 400px;
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
  justify-content: flex-end;
  gap: 10px;
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
