import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  sidebarCollapsed: boolean;
  mode: "light" | "dark";
}

const initialState: ThemeState = {
  sidebarCollapsed: false,
  mode: "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleSidebar, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
