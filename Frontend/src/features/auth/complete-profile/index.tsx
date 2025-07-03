import React from 'react';
import { CompleteProfileForm } from './components/complete-profile-form';

export default function CompleteProfile() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl shadow-lg border border-border bg-card p-8 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-foreground mb-2">Complete Your Profile</h2>
        <p className="text-muted-foreground text-center mb-4 text-base">To finish signing up, please provide your details below.</p>
        <CompleteProfileForm />
      </div>
    </div>
  );
}

