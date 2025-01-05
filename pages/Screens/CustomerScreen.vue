<template>
  <div class="container">
    <!-- Фильтры -->
    <div class="filters my-3">
      <div class="filter-item">
        <label for="dateFilter">Дата заявки:</label>
        <input
            type="date"
            v-model="dateFilter"
            class="form-control"
        />
      </div>

      <div class="filter-item">
        <label for="constructionFilter">Срок строительства (в месяцах):</label>
        <input
            type="number"
            v-model="constructionFilter"
            class="form-control"
            placeholder="Введите срок строительства"
        />
      </div>
    </div>

    <!-- Кнопка сброса -->
    <div class="reset-button-container">
      <button class="reset-button" @click="resetFilters">Сбросить фильтры</button>
    </div>

    <!-- Заголовок с кнопкой на одной линии -->
    <div class="bids-header">
      <h1 class="header-title">Заявки</h1>
      <button class="create-button" @click="openCreateBidModal">Создать заявку</button>
<!--      <button class="create-button" @click="openCreateOrderModal">Создать заказ</button>-->
    </div>


    <!-- Список заявок -->
    <div class="bids__list my-3">
      <div v-for="bid in filteredBids" :key="bid.id" class="my-3">
        <BidItem :bid="bid" @delete="deleteBid" />
      </div>
    </div>

    <add-bid v-if="isCreateBidModalOpen" @close="closeCreateBidModal" @created="loadBids" />
    <add-order
        v-if="isCreateOrderModalOpen"
        :bids="bids"
        @close="closeCreateOrderModal"
        @created="handleCreateOrder"
    />

  </div>
</template>

<script>
import axios from 'axios';
import AddBid from "@/components/AddBid.vue";
import BidItem from "@/components/BidItem.vue";
import AddOrder from "@/components/AddOrder.vue";

// Данные для заявок
export default {
  components: {
    AddOrder,
    AddBid,
    BidItem
  },
  data() {
    return {
      bids: [],
      customers: [],
      dateFilter: '',
      constructionFilter: '',
      isCreateBidModalOpen: false,
      isCreateOrderModalOpen: false,
    };
  },
  computed: {
    filteredBids() {
      return this.bids.filter(bid => {
        const matchesDate = !this.dateFilter || bid.dateOfRequest === this.dateFilter;
        const matchesConstructionPeriod = !this.constructionFilter || bid.constructionPeriod == this.constructionFilter;
        return matchesDate && matchesConstructionPeriod;
      });
    }
  },
  methods: {
    loadBids() {
      axios.get("https://localhost:7265/Bids")
          .then(response => {
            console.log("Данные заявок:", response.data); // Логирование данных
            this.bids = response.data.map(bid => ({
              ...bid,
              hasOrder: bid.orders !== null
            }));
          })
          .catch(error => {
            console.error("Ошибка при загрузке заявок:", error);
          });
    },

    loadOrders() {
      axios.get("https://localhost:7265/Orders")
          .then(response => {
            this.orders = response.data;
          })
          .catch(error => {
            console.error("Ошибка при загрузке заказов:", error);
          });
    },
    // openCreateOrderModal() {
    //   this.isCreateOrderModalOpen = true;
    // },
    closeCreateOrderModal() {
      this.isCreateOrderModalOpen = false;
    },
    handleCreateOrder(newOrder) {
      axios.post("https://localhost:7265/Orders", newOrder)
          .then(() => {
            this.loadOrders();
          })
          .catch(error => {
            console.error("Ошибка при создании заказа:", error);
          });
    },
    loadCustomers() {
      axios.get("https://localhost:7265/Customers")
          .then(response => {
            this.customers = response.data;
          })
          .catch(error => {
            console.error("Ошибка при загрузке клиентов:", error);
          });
    },
    openCreateBidModal() {
      this.isCreateBidModalOpen = true;
    },
    closeCreateBidModal() {
      this.isCreateBidModalOpen = false;
    },
    resetFilters() {
      this.dateFilter = '';
      this.constructionFilter = '';
    }
  },
  mounted() {
    this.loadBids();
    this.loadCustomers();
    this.loadOrders();
  }
};
</script>


<style scoped>
.container {
  width: 100%;
  max-width: 780px;
  margin-top: 5rem;
  margin-left: auto;
  margin-right: auto;
}

.filters, .form-group {
  margin-bottom: 1rem;
}

.filter-item label, .form-group label {
  display: block;
  font-weight: bold;
}

.filter-item input, .form-control {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.create-button, .btn {
  background-color: #6c5ce7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.create-button:hover, .btn:hover {
  background-color: #5b4bdb;
}

.reset-button-container {
  margin-top: 10px;
  text-align: right;
}
</style>
