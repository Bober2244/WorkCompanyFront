<template>
  <div class="sign-in wrapper">
    <h1 class="headline sign-in__headline">Войти</h1>

    <form @submit.prevent="signIn" class="form sign-in__form">

      <div class="form-group">
        <label class="input-wrapper">Почта
          <input type="email" class="form-control" v-model="form.email" name="email" @blur="validateEmail"
                 :class="{ error: error.email }" />
        </label>
        <p v-if="error.email" class="error-message"> Введите валидную почту </p>
      </div>

      <div class="form-group">
        <label class="input-wrapper">Пароль
          <input type="password" class="form-control" v-model="form.password" name="password" />
          <i class="bi bi-eye-slash icon" @click="setVisibility"></i>
        </label>
      </div>

      <button type="submit" class="btn form__button">Войти</button>
    </form>

    <div class="options sign-up__options">
      <p class="options__description">Еще нет аккаунта?</p>
      <router-link class="options__link" to="/sign-up"> Зарегистрироваться </router-link>
    </div>

  </div>
</template>

<script>
import axios from 'axios'; // Импортируем axios для HTTP-запросов
import {isValidEmail} from "@/utils/validation";
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      error: {
        email: false,
      }
    }
  },
  methods: {
    setVisibility(e) {
      const getSel = e.target;
      const getInput = getSel.previousSibling;

      if (getInput.type === "password") {
        getInput.type = "text";
        getSel.classList.remove("bi-eye-slash");
        getSel.classList.add("bi-eye");
      } else {
        getInput.type = "password";
        getSel.classList.remove("bi-eye");
        getSel.classList.add("bi-eye-slash");
      }
    },
    addClassInvalid(attr) {
      const getSel = document.querySelector(`input[name="${attr}"]`);
      getSel.classList.add('invalid');
      this.error[attr] = true;
    },
    removeClassInvalid(attr) {
      const getSel = document.querySelector(`input[name="${attr}"]`);
      getSel.classList.remove('invalid');
      this.error[attr] = false;
    },
    validateEmail() {
      const attr = 'email';
      if (this.form[attr].length !== 0) {
        !isValidEmail(this.form[attr]) ? this.addClassInvalid(attr) : this.removeClassInvalid(attr);
      }
    },
    async signIn() {
      const getInputAll = document.querySelectorAll('.error');

      const emailLength = this.form.email.length > 0;
      const passwordLength = this.form.password.length > 0;

      if (emailLength && passwordLength && getInputAll.length === 0) {
        try {
          const response = await axios.post('https://localhost:7265/Auth/login', {
            Email: this.form.email,
            Password: this.form.password,
          }, {
            withCredentials: true  // Добавляем эту настройку
          });

          console.log(response);
          const token = response.data.jwt;

          if (token && response.status === 200) {

            localStorage.setItem('jwt', token);

            this.$store.dispatch('login', {
              userId: response.data.id, // ID пользователя, полученное с сервера
              role: response.data.role, // Роль пользователя, полученная с сервера
            });


            this.$router.push('/home');
          } else {
            alert('Invalid credentials');
          }
        } catch (error) {
          console.error('Sign In error:', error);
          alert('Error signing in');
        }
      }
    }

  }
}
</script>

<style scoped>
.sign-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
