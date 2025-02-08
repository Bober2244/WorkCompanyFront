import Vuex from "vuex";

export default new Vuex.Store({
    state: {
        userId: localStorage.getItem("userId") || null,  // Получаем из localStorage
        userRole: localStorage.getItem("userRole") || null,  // Получаем из localStorage
        userName: localStorage.getItem("userName") || null,
        email: localStorage.getItem("email") || null,
        birthday: localStorage.getItem("birthday") || null,
        phoneNumber: localStorage.getItem("phoneNumber") || null,
    },
    mutations: {
        setUserId(state, userId) {
            state.userId = userId;
            localStorage.setItem("userId", userId);  // Сохраняем в localStorage
        },
        setUserRole(state, userRole) {
            state.userRole = userRole;
            localStorage.setItem("userRole", userRole);  // Сохраняем в localStorage
        },
        setUserName(state, userName) {
            state.userName = userName;
            localStorage.setItem("userName", userName);
        },
        setEmail(state, email) {
            state.email = email;
            localStorage.setItem("email", email);
        },
        setPhoneNumber(state, phoneNumber) {
            state.phoneNumber = phoneNumber;
            localStorage.setItem("phoneNumber", phoneNumber);
        },
        setBirthday(state, birthday) {
            state.birthday = birthday;
            localStorage.setItem("birthday", birthday);
        },
    },
    actions: {
        loginCustomer({ commit }, { userId, role, userName, email, phoneNumber, birthday }) {
            commit("setUserId", userId);
            commit("setUserRole", role);
            commit("setUserName", userName);
            commit("setEmail", email);
            commit("setPhoneNumber", phoneNumber);
            commit("setBirthday", birthday);
        },
        login({ commit }, { userId, role, userName, email }) {
            commit("setUserId", userId);
            commit("setUserRole", role);
            commit("setUserName", userName);
            commit("setEmail", email);
        },
        logout({ commit }) {
            commit("setUserId", null);
            commit("setUserRole", null);
            commit("setUserName", null);
            commit("setEmail", null);
            commit("setPhoneNumber", null);
            commit("setBirthday", null);
            localStorage.removeItem("userId");  // Убираем из localStorage
            localStorage.removeItem("userRole");  // Убираем из localStorage
            localStorage.removeItem("userName");
            localStorage.removeItem("email");
            localStorage.removeItem("birthday");
            localStorage.removeItem("phoneNumber");
        },
    },
    getters: {
        getUserId(state) {
            return state.userId;
        },
        getUserRole(state) {
            return state.userRole;
        },
        getUserName(state) {
            return state.userName;
        },
        getAccount(state) {
            return state.email;
        },
        getBirthday(state) {
            return state.birthday;
        },
        getPhoneNumber(state) {
            return state.phoneNumber;
        },
    },
});
