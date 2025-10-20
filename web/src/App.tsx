import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ThemeInitializer } from './components/foundation/ThemeInitializer';
import { useLanguageStore } from './store/useLanguageStore';
import { IntlProvider } from 'react-intl';
import { locales } from './i18n/IntlConfig';

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
    const { locale } = useLanguageStore();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeInitializer />
                <IntlProvider locale={locale} messages={locales[locale]}>

                    <RouterProvider router={router} />
                </IntlProvider>

            </QueryClientProvider>
        </>
    );
}

export default App;
