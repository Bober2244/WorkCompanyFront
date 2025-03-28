<template>
  <div class="bid-card">
    <div class="bid-summary">
      <div>
        <p><strong>Название:</strong> {{ bid?.objectName || 'Не указано' }}</p>
        <p><strong>Дата заявки:</strong> {{ bid?.dateOfRequest || 'Не указано' }}</p>
        <p><strong>Срок строительства:</strong> {{ bid?.constructionPeriod || 'Не указано' }} дней</p>

      </div>
      <button
          class="action-button delete-button"
          v-if="bid.orders.length === 0"
          @click="deleteBid(bid.id)"
      >
        Удалить
      </button>
      <button
          class="action-button reset-button"
          v-if="bid.orders.length === 0"
          @click="openModal(bid)"
      >
        Изменить
      </button>

      <edit-bid
          :show="isModalOpen"
          :bid="selectedBid"
          @save="handleSave"
          @close="closeModal"
      />


      <button class="toggle-button" @click="toggleDetails">
        {{ showDetails ? 'Свернуть' : 'Развернуть' }}
      </button>
    </div>
    <transition>
      <div v-if="showDetails" class="bid-details">
        <h4>Сформирован заказ:</h4>
        <ul>
          <li v-for="order in bid.orders" :key="order.id" class="order-item">
            <p><strong>Заказ #{{ order.id }}</strong></p>
            <p><strong>Объект: </strong>{{ bid.objectName }}</p>
            <p><strong>Дата начала:</strong> {{ formatDate(order.startDate) }}</p>
            <p><strong>Дата окончания:</strong> {{ formatDate(order.endDate) }}</p>
            <p :class="`status-${order.workStatus.toLowerCase()}`"><strong>Статус работы:</strong> {{
                order.workStatus
              }}</p>
            <progress-bar
                :progress="workProgress"
            />
            <p><strong>Откликнувшиеся бригады:</strong></p>
            <ul>
              <li v-for="brigade in order.brigadeOrders" :key="brigade.id">
                {{ brigade.brigade.name }}
              </li>
            </ul>
            <div class="order-actions" v-if="order.workStatus !== 'Готово'">
              <button
                  v-if="role !== '1'"
                  class="action-button"
                  @click="openOrderModal(order)"
              >
                Изменить
              </button>
              <button
                  v-if="role !== '1'"
                  class="action-button delete-button"
                  @click="deleteOrder(order.id)"
              >
                Удалить
              </button>
            </div>

            <edit-order
                :show="isOrderModalOpen"
                :order="selectedOrder"
                :bids="availableBids"
                @save="handleOrderSave"
                @close="closeOrderModal"
            />
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import EditBid from "@/components/EditBid.vue";
import EditOrder from "@/components/EditOrder.vue";
import ProgressBar from "@/components/ProgressBar.vue";

export default {
  components: {ProgressBar, EditOrder, EditBid},
  props: {
    bid: {
      type: Object,
      required: true,
      default: () => ({})
    },
  },

  data() {
    return {
      availableBids: [],
      selectedOrder: null,
      isOrderModalOpen: false,
      selectedBid: null,
      isModalOpen: false,
      showDetails: false,
      role: localStorage.getItem("userRole"),
    };
  },
  mounted() {
    this.loadBids();
  },
  methods: {

    loadBids() {
      axios.get("https://localhost:7265/Bids")
          .then(response => {
            this.availableBids = response.data;
          })
          .catch(error => {
            console.error("Ошибка при загрузке заявок:", error);
          });
    },

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
        objectName: updatedBid.objectName,
      };

      axios
          .patch(`https://localhost:7265/Bids/${updatedBid.id}`, payload)
          .then(() => {
            console.log("Изменения успешно сохранены");
            this.closeModal();

          })
          .catch((error) => {
            console.error("Ошибка при сохранении изменений:", error);
          });
    },


    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    formatDate(date) {
      if (!date) return 'Дата не указана';
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(date).toLocaleDateString('ru-RU', options);
    },
    openOrderModal(order) {
      this.selectedOrder = order;
      this.isOrderModalOpen = true;
    },
    closeOrderModal() {
      this.isOrderModalOpen = false;
    },
    handleOrderSave(updatedOrder) {
      console.log("Обновленный заказ:", updatedOrder);
      const payload = {
        startDate: updatedOrder.startDate,
        endDate: updatedOrder.endDate,
        workStatus: this.selectedOrder.workStatus,
        bidId: Number(updatedOrder.bidId),
        objectName: updatedOrder.objectName,
      };

      axios
          .patch(`https://localhost:7265/Bids/${this.selectedOrder.id}`, payload)
          .then(() => {
            console.log("Изменения заказа сохранены");
            this.closeOrderModal();
          })
          .catch((error) => {
            console.error("Ошибка при сохранении заказа:", error);
          });
    },

    async deleteOrder(orderId) {
      try {
        await axios.delete(`https://localhost:7265/Orders/${orderId}`).then(() => {
          this.loadBids(); // Перезагрузить заявки после удаления
        });

        this.$emit('order-deleted', orderId);

      } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        alert("Ошибка при удалении заказа")
      }
    },
    async deleteBid(bidId) {
      try {
        await axios.delete(`https://localhost:7265/Bids/${bidId}`);
        this.availableBids = this.availableBids.filter(bid => bid.id !== bidId); // Исправлено
        this.$emit('bid-deleted', bidId); // Исправлено название события
      } catch (error) {
        console.error('Ошибка при удалении заявки:', error);
        alert("Ошибка при удалении заявки")
      }
    }
  },
  computed: {
    workProgress() {
      let ready = this.bid.orders[0].brigadeOrders.filter(bo => bo.workStatus === "Готово").length;
      let percent = ready / this.bid.orders[0].brigadeOrders.length * 100
      return this.bid.orders[0].brigadeOrders.length === 0 ? 0 : percent;
    }
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
