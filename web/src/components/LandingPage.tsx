import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';
import { Button } from './ui/button';

const ROLES = [
    { key: 'student', label: 'Roles.Student.Label', blurb: 'Roles.Student.Blurb' },
    { key: 'teacher', label: 'Roles.Teacher.Label', blurb: 'Roles.Teacher.Blurb' },
    { key: 'company', label: 'Roles.Company.Label', blurb: 'Roles.Company.Blurb' },
] as const;

export default function LandingPage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6">
            <main className="w-full max-w-2xl text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                    <FormattedMessage id="Landing.Title" />
                </h1>

                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    <FormattedMessage id="Landing.Subtitle" />
                </p>

                <h2 className="mt-10 text-lg font-medium">
                    <FormattedMessage id="Landing.ChooseRole" />;
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {ROLES.map((r) => {
                        const isSelected = selectedRole === r.key;
                        return (
                            <button
                                key={r.key}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => setSelectedRole(r.key)}
                                className={[
                                    'rounded-xl border p-4 text-left transition',
                                    'hover:shadow-md focus-visible:outline focus-visible:outline-2',
                                    'focus-visible:outline-offset-2 focus-visible:outline-blue-600',
                                    isSelected ? 'ring-2 ring-blue-600' : 'hover:border-gray-300',
                                ].join(' ')}
                            >
                                <div className="text-base font-semibold">
                                    <FormattedMessage id={r.label} />
                                </div>
                                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    <FormattedMessage id={r.blurb} />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {selectedRole && (
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button asChild>
                            <Link to="/login" search={{ role: selectedRole }}>
                                <FormattedMessage id="Actions.LogIn" />
                            </Link>
                        </Button>

                        <Button variant="outline" asChild>
                            <Link to="/register" search={{ role: selectedRole }}>
                                <FormattedMessage id="Actions.Register" />
                            </Link>
                        </Button>
                    </div>
                )}

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