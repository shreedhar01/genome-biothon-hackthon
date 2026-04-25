import { Route, Routes } from "react-router-dom";

import { HomePage } from "../pages/Home";

export function AppRouter() {
  return (
    <Routes>
        <Route index element={<HomePage />} />
    </Routes>
  );
}
