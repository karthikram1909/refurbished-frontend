import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PhoneCard } from '@/components/PhoneCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, SlidersHorizontal, Smartphone } from 'lucide-react';
import { getPhones } from '@/lib/api';
import { BASE_URL } from '@/lib/config';
import { Phone } from '@/mockData/data';

export const PhoneListing = () => {
  const [searchParams] = useSearchParams();
  // We don't use phones from context anymore for listing, we fetch fresh
  const [apiPhones, setApiPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const loadPhones = async () => {
        try {
            setLoading(true);
            // Fetch ALL phones (limit 1000) so we can filter locally
            const response = await getPhones(1, 1000);
            
            // Check if response is object with phones array (backend pagination structure)
            const data = response.phones ? response.phones : response;
            
            // Map Backend Data to Frontend Phone Interface
            const mappedPhones: Phone[] = Array.isArray(data) ? data.map((p: any) => ({
                id: p._id,
                brand: p.brand || 'Unknown',
                model: p.name, // Use full name as model
                storage: p.name.match(/\d+GB|\d+TB/i)?.[0] || '',
                ram: '',
                condition: 'Good', // Default
                price: p.price,
                originalPrice: p.price,
                image: (p.image && !p.image.startsWith('http') && !p.image.startsWith('data:')) ? `${BASE_URL}${p.image}` : (p.image || '/placeholder.png'),
                images: [(p.image && !p.image.startsWith('http') && !p.image.startsWith('data:')) ? `${BASE_URL}${p.image}` : (p.image || '/placeholder.png')],
                stock: p.isSold ? 0 : 1,
                warranty: p.warranty || '',
                specifications: {
                    display: '',
                    processor: '',
                    camera: '',
                    battery: p.battery || '',
                    os: '',
                },
                conditionDetails: p.description || '',
            })) : [];
            setApiPhones(mappedPhones);
        } catch (error) {
            console.error("Failed to load phones", error);
        } finally {
            setLoading(false);
        }
    };
    loadPhones();
  }, []);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState('price-low');

  const brands = [...new Set(apiPhones.map((p) => p.brand))];
  // const conditions = ['Excellent', 'Good', 'Fair'];
  const storageOptions = [...new Set(apiPhones.map((p) => p.storage).filter(Boolean))];

  const searchQuery = searchParams.get('search');
  const conditionFilter = searchParams.get('condition');

  const filteredAndSortedPhones = useMemo(() => {
    let filtered = [...apiPhones];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.brand.toLowerCase().includes(query) ||
          p.model.toLowerCase().includes(query)
      );
    }

    if (conditionFilter) {
      filtered = filtered.filter((p) => p.condition === conditionFilter);
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedConditions.length > 0) {
      filtered = filtered.filter((p) => selectedConditions.includes(p.condition));
    }

    if (selectedStorage.length > 0) {
      filtered = filtered.filter((p) => selectedStorage.includes(p.storage));
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    apiPhones,
    searchQuery,
    conditionFilter,
    selectedBrands,
    selectedConditions,
    selectedStorage,
    priceRange,
    sortBy,
  ]);

  // Derived state for pagination
  const totalPages = Math.ceil(filteredAndSortedPhones.length / itemsPerPage);
  const paginatedPhones = filteredAndSortedPhones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedConditions, selectedStorage, priceRange, searchQuery, sortBy]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleStorageToggle = (storage: string) => {
    setSelectedStorage((prev) =>
      prev.includes(storage) ? prev.filter((s) => s !== storage) : [...prev, storage]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedStorage([]);
    setPriceRange([0, 200000]);
    setSortBy('price-low');
  };

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Brand Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-900">Brand</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => {
             const isSelected = selectedBrands.includes(brand);
             return (
                <button
                    key={brand}
                    onClick={() => handleBrandToggle(brand)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                        isSelected 
                        ? 'bg-green-600 text-white border-green-600 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600'
                    }`}
                >
                    {brand}
                </button>
             );
          })}
        </div>
      </div>

      {/* Storage Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-900">Storage</h3>
        <div className="grid grid-cols-3 gap-2">
          {storageOptions.map((storage) => {
             const isSelected = selectedStorage.includes(storage);
             return (
                <button
                    key={storage}
                    onClick={() => handleStorageToggle(storage)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border text-center ${
                        isSelected 
                        ? 'bg-green-600 text-white border-green-600 shadow-md ring-2 ring-green-100 ring-offset-1' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
                    }`}
                >
                    {storage}
                </button>
             );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
            </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={200000}
          step={1000}
          className="my-6"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹0</span>
            <span>₹2L+</span>
        </div>
      </div>

      <Button 
        variant="ghost" 
        onClick={clearFilters} 
        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Phones</h1>
        {searchQuery && (
          <p className="text-muted-foreground mt-2">
            Search results for "{searchQuery}"
          </p>
        )}
        {conditionFilter && (
          <p className="text-muted-foreground mt-2">
            Showing {conditionFilter} condition phones
          </p>
        )}
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl border sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <FiltersContent />
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedPhones.length} phones found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
             <div className="text-center py-20">Loading phones...</div>
          ) : paginatedPhones.length > 0 ? (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedPhones.map((phone) => (
                    <PhoneCard key={phone.id} phone={phone} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </>
          ) : (
            <EmptyState
              icon={Smartphone}
              title="No phones found"
              description="Try adjusting your filters or search criteria"
              action={{
                label: 'Clear Filters',
                onClick: clearFilters,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
