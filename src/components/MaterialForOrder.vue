<template>
  <div class="materials-page">
    <button @click="goBack">Вернуться назад</button>
    <h1>Материалы для заказа #{{ orderId }}</h1>
    <select v-model="selectedMaterial" class="material-select">
      <option v-for="material in materials" :key="material.id" :value="material.id">
        {{ material.name }}
      </option>
    </select>
    <input
        v-model.number="quantity"
        type="number"
        class="material-quantity"
        placeholder="Введите количество"
        min="1"
    />
    <button @click="attachMaterial" :disabled="!selectedMaterial || !quantity">
      Привязать материал
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      materials: [], // Список доступных материалов
      selectedMaterial: null, // Выбранный материал
      quantity: 1, // Введенное количество
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    async fetchMaterials() {
      try {
        const response = await axios.get("https://localhost:7265/Materials");
        this.materials = response.data;
      } catch (error) {
        console.error("Ошибка загрузки материалов:", error.message);
      }
    },
    async attachMaterial() {
      try {
        await axios.post(`https://localhost:7265/Orders/${this.orderId}/Materials`, {
          materialId: this.selectedMaterial,
          quantity: this.quantity,
        });
        alert("Материал успешно привязан к заказу!");
        // Сброс полей после успешной привязки
        this.selectedMaterial = null;
        this.quantity = 1;
      } catch (error) {
        console.error("Ошибка привязки материала:", error.message);
        alert("Не удалось привязать материал.");
      }
    },
  },
  mounted() {
    this.fetchMaterials();
  },
};
</script>

<style scoped>
.materials-page {
  padding: 20px;
}

.material-select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.material-quantity {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
