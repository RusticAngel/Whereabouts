'use client';

export function FilterTabs({ 
  active, 
  onSelect 
}: { 
  active: 'global' | 'friends'; 
  onSelect: (filter: 'global' | 'friends') => void 
}) {
  return (
    <div className="flex gap-2 border-b border-gray-800 mb-4">
      <button
        onClick={() => onSelect('global')}
        className={`px-4 py-2 text-sm font-medium transition-all ${
          active === 'global'
            ? 'text-yellow-400 border-b-2 border-yellow-400'
            : 'text-gray-400 hover:text-white border-b-2 border-transparent'
        }`}
      >
        🌍 Global
      </button>
      <button
        onClick={() => onSelect('friends')}
        className={`px-4 py-2 text-sm font-medium transition-all ${
          active === 'friends'
            ? 'text-green-400 border-b-2 border-green-400'
            : 'text-gray-400 hover:text-white border-b-2 border-transparent'
        }`}
      >
        👥 Friends
      </button>
    </div>
  );
}