import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./slices/articlesSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    articles: articleReducer,
    authorization: authReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>; //возвращаем тип рутредюсера, т.к. без этого в дальнейшем не сможем доставать стейт
export type AppDispatch = typeof store.dispatch;
