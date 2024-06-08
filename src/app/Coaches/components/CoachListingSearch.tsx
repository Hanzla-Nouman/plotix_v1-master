import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

export default function CoachListingSearch() {
  return (
    <form className="relative">
      <div className="absolute left-0 -top-5 w-full z-10 flex justify-center items-center px-8 sm:px-20 md:px-40 xl:px-80 2xl:px-96">
        <div className="relative w-full">
          <Input
            className="rounded-full border-white pl-10 py-6 hover:border-slate-300 duration-500 focus:border-slate-300 placeholder:text-slate-400"
            style={{ boxShadow: '0 12px 40px 0 rgba(14,14,18,.06)' }}
            placeholder="Search coach"
          />

          <Search className="absolute left-3 bottom-3" width={20} height={20} />
        </div>
      </div>
    </form>
  );
};
