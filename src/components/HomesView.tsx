import React, { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Bed,
  Bath,
  Trash2,
  Eye,
  Heart,
} from 'lucide-react';
import { Language, PropertyListing } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { formatETB } from '../utils/admin-logic';

interface HomesViewProps {
  currentLang: Language;
}

export const HomesView: React.FC<HomesViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [properties, setProperties] = useState<PropertyListing[]>(adminStore.properties);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingProp, setEditingProp] = useState<PropertyListing | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contactPhone.includes(searchTerm);
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleTogglePublish = (prop: PropertyListing) => {
    prop.published = !prop.published;
    adminStore.logAction(
      prop.published ? 'Property Listing Approved & Published' : 'Property Listing Unpublished',
      `${prop.title} (${prop.location})`
    );
    adminStore.notify();
    setProperties([...adminStore.properties]);
  };

  const handleDelete = (id: string) => {
    adminStore.properties = adminStore.properties.filter((p) => p.id !== id);
    adminStore.logAction('Property Deleted', `Property ID ${id}`);
    adminStore.notify();
    setProperties([...adminStore.properties]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProp) return;
    if (isCreating) {
      adminStore.properties.unshift(editingProp);
      adminStore.logAction('New Property Added', `${editingProp.title} (${editingProp.location})`);
    } else {
      const idx = adminStore.properties.findIndex((p) => p.id === editingProp.id);
      if (idx !== -1) {
        adminStore.properties[idx] = { ...editingProp };
        adminStore.logAction('Property Updated', `${editingProp.title}`);
      }
    }
    adminStore.notify();
    setProperties([...adminStore.properties]);
    setEditingProp(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navHomes} – {t.homesDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የኪራይና ሽያጭ ቤቶች፣ አፓርታማዎች፣ ቪላዎች እና የንግድ ቦታዎች ማስተዳደሪያ።
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingProp({
              id: `prop_${Date.now()}`,
              title: '',
              type: 'rental',
              priceEtb: 25000,
              period: 'monthly',
              location: 'Bole, Addis Ababa',
              city: 'Addis Ababa',
              bedrooms: 2,
              bathrooms: 2,
              description: '',
              contactPhone: '+251 911 000 000',
              imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
              published: true,
              favoritesCount: 0,
              createdAt: Date.now(),
            });
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ ቤት መዝግብ</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="በአርዕስት፣ በሰፈር ወይም በስልክ ቁጥር ይፈልጉ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ሁሉም የቤት አይነቶች</option>
            <option value="rental">የኪራይ ቤት (Rental)</option>
            <option value="sale">የሚሸጥ (For Sale)</option>
            <option value="apartment">አፓርታማ (Apartment)</option>
            <option value="villa">ቪላ (Villa)</option>
            <option value="commercial">የንግድ ቦታ (Commercial)</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prop) => (
          <div
            key={prop.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur uppercase">
                    {prop.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur ${
                      prop.published ? 'bg-emerald-600/90 text-white' : 'bg-amber-600/90 text-white animate-pulse'
                    }`}
                  >
                    {prop.published ? 'የታተመ' : 'ማረጋገጫ የሚጠብቅ'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-slate-800 backdrop-blur flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 fill-current" />
                  <span>{prop.favoritesCount}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {formatETB(prop.priceEtb)}
                  </span>
                  {prop.period && <span className="text-[10px] text-slate-400">/{prop.period}</span>}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {prop.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {prop.location}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.bedrooms} መኝታ
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.bathrooms} መታጠቢያ
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {prop.contactPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(prop)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  prop.published
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    : 'bg-emerald-600 text-white shadow-sm'
                }`}
              >
                {prop.published ? 'አትም አቁም' : 'አጽድቅና አትም'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProp({ ...prop });
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(prop.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Property Modal */}
      {editingProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isCreating ? 'አዲስ ቤት መመዝገቢያ' : 'የቤት ማስታወቂያ ማስተካከያ'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProp(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የማስታወቂያው አርዕስት
              </label>
              <input
                type="text"
                required
                value={editingProp.title}
                onChange={(e) => setEditingProp({ ...editingProp, title: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  አይነት
                </label>
                <select
                  value={editingProp.type}
                  onChange={(e) => setEditingProp({ ...editingProp, type: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="rental">የኪራይ (Rental)</option>
                  <option value="sale">የሚሸጥ (For Sale)</option>
                  <option value="apartment">አፓርታማ (Apartment)</option>
                  <option value="villa">ቪላ (Villa)</option>
                  <option value="commercial">የንግድ ቦታ (Commercial)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ዋጋ (ETB)
                </label>
                <input
                  type="number"
                  required
                  value={editingProp.priceEtb}
                  onChange={(e) => setEditingProp({ ...editingProp, priceEtb: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  አካባቢ / ሰፈር
                </label>
                <input
                  type="text"
                  required
                  value={editingProp.location}
                  onChange={(e) => setEditingProp({ ...editingProp, location: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የአገናኝ ስልክ ቁጥር
                </label>
                <input
                  type="text"
                  required
                  value={editingProp.contactPhone}
                  onChange={(e) => setEditingProp({ ...editingProp, contactPhone: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የፎቶ ማስፈንጠሪያ (Image URL)
              </label>
              <input
                type="url"
                required
                value={editingProp.imageUrl}
                onChange={(e) => setEditingProp({ ...editingProp, imageUrl: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProp(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                {t.saveChanges}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
