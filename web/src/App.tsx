import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

/* ~Begin TanstackRouter */
const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
/* ~End TanstackRouter */

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
