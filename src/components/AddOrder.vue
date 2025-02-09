<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Создать заказ</h2>
      <form @submit.prevent="createOrder">
        <!-- Дата начала -->
        <div class="form-group">
          <label for="startDate">Дата начала:</label>
          <input type="date" v-model="newOrder.startDate" required />
        </div>
        <!-- Дата окончания -->
        <div class="form-group">
          <label for="endDate">Дата окончания:</label>
          <input type="date" v-model="newOrder.endDate" required />
        </div>
        <!-- Статус -->
        <div class="form-group">
          <label for="workStatus">Статус работы:</label>
          <select v-model="newOrder.workStatus" required>
            <option value="В работе">В работе</option>
            <option value="Готово">Готово</option>
          </select>
        </div>
        <!-- Привязка к заявке -->
        <div class="form-group">
          <label for="bidId">Заявка:</label>
          <select v-model="newOrder.bidId" required>
            <option v-for="bid in bids" :key="bid.id" :value="bid.id">
              {{ bid.dateOfRequest }} ({{bid.constructionPeriod}} дней)
            </option>
          </select>
        </div>
        <!-- Кнопки -->
        <div class="form-buttons">
          <button type="submit" class="btn">Сохранить</button>
          <button type="button" class="btn cancel" @click="$emit('close')">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bids: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      newOrder: {
        startDate: '',
        endDate: '',
        workStatus: 'Planned',
        bidId: '',
      },
    };
  },
  methods: {
    createOrder() {
      const orderData = { ...this.newOrder };
      this.$emit('created', orderData); // Отправить данные в родительский компонент
      this.$emit('close'); // Закрыть модальное окно
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  background-color: #6c5ce7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn.cancel {
  background-color: #d63031;
}

.btn:hover {
  opacity: 0.9;
}
</style>
