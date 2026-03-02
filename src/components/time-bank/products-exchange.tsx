'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Package, User, MapPin, Handshake, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  quantity: number;
  unit: string;
  quality: string;
  type: string;
  category: string;
  user: {
    id: string;
    name: string;
    city?: string;
    country?: string;
    trustLevel: string;
    rating: number;
  };
}

interface ProductsExchangeProps {
  currentUser: { id: string; timeBalance: number };
  categories: { name: string; nameAr: string }[];
  locations: Record<string, string[]>;
  onExchangeRequest: (providerId: string, productId: string, timeAmount: number) => Promise<void>;
}

// Fair exchange rates (in minutes)
const FAIR_RATES: Record<string, Record<string, number>> = {
  // Products to minutes (base rates)
  'egg_6': 30,        // 6 بيضات = 30 دقيقة
  'milk_1l': 30,      // 1 لتر حليب = 30 دقيقة
  'honey_1kg': 180,   // 1 كيلو عسل = 3 ساعات
  'dates_1kg': 60,    // 1 كيلو تمر = 1 ساعة
  'vegetables_3kg': 60, // 3 كيلو خضروات = 1 ساعة
  'fish_1kg': 120,    // 1 كيلو سمك = 2 ساعة
  'nuts_2kg': 180,    // 2 كيلو مكسرات = 3 ساعات
};

export function ProductsExchange({
  currentUser,
  categories,
  locations,
  onExchangeRequest,
}: ProductsExchangeProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('OFFER');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Create product dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    quantity: 1,
    unit: 'كيلو',
    quality: 'جيد جداً',
    type: 'OFFER',
    category: '',
  });
  const [creating, setCreating] = useState(false);

  // Exchange dialog
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [exchangeNotes, setExchangeNotes] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedType, selectedCategory, selectedCountry, selectedCity]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedCountry) params.append('country', selectedCountry);
      if (selectedCity) params.append('city', selectedCity);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.category) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Failed to create product');

      toast({ title: 'تم بنجاح', description: 'تم إضافة المنتج بنجاح' });
      setCreateDialogOpen(false);
      setNewProduct({
        name: '',
        description: '',
        quantity: 1,
        unit: 'كيلو',
        quality: 'جيد جداً',
        type: 'OFFER',
        category: '',
      });
      fetchProducts();
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة المنتج',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleExchangeRequest = async () => {
    if (!selectedProduct) return;

    setRequesting(true);
    try {
      // Calculate time based on product
      const timeAmount = calculateTimeAmount(selectedProduct);
      await onExchangeRequest(selectedProduct.user.id, selectedProduct.id, timeAmount);
      toast({ title: 'تم إرسال الطلب', description: 'تم إرسال طلب التبادل بنجاح' });
      setExchangeDialogOpen(false);
      setSelectedProduct(null);
      setExchangeNotes('');
    } catch {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الطلب',
        variant: 'destructive',
      });
    } finally {
      setRequesting(false);
    }
  };

  const calculateTimeAmount = (product: Product): number => {
    // Simple calculation based on category
    const baseRates: Record<string, number> = {
      'Dates': 60,    // 1 ساعة للكيلو
      'Honey': 180,   // 3 ساعات للكيلو
      'Vegetables': 20, // 20 دقيقة للكيلو
      'Dairy': 30,    // 30 دقيقة للتر
      'Fish': 120,    // ساعتين للكيلو
      'Nuts': 90,     // ساعة ونصف للكيلو
      'Food': 30,     // 30 دقيقة افتراضي
    };

    const baseRate = baseRates[product.category] || 30;
    return Math.round(baseRate * product.quantity);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.includes(searchQuery) ||
      product.nameAr.includes(searchQuery) ||
      product.description?.includes(searchQuery)
  );

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'مميز':
        return 'bg-emerald-100 text-emerald-700';
      case 'موثوق جداً':
        return 'bg-teal-100 text-teal-700';
      case 'موثوق':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'ممتاز':
        return 'bg-emerald-500 text-white';
      case 'جيد جداً':
        return 'bg-teal-500 text-white';
      case 'جيد':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مبادلة المنتجات</h2>
          <p className="text-gray-500">تبادل المنتجات بطرق عادلة بدون المال</p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Fair Exchange Info */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-amber-600" />
            <div>
              <h4 className="font-bold text-amber-800">معدلات التبادل العادل</h4>
              <p className="text-sm text-amber-700">
                6 بيضات = 1 لتر حليب | 1 كيلو عسل = 3 كيلو تمر ممتاز | 3 كيلو خضروات = 1 كيلو تمر
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="الدولة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">الكل</SelectItem>
                {Object.keys(locations).map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCountry && (
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="المدينة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  {locations[selectedCountry]?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Type Tabs */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList>
          <TabsTrigger value="OFFER">منتجات معروضة</TabsTrigger>
          <TabsTrigger value="REQUEST">منتجات مطلوبة</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">لا توجد منتجات متاحة حالياً</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-teal-500" />
                      {product.name}
                    </CardTitle>
                    <Badge className={getQualityColor(product.quality)}>
                      {product.quality}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description || 'لا يوجد وصف'}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 font-medium text-teal-700">
                      <span>{product.quantity}</span>
                      <span>{product.unit}</span>
                    </div>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{product.user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {product.user.city}
                        </div>
                      </div>
                    </div>

                    {product.user.id !== currentUser.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product);
                          setExchangeDialogOpen(true);
                        }}
                      >
                        <Handshake className="h-4 w-4 ml-1" />
                        تبادل
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Product Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة منتج جديد</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>اسم المنتج</Label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="مثال: تمر خلاص"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="اكتب وصفاً للمنتج..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={newProduct.type}
                  onValueChange={(v) => setNewProduct({ ...newProduct, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFER">أعرض منتج</SelectItem>
                    <SelectItem value="REQUEST">أطلب منتج</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>الكمية</Label>
                <Input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseFloat(e.target.value) || 1 })}
                  min={0.1}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label>الوحدة</Label>
                <Select
                  value={newProduct.unit}
                  onValueChange={(v) => setNewProduct({ ...newProduct, unit: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="كيلو">كيلو</SelectItem>
                    <SelectItem value="لتر">لتر</SelectItem>
                    <SelectItem value="قطعة">قطعة</SelectItem>
                    <SelectItem value="علبة">علبة</SelectItem>
                    <SelectItem value="كرتون">كرتون</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الجودة</Label>
                <Select
                  value={newProduct.quality}
                  onValueChange={(v) => setNewProduct({ ...newProduct, quality: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ممتاز">ممتاز</SelectItem>
                    <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                    <SelectItem value="جيد">جيد</SelectItem>
                    <SelectItem value="مقبول">مقبول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleCreateProduct} disabled={creating} className="bg-teal-600 hover:bg-teal-700">
              {creating ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exchange Dialog */}
      <Dialog open={exchangeDialogOpen} onOpenChange={setExchangeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>طلب تبادل منتج</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-teal-600" />
                  <div>
                    <h4 className="font-bold text-teal-700">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.quantity} {selectedProduct.unit} | {selectedProduct.quality}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-amber-700">القيمة المقدرة</span>
                  <span className="font-bold text-amber-700">
                    ~{calculateTimeAmount(selectedProduct)} دقيقة
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>ملاحظات إضافية</Label>
                <Textarea
                  value={exchangeNotes}
                  onChange={(e) => setExchangeNotes(e.target.value)}
                  placeholder="أضف ملاحظاتك هنا..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setExchangeDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleExchangeRequest}
              disabled={requesting}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {requesting ? 'جاري الإرسال...' : 'إرسال طلب التبادل'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
