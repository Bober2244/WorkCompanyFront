<template>
  <div class="order-item">
    <div class="order-column">
      <div class="order-item__details">
        <p><strong>Заказ #</strong>{{ order.id }}</p>
        <p><strong>Дата начала:</strong> {{ order.startDate }}</p>
        <p><strong>Дата конца:</strong> {{ order.endDate }}</p>
        <p><strong>Статус:</strong> {{ order.workStatus }}</p>
        <p><strong>Объект:</strong> {{ order?.bid.objectName }}</p>
        <strong>Бригады:</strong>
        <ul>
          <li v-for="brigade in order.brigadeOrders" :key="brigade.id">
            {{ brigade.brigade.name }}
          </li>
        </ul>
      </div>

      <div class="order-item__actions" v-if="order.workStatus !== 'Готово'">
        <button
            v-if="!isUserResponsible"
            class="action-button"
            :disabled="isOrderModalOpen"
            @click="openOrderModal(order)"
        >
          Изменить
        </button>

        <!-- Кнопка "Откликнуться" -->
        <button
            class="action-button"
            v-if="isUserResponsible"
            @click="respond"
        >
          Откликнуться
        </button>
      </div>

      <edit-order-status
          :show="isOrderModalOpen"
          :order="selectedOrder"
          :bids="availableBids"
          @save="handleOrderSave"
          @close="closeOrderModal"
      />
    </div>

    <progress-bar
        :progress="workProgress"
    />
  </div>
</template>


<script>
import axios from "axios";
import EditOrderStatus from "@/components/EditOrderStatus.vue";
import ProgressBar from "@/components/ProgressBar.vue";

export default {
  components: {ProgressBar, EditOrderStatus},
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      availableBids: [],
      selectedOrder: null,
      isOrderModalOpen: false,
      isUserResponsible: false,
    };
  },
  methods: {
    closeOrderModal() {
      this.isOrderModalOpen = false;
    },
    async handleOrderSave(updatedOrder) {
      try {
        const userId = localStorage.getItem("userId");
        const brigade = (await axios.get(`https://localhost:7265/Brigades/user-brigade/${userId}`)).data;
        const brigadeOrder = updatedOrder.brigadeOrders.filter(bo => bo.brigade.name === brigade.name)[0]
        console.log("dto", brigadeOrder);
        axios
            .patch(
                `https://localhost:7265/BrigadeOrders/${brigadeOrder.id}`,
                {
                  orderId: this.selectedOrder.id,
                  brigadeId: brigadeOrder.brigadeId,
                  workStatus: brigadeOrder.workStatus,
                },
                {
                  headers: {
                    "Content-Type": "application/json", // Указываем формат данных
                  },
                })
            .then((response) => {
              console.log("Изменения заказа сохранены:", response.data);
              this.closeOrderModal();
            })
            .catch((error) => {
              alert("Ошибка при сохранении заказа:", error);
            });
      } catch (error) {
        alert("Ошибка при сохранении:", error)
      }
    },
    openOrderModal(order) {
      if (!order) {
        console.error("Заказ не найден");
        return;
      }
      this.selectedOrder = {...order}; // Создаем копию заказа
      this.isOrderModalOpen = true; // Открываем модальное окно
    },
    async respond() {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`https://localhost:7265/Brigades/user-brigade/${userId}`)

        await axios
            .post(`https://localhost:7265/orders/${this.order.id}/apply`,
                Number(response.data.id), // отправляем только brigadeId как число
                {
                  headers: {"Content-Type": "application/json"},
                })
      } catch (error) {
        console.error("Ошибка при загрузке бригад:", error);
        alert("Не удалось загрузить список бригад.");
      }
    },
    async checkResponsibility(order) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("Пользователь не авторизован");
        this.isUserResponsible = false;
        return;
      }

      try {
        const response = await axios.get(
            `https://localhost:7265/Brigades/user-brigade/${userId}`
        );
        const userBrigadeName = response.data.name;

        const isBrigadeInOrder = order.brigadeOrders.some(
            (tetheredBrigade) => tetheredBrigade.brigade.name === userBrigadeName
        );

        this.isUserResponsible = !isBrigadeInOrder;
      } catch (error) {
        console.error("Ошибка при получении бригады пользователя:", error);
        alert("Ошибка при получении бригады пользователя:", error)
        this.isUserResponsible = false;
      }
    },
  },
  watch: {
    order: {
      immediate: true,
      handler(newOrder) {
        if (newOrder) {
          this.checkResponsibility(newOrder);
        }
      },
    },
  },
  computed: {
    workProgress() {
      let ready = this.order.brigadeOrders.filter(bo => bo.workStatus === "Готово").length;
      let percent = ready / this.order.brigadeOrders.length * 100

      let tempOrder = { ...this.order };
      if (percent === 100) {
        tempOrder.workStatus = "Готово"
      }
      else {
        tempOrder.workStatus = "В работе"
      }
      if (this.order.workStatus !== tempOrder.workStatus) {
        axios.patch(
            `https://localhost:7265/Orders/${this.order.id}/status`, tempOrder.workStatus,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
        )
      }
      return this.order.brigadeOrders.length === 0 ? 0 : percent;
    },
  },
  mounted() {
    this.checkResponsibility(this.order);
    console.log(this.order);
  }
};
</script>


<style scoped>
.status-готово {
  color: green;
  font-weight: bold;
}

.status-выполняется {
  color: orange;
}

.status-начато {
  color: blue;
}

/* Основной стиль компонента */
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.order-item__details {
  flex-grow: 1;
}

.order-item__actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #0056b3;
}

.action-button.cancel {
  background-color: #dc3545;
}

.action-button.cancel:hover {
  background-color: #a71d2a;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.order-column {
  flex-direction: column;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
}

/* Анимация появления модального окна */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
