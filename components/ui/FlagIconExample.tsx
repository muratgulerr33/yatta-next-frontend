'use client';

import React from 'react';
import FlagIcon from './FlagIcon';

/**
 * FlagIcon kullanım örnekleri
 * 
 * Bu component, Flagpack'in nasıl kullanılacağını gösterir.
 */
export const FlagIconExample: React.FC = () => {
  // Popüler ülke kodları
  const countries = [
    { code: 'TR', name: 'Türkiye' },
    { code: 'US', name: 'Amerika Birleşik Devletleri' },
    { code: 'GB', name: 'Birleşik Krallık' },
    { code: 'DE', name: 'Almanya' },
    { code: 'FR', name: 'Fransa' },
    { code: 'IT', name: 'İtalya' },
    { code: 'ES', name: 'İspanya' },
    { code: 'NL', name: 'Hollanda' },
    { code: 'BE', name: 'Belçika' },
    { code: 'CH', name: 'İsviçre' },
    { code: 'AT', name: 'Avusturya' },
    { code: 'SE', name: 'İsveç' },
    { code: 'NO', name: 'Norveç' },
    { code: 'DK', name: 'Danimarka' },
    { code: 'FI', name: 'Finlandiya' },
    { code: 'PL', name: 'Polonya' },
    { code: 'JP', name: 'Japonya' },
    { code: 'CN', name: 'Çin' },
    { code: 'KR', name: 'Güney Kore' },
    { code: 'IN', name: 'Hindistan' },
    { code: 'BR', name: 'Brezilya' },
    { code: 'MX', name: 'Meksika' },
    { code: 'CA', name: 'Kanada' },
    { code: 'AU', name: 'Avustralya' },
    { code: 'RU', name: 'Rusya' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Flagpack Bayrak İkonları</h2>
      
      {/* Standart boyutlar */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Farklı Boyutlar</h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <FlagIcon code="TR" size={16} />
            <p className="text-xs mt-1">16px</p>
          </div>
          <div className="text-center">
            <FlagIcon code="TR" size={24} />
            <p className="text-xs mt-1">24px</p>
          </div>
          <div className="text-center">
            <FlagIcon code="TR" size={32} />
            <p className="text-xs mt-1">32px</p>
          </div>
          <div className="text-center">
            <FlagIcon code="TR" size={48} />
            <p className="text-xs mt-1">48px</p>
          </div>
          <div className="text-center">
            <FlagIcon code="TR" size={64} />
            <p className="text-xs mt-1">64px</p>
          </div>
        </div>
      </div>

      {/* Yuvarlak bayraklar */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Yuvarlak Bayraklar</h3>
        <div className="flex items-center gap-4">
          <FlagIcon code="TR" size={48} rounded />
          <FlagIcon code="US" size={48} rounded />
          <FlagIcon code="GB" size={48} rounded />
          <FlagIcon code="DE" size={48} rounded />
          <FlagIcon code="FR" size={48} rounded />
        </div>
      </div>

      {/* Ülke listesi */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tüm Ülkeler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {countries.map((country) => (
            <div
              key={country.code}
              className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
            >
              <FlagIcon code={country.code} size={24} />
              <div>
                <p className="text-sm font-medium">{country.name}</p>
                <p className="text-xs text-gray-500">{country.code}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kullanım örneği */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Kod Örneği</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          <code>{`import FlagIcon from '@/components/ui/FlagIcon';

// Basit kullanım
<FlagIcon code="TR" />

// Özel boyut
<FlagIcon code="US" size={48} />

// Yuvarlak bayrak
<FlagIcon code="GB" size={32} rounded />

// CSS class ile
<FlagIcon code="DE" className="shadow-lg" />`}</code>
        </pre>
      </div>
    </div>
  );
};

export default FlagIconExample;

