<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h3>Изменить статус заказа</h3>
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <label for="workStatus">Статус работы:</label>
          <select v-model="localOrder.workStatus" required>
            <option value="В работе">В работе</option>
            <option value="Готово">Готово</option>
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
  },
  data() {
    return {
      localOrder: { ...this.order }, // Локальная копия заказа для редактирования
    };
  },
  methods: {
    saveChanges() {
      if (!this.localOrder.workStatus) {
        console.error("Ошибка: статус работы не выбран.");
        return;
      }
      this.$emit("save", this.localOrder); // Отправляем обновленный статус родителю
      this.closeModal();
    },
    closeModal() {
      this.$emit("close"); // Сообщаем родителю о закрытии модального окна
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
  width: 100%;
  height: 40px;
  font-size: 16px;
  padding: 5px;
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
