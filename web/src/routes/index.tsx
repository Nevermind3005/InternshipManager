import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

const ROLES = [
  { key: 'student', label: 'Student', blurb: 'Log activities and track approvals.' },
  { key: 'teacher', label: 'Teacher', blurb: 'Oversee cohorts and review logs.' },
  { key: 'company', label: 'Company', blurb: 'Approve hours and give feedback.' },
] as const;

function RouteComponent() {

    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <main className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Track internships in one place
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Students manage placements, teachers monitor progress, and companies collaborate easily
        </p>

        <h2 className="mt-10 text-lg font-medium">Choose your role</h2>
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
                <div className="text-base font-semibold">{r.label}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{r.blurb}</div>
              </button>
            );
          })}
        </div>

        {selectedRole && (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              search={{ role: selectedRole }}
              className="inline-flex min-w-[9rem] items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Log in
            </Link>
            <Link
              to="/register"
              search={{ role: selectedRole }}
              className="inline-flex min-w-[9rem] items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Register
            </Link>
          </div>
        )}

        <div className="mt-10 text-sm text-gray-600 dark:text-gray-400">
          <span className="mx-2">•</span>
          <a href="#" className="underline-offset-2 hover:underline">About</a>
          <span className="mx-2">•</span>
          <a href="#" className="underline-offset-2 hover:underline">Privacy</a>
          <span className="mx-2">•</span>
          <a href="#" className="underline-offset-2 hover:underline">Contact</a>
        </div>
      </main>
    </div>
  );

}
