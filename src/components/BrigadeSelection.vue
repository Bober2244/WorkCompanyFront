<template>
  <div class="brigade-selection">
    <h3>Выберите бригаду для заказа</h3>
    <select v-model="selectedBrigadeId" class="brigade-select">
      <option value="" disabled>Выберите бригаду</option>
      <option v-for="brigade in brigades" :key="brigade.id" :value="brigade.id">
        {{ brigade.name }}
      </option>
    </select>
    <div class="actions">
      <button @click="submitResponse">Откликнуться</button>
      <router-link to="/home" class="cancel">Отмена</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      brigades: [],
      selectedBrigadeId: null,
      orderId: this.$route.query.orderId, // Получение orderId из query параметра
    };
  },
  mounted() {
    if (this.$route.query.brigades) {
      this.brigades = JSON.parse(this.$route.query.brigades);
    }
  },
  methods: {
    async submitResponse() {
      if (!this.selectedBrigadeId) {
        alert("Пожалуйста, выберите бригаду.");
        return;
      }

      try {
        await axios.post(
            `https://localhost:7265/orders/${this.orderId}/apply`,
            Number(this.selectedBrigadeId), // отправляем только brigadeId как число
            {
              headers: { "Content-Type": "application/json" },
            }
        );
        alert("Бригада успешно откликнулась на заказ");
        this.$router.push('/home');
      } catch (error) {
        console.error("Ошибка при отклике:", error.response);
        alert("Не удалось откликнуться на заказ.");
      }
    },

  },
};



</script>

<style scoped>
/* Стили для страницы выбора бригады */
.brigade-selection {
  padding: 20px;
  text-align: center;
}

.brigade-select {
  width: 300px;
  padding: 10px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.actions {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.cancel {
  margin-left: 10px;
  color: #dc3545;
}
</style>
