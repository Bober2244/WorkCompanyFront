<template>
  <div class="bid-card">
    <div class="bid-summary">
      <div>
        <p><strong>Дата заявки:</strong> {{ formatDate(bid.dateOfRequest) }}</p>
        <p><strong>Срок строительства:</strong> {{ bid.constructionPeriod }} дней</p>
      </div>
      <button class="toggle-button" @click="toggleDetails">
        {{ showDetails ? 'Свернуть' : 'Развернуть' }}
      </button>
    </div>

    <!-- Детализация: список заказов -->
    <div v-if="showDetails" class="bid-details">
      <h4>Заказы:</h4>
      <ul>
        <li v-for="order in bid.orders" :key="order.id" class="order-item">
          <p><strong>Заказ #{{ order.id }}</strong></p>
          <p><strong>Дата начала:</strong> {{ formatDate(order.startDate) }}</p>
          <p><strong>Дата окончания:</strong> {{ formatDate(order.endDate) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bid: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDetails: false,
    };
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('ru-RU', options);
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

</style>
