import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { COUNTRY_PHONE_CODES, getCountryConfig, sanitizeMobile } from '../../utils/validationRules';

/**
 * 📱 Sovereign Country Phone Input Component
 * Provides international dial code selection + strict digit restriction based on selected country.
 */
export const CountryPhoneInput = ({
  value = '',
  countryCode = '+91',
  onChange,
  onCountryChange,
  name = 'mobile',
  id,
  required = false,
  disabled = false,
  placeholder,
  className = '',
  label,
  error
}) => {
  const [selectedCountry, setSelectedCountry] = useState(() => getCountryConfig(countryCode));

  useEffect(() => {
    if (countryCode) {
      setSelectedCountry(getCountryConfig(countryCode));
    }
  }, [countryCode]);

  const handleCountrySelect = (e) => {
    const dial = e.target.value;
    const cfg = getCountryConfig(dial);
    setSelectedCountry(cfg);
    if (typeof onCountryChange === 'function') {
      onCountryChange(cfg.dial, cfg);
    }
    // Re-sanitize current value against new country's max length
    if (value && typeof onChange === 'function') {
      const clean = sanitizeMobile(value, cfg.dial);
      onChange(clean, cfg.dial);
    }
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value;
    const clean = sanitizeMobile(raw, selectedCountry.dial);
    if (typeof onChange === 'function') {
      onChange(clean, selectedCountry.dial);
    }
  };

  const digits = String(value || '').replace(/\D/g, '');
  const isFilled = digits.length === selectedCountry.maxLength;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {label}
          {required && <span className="text-rose-500 font-bold ml-1">*</span>}
        </label>
      )}

      <div className={`relative flex items-stretch rounded-xl border transition-all ${
        error ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200'
      } ${disabled ? 'bg-slate-100 opacity-70' : 'bg-white'}`}>
        
        {/* Country Selector Dropdown */}
        <div className="relative shrink-0 flex items-center bg-slate-50 border-r border-slate-200 rounded-l-xl px-2.5 py-1.5 hover:bg-slate-100 transition-colors">
          <span className="text-base mr-1.5 select-none">{selectedCountry.flag}</span>
          <span className="text-xs font-mono font-black text-slate-800">{selectedCountry.dial}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 pointer-events-none" />
          
          <select
            value={selectedCountry.dial}
            onChange={handleCountrySelect}
            disabled={disabled}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label="Select Country Calling Code"
          >
            {COUNTRY_PHONE_CODES.map((c) => (
              <option key={`${c.code}-${c.dial}`} value={c.dial}>
                {c.flag} {c.name} ({c.dial}) — {c.maxLength} digits
              </option>
            ))}
          </select>
        </div>

        {/* Numeric Input */}
        <input
          type="tel"
          id={id || name}
          name={name}
          value={value || ''}
          onChange={handleNumberChange}
          placeholder={placeholder || selectedCountry.placeholder || `${selectedCountry.maxLength} digits`}
          maxLength={selectedCountry.maxLength}
          required={required}
          disabled={disabled}
          className={`flex-1 py-2 px-3 text-sm font-mono font-bold text-slate-900 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-slate-400 ${className}`}
        />

        {/* Digits Counter & Valid Status */}
        <div className="flex items-center pr-3 pointer-events-none shrink-0 select-none">
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
            isFilled 
              ? 'bg-emerald-100 text-emerald-800' 
              : digits.length > 0 
              ? 'bg-amber-100 text-amber-800' 
              : 'text-slate-400'
          }`}>
            {digits.length}/{selectedCountry.maxLength}
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-[11px] text-rose-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CountryPhoneInput;
