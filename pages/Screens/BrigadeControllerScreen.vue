<template>
  <div class="container">
    <!-- Фильтры -->
    <div class="filters my-3">
      <div class="filter-item">
        <label for="dateFilter">Дата начала заказа:</label>
        <input
            type="date"
            v-model="dateFilter"
            class="form-control"
        />
      </div>

      <div class="filter-item">
        <label for="dateFilter">Дата конца заказа:</label>
        <input
            type="date"
            v-model="deliveryDateFilter"
            class="form-control"
        />
      </div>
    </div>

    <!-- Кнопки сброса и управления бригадой -->
    <div class="button-container">
      <button class="reset-button" @click="resetFilters">Сбросить фильтры</button>
      <button class="management-button" @click="goToManagement">Перейти к управлению бригадой</button>
    </div>

    <!-- Список заказов -->
    <div class="orders__list my-3">
      <div v-for="order in filteredOrders" :key="order.id" class="my-3">
        <OrderItem :order="order" />
      </div>
    </div>

  </div>
</template>


<script>
import OrderItem from "@/components/OrderItem.vue";
import axios from "axios";
export default {
  components: {
    OrderItem,
  },
  data() {
    return {
      bids: [],
      orders: [], // Список заказов
      dateFilter: '', // Фильтр по дате
      deliveryDateFilter: '', // Фильтр по сроку доставки
      isCreateOrderModalOpen: false, // Состояние модального окна для создания заказа
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchesDate = this.dateFilter ? order.startDate === this.dateFilter : true;
        const matchesDeliveryDate = this.deliveryDateFilter
            ? order.endDate === this.deliveryDateFilter
            : true;
        return matchesDate && matchesDeliveryDate;
      });
    },
  },
  methods: {
    loadBids() {
      axios.get("https://localhost:7265/Bids")
          .then(response => {
            this.bids = response.data;
          })
          .catch(error => {
            console.error("Ошибка при загрузке заявок:", error);
          });
    },
    resetFilters() {
      this.dateFilter = '';
      this.deliveryDateFilter = '';
    },
    async loadOrders() {
      await axios.get("https://localhost:7265/Orders")
          .then(response => {
            this.orders = response.data;
            console.log(this.orders);
          })
          .catch(error => {
            console.error("Ошибка при загрузке заказов:", error);
          });
    },
    goToManagement() {
      // Redirect to management page (replace '/management' with the correct route)
      this.$router.push('/managmentBrigade');
    }
  },
  mounted() {
    this.loadBids();
    this.loadOrders();
  },
};
</script>


<style scoped>
.container {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 20px;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: space-between; /* Distribute buttons across the container */
}

.reset-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #0056b3;
}

.management-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: auto; /* Move this button to the right */
}

.management-button:hover {
  background-color: #218838;
}

.orders__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
