'use client';

import React from 'react';
import { Users, Construction } from 'lucide-react';

const AttendeesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Attendees Page
        </h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <Construction className="w-5 h-5" />
          <p className="text-lg">This page is under development</p>
        </div>
      </div>
    </div>
  );
};

export default AttendeesPage;