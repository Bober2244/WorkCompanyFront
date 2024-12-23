<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h3>Изменить заявку</h3>
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <label for="dateOfRequest">Дата заявки:</label>
          <input type="date" v-model="localBid.dateOfRequest" required />
        </div>
        <div class="form-group">
          <label for="constructionPeriod">Срок строительства:</label>
          <input type="number" v-model="localBid.constructionPeriod" required />
        </div>
        <div class="form-group">
          <label for="customerId">Заказчик:</label>
          <select v-model="localBid.customerId" required class="wide-select">
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.fullName }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="action-button save-button" @click="saveChanges">Сохранить</button>
          <button
              type="button"
              class="action-button cancel-button"
              @click="closeModal"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    bid: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      customers: [],
      localBid: { ...this.bid }, // Создаем локальную копию заявки для редактирования
    };
  },
  created() {
    console.log('bid prop:', this.bid);
    this.fetchCustomers();  // Загружаем список клиентов при создании компонента
  },
  methods: {
    fetchCustomers() {
      axios.get('https://localhost:7265/Customers')
          .then(response => {
            this.customers = response.data;

            console.log(this.customers);
          })
          .catch(error => {
            console.error("Ошибка при загрузке клиентов:", error);
          });

    },
    saveChanges() {
      if (!this.localBid || !this.localBid.dateOfRequest) {
        console.error('Ошибка: локальная заявка не имеет необходимых данных.');
        return;
      }
      this.$emit('save', this.localBid); // Передаём обновлённые данные заявки
      this.closeModal();
    },

    closeModal() {
      this.$emit('close'); // Сообщаем родителю, что окно нужно закрыть
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.save-button {
  background-color: #28a745;
  color: #fff;
}
.cancel-button {
  background-color: #dc3545;
  color: #fff;
}
</style>
