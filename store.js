import Vuex from "vuex";

export default new Vuex.Store({
    state: {
        userId: localStorage.getItem("userId") || null,  // Получаем из localStorage
        userRole: localStorage.getItem("userRole") || null,  // Получаем из localStorage
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
    },
    actions: {
        login({ commit }, { userId, role }) {
            commit("setUserId", userId);
            commit("setUserRole", role);
        },
        logout({ commit }) {
            commit("setUserId", null);
            commit("setUserRole", null);
            localStorage.removeItem("userId");  // Убираем из localStorage
            localStorage.removeItem("userRole");  // Убираем из localStorage
        },
    },
    getters: {
        getUserId(state) {
            return state.userId;
        },
        getUserRole(state) {
            return state.userRole;
        },
    },
});
