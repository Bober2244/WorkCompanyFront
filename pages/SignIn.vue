<template>
  <div class="sign-in wrapper">
    <h1 class="headline sign-in__headline">Войти</h1>

    <form @submit.prevent="signIn" class="form sign-in__form">

      <div class="form-group">
        <label class="input-wrapper">Почта
          <input type="email" class="form-control" v-model="form.email" name="email" @blur="validateEmail"
                 :class="{ error: this.error.email }" />
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
      const emailLength = this.form.email.length > 0;
      const passwordLength = this.form.password.length > 0;

      if (emailLength && passwordLength && document.querySelectorAll('.error').length === 0) {
        try {
          const response = await axios.post('https://localhost:7265/Auth/login', {
            Email: this.form.email,
            Password: this.form.password,
          }, {
            withCredentials: true,
          });
          const customer = await axios.get(`https://localhost:7265/Customers/${response.data.id}`)

          const token = response.data.jwt;

          if (token && response.status === 200) {
            localStorage.setItem('jwt', token);

            await this.$store.dispatch('login', {
              userId: response.data.id,
              role: response.data.role,
              userName: customer.data.fullName,
              email: customer.data.email,
              phoneNumber: customer.data.phoneNumber,
              birthday: customer.data.dateOfBirth,
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
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  text-align: center;
  background-image: url('@/assets/img/fon.jpg'); /* Добавьте фоновое изображение */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.headline {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.form {
  max-width: 400px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-control {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.form-control.error {
  border-color: #ff4d4d;
}

.error-message {
  color: #ff4d4d;
  font-size: 0.875rem;
}

.btn {
  background-color: #d4a373;
  color: white;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #b58863;
}

.options {
  margin-top: 1.5rem;
}

.options__description {
  margin-bottom: 0.5rem;
}

.options__link {
  color: #d4a373;
  text-decoration: none;
}

.options__link:hover {
  text-decoration: underline;
}
</style>