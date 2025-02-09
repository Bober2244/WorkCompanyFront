<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Создание заявки</h3>
      <form @submit.prevent="submitCreateBid">
        <div class="form-group">
          <label for="dateOfRequest">Дата заявки:</label>
          <input type="date" v-model="newBid.dateOfRequest" required />
        </div>
        <div class="form-group">
          <label for="constructionPeriod">Срок строительства:</label>
          <input type="number" v-model="newBid.constructionPeriod" required />
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-primary">Создать заявку</button>
          <button type="button" class="btn btn-secondary" @click="closeCreateBidModal">Закрыть</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newBid: {
        dateOfRequest: '',
        constructionPeriod: '',
        customerId: localStorage.getItem('userId'),
      },
      customers: [],  // Массив для хранения клиентов
    };
  },
  created() {
    this.fetchCustomers();  // Загружаем список клиентов при создании компонента
  },
  methods: {
    // Функция для загрузки клиентов с сервера
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

    // Функция отправки заявки
    submitCreateBid() {
      const bidDto = {
        dateOfRequest: this.newBid.dateOfRequest,
        constructionPeriod: this.newBid.constructionPeriod,
        customerId: this.newBid.customerId,
      };

      axios.post('https://localhost:7265/Bids', bidDto)
          .then(() => {
            this.$emit('created');
            this.closeCreateBidModal();
          })
          .catch(error => {
            console.error('Ошибка при создании заявки:', error);
            alert("Ошибка сервера или валидации")
          });
    },

    // Функция закрытия модального окна
    closeCreateBidModal() {
      this.$emit('close');
    }
  }
};
</script>

<style >
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 15px;
}

button {
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Стиль для расширенного select */
.wide-select {
  width: 100%;
  height: 40px; /* Увеличивает высоту */
  padding: 10px; /* Увеличивает внутренний отступ */
  font-size: 16px; /* Увеличивает шрифт */
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
