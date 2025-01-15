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
      <button class="management-button" @click="goToMaterial">Перейти к управлению материалами</button>
      <button class="create-button" @click="openCreateOrderModal">Создать заказ</button>

    </div>


    <!-- Список заказов -->
    <div class="orders__list my-3">
      <div v-for="order in filteredOrders" :key="order.id" class="my-3">
        <OrderItemForAdmin :order="order" />
      </div>
    </div>

    <add-order
        v-if="isCreateOrderModalOpen"
        :bids="bids"
        @close="closeCreateOrderModal"
        @created="handleCreateOrder"
    />

  </div>
</template>


<script>
import axios from "axios";
import OrderItemForAdmin from "@/components/OrderItemForAdmin.vue";
import AddOrder from "@/components/AddOrder.vue";
export default {
  components: {
    AddOrder,
    OrderItemForAdmin,
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
        // Проверяем фильтр по дате начала
        const matchesStartDate = this.dateFilter
            ? order.startDate === this.dateFilter
            : true;

        // Проверяем фильтр по дате окончания
        const matchesEndDate = this.deliveryDateFilter
            ? order.endDate === this.deliveryDateFilter
            : true;

        // Исключаем заказы со статусом "Создан"
        // Возвращаем true, если заказ соответствует всем условиям
        return matchesStartDate && matchesEndDate;
      });
    },
  },
  methods: {
    handleCreateOrder(newOrder) {
      axios.post("https://localhost:7265/Orders", newOrder)
          .then(() => {
            this.loadOrders();
          })
          .catch(error => {
            console.error("Ошибка при создании заказа:", error);
          });
    },
    closeCreateOrderModal() {
      this.isCreateOrderModalOpen = false;
    },
    openCreateOrderModal() {
      this.isCreateOrderModalOpen = true;
    },
    goToMaterial() {
      // Redirect to management page (replace '/management' with the correct route)
      this.$router.push('/managmentMaterial');
    },
    loadBids() {
      axios.get("https://localhost:7265/Bids")
          .then(response => {
            this.bids = response.data;
            console.log(response.data)
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
