<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <h3 class="modal-title">Выход из аккаунта</h3>
      <p class="modal-message">Вы уверены, что хотите выйти из аккаунта?</p>
      <div class="modal-actions">
        <button class="cancel-button" @click="closeModal">Отмена</button>
        <button class="confirm-button" @click="confirmExit">Подтвердить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
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
  width: 300px;
  z-index: 1010; /* Модальное окно поверх затемненного фона */
}

.modal-title, .modal-message {
  color: #000; /* Черный цвет текста */
}

.modal-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.modal-message {
  margin-bottom: 1.5rem;
}

.modal-actions {
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