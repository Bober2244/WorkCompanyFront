Это - клиентская часть SPA, страница регистрации. Собстсвенно, первый проект на vue 3.

### Стек: Vue3, Vue Router, SCSS

:green_circle: Реализовано:
- 4 фрейма (стартовая, регистрация, логин, основая страницы);
- переход между фреймами (Vue router);
- валидация (посмотреть правила - src/validation.js) каждого из полей формы (v-model, события);
- подсказки при заполнении полей формы (bootstrap tooltip, Vue.directive);

:purple_circle: В планах:
- уйти от дублирования кода при валидации на разных страницах;
- добавить возможность регистрации;
- ~~сделать UI дружелюбнее (пока из интерфейса не понятны требования к полям формы)~~

:green_circle: Как это выглядит: 

<img src="https://github.com/Idzanaagi/registration-form-vue3-app/blob/master/src/demo/registartion.gif">

Деплой - https://registration-form-vue3-app.vercel.app/#/

:large_blue_circle: Установка:
- скопировать репозиторий: 
```
git@github.com:Idzanaagi/registration-form-vue3-app.git
```
- в папке проекта установить зависимости:
```
npm ci
```
- запустить приложениe:
```
 npm run serve
 ```
 
