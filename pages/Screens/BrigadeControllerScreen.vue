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

    <!-- Кнопка сброса -->
    <div class="reset-button-container">
      <button class="reset-button" @click="resetFilters">Сбросить фильтры</button>
    </div>

    <!-- Заголовок с кнопкой на одной линии -->
<!--    <div class="orders-header">-->
<!--      <h1 class="header-title">Заказы</h1>-->
<!--      <button class="create-button" @click="openCreateOrderModal">Создать заказ</button>-->
<!--    </div>-->

    <!-- Список заказов -->
    <div class="orders__list my-3">
      <div v-for="order in filteredOrders" :key="order.id" class="my-3">
        <OrderItem :order="order" />
      </div>
    </div>

    <add-order
        v-if="isCreateOrderModalOpen"
        :bids="bids"
        @close="closeCreateOrderModal"
        @created="loadOrders"
    />

  </div>
</template>

<script>
import AddOrder from "@/components/AddOrder.vue";
import OrderItem from "@/components/OrderItem.vue";
import axios from "axios";
export default {
  components: {
    OrderItem,
    AddOrder,
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
    openCreateOrderModal() {
      this.isCreateOrderModalOpen = true;
    },
    closeCreateOrderModal() {
      this.isCreateOrderModalOpen = false;
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
.reset-button-container {
  margin: 10px 0;
}
.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.orders__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
