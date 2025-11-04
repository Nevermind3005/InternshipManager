import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeInitializer } from './components/foundation/ThemeInitializer';
import { useLanguageStore } from './store/useLanguageStore';
import { IntlProvider } from 'react-intl';
import { locales } from './i18n/IntlConfig';
import { Toaster } from 'sonner';
import { Landing } from './components/Landing';

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
                    <Toaster position="top-center" richColors />
                    {/* <RouterProvider router={router} /> */}
                    <Landing />
                </IntlProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;
