<template>
  <div class="container">
    <!-- Поисковая строка -->
    <div class="search-bar my-3">
      <input type="text" v-model="searchQuery" class="form-control" placeholder="Поиск по имени, email или телефону" />
    </div>

    <!-- Заголовок с кнопкой на одной линии -->
    <div class="bids-header">
      <h1 class="header-title">Заявки</h1>
      <button class="create-button" @click="createBid">Создать заявку</button>
    </div>

    <!-- Список заявок -->
    <div class="bids__list my-3">
      <div v-for="bid in filteredBids" :key="bid.id" class="my-3">
        <BidItem :bid="bid" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BidItem from "@/components/BidItem.vue";

// Данные для заявок
const bids = ref([]);
const searchQuery = ref("");

// Метод для загрузки данных
const loadBids = () => {
  // Здесь пример с фейковыми данными, замените на запрос к вашему API
  bids.value = [
    {
      id: 1,
      dateOfRequest: "2024-12-10",
      constructionPeriod: 6,
      customer: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        image: "1.jpg",
      },
      orders: [
        {
          id: 101,
          startDate: "2024-12-15",
          endDate: "2024-12-20",
          title: "Заказ 1",
          amount: 500,
        },
        {
          id: 102,
          startDate: "2024-12-18",
          endDate: "2024-12-24",
          title: "Заказ 2",
          amount: 700,
        },
      ],
    },
    {
      id: 2,
      dateOfRequest: "2024-12-12",
      constructionPeriod: 12,
      customer: {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+0987654321",
        image: "2.jpg",
      },
      orders: [
        {
          id: 103,
          startDate: "2024-12-15",
          endDate: "2024-12-27",
          title: "Order 3",
          amount: 1200,
        },
      ],
    },
  ];
};

// Загружаем данные при монтировании компонента
onMounted(() => {
  loadBids();
});

const filteredBids = computed(() => {
  return bids.value.filter(bid => {
    return bid.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        bid.customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        bid.customer.phone.includes(searchQuery.value);
  });
});

function createBid() {
  console.log("Кнопка 'Создать заявку' нажата.");
  // Логика для создания новой заявки
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 780px;
  margin-top: 5rem;
  margin-left: auto;
  margin-right: auto;
}

.search-bar input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.bids-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.create-button {
  background-color: #6c5ce7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #5b4bdb;
}
</style>
