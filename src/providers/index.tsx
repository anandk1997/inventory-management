import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Spinner } from "src/components/Loader";
import { persistor, store } from "src/store";

export const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <Suspense fallback={<Spinner />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Toaster position="top-center" reverseOrder={false} />

            {children}
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
};
