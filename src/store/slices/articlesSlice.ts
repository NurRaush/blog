import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Article = {
  slug: string|null;
  title: string|null;
  description: string|null;
  body: string|null;
  tagList: string[]|[];
  createdAt: string|null;
  updatedAt: string| null;
  favorited: boolean| null;
  favoritesCount: number;
  author: {
    username: string|null;
    bio: string| null;
    image: string| null;
    following: boolean| null;
  };
};

type FetchData = { articles: Article[]; articlesCount: number };

type ArticlesState = {
  articles: Article[];
  status: string;
  error: boolean;
  articlesCount: number;
  page: number;
  needToUpdate: boolean;
  fullArticle: Article ;
};
const initialState: ArticlesState = {
  articles: [],
  status: "",
  error: false,
  articlesCount: 0,
  page: 1,
  needToUpdate:false,
  fullArticle: {
    slug: null,
  title: null,
  description: null,
  body: null,
  tagList:[],
  createdAt: null,
  updatedAt: null,
  favorited: null,
  favoritesCount: 0,
  author: {
    username: null,
    bio: null,
    image: null,
    following: null
  }
  },
};

type TypeNewArticle = {
  title: string,
  description: string,
  body: string,
  tagList?:string[]
}

export const fetchFavorite = createAsyncThunk<{ article: Article }, {method:string,slug:string|null},
{ rejectValue: string }>("articles/fetchFavorite", async function (data, { rejectWithValue }) {
  const token = localStorage.getItem("token");
  const {method,slug} = data
  try {
    const res = await fetch(`https://blog.kata.academy/api/articles/${slug}/favorite`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if (!res.ok) {
      throw new Error(`статус код ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
  }  
})

export const fetchDeleteArticle = createAsyncThunk<{}, string,
{ rejectValue: string }>("articles/fetchDeleteArticle", async function (slug, { rejectWithValue }) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if (!res.ok) {
      throw new Error(`статус код ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
  }  
}) 

export const fetchEditArticle = createAsyncThunk<{ article: Article }, { data: TypeNewArticle, slug:string },
{ rejectValue: string }>("articles/fetchEditArticle", async function (article, { rejectWithValue }) {
  const token = localStorage.getItem("token");
  const { slug, data } = article;
  const fetchData = { article: data }
  try {
    const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify(fetchData)

    });
    if (!res.ok) {
      throw new Error(`статус код ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
  }  
})

export const fetchNewArticle = createAsyncThunk<{ article: Article }, TypeNewArticle,
  { rejectValue: string }>("articles/fetchNewArticle", async function (article, { rejectWithValue }) {
    const token = localStorage.getItem("token");
    const fetchData = { article: article }
    try {
      const res = await fetch(`https://blog.kata.academy/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(fetchData)

      });
      if (!res.ok) {
        throw new Error(`статус код ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (e) {
      if (e instanceof Error) {
        return rejectWithValue(e.message);
      }
    }  
  })

export const fetchFullArticle = createAsyncThunk<
  { article: Article },
  string,
  { rejectValue: string }
>("articles/fetchFullArticle", async function (slug, { rejectWithValue }) {
  try {
    const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`);
    if (!res.ok) {
      throw new Error(`статус код ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
  }
});

export const fetchArticles = createAsyncThunk<
  FetchData,
  number,
  { rejectValue: string }
>("articles/fetchArticles", async function (offset, { rejectWithValue }) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `https://blog.kata.academy/api/articles?limit=5&offset=${
        5 * (offset - 1)
      }`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
    }
    );
    if (!res.ok) {
      throw new Error(`статус код ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
  }
});

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setNeedToUpdate(state,action: PayloadAction<boolean>) {
      state.needToUpdate=action.payload
    },
    setFavorited(state, action: PayloadAction<number>) {
      if (state.articles[action.payload].favorited) {
          state.articles[action.payload].favoritesCount -= 1;  
      } else {
        state.articles[action.payload].favoritesCount += 1;
      }
      state.articles[action.payload].favorited = !state.articles[action.payload].favorited;
    },
    setFavoritedFull(state) {
      if (state.fullArticle.favorited) {
        state.fullArticle.favoritesCount -= 1;
      } else {
        state.fullArticle.favoritesCount += 1;
      }
      state.fullArticle.favorited = !state.fullArticle.favorited;
    },
    unmountArticle(state) {
      state.fullArticle = {
        slug: null,
        title: null,
        description: null,
        body: null,
        tagList:[],
        createdAt: null,
        updatedAt: null,
        favorited: null,
        favoritesCount: 0,
        author: {
          username: null,
          bio: null,
          image: null,
          following: null
        }};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.pending, (state, action) => {
      state.status = "loading";
      state.error = false;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.status = "rejected";
      state.error = true;
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.status = "done";
      state.error = false;
      state.articles = action.payload.articles;
      state.articlesCount = action.payload.articlesCount;
    });
    builder.addCase(fetchFullArticle.pending, (state, action) => {
      state.status = "loading";
      state.error = false;
    });
    builder.addCase(fetchFullArticle.rejected, (state, action) => {
      state.status = "rejected";
      state.error = true;
    });
    builder.addCase(fetchFullArticle.fulfilled, (state, action) => {
      state.status = "done";
      state.error = false;
      state.fullArticle = action.payload.article;
    });
  },
});

export const { changePage, unmountArticle, setNeedToUpdate, setFavorited, setFavoritedFull } = articleSlice.actions;
export default articleSlice.reducer;
