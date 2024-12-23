<template>
  <div class="order-item">
    <div class="order-item__details">
      <p><strong>Заказ #</strong> {{ order.id }}</p>
      <p><strong>Дата начала:</strong> {{ order.startDate }}</p>
      <p><strong>Дата конца:</strong> {{ order.endDate }}</p>
      <p><strong>Статус:</strong> {{ order.workStatus }}</p>
    </div>
    <div class="order-item__actions">
      <button class="action-button" @click="$emit('view', order.id)">Откликнуться</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
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
</style>
