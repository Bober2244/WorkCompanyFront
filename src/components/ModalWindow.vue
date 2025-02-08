<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-actions">
        <pre class="modal-message-title">ФИО: </pre>
        <p class="modal-message">{{this.name}}</p>
      </div>
      <div class="modal-actions">
        <pre class="modal-message-title">Аккаунт: </pre>
        <p class="modal-message">{{this.email}}</p>
      </div>
      <div
          class="modal-actions"
          v-if="this.role==='1'">
        <pre class="modal-message-title">Телефон: </pre>
        <p class="modal-message">{{this.phoneNumber}}</p>
      </div>
      <div
          class="modal-actions"
          v-if="this.role==='1'">
        <pre class="modal-message-title">Дата рождения: </pre>
        <p class="modal-message">{{formatDate(this.birthday)}}</p>
      </div>
      <div class="modal-actions">
        <pre class="modal-message-title">Роль: </pre>
        <p v-if="this.role === '0'" class="modal-message">Бригадир</p>
        <p v-if="this.role === '1'" class="modal-message">Заказчик</p>
        <p v-if="this.role === '2'" class="modal-message">Админ</p>
      </div>
      <div class="modal-buttons">
        <button class="cancel-button" @click="closeModal">Назад</button>
        <button class="confirm-button" @click="confirmExit">Выйти</button>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  data() {
    return {
      visible: false,
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("userRole"),
      phoneNumber: localStorage.getItem("phoneNumber"),
      birthday: localStorage.getItem("birthday"),
    };
  },
  methods: {
    openModal() {
      this.visible = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.visible = false;
      document.body.style.overflow = '';
    },
    confirmExit() {
      this.$emit('confirm');
      this.closeModal();
    },
    formatDate(isoDate) {
      return format(new Date(isoDate), 'dd.MM.yyyy');
    }
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Затемнение фона */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Обеспечивает отображение поверх всего контента */
}

.modal-container {
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  width: auto;
  z-index: 1010; /* Модальное окно поверх затемненного фона */
}

.modal-message {
  color: #000; /* Черный цвет текста */
  margin-bottom: 1.5rem;
}

.modal-message-title {
  margin-bottom: 1.5rem;
  color: black;
  text-align: start;
  font: bold 1rem/1.5 "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.modal-actions {
  display: flex;
  justify-content: start;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
}

.cancel-button, .confirm-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.cancel-button {
  background: #ccc;
}

.confirm-button {
  background: #C7A77B;
  color: #fff;
}

.cancel-button:hover {
  background: #bbb;
}

.confirm-button:hover {
  background: #B78F5C;
}
</style>