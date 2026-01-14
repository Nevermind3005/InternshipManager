import { Link } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';
import { Button } from './ui/button';
import { Building2 } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6">
            <main className="w-full max-w-2xl text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                    <FormattedMessage id="Landing.Title" />
                </h1>

                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    <FormattedMessage id="Landing.Subtitle" />
                </p>

                <div className="mt-10">
                    <Button asChild size="lg" className="gap-2">
                        <Link to="/register-company">
                            <Building2 className="h-5 w-5" />
                            <FormattedMessage id="Landing.RegisterCompany" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-10 text-sm text-gray-600 dark:text-gray-400">
                    <a href="#" className="underline-offset-2 hover:underline">
                        <FormattedMessage id="Footer.About" />
                    </a>
                    <span className="mx-2">•</span>
                    <a href="#" className="underline-offset-2 hover:underline">
                        <FormattedMessage id="Footer.Privacy" />
                    </a>
                    <span className="mx-2">•</span>
                    <a href="#" className="underline-offset-2 hover:underline">
                        <FormattedMessage id="Footer.Contact" />
                    </a>
                </div>
            </main>
        </div>
    );
}