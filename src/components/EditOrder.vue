<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h3>Изменить заказ</h3>
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <p>{{ localOrder.id }}</p>
          <label for="startDate">Дата начала:</label>
          <input type="date" v-model="localOrder.startDate" required />
        </div>

        <div class="form-group">
          <label for="endDate">Дата окончания:</label>
          <input type="date" v-model="localOrder.endDate" required />
        </div>
        <div class="form-group">
          <label for="workStatus">Статус работы:</label>
          <select v-model="localOrder.workStatus" required>
            <option value="Создан">Создан</option>
            <option value="Откликнулся">Откликнулся</option>
            <option value="В работе">В работе</option>
            <option value="Готово">Готово</option>
          </select>
        </div>
        <div class="form-group">
          <label for="bidId">Заявка:</label>
          <select v-model="localOrder.bidId" required>
            <option
                v-for="bid in bids"
                :key="bid.id"
                :value="bid.id"
            >
              {{ bid.name || `Заявка #${bid.id}` }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="action-button save-button">Сохранить</button>
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
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
    bids: {
      type: Array,
      required: true, // Массив заявок передается из родительского компонента
    },
  },
  data() {
    return {
      localOrder: { ...this.order }, // Локальная копия заказа для редактирования
    };
  },
  methods: {
    saveChanges() {
      console.log("dasdasdasdas", this.localOrder.id);
      if (!this.localOrder.startDate || !this.localOrder.endDate || !this.localOrder.workStatus || !this.localOrder.bidId) {
        console.error('Ошибка: не заполнены все обязательные поля.');
        return;
      }
      this.$emit('save', this.localOrder); // Отправляем обновленный заказ родителю
      this.closeModal();
    },
    closeModal() {
      this.$emit('close'); // Сообщаем родителю о закрытии модального окна
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
.form-group select {
  width: 100%; /* Увеличиваем ширину */
  height: 40px; /* Увеличиваем высоту */
  font-size: 16px; /* Увеличиваем размер шрифта */
  padding: 5px; /* Добавляем отступы */
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
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

