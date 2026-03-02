'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Users, Package, Briefcase, Bell, Megaphone, Settings,
  TrendingUp, Globe, MapPin, Clock, Star, AlertTriangle, CheckCircle,
  XCircle, Send, Plus, Trash2, Eye, Search, Filter, ChevronDown,
  Award, Ban, UserCheck, UserX, Clock4, BarChart3, PieChart, Mail,
  Server, Key, TestTube
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

interface AdminDashboardProps {
  user: any
  onClose: () => void
}

export default function AdminDashboard({ user, onClose }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview')
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [locations, setLocations] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCountry, setFilterCountry] = useState('ALL')
  const [filterCity, setFilterCity] = useState('ALL')
  
  // نماذج الإرسال
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    targetScope: 'ALL',
    targetValue: '',
    type: 'ANNOUNCEMENT'
  })
  
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'ANNOUNCEMENT',
    priority: 'NORMAL',
    targetScope: 'ALL',
    targetValue: '',
    expiresAt: ''
  })

  // إعدادات البريد
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'ميزان الوصل',
    useTLS: true,
    emailVerified: false
  })
  const [testEmail, setTestEmail] = useState('')

  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
    fetchLocations()
    fetchAnnouncements()
    fetchEmailSettings()
  }, [])

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers()
    }
  }, [activeSection, searchQuery, filterCountry, filterCity])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (res.ok) {
        setStats(data)
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filterCountry && filterCountry !== 'ALL') params.append('country', filterCountry)
      if (filterCity && filterCity !== 'ALL') params.append('city', filterCity)
      
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/admin/notifications')
      const data = await res.json()
      if (res.ok) {
        setLocations(data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements')
      const data = await res.json()
      if (res.ok) {
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  }

  const fetchEmailSettings = async () => {
    try {
      const res = await fetch('/api/admin/email-settings')
      const data = await res.json()
      if (res.ok && data.settings) {
        setEmailSettings({
          smtpHost: data.settings.smtpHost || '',
          smtpPort: data.settings.smtpPort || 587,
          smtpUser: data.settings.smtpUser || '',
          smtpPassword: '', // لا نملأ كلمة المرور
          fromEmail: data.settings.fromEmail || '',
          fromName: data.settings.fromName || 'ميزان الوصل',
          useTLS: data.settings.useTLS !== false,
          emailVerified: data.settings.emailVerified === true
        })
      }
    } catch (error) {
      console.error('Error fetching email settings:', error)
    }
  }

  const saveEmailSettings = async () => {
    try {
      const res = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailSettings)
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم الحفظ', description: 'تم حفظ إعدادات البريد بنجاح' })
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const testEmailSettings = async () => {
    if (!testEmail) {
      toast({ title: 'تنبيه', description: 'أدخل البريد الاختباري', variant: 'destructive' })
      return
    }
    try {
      const res = await fetch('/api/admin/email-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم الإرسال', description: 'تم إرسال البريد الاختباري بنجاح' })
      } else {
        toast({ title: 'خطأ', description: data.error || data.details, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      toast({ title: 'تنبيه', description: 'العنوان والرسالة مطلوبان', variant: 'destructive' })
      return
    }

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationForm)
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم الإرسال', description: data.message })
        setNotificationForm({ title: '', message: '', targetScope: 'ALL', targetValue: '', type: 'ANNOUNCEMENT' })
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const createAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      toast({ title: 'تنبيه', description: 'العنوان والمحتوى مطلوبان', variant: 'destructive' })
      return
    }

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementForm)
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم النشر', description: 'تم نشر المنشور الرسمي بنجاح' })
        setAnnouncementForm({ title: '', content: '', type: 'ANNOUNCEMENT', priority: 'NORMAL', targetScope: 'ALL', targetValue: '', expiresAt: '' })
        fetchAnnouncements()
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const deleteAnnouncement = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم الحذف', description: 'تم حذف المنشور بنجاح' })
        fetchAnnouncements()
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const handleUserAction = async (userId: string, action: string, value?: any) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, value })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم التحديث', description: data.message })
        fetchUsers()
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const getTargetScopeLabel = (scope: string) => {
    const labels: Record<string, string> = {
      'ALL': 'الجميع',
      'COUNTRY': 'دولة محددة',
      'CITY': 'مدينة محددة',
      'NEIGHBORHOOD': 'حي محدد',
      'USER': 'خليفة محدد'
    }
    return labels[scope] || scope
  }

  const toWesternNumbers = (num: number | string): string => {
    const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    let result = String(num)
    arabicNums.forEach((arabic, western) => {
      result = result.replace(new RegExp(arabic, 'g'), String(western))
    })
    return result
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full gradient-emerald flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-bold text-slate-700">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-emerald-600 via-teal-600 to-emerald-700 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">لوحة تحكم الخليفة المختار</h1>
                <p className="text-emerald-100 text-sm">إدارة منصة ميزان الوصل</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 bg-slate-50 border-l p-3 space-y-1">
            {[
              { id: 'overview', icon: BarChart3, label: 'نظرة عامة' },
              { id: 'users', icon: Users, label: 'إدارة الخلفاء' },
              { id: 'notifications', icon: Bell, label: 'إرسال إشعارات' },
              { id: 'announcements', icon: Megaphone, label: 'المنشورات الرسمية' },
              { id: 'email', icon: Mail, label: 'إعدادات البريد' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'hover:bg-slate-200 text-slate-700'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {/* Overview Section */}
              {activeSection === 'overview' && stats && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'الخلفاء', value: stats.stats.totalUsers, icon: Users, color: 'emerald' },
                      { label: 'الخدمات', value: stats.stats.totalServices, icon: Briefcase, color: 'blue' },
                      { label: 'المنتجات', value: stats.stats.totalProducts, icon: Package, color: 'amber' },
                      { label: 'التبادلات', value: stats.stats.totalExchanges, icon: TrendingUp, color: 'purple' },
                    ].map((stat, i) => (
                      <Card key={i} className="border-0 shadow-lg">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-500">{stat.label}</p>
                              <p className="text-3xl font-bold text-slate-800">{toWesternNumbers(stat.value)}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                              <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">خلفاء جدد هذا الأسبوع</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-emerald-600">{toWesternNumbers(stats.stats.newUsersThisWeek || 0)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">تبادلات مكتملة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-blue-600">{toWesternNumbers(stats.stats.completedExchanges || 0)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">ساعات التبادل</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-amber-600">{toWesternNumbers(stats.stats.totalHoursExchanged || 0)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Users */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        أعلى الخلفاء نزاهة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.topUsers?.slice(0, 5).map((u: any, i: number) => (
                          <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center text-white font-bold text-sm">
                                {toWesternNumbers(i + 1)}
                              </div>
                              <div>
                                <p className="font-bold">{u.name}</p>
                                <p className="text-xs text-slate-500">{u.city} • {u.trustLevel}</p>
                              </div>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700">
                              {toWesternNumbers(u.integrityScore)}% نزاهة
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Users by Country */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        الخلفاء حسب الدول
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stats.charts?.usersByCountry?.slice(0, 5).map((c: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm">{c.country || 'غير محدد'}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={(c.count / stats.stats.totalUsers) * 100} className="w-24 h-2" />
                              <span className="text-sm font-bold">{toWesternNumbers(c.count)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Users Section */}
              {activeSection === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* Filters */}
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="البحث بالاسم أو البريد..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-9"
                      />
                    </div>
                    <Select value={filterCountry} onValueChange={setFilterCountry}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="الدولة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">الكل</SelectItem>
                        {locations?.countries?.map((c: any) => (
                          <SelectItem key={c.code} value={c.code}>{c.code} ({toWesternNumbers(c.count)})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Users List */}
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {users.map((u) => (
                        <Card key={u.id} className={`border-0 shadow ${u.isSuspended ? 'bg-red-50' : ''}`}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full gradient-emerald flex items-center justify-center text-white font-bold">
                                  {u.name?.[0]}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold">{u.name}</p>
                                    {u.isAdmin && (
                                      <Badge className="bg-purple-500 text-white text-xs">خليفة مختار</Badge>
                                    )}
                                    {u.isSuspended && (
                                      <Badge className="bg-red-500 text-white text-xs">موقوف</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500">{u.email} • {u.city} • {u.country}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {toWesternNumbers(u.integrityScore)}% نزاهة
                                </Badge>
                                <Badge variant="outline">
                                  {toWesternNumbers(Math.floor(u.timeBalance / 60))} ساعة
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleUserAction(u.id, u.isSuspended ? 'activate' : 'suspend')}>
                                      {u.isSuspended ? (
                                        <><UserCheck className="w-4 h-4 ml-2" /> فك الإيقاف</>
                                      ) : (
                                        <><Ban className="w-4 h-4 ml-2" /> إيقاف الخليفة</>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleUserAction(u.id, 'setAdmin', !u.isAdmin)}>
                                      {u.isAdmin ? (
                                        <><UserX className="w-4 h-4 ml-2" /> إلغاء صلاحيات الخليفة</>
                                      ) : (
                                        <><Shield className="w-4 h-4 ml-2" /> تعيين كخليفة مختار</>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-0 shadow-lg max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-500" />
                        إرسال إشعار
                      </CardTitle>
                      <CardDescription>
                        أرسل إشعارات للخلفاء حسب الموقع أو لخليفة محدد
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>عنوان الإشعار</Label>
                        <Input
                          value={notificationForm.title}
                          onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                          placeholder="عنوان الإشعار..."
                        />
                      </div>
                      
                      <div>
                        <Label>نص الإشعار</Label>
                        <Textarea
                          value={notificationForm.message}
                          onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                          placeholder="محتوى الإشعار..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>نوع الإشعار</Label>
                          <Select 
                            value={notificationForm.type} 
                            onValueChange={(v) => setNotificationForm({...notificationForm, type: v})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ANNOUNCEMENT">إعلان</SelectItem>
                              <SelectItem value="WARNING">تحذير</SelectItem>
                              <SelectItem value="SYSTEM">نظام</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>الهدف</Label>
                          <Select 
                            value={notificationForm.targetScope} 
                            onValueChange={(v) => setNotificationForm({...notificationForm, targetScope: v, targetValue: ''})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ALL">الجميع</SelectItem>
                              <SelectItem value="COUNTRY">دولة محددة</SelectItem>
                              <SelectItem value="CITY">مدينة محددة</SelectItem>
                              <SelectItem value="NEIGHBORHOOD">حي محدد</SelectItem>
                              <SelectItem value="USER">خليفة محدد</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {notificationForm.targetScope === 'COUNTRY' && (
                        <div>
                          <Label>اختر الدولة</Label>
                          <Select 
                            value={notificationForm.targetValue} 
                            onValueChange={(v) => setNotificationForm({...notificationForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations?.countries?.map((c: any) => (
                                <SelectItem key={c.code} value={c.code}>{c.code} ({toWesternNumbers(c.count)} خليفة)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {notificationForm.targetScope === 'CITY' && (
                        <div>
                          <Label>اختر المدينة</Label>
                          <Select 
                            value={notificationForm.targetValue} 
                            onValueChange={(v) => setNotificationForm({...notificationForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations?.cities?.map((c: any) => (
                                <SelectItem key={c.city} value={c.city}>{c.city} ({toWesternNumbers(c.count)} خليفة)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {notificationForm.targetScope === 'NEIGHBORHOOD' && (
                        <div>
                          <Label>اختر الحي</Label>
                          <Select 
                            value={notificationForm.targetValue} 
                            onValueChange={(v) => setNotificationForm({...notificationForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الحي" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations?.neighborhoods?.map((n: any) => (
                                <SelectItem key={n.neighborhood} value={n.neighborhood}>{n.neighborhood} - {n.city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {notificationForm.targetScope === 'USER' && (
                        <div>
                          <Label>اختر الخليفة</Label>
                          <Select
                            value={notificationForm.targetValue}
                            onValueChange={(v) => setNotificationForm({...notificationForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الخليفة" />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-48">
                                {locations?.users?.map((u: any) => (
                                  <SelectItem key={u.id} value={u.id}>
                                    {u.name} - {u.city || 'غير محدد'}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button onClick={sendNotification} className="w-full gradient-emerald text-white">
                        <Send className="w-4 h-4 ml-2" />
                        إرسال الإشعار
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Announcements Section */}
              {activeSection === 'announcements' && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-6"
                >
                  {/* Create Announcement */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-emerald-500" />
                        منشور رسمي جديد
                      </CardTitle>
                      <CardDescription>
                        انشر منشوراً رسمياً من الخليفة المختار
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>العنوان</Label>
                        <Input
                          value={announcementForm.title}
                          onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                          placeholder="عنوان المنشور..."
                        />
                      </div>
                      
                      <div>
                        <Label>المحتوى</Label>
                        <Textarea
                          value={announcementForm.content}
                          onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                          placeholder="محتوى المنشور..."
                          rows={5}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>النوع</Label>
                          <Select 
                            value={announcementForm.type} 
                            onValueChange={(v) => setAnnouncementForm({...announcementForm, type: v})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ANNOUNCEMENT">إعلان</SelectItem>
                              <SelectItem value="WARNING">تحذير</SelectItem>
                              <SelectItem value="UPDATE">تحديث</SelectItem>
                              <SelectItem value="EVENT">فعالية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>الأولوية</Label>
                          <Select 
                            value={announcementForm.priority} 
                            onValueChange={(v) => setAnnouncementForm({...announcementForm, priority: v})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HIGH">عالية</SelectItem>
                              <SelectItem value="NORMAL">عادية</SelectItem>
                              <SelectItem value="LOW">منخفضة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>الاستهداف</Label>
                        <Select 
                          value={announcementForm.targetScope} 
                          onValueChange={(v) => setAnnouncementForm({...announcementForm, targetScope: v, targetValue: ''})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">الجميع</SelectItem>
                            <SelectItem value="COUNTRY">دولة محددة</SelectItem>
                            <SelectItem value="CITY">مدينة محددة</SelectItem>
                            <SelectItem value="NEIGHBORHOOD">حي محدد</SelectItem>
                            <SelectItem value="USER">خليفة محدد</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {announcementForm.targetScope === 'COUNTRY' && (
                        <div>
                          <Label>اختر الدولة</Label>
                          <Select 
                            value={announcementForm.targetValue} 
                            onValueChange={(v) => setAnnouncementForm({...announcementForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations?.countries?.map((c: any) => (
                                <SelectItem key={c.code} value={c.code}>{c.code} ({toWesternNumbers(c.count)} خليفة)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {announcementForm.targetScope === 'CITY' && (
                        <div>
                          <Label>اختر المدينة</Label>
                          <Select 
                            value={announcementForm.targetValue} 
                            onValueChange={(v) => setAnnouncementForm({...announcementForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations?.cities?.map((c: any) => (
                                <SelectItem key={c.city} value={c.city}>{c.city} ({toWesternNumbers(c.count)} خليفة)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {announcementForm.targetScope === 'NEIGHBORHOOD' && (
                        <div>
                          <Label>اختر الحي</Label>
                          <Select 
                            value={announcementForm.targetValue} 
                            onValueChange={(v) => setAnnouncementForm({...announcementForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الحي" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations?.neighborhoods?.map((n: any) => (
                                <SelectItem key={n.neighborhood} value={n.neighborhood}>{n.neighborhood} - {n.city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {announcementForm.targetScope === 'USER' && (
                        <div>
                          <Label>اختر الخليفة</Label>
                          <Select 
                            value={announcementForm.targetValue} 
                            onValueChange={(v) => setAnnouncementForm({...announcementForm, targetValue: v})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الخليفة" />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-48">
                                {locations?.users?.map((u: any) => (
                                  <SelectItem key={u.id} value={u.id}>
                                    {u.name} - {u.city || 'غير محدد'}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button onClick={createAnnouncement} className="w-full gradient-emerald text-white">
                        <Megaphone className="w-4 h-4 ml-2" />
                        نشر المنشور
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Existing Announcements */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-amber-500" />
                        المنشورات الحالية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {announcements.map((a) => (
                            <div key={a.id} className="p-3 bg-slate-50 rounded-lg border-r-4 border-emerald-500">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={a.priority === 'HIGH' ? 'bg-red-500' : a.priority === 'NORMAL' ? 'bg-amber-500' : 'bg-slate-500'}>
                                      {a.priority === 'HIGH' ? 'عالية' : a.priority === 'NORMAL' ? 'عادية' : 'منخفضة'}
                                    </Badge>
                                    <Badge variant="outline">{getTargetScopeLabel(a.targetScope)}</Badge>
                                  </div>
                                  <p className="font-bold">{a.title}</p>
                                  <p className="text-sm text-slate-600 mt-1">{a.content}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteAnnouncement(a.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {announcements.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                              لا توجد منشورات حالياً
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Email Settings Section */}
              {activeSection === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-3xl mx-auto space-y-6"
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        إعدادات خادم البريد (SMTP)
                      </CardTitle>
                      <CardDescription>
                        قم بتكوين إعدادات البريد الإلكتروني لإرسال رسائل التحقق والإشعارات
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>خادم SMTP</Label>
                          <div className="relative">
                            <Server className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              value={emailSettings.smtpHost}
                              onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                              placeholder="smtp.example.com"
                              className="pr-9"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>المنفذ</Label>
                          <Input
                            type="number"
                            value={emailSettings.smtpPort}
                            onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value) || 587})}
                            placeholder="587"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>اسم المستخدم</Label>
                          <Input
                            value={emailSettings.smtpUser}
                            onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                            placeholder="user@example.com"
                          />
                        </div>
                        <div>
                          <Label>كلمة المرور</Label>
                          <div className="relative">
                            <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              type="password"
                              value={emailSettings.smtpPassword}
                              onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                              placeholder="••••••••"
                              className="pr-9"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>البريد المرسل</Label>
                          <Input
                            value={emailSettings.fromEmail}
                            onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                            placeholder="noreply@mizanelwasl.com"
                          />
                        </div>
                        <div>
                          <Label>اسم المرسل</Label>
                          <Input
                            value={emailSettings.fromName}
                            onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                            placeholder="ميزان الوصل"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailSettings.useTLS}
                            onChange={(e) => setEmailSettings({...emailSettings, useTLS: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300"
                          />
                          <span className="text-sm">استخدام TLS</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailSettings.emailVerified}
                            onChange={(e) => setEmailSettings({...emailSettings, emailVerified: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300"
                          />
                          <span className="text-sm font-bold text-emerald-600">تفعيل التحقق من البريد للخلفاء الجدد</span>
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={saveEmailSettings} className="w-full gradient-emerald text-white">
                        <CheckCircle className="w-4 h-4 ml-2" />
                        حفظ الإعدادات
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Test Email */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TestTube className="w-5 h-5 text-amber-500" />
                        اختبار الإعدادات
                      </CardTitle>
                      <CardDescription>
                        أرسل بريداً اختبارياً للتحقق من صحة الإعدادات
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Input
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="أدخل البريد الاختباري..."
                          className="flex-1"
                        />
                        <Button onClick={testEmailSettings} variant="outline">
                          <Send className="w-4 h-4 ml-2" />
                          إرسال اختباري
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Info Card */}
                  <Card className="border-0 shadow-lg bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-bold mb-1">ملاحظات مهمة:</p>
                          <ul className="list-disc list-inside space-y-1 text-blue-600">
                            <li>عند تفعيل "التحقق من البريد"، سيُطلب من كل خليفة جديد تأكيد بريده قبل استخدام المنصة</li>
                            <li>المنفذ 587 هو الأكثر شيوعاً مع TLS</li>
                            <li>المنفذ 465 يستخدم لـ SSL</li>
                            <li>تأكد من السماح بالوصول من تطبيقات أقل أماناً في Gmail</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
