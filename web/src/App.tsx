import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import router from './lib/router';

/* ~Begin ReactQuery */
const queryClient = new QueryClient();
/* ~End ReactQuery */

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </>
    );
}

export default App;
