import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { Suspense } from "react";
import { Spinner } from "./components/Loader";
import { router } from "./routes";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Toaster position="top-center" reverseOrder={false} />
            <RouterProvider router={router} />;
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
}

export default App;
