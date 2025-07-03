import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { PhoneInput } from '@/components/ui/phone-input';
// import { toast } from 'sonner';
import { showSuccessToast, showErrorToast } from '@/lib/toastUtils';

export function CompleteProfileForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, country, phone }),
      });
      if (res.ok) {
        showSuccessToast('Profile updated!');
        navigate({ to: '/' });
      } else {
        const data = await res.json();
        showErrorToast(data.message || 'Failed to update profile');
      }
    } catch (err) {
      showErrorToast('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 rounded-xl shadow-lg bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">First Name</label>
          <Input
            id="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            className=""
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">Last Name</label>
          <Input
            id="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            className=""
          />
        </div>
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-foreground mb-1">Country</label>
        <Select
          inputId="country"
          options={countryList().getData()}
          value={countryList().getData().find((c: { label: string }) => c.label === country)}
          onChange={val => setCountry(val?.label || '')}
          placeholder="Select your country"
          classNamePrefix="react-select"
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              minHeight: 44,
              boxShadow: 'none',
              borderRadius: '0.5rem',
            }),
            menu: (base) => ({ ...base, zIndex: 50 }),
            singleValue: (base) => ({ ...base }),
            placeholder: (base) => ({ ...base }),
          }}
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
        <PhoneInput
          id="phone"
          value={phone}
          onChange={setPhone}
          className="w-full"
          required
        />
      </div>
      <Button type="submit" className="w-full font-semibold text-base py-3 rounded-lg shadow-sm transition-colors" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
