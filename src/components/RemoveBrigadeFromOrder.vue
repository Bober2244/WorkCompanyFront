<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <h3>Удаление бригады из заказа</h3>
      <form @submit.prevent="removeBrigade">
        <div class="form-group">
          <label for="brigadeSelect">Выберите бригаду для удаления:</label>
          <select
              id="brigadeSelect"
              v-model="selectedBrigadeId"
              required
              class="form-select"
          >
            <option disabled value="">Выберите бригаду</option>
            <option
                v-for="brigadeOrder in brigadeOrders"
                :key="brigadeOrder.id"
                :value="brigadeOrder.id"
            >
              {{ brigadeOrder.brigade.name }} ({{ brigadeOrder.workStatus }})
            </option>
          </select>
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="form-actions">
          <button
              type="submit"
              class="action-button remove-button"
              :disabled="!selectedBrigadeId || isLoading"
          >
            <span v-if="isLoading">Удаление...</span>
            <span v-else>Удалить бригаду</span>
          </button>
          <button
              type="button"
              class="action-button cancel-button"
              @click="closeModal"
              :disabled="isLoading"
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
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      brigadeOrders: [],
      selectedBrigadeId: '',
      isLoading: false,
      error: null
    };
  },
  methods: {
    async loadBrigadeOrders() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(`https://localhost:7265/BrigadeOrders/brigade-orders/${this.order.id}`);
        this.brigadeOrders = response.data;
      } catch (err) {
        this.error = 'Не удалось загрузить список бригад';
        console.error('Ошибка при загрузке бригад:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async removeBrigade() {
      if (!this.selectedBrigadeId) {
        this.error = 'Выберите бригаду для удаления';
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.delete(
            `https://localhost:7265/BrigadeOrders/${this.selectedBrigadeId}`
        );

        if (response.status === 200) {
          this.$emit('removed', {
            orderId: this.order.id,
            brigadeOrderId: this.selectedBrigadeId
          });
          this.closeModal();
          window.location.reload();
        } else {
          this.closeModal();
          window.location.reload();
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Ошибка при удалении бригады';
        console.error('Ошибка:', err);
      } finally {
        this.isLoading = false;
      }
    },

    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.selectedBrigadeId = '';
      this.error = null;
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadBrigadeOrders();
        } else {
          this.resetForm();
        }
      }
    }
  }
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
.form-select {
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
  font-size: 14px;
}
.remove-button {
  background-color: #dc3545;
  color: #fff;
}
.remove-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.cancel-button {
  background-color: #6c757d;
  color: #fff;
}
.cancel-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.error-message {
  color: #dc3545;
  margin-top: 10px;
  text-align: center;
}
</style>