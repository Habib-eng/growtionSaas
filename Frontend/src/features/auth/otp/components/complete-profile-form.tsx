import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'sonner';

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
        toast.success('Profile updated!');
        navigate({ to: '/' });
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4'>
      <h2 className='text-2xl font-bold mb-2 text-center'>Complete Your Profile</h2>
      <div className='flex gap-2'>
        <Input
          placeholder='First Name'
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <Input
          placeholder='Last Name'
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </div>
      <Select
        options={countryList().getData()}
        value={countryList().getData().find(c => c.label === country)}
        onChange={val => setCountry(val?.label || '')}
        placeholder='Country'
        classNamePrefix='react-select'
        isSearchable
        required
      />
      <PhoneInput
        country={'us'}
        value={phone}
        onChange={setPhone}
        inputClass='w-full'
        inputStyle={{ width: '100%' }}
        required
      />
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
