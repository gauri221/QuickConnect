import { configureStore } from "@reduxjs/toolkit" ;
import themeSliceReducer from "./themeSlice";
import refreshSidebarReducer from "./refreshSidebar";

export const store = configureStore({
    reducer : {
        themeKey: themeSliceReducer,
        refreshSidebar: refreshSidebarReducer,
    },
})