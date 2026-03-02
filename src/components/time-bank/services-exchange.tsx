'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Clock, User, MapPin, Star, Handshake, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Service {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  type: string;
  category: string;
  duration: number;
  status: string;
  user: {
    id: string;
    name: string;
    city?: string;
    country?: string;
    trustLevel: string;
    rating: number;
  };
}

interface ServicesExchangeProps {
  currentUser: { id: string; timeBalance: number };
  categories: { name: string; nameAr: string }[];
  locations: Record<string, string[]>;
  onExchangeRequest: (providerId: string, serviceId: string, timeAmount: number) => Promise<void>;
}

export function ServicesExchange({
  currentUser,
  categories,
  locations,
  onExchangeRequest,
}: ServicesExchangeProps) {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('OFFER');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Create service dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    type: 'OFFER',
    category: '',
    duration: 60,
  });
  const [creating, setCreating] = useState(false);

  // Exchange request dialog
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [exchangeNotes, setExchangeNotes] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [selectedType, selectedCategory, selectedCountry, selectedCity]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedCountry) params.append('country', selectedCountry);
      if (selectedCity) params.append('city', selectedCity);

      const response = await fetch(`/api/services?${params.toString()}`);
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    if (!newService.title || !newService.description || !newService.category) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة الخدمة بنجاح',
      });
      setCreateDialogOpen(false);
      setNewService({
        title: '',
        description: '',
        type: 'OFFER',
        category: '',
        duration: 60,
      });
      fetchServices();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة الخدمة',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleExchangeRequest = async () => {
    if (!selectedService) return;

    setRequesting(true);
    try {
      await onExchangeRequest(
        selectedService.user.id,
        selectedService.id,
        selectedService.duration
      );
      toast({
        title: 'تم إرسال الطلب',
        description: 'تم إرسال طلب التبادل بنجاح',
      });
      setExchangeDialogOpen(false);
      setSelectedService(null);
      setExchangeNotes('');
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الطلب',
        variant: 'destructive',
      });
    } finally {
      setRequesting(false);
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.includes(searchQuery) ||
      service.description.includes(searchQuery) ||
      service.titleAr.includes(searchQuery)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">تبادل الخدمات</h2>
          <p className="text-gray-500">اكتشف الخدمات المتاحة وقدم خدماتك</p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن خدمة..."
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
          <TabsTrigger value="OFFER">خدمات معروضة</TabsTrigger>
          <TabsTrigger value="REQUEST">خدمات مطلوبة</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          لا توجد خدمات متاحة حالياً
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge variant="secondary">
                      {service.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration} دقيقة</span>
                    </div>
                    <Badge className={getTrustLevelColor(service.user.trustLevel)}>
                      {service.user.trustLevel}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{service.user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {service.user.city}
                        </div>
                      </div>
                    </div>

                    {service.user.id !== currentUser.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedService(service);
                          setExchangeDialogOpen(true);
                        }}
                        disabled={currentUser.timeBalance < service.duration}
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

      {/* Create Service Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة خدمة جديدة</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>عنوان الخدمة</Label>
              <Input
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                placeholder="مثال: دروس في اللغة الإنجليزية"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="اكتب وصفاً تفصيلياً للخدمة..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={newService.type}
                  onValueChange={(v) => setNewService({ ...newService, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFER">أعرض خدمة</SelectItem>
                    <SelectItem value="REQUEST">أطلب خدمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select
                  value={newService.category}
                  onValueChange={(v) => setNewService({ ...newService, category: v })}
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

            <div className="space-y-2">
              <Label>المدة (بالدقائق)</Label>
              <Input
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 60 })}
                min={15}
                step={15}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleCreateService} disabled={creating} className="bg-emerald-600 hover:bg-emerald-700">
              {creating ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exchange Request Dialog */}
      <Dialog open={exchangeDialogOpen} onOpenChange={setExchangeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>طلب تبادل خدمة</DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-bold text-emerald-700">{selectedService.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedService.description}</p>
                <div className="flex items-center gap-2 mt-2 text-emerald-600">
                  <Clock className="h-4 w-4" />
                  <span>{selectedService.duration} دقيقة</span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-amber-700">رصيدك الحالي</span>
                  <span className="font-bold text-amber-700">
                    {Math.floor(currentUser.timeBalance / 60)} ساعة {currentUser.timeBalance % 60} دقيقة
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
              disabled={requesting || (selectedService && currentUser.timeBalance < selectedService.duration)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {requesting ? 'جاري الإرسال...' : 'إرسال طلب التبادل'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
