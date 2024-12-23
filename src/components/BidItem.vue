<template>
  <div class="bid-card">
    <div class="bid-summary">
      <div>
        <p><strong>Дата заявки:</strong> {{ formatDate(bid.dateOfRequest) }}</p>
        <p><strong>Срок строительства:</strong> {{ bid.constructionPeriod }} месяцев</p>
      </div>
      <button class="action-button delete-button" @click="deleteBid(bid.id)">Удалить</button>
      <button class="action-button reset-button" @click="openModal(bid)">Изменить</button>

      <edit-bid
          :show="isModalOpen"
          :bid="bid"
          @save="handleSave(localBid)"
          @close="closeModal"
      />

      <button class="toggle-button" @click="toggleDetails">
        {{ showDetails ? 'Свернуть' : 'Развернуть' }}
      </button>
    </div>
    <transition>
      <div v-if="showDetails" class="bid-details">
        <h4>Заказы:</h4>
        <ul>
          <li v-for="order in bid.orders" :key="order.id" class="order-item">
            <p><strong>Заказ #{{ order.id }}</strong></p>
            <p><strong>Дата начала:</strong> {{ formatDate(order.startDate) }}</p>
            <p><strong>Дата окончания:</strong> {{ formatDate(order.endDate) }}</p>
            <p :class="`status-${order.workStatus.toLowerCase()}`"><strong>Статус работы:</strong> {{ order.workStatus }}</p>
            <div class="order-actions">
              <button class="action-button" @click="editOrder(order.id)">Изменить</button>
              <button class="action-button delete-button" @click="deleteOrder(order.id)">Удалить</button>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import EditBid from "@/components/EditBid.vue";

export default {
  components: {EditBid},
  props: {
    bid: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isModalOpen: false,
      showDetails: false,
    };
  },
  methods: {
    openModal(bid) {
      this.selectedBid = bid;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    handleSave(updatedBid) {
      console.log('Обновленная заявка:', updatedBid);
      const payload = {
        dateOfRequest: updatedBid.dateOfRequest,
        constructionPeriod: updatedBid.constructionPeriod,
        customerId: updatedBid.customerId,
      };

      axios
          .patch(`https://localhost:7265/Bids/${updatedBid.id}`, payload)
          .then(() => {
            console.log('Изменения успешно сохранены');
            // Закрываем модальное окно после успешного сохранения
            this.closeModal();
          })
          .catch(error => {
            console.error('Ошибка при сохранении изменений:', error);
          });
    },

    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    formatDate(date) {
      if (!date) return 'Дата не указана';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('ru-RU', options);
    },
    editOrder(orderId) {
      // Логика для редактирования заказа
      console.log(`Редактировать заказ с ID: ${orderId}`);
    },
    async deleteOrder(orderId) {
      try {
        await axios.delete(`https://localhost:7265/Orders/${orderId}`);

        this.$emit('order-deleted', orderId);
      } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
      }
    },
    async deleteBid(bidId) {
      try {
        await axios.delete(`https://localhost:7265/Bids/${bidId}`);
        this.bids = this.bids.filter(bid => bid.id !== bidId);
        this.$emit('order-deleted', bidId);
      } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
      }
    },
  },
};
</script>

<style scoped>


.bid-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.bid-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-button {
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.toggle-button:hover {
  background: #5b4bdb;
}

.bid-details {
  margin-top: 16px;
}

.order-item {
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #f9f9f9;
}

.order-item p:first-child {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.order-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.action-button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-button:hover {
  background-color: #ddd;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #e53935;
}
</style>
