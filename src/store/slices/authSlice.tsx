import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Authorize = {
  email: string | null;
  username: string | null;
  password: string | null;
  token: string | null;
  bio: string | null;
  image: string | null;
  authStatus: null | string;
  authError: boolean | null;
  isAuthorised: boolean;
};

type SignResponse = {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string;
  };
};

const initialState: Authorize = {
  email: null,
  username: null,
  password: null,
  token: null,
  bio: null,
  image: null,
  authError: null,
  authStatus: null,
  isAuthorised: false,
};

type FetchSignUp = {
  user: {
    username: string;
    email: string;
    password: string;
  };
};

type FetchEdit = {
  user: {
    email?: string;
    password?: string;
    username?: string;
    bio?: string;
    image?: string;
  };
};

export const fetchEditProfile = createAsyncThunk<
  SignResponse,
  FetchEdit,
  { rejectValue: string }
>("authorization/fetchEditProfile", async function (user, { rejectWithValue }) {
  
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`https://blog.kata.academy/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      throw new Error(`статус код ${res.status}`);
    }
    const data = await res.json();
    if (user?.user?.password) {
      localStorage.setItem("password", user.user.password);
    }
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
  }
});

export const fetchSignIn = createAsyncThunk<
  SignResponse,
  { user: { email: string; password: string } },
  { rejectValue: string }
>("authorization/fetchSigin", async function (user, { rejectWithValue }) {
  try {
    const res = await fetch(`https://blog.kata.academy/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      throw new Error(`статус код ${res.status}`);
    }
    const data = await res.json();
    localStorage.setItem("password", user.user.password);
    return data;
  } catch (e) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
  }
});

export const fetchSignUp = createAsyncThunk<
  SignResponse,
  FetchSignUp,
  { rejectValue: string }
>("authorization/fetchSignUp", async function (user, { rejectWithValue }) {
  try {
    const res = await fetch(`https://blog.kata.academy/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
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
});

const authSlice = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    autoAuthorise(state) {
      state.isAuthorised = true;
    },
    logOut(state) {
      localStorage.clear();
      state.authError = null;
      state.authStatus = null;
      state.bio = null;
      state.email = null;
      state.image = null;
      state.isAuthorised = false;
      state.password = null;
      state.token = null;
      state.username = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSignUp.pending, (state, action) => {
      state.authStatus = "loading";
      state.authError = false;
    });
    builder.addCase(fetchSignUp.rejected, (state, action) => {
      state.authStatus = "rejected";
      state.authError = true;
    });
    builder.addCase(fetchSignUp.fulfilled, (state, action) => {
      state.authStatus = "done";
      state.authError = false;
      state.bio = action.payload.user.bio;
      state.email = action.payload.user.email;
      state.image = action.payload.user.image;
      state.token = action.payload.user.token;
      state.username = action.payload.user.username;
    });
    builder.addCase(fetchSignIn.pending, (state, action) => {
      state.authStatus = "loading";
      state.authError = false;
    });
    builder.addCase(fetchSignIn.rejected, (state, action) => {
      state.authStatus = "rejected";
      state.authError = true;
    });
    builder.addCase(fetchSignIn.fulfilled, (state, action) => {
      state.authStatus = "done";
      state.authError = false;
      state.bio = action.payload.user.bio;
      state.email = action.payload.user.email;
      state.image = action.payload.user.image;
      state.token = action.payload.user.token;
      state.username = action.payload.user.username;
      state.isAuthorised = true;
      localStorage.setItem("email", action.payload.user.email);
      localStorage.setItem("token", action.payload.user.token);
      localStorage.setItem("username",action.payload.user.username)
    });
    builder.addCase(fetchEditProfile.pending, (state, action) => {
      state.authStatus = "loading";
      state.authError = false;
    });
    builder.addCase(fetchEditProfile.rejected, (state, action) => {
      state.authStatus = "rejected";
      state.authError = true;
    });
    builder.addCase(fetchEditProfile.fulfilled, (state, action) => {
      state.authStatus = "done";
      state.authError = false;
      state.bio = action.payload.user.bio;
      state.email = action.payload.user.email;
      state.image = action.payload.user.image;
      state.token = action.payload.user.token;
      state.username = action.payload.user.username;
      localStorage.setItem("email", action.payload.user.email);
      localStorage.setItem("token", action.payload.user.token);
    });
  },
});

export const { autoAuthorise, logOut } = authSlice.actions;
export default authSlice.reducer;
