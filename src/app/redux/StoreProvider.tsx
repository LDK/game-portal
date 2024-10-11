"use client";

import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import { persistStore } from "redux-persist";

persistStore(store);
export default function StorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}