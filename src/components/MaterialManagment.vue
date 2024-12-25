<template>
  <div>
    <button @click="goBack">Вернуться назад</button>
    <div v-for="material in materials" :key="material.id" class="material-item">
      <p><strong>{{ material.name }}</strong></p>
      <p>Количество: {{ material.quantity }} {{ material.measurementUnit }}</p>

      <!-- Кнопки для удаления и редактирования -->
      <button @click="deleteMaterial(material.id)" :disabled="isDeleting">
        {{ isDeleting ? "Удаление..." : "Удалить" }}
      </button>
      <button @click="editMaterial(material)" :disabled="isEditing === material.id">
        {{ isEditing === material.id ? "Редактирование..." : "Редактировать" }}
      </button>
    </div>

    <!-- Форма для добавления нового материала -->
    <button @click="showAddMaterialForm = !showAddMaterialForm">
      {{ showAddMaterialForm ? 'Отменить добавление' : 'Добавить материал' }}
    </button>

    <!-- Форма для добавления материала -->
    <div v-if="showAddMaterialForm" class="add-material-form">
      <h3>Добавить новый материал</h3>
      <form @submit.prevent="addMaterial">
        <div>
          <label for="name">Название</label>
          <input type="text" id="name" v-model="newMaterial.name" required />
        </div>
        <div>
          <label for="quantity">Количество</label>
          <input type="number" id="quantity" v-model="newMaterial.quantity" required />
        </div>
        <div>
          <label for="measurementUnit">Единица измерения</label>
          <input type="text" id="measurementUnit" v-model="newMaterial.measurementUnit" required />
        </div>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Добавление...' : 'Добавить' }}
        </button>
      </form>
    </div>

    <!-- Форма для редактирования материала -->
    <div v-if="isEditing" class="edit-material-form">
      <h3>Редактировать материал</h3>
      <form @submit.prevent="updateMaterial">
        <div>
          <label for="editName">Название</label>
          <input type="text" id="editName" v-model="editedMaterial.name" required />
        </div>
        <div>
          <label for="editQuantity">Количество</label>
          <input type="number" id="editQuantity" v-model="editedMaterial.quantity" required />
        </div>
        <div>
          <label for="editMeasurementUnit">Единица измерения</label>
          <input type="text" id="editMeasurementUnit" v-model="editedMaterial.measurementUnit" required />
        </div>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Редактирование...' : 'Сохранить' }}
        </button>
        <button type="button" @click="cancelEdit">Отменить</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      materials: [], // Список материалов
      isDeleting: false, // Состояние для кнопки удаления
      showAddMaterialForm: false, // Состояние для показа формы добавления материала
      newMaterial: {
        name: "",
        quantity: 0,
        measurementUnit: "",
      }, // Данные для нового материала
      isSubmitting: false, // Состояние для кнопки добавления
      isEditing: null, // Состояние для редактирования материала
      editedMaterial: {
        id: null,
        name: "",
        quantity: 0,
        measurementUnit: "",
      }, // Данные для редактируемого материала
    };
  },
  mounted() {
    this.fetchMaterials(); // Загружаем данные о материалах при монтировании компонента
  },
  methods: {
    async fetchMaterials() {
      try {
        const response = await axios.get("https://localhost:7265/Materials");
        this.materials = response.data; // Сохраняем полученные данные в массив материалов
      } catch (error) {
        console.error("Ошибка при загрузке материалов:", error);
        alert("Не удалось загрузить материалы. Попробуйте снова.");
      }
    },

    async deleteMaterial(id) {
      if (confirm("Вы уверены, что хотите удалить этот материал?")) {
        this.isDeleting = true; // Устанавливаем состояние загрузки
        try {
          // Выполнение DELETE-запроса к серверу
          await axios.delete(`https://localhost:7265/Materials/${id}`);
          this.materials = this.materials.filter(material => material.id !== id); // Удаляем материал из списка
          alert("Материал успешно удалён!");
        } catch (error) {
          console.error("Ошибка при удалении материала:", error);
          alert("Не удалось удалить материал. Попробуйте снова.");
        } finally {
          this.isDeleting = false; // Сбрасываем состояние загрузки
        }
      }
    },

    async addMaterial() {
      this.isSubmitting = true; // Устанавливаем состояние загрузки
      try {
        const response = await axios.post("https://localhost:7265/Materials", this.newMaterial);
        this.materials.push(response.data); // Добавляем новый материал в список
        this.showAddMaterialForm = false; // Закрываем форму добавления
        this.newMaterial = { name: "", quantity: 0, measurementUnit: "" }; // Очищаем форму
        alert("Материал успешно добавлен!");
      } catch (error) {
        console.error("Ошибка при добавлении материала:", error);
        alert("Не удалось добавить материал. Попробуйте снова.");
      } finally {
        this.isSubmitting = false; // Сбрасываем состояние загрузки
      }
    },
    goBack() {
      this.$router.back();
    },

    editMaterial(material) {
      this.isEditing = material.id; // Устанавливаем id редактируемого материала
      this.editedMaterial = { ...material }; // Копируем данные материала в редактируемую форму
    },

    async updateMaterial() {
      this.isSubmitting = true; // Устанавливаем состояние загрузки
      try {
        const response = await axios.patch(`https://localhost:7265/Materials/${this.editedMaterial.id}`, this.editedMaterial);
        // Обновляем данные материала в списке
        const index = this.materials.findIndex(material => material.id === this.editedMaterial.id);
        this.materials.splice(index, 1, response.data); // Заменяем старый материал новым
        this.cancelEdit(); // Отменяем режим редактирования
        alert("Материал успешно обновлён!");
      } catch (error) {
        console.error("Ошибка при редактировании материала:", error);
        alert("Не удалось обновить материал. Попробуйте снова.");
      } finally {
        this.isSubmitting = false; // Сбрасываем состояние загрузки
      }
    },

    cancelEdit() {
      this.isEditing = null; // Сбрасываем состояние редактирования
      this.editedMaterial = { id: null, name: "", quantity: 0, measurementUnit: "" }; // Очищаем редактируемую форму
    },
  },
};
</script>

<style scoped>
.material-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.material-item p {
  margin: 0;
}

button {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.add-material-form, .edit-material-form {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.add-material-form form div, .edit-material-form form div {
  margin-bottom: 10px;
}

.add-material-form input, .edit-material-form input {
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-material-form button, .edit-material-form button {
  background-color: #28a745;
  color: white;
}

.add-material-form button:hover, .edit-material-form button:hover {
  background-color: #218838;
}
</style>
