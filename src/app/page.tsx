'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, Clock, Package, Users, Shield, MessageCircle, 
  Bell, User, LogOut, ChevronDown, Search,
  Plus, Star, Heart, ThumbsUp, ThumbsDown, Send,
  ArrowRight, CheckCircle, AlertCircle, Info, X,
  Home, Briefcase, ShoppingBag, Award, Phone, Settings,
  Sparkles, TrendingUp, Globe, Handshake, Target, Zap,
  Menu, XCircle, Eye, Calendar, MapPin, HeartHandshake,
  Building, Timer, Gem, BadgeCheck, Smile, Gift, CircleDot,
  Sun, Moon, Leaf, Droplets, Wind, Sparkle, BookOpen,
  Feather, Scroll, Signature, Image as ImageIcon, Trash2, Upload,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import AdminDashboard from '@/components/admin/admin-dashboard'

// Covenant Charter Component
const CovenantCharter = ({ onAgree, agreed = false }: { onAgree?: () => void; agreed?: boolean }) => {
  const articles = [
    {
      number: '١',
      title: 'عهد النية والصدق',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      points: [
        'أجعل "النية" أساس كل أفعالي ومبادلاتي',
        'لا أعمل لدنيا إلا وأنا أهدف به وجه الله وخدمة الحياة',
        'أقاوم حب الرياء، وأحرص أن يكون باطني أطيب من ظاهري',
        'في كل معاملة أسعى لتمكين "النزاهة" كأغلى عملة'
      ]
    },
    {
      number: '٢',
      title: 'عهد الاستخلاف والبيئة',
      icon: Leaf,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      points: [
        'أعهد أنني "خليفة" في هذه الأرض، لا مستهلك لها',
        'أعامل الطبيعة وكل ما في الكون كأمانة أوتمن عليها',
        'لا أفعل ما يضر البيئة أو يلوث "بيئة النفس"',
        'أسعى لترك الأرض خيراً مما ورثتها'
      ]
    },
    {
      number: '٣',
      title: 'عهد العدالة والتبادل',
      icon: Scale,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      points: [
        'ألتزم بـ "قانون لا ضرر ولا ضرار"',
        'أبتعد عن الربا والاستغلال، وأحرص على التكافل والتبادل المنصف',
        'لا آكل أموال الناس بالباطل، ولا أبخس الناس أشياءهم',
        'أخدم الغير وسيلة للتكامل، لا فرصة للاستغلال'
      ]
    },
    {
      number: '٤',
      title: 'عهد العلم والابتكار',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      points: [
        'أجعل "العلم" عبادة، و"الابتكار" خدمة للإنسانية',
        'لا أستخدم عقلي أو أدواتي لإيذاء البشر أو الإساءة لكرامتهم',
        'عملي وتعلمي مساهمان في بناء النهضة الإنسانية',
        'أبتكر الخير، وأدعم الإبداع الذي يرفع كينونة الإنسان'
      ]
    },
    {
      number: '٥',
      title: 'عهد الوصل والذكر',
      icon: Handshake,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      points: [
        'أحافظ على "الرابط" مع الأصل',
        'ألتزم بوقت للصمت والتأمل والذكر لإعادة ضبط روحي',
        'أكون عنصراً فعالاً في مجتمعي، لا منعزلاً',
        'أسعى لأن أكون "موصّلاً" للخير لا "معبداً" يحبسه'
      ]
    }
  ]

  return (
    <div className="relative" dir="rtl">
      {/* Decorative header */}
      <motion.div 
        className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full gradient-emerald shadow-2xl flex items-center justify-center border-4 border-white">
            <Award className="w-10 h-10 text-white" />
          </div>
          <motion.div 
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-4 h-4 text-white fill-white" />
          </motion.div>
        </div>
      </motion.div>

      <Card className="shadow-2xl border-0 overflow-hidden pt-12 rounded-2xl">
        {/* Header */}
        <CardHeader className="text-center bg-gradient-to-b from-emerald-50 via-white to-white pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-1.5 text-sm">
              <Scroll className="w-4 h-4 ml-1.5" />
              دستور الانضمام لمذهب ميزان الوصل
            </Badge>
            <CardTitle className="text-3xl md:text-4xl font-bold text-slate-800">
              ميثاق الوصل والعهد
            </CardTitle>
            <CardDescription className="text-base text-slate-600 max-w-lg mx-auto">
              دعوة عالمية للبشرية جمعاء • العودة إلى الأصل • التخلص من الزيف
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-5">
          {/* Bismillah */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-xl border border-emerald-100"
          >
            <p className="text-xl font-bold text-emerald-700 mb-1">بسم الله الرحمن الرحيم</p>
            <p className="text-sm text-slate-500 italic">
              ﴿وَلِكُلِّ أُمَّةٍ جَعَلْنَا مَنسَكًا لِّيَذْكُرُوا اسْمَ اللَّهِ عَلَىٰ مَا رَزَقَهُم مِّن بَهِيمَةِ الْأَنْعَامِ﴾
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-r-4 border-emerald-500"
          >
            <p className="text-slate-700 leading-loose text-center">
              أنا الموقّع أدناه، الشاهد على نفسي وربي،
              <span className="block mt-2 font-semibold text-emerald-700">
                أقرّ وأعترف بملء إرادتي وحريتي أنني تعبت من الزيف والسراب، وأريد العودة إلى "الأصل".
              </span>
              <span className="block mt-2 text-slate-600">
                أؤمن أنني "خليفة" في هذه الأرض، وأرغب في الانضمام لمذهب "ميزان الوصل" لأصبح "ابن الوصل".
              </span>
            </p>
          </motion.div>

          {/* Articles */}
          <div className="space-y-3">
            {articles.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <Card className={`border-2 ${article.borderColor} ${article.bgColor} overflow-hidden hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-0">
                    {/* Article Header */}
                    <div className={`bg-gradient-to-l ${article.color} px-4 py-2.5 flex items-center gap-3`}>
                      <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{article.number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <article.icon className="w-5 h-5 text-white" />
                        <h4 className="font-bold text-white text-lg">{article.title}</h4>
                      </div>
                    </div>
                    {/* Article Points */}
                    <div className="p-4">
                      <ul className="space-y-2.5">
                        {article.points.map((point, j) => (
                          <motion.li 
                            key={j} 
                            className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.08 + j * 0.03 }}
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                            <span>{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Commitment */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="p-5 bg-gradient-to-l from-blue-50 via-indigo-50 to-blue-50 rounded-xl border-r-4 border-blue-500"
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-blue-800 text-lg">الالتزام بمذهب ميزان الوصل</h4>
            </div>
            <p className="text-sm text-slate-700 leading-loose">
              أدرك أن انضمامي لمذهب "ميزان الوصل" يعني أن سلوكي الظاهر والباطن ينعكس على
              <span className="font-bold text-emerald-600 mx-1">"رصيد نزاهتي"</span>
              في المنصة. أقبل أن يكون هذا الرصيد شهادتي، وأقبل تقييم المجتمع العادل.
              <span className="block mt-2 font-medium text-blue-700">لا فرق بين البشر إلا بالنزاهة والعمل الصالح.</span>
            </p>
          </motion.div>

          {/* Closing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center p-4 bg-slate-100 rounded-xl"
          >
            <p className="text-slate-700 font-medium text-lg">
              والله على ما أقول وكيل، وشهيدي هو ربي وضميري وملائكته
            </p>
          </motion.div>

          {/* Agreement Button */}
          {onAgree && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Button
                onClick={onAgree}
                disabled={agreed}
                className={`w-full py-6 text-lg rounded-xl ${agreed ? 'bg-emerald-500' : 'gradient-emerald hover:opacity-90'} text-white shadow-xl transition-all`}
              >
                {agreed ? (
                  <>
                    <CheckCircle className="w-6 h-6 ml-2" />
                    تم التوقيع على الميثاق
                  </>
                ) : (
                  <>
                    <Signature className="w-6 h-6 ml-2" />
                    أوقع وألتزم بهذا الميثاق
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100 justify-center py-4 border-t">
          <p className="text-sm text-slate-600 text-center leading-relaxed">
            <span className="font-bold text-emerald-600">بتوقيعك</span> تصبح <span className="font-bold">"خليفة"</span> و <span className="font-bold">"ابن الوصل"</span>
            <span className="block text-xs text-slate-500 mt-1">لا حدود جغرافية • لا فوارق عنصرية • المعيار هو الالتزام بالدستور</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Professional Balance Scale Component - يعبر عن مذهب ميزان الوصل
const BalanceScale = () => {
  // القيم الأربع للمذهب
  const values = [
    { icon: Scale, label: 'العدل', color: 'from-emerald-500 to-teal-600', desc: 'أساس التبادل' },
    { icon: Heart, label: 'النية الحسنة', color: 'from-rose-500 to-pink-600', desc: 'جوهر التعامل' },
    { icon: Handshake, label: 'التكافل', color: 'from-amber-500 to-orange-600', desc: 'روح المجتمع' },
    { icon: Shield, label: 'النزاهة', color: 'from-blue-500 to-indigo-600', desc: 'عملة الثقة' },
  ]

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[380px] md:h-[420px]" dir="rtl">
      {/* خلفية متحركة ناعمة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative h-full flex flex-col items-center justify-between py-4">
        
        {/* === الجزء العلوي: الميزان والأيقونة === */}
        <div className="flex flex-col items-center relative z-10">
          {/* أيقونة الميزان المركزية */}
          <motion.div
            className="relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          >
            {/* هالة متوهجة */}
            <motion.div
              className="absolute inset-0 -m-4 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* الدائرة الرئيسية */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl flex items-center justify-center border-4 border-white/50 relative">
              <div className="absolute inset-2 rounded-full border-2 border-white/30" />
              <Scale className="w-12 h-12 text-white" />
            </div>
            {/* النجمة الذهبية */}
            <motion.div 
              className="absolute -top-2 left-1/2 -translate-x-1/2"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* العنوان */}
          <motion.h3
            className="mt-4 text-xl md:text-2xl font-bold text-slate-800 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            ميزان الوصل
          </motion.h3>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            التوازن في التبادل والقيم
          </motion.p>
        </div>

        {/* === العمود والعارضة === */}
        <div className="relative flex-1 flex items-center justify-center w-full">
          {/* العمود الرأسي */}
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full max-h-32 bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 rounded-full shadow-lg"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />

          {/* العارضة الأفقية */}
          <motion.div
            className="absolute top-8 left-1/2 -translate-x-1/2 origin-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 50 }}
            style={{ width: '90%', maxWidth: '600px' }}
          >
            <div className="relative h-3 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-full shadow-lg">
              {/* علامات التدرج */}
              <div className="absolute top-0 left-1/4 w-1 h-3 bg-white/40 rounded-full" />
              <div className="absolute top-0 left-1/2 w-1.5 h-3 bg-white/50 rounded-full" />
              <div className="absolute top-0 right-1/4 w-1 h-3 bg-white/40 rounded-full" />
            </div>

            {/* الكفتان */}
            <div className="absolute top-4 left-0 -translate-x-1/2">
              <ScalePan side="left" values={values.slice(0, 2)} delay={0.8} />
            </div>
            <div className="absolute top-4 right-0 translate-x-1/2">
              <ScalePan side="right" values={values.slice(2)} delay={1} />
            </div>
          </motion.div>
        </div>

        {/* === القاعدة === */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-28 h-4 bg-gradient-to-t from-slate-700 via-slate-600 to-slate-500 rounded-b-full shadow-xl" />
            <div className="w-20 h-12 bg-gradient-to-t from-slate-600 via-slate-500 to-slate-400 rounded-t-lg shadow-lg -mt-1 flex items-center justify-center">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-inner" />
                <div className="w-2 h-2 rounded-full bg-amber-400 shadow-inner" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-inner" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

// مكون تبويب الخلفاء والمراسلة
const KhalifasTab = ({ user, toast }: { user: any; toast: any }) => {
  const [nearbyKhalifas, setNearbyKhalifas] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedKhalifa, setSelectedKhalifa] = useState<any>(null)
  const [messageContent, setMessageContent] = useState('')
  const [activeView, setActiveView] = useState<'list' | 'chat'>('list')
  const [currentChat, setCurrentChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [nearbyRes, convRes] = await Promise.all([
          fetch('/api/khalifas/nearby'),
          fetch('/api/messages')
        ])
        const nearbyData = await nearbyRes.json()
        const convData = await convRes.json()
        setNearbyKhalifas(nearbyData.khalifas || [])
        setStats(nearbyData.stats)
        setConversations(convData.conversations || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const startConversation = async (receiverId: string) => {
    if (!messageContent.trim()) {
      toast({ title: 'تنبيه', description: 'اكتب رسالة أولاً', variant: 'destructive' })
      return
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content: messageContent })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم إرسال الرسالة', description: 'سيتم إشعار الخليفة برسالتك' })
        setMessageContent('')
        setSelectedKhalifa(null)
        fetchConversations()
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const openChat = async (conv: any) => {
    try {
      const res = await fetch(`/api/messages/${conv.id}`)
      const data = await res.json()
      setCurrentChat({ ...conv, otherUser: data.otherUser })
      setMessages(data.messages || [])
      setActiveView('chat')
    } catch (error) {
      console.error('Error opening chat:', error)
    }
  }

  const sendMessage = async () => {
    if (!messageContent.trim() || !currentChat) return

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          receiverId: currentChat.otherUser.id, 
          content: messageContent 
        })
      })
      const data = await res.json()
      if (data.success) {
        setMessages([...messages, data.message])
        setMessageContent('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getProximityBadge = (level: string) => {
    const badges: Record<string, { color: string; icon: string }> = {
      'نفس الحي': { color: 'bg-green-500', icon: '🏠' },
      'نفس المدينة': { color: 'bg-blue-500', icon: '🏙️' },
      'نفس الدولة': { color: 'bg-amber-500', icon: '🌍' },
      'دولة أخرى': { color: 'bg-slate-500', icon: '🌐' }
    }
    return badges[level] || { color: 'bg-gray-500', icon: '📍' }
  }

  const getTrustBadgeClass = (level: string) => {
    const classes: Record<string, string> = {
      'خليفة مميز': 'bg-emerald-500 text-white',
      'خليفة صادق': 'bg-teal-500 text-white',
      'خليفة موثوق': 'bg-blue-500 text-white',
      'تحت المراقبة': 'bg-orange-500 text-white'
    }
    return classes[level] || 'bg-gray-500 text-white'
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* إحصائيات القرب */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="text-2xl mb-1">🏠</div>
              <div className="text-2xl font-bold text-green-700">{stats.sameNeighborhood}</div>
              <div className="text-xs text-green-600">نفس الحي</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="text-2xl mb-1">🏙️</div>
              <div className="text-2xl font-bold text-blue-700">{stats.sameCity}</div>
              <div className="text-xs text-blue-600">نفس المدينة</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="text-2xl mb-1">🌍</div>
              <div className="text-2xl font-bold text-amber-700">{stats.sameCountry}</div>
              <div className="text-xs text-amber-600">نفس الدولة</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="text-2xl mb-1">🌐</div>
              <div className="text-2xl font-bold text-purple-700">{stats.otherCountries}</div>
              <div className="text-xs text-purple-600">دول أخرى</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* قائمة المحادثات */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              محادثاتي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">لا توجد محادثات بعد</p>
                  <p className="text-xs text-gray-400 mt-2">ابدأ محادثة مع خليفة قريب</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv: any) => (
                    <div
                      key={conv.id}
                      onClick={() => openChat(conv)}
                      className="p-3 rounded-lg border hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-emerald flex items-center justify-center text-white font-bold">
                          {conv.otherUser?.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{conv.otherUser?.name}</div>
                          <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString('ar-SA') : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* الخلفاء القريبون */}
        <div className="md:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                الخلفاء القريبون
                <Badge className="bg-emerald-100 text-emerald-700 mr-2">
                  {nearbyKhalifas.length} خليفة
                </Badge>
              </CardTitle>
              <CardDescription>
                مرتبون حسب القرب الجغرافي للتلاحم والتكاتف
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {nearbyKhalifas.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">لا يوجد خلفاء آخرون</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {nearbyKhalifas.map((k: any) => {
                      const badge = getProximityBadge(k.proximityLevel)
                      return (
                        <motion.div
                          key={k.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-xl border hover:shadow-lg transition-all bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full gradient-emerald flex items-center justify-center text-white font-bold text-lg">
                                {k.name?.[0]}
                              </div>
                              <div>
                                <div className="font-bold text-lg">{k.name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <MapPin className="w-3 h-3" />
                                  <span>{k.city || 'غير محدد'}{k.country ? `، ${k.country}` : ''}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${badge.color} text-white text-xs`}>
                                {badge.icon} {k.proximityLevel}
                              </Badge>
                              <Badge className={getTrustBadgeClass(k.trustLevel)}>
                                {k.trustLevel}
                              </Badge>
                              <Badge variant="outline" className="text-emerald-600">
                                {k.integrityScore}% نزاهة
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.floor(k.timeBalance / 60)} ساعة
                              </span>
                              <span className="flex items-center gap-1">
                                <Handshake className="w-3 h-3" />
                                {k.totalExchanges} تبادل
                              </span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setSelectedKhalifa(k)}
                              className="gradient-emerald text-white"
                            >
                              <MessageCircle className="w-4 h-4 ml-1" />
                              مراسلة
                            </Button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* نافذة بدء محادثة */}
      <Dialog open={!!selectedKhalifa} onOpenChange={() => setSelectedKhalifa(null)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              رسالة جديدة
            </DialogTitle>
            <DialogDescription>
              إلى: {selectedKhalifa?.name} • {selectedKhalifa?.proximityLevel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => startConversation(selectedKhalifa?.id)}
                className="flex-1 gradient-emerald text-white"
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال
              </Button>
              <Button variant="outline" onClick={() => setSelectedKhalifa(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة المحادثة */}
      <Dialog open={activeView === 'chat' && !!currentChat} onOpenChange={() => setActiveView('list')}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center text-white">
                {currentChat?.otherUser?.name?.[0]}
              </div>
              {currentChat?.otherUser?.name}
            </DialogTitle>
            <DialogDescription>
              {currentChat?.otherUser?.city} • {currentChat?.otherUser?.trustLevel}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] mb-4">
            <div className="space-y-3 p-2">
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user.id ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      msg.senderId === user.id
                        ? 'bg-emerald-500 text-white rounded-bl-none'
                        : 'bg-gray-100 text-gray-800 rounded-br-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="اكتب رسالة..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} className="gradient-emerald text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// مكون كفة الميزان
const ScalePan = ({ side, values, delay }: { side: 'left' | 'right'; values: any[]; delay: number }) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {/* السلاسل */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-0.5 h-8 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full" />
      <div className={`absolute ${side === 'left' ? 'left-1/4' : 'right-1/4'} -translate-x-1/2 -top-6 w-0.5 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full`} />
      <div className={`absolute ${side === 'left' ? 'right-1/4' : 'left-1/4'} translate-x-1/2 -top-6 w-0.5 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full`} />
      
      {/* الكفة */}
      <div className="w-36 md:w-44 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 p-2.5 space-y-2">
        {values.map((value, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-sm border border-slate-100"
            initial={{ opacity: 0, x: side === 'left' ? -15 : 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center shadow-md shrink-0`}>
              <value.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-slate-700">{value.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{value.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Types
interface User {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  country?: string
  city?: string
  neighborhood?: string
  timeBalance: number
  integrityScore: number
  trustLevel: string
  rating: number
  totalExchanges: number
  covenantSigned?: boolean
}

interface Service {
  id: string
  title: string
  titleAr: string
  description: string
  type: string
  category: string
  duration: number
  status: string
  images?: string
  user: { id: string; name: string; image?: string; city: string; trustLevel: string; integrityScore: number; rating: number }
}

interface Product {
  id: string
  name: string
  nameAr: string
  description?: string
  quantity: number
  unit: string
  quality: string
  type: string
  category: string
  images?: string
  user: { id: string; name: string; image?: string; city: string; trustLevel: string }
}

interface Post {
  id: string
  title: string
  content: string
  type: string
  user: { id: string; name: string; image?: string; trustLevel: string; integrityScore: number }
  comments: { id: string; content: string; createdAt: string; user: { id: string; name: string; image?: string } }[]
  positiveVotes: number
  negativeVotes: number
  votes?: { id: string; type: string; userId: string }[]
  createdAt: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

interface Stats {
  totalUsers: number
  totalServices: number
  totalProducts: number
  totalExchanges: number
  completedExchanges: number
  totalHoursExchanged: number
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('services')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCovenant, setShowCovenant] = useState(false)
  const [covenantAgreed, setCovenantAgreed] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [stats, setStats] = useState<Stats | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [categories, setCategories] = useState<any[]>([])
  const [locations, setLocations] = useState<{countries: any[], cities: Record<string, string[]>} | null>(null)
  
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '', country: '', city: '', neighborhood: '' })
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', type: 'OFFER', category: '', duration: 60, images: [] as string[] })
  const [productForm, setProductForm] = useState({ name: '', description: '', quantity: 1, unit: 'كيلو', quality: 'جيد جداً', type: 'OFFER', category: '', images: [] as string[] })
  const [postForm, setPostForm] = useState({ title: '', content: '', type: 'POST' })
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '', category: 'GENERAL' })

  const [serviceFilter, setServiceFilter] = useState({ type: 'ALL', category: '', city: '', search: '' })
  const [productFilter, setProductFilter] = useState({ type: '', category: '', city: '', search: '' })
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', country: '', city: '', neighborhood: '', image: '' })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [commentForm, setCommentForm] = useState({ content: '' })

  const { toast } = useToast()

  useEffect(() => { fetchUser(); fetchStats(); fetchCategories(); fetchLocations() }, [])
  useEffect(() => { if (user) { fetchServices(); fetchProducts(); fetchPosts(); fetchNotifications() } }, [user])

  const fetchUser = async () => {
    try { const res = await fetch('/api/auth/me'); const data = await res.json(); setUser(data.user) }
    catch (error) { console.error('Error fetching user:', error) }
    finally { setLoading(false) }
  }
  const fetchStats = async () => { try { const res = await fetch('/api/stats'); const data = await res.json(); setStats(data) } catch (error) { console.error('Error fetching stats:', error) } }
  const fetchCategories = async () => { try { const res = await fetch('/api/categories'); const data = await res.json(); setCategories(data.categories || []) } catch (error) { console.error('Error fetching categories:', error) } }
  const fetchLocations = async () => { try { const res = await fetch('/api/locations'); const data = await res.json(); setLocations(data) } catch (error) { console.error('Error fetching locations:', error) } }
  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (serviceFilter.type && serviceFilter.type !== 'ALL') params.append('type', serviceFilter.type)
      if (serviceFilter.category) params.append('category', serviceFilter.category)
      if (serviceFilter.search) params.append('search', serviceFilter.search)
      const res = await fetch(`/api/services?${params}`); const data = await res.json(); setServices(data.services || [])
    } catch (error) { console.error('Error fetching services:', error) }
  }
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (productFilter.type) params.append('type', productFilter.type)
      if (productFilter.search) params.append('search', productFilter.search)
      const res = await fetch(`/api/products?${params}`); const data = await res.json(); setProducts(data.products || [])
    } catch (error) { console.error('Error fetching products:', error) }
  }
  const fetchPosts = async () => { try { const res = await fetch('/api/community'); const data = await res.json(); setPosts(data.posts || []) } catch (error) { console.error('Error fetching posts:', error) } }
  const fetchNotifications = async () => { try { const res = await fetch('/api/notifications'); const data = await res.json(); setNotifications(data.notifications || []); setUnreadCount(data.unreadCount || 0) } catch (error) { console.error('Error fetching notifications:', error) } }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: authForm.email, password: authForm.password }) })
      const data = await res.json()
      if (data.success) { setUser(data.user); setShowAuthModal(false); toast({ title: 'مرحباً بعودتك يا خليفة!', description: `أهلاً ${data.user.name}، ابن الوصل • لا حدود بيننا` }) }
      else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) }
    } catch (error) { toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' }) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!covenantAgreed) { toast({ title: 'تنبيه', description: 'يجب الموافقة على ميثاق الوصل أولاً', variant: 'destructive' }); return }
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) })
      const data = await res.json()
      if (data.success) { setUser(data.user); setShowAuthModal(false); setCovenantAgreed(false); toast({ title: 'مرحباً بك يا خليفة!', description: 'أصبحت ابن الوصل • رصيدك 5 ساعات • لا حدود • لا فوارق' }) }
      else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) }
    } catch (error) { toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' }) }
  }

  const handleLogout = async () => { try { await fetch('/api/auth/logout', { method: 'POST' }); setUser(null); toast({ title: 'تم تسجيل الخروج' }) } catch (error) { toast({ title: 'خطأ', variant: 'destructive' }) } }

  const handleImageUpload = async (files: FileList | null, type: 'service' | 'product'): Promise<string[]> => {
    if (!files || files.length === 0) return []
    
    const formData = new FormData()
    const validFiles = Array.from(files).slice(0, 4) // Max 4 images
    validFiles.forEach(file => formData.append('images', file))
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم رفع الصور', description: `تم رفع ${data.count} صورة بنجاح` })
        return data.images
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
        return []
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء رفع الصور', variant: 'destructive' })
      return []
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    try { const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(serviceForm) }); const data = await res.json(); if (data.success) { toast({ title: 'تم إضافة الخدمة' }); setServiceForm({ title: '', description: '', type: 'OFFER', category: '', duration: 60, images: [] }); fetchServices() } else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) } } catch (error) { toast({ title: 'خطأ', variant: 'destructive' }) }
  }
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try { const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productForm) }); const data = await res.json(); if (data.success) { toast({ title: 'تم إضافة المنتج' }); setProductForm({ name: '', description: '', quantity: 1, unit: 'كيلو', quality: 'جيد جداً', type: 'OFFER', category: '', images: [] }); fetchProducts() } else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) } } catch (error) { toast({ title: 'خطأ', variant: 'destructive' }) }
  }
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try { const res = await fetch('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(postForm) }); const data = await res.json(); if (data.success) { toast({ title: 'تم نشر المنشور' }); setPostForm({ title: '', content: '', type: 'POST' }); fetchPosts() } else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) } } catch (error) { toast({ title: 'خطأ', variant: 'destructive' }) }
  }
  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    try { const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactForm) }); const data = await res.json(); if (data.success) { toast({ title: 'تم إرسال الرسالة' }); setContactForm({ name: '', email: '', subject: '', message: '', category: 'GENERAL' }) } else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) } } catch (error) { toast({ title: 'خطأ', variant: 'destructive' }) }
  }
  const handleExchangeRequest = async (type: 'SERVICE' | 'PRODUCT', providerId: string, itemId: string, timeAmount: number) => {
    try { const res = await fetch('/api/exchanges', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, providerId, serviceId: type === 'SERVICE' ? itemId : undefined, productId: type === 'PRODUCT' ? itemId : undefined, timeAmount }) }); const data = await res.json(); if (data.success) { toast({ title: 'تم إرسال طلب التبادل' }); fetchUser() } else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) } } catch (error) { toast({ title: 'خطأ', variant: 'destructive' }) }
  }
  const handlePostVote = async (postId: string, type: 'POSITIVE' | 'NEGATIVE') => {
    try { const res = await fetch(`/api/community/${postId}/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) }); const data = await res.json(); if (data.success) { fetchPosts() } else { toast({ title: 'خطأ', description: data.error, variant: 'destructive' }) } } catch (error) { toast({ title: 'خطأ', variant: 'destructive' }) }
  }

  const handleAddComment = async (postId: string, content: string) => {
    if (!content.trim()) {
      toast({ title: 'تنبيه', description: 'اكتب تعليقاً أولاً', variant: 'destructive' })
      return
    }
    try {
      const res = await fetch(`/api/community/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'تم إضافة التعليق', description: 'بارك الله فيك' })
        fetchPosts()
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', variant: 'destructive' })
    }
  }

  const openProfileModal = () => {
    if (user) {
      setProfileForm({
        name: user.name,
        phone: user.phone || '',
        country: user.country || '',
        city: user.city || '',
        neighborhood: user.neighborhood || '',
        image: user.image || ''
      })
      setShowProfileModal(true)
    }
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('images', files[0])
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success && data.images[0]) {
        setProfileForm({ ...profileForm, image: data.images[0] })
        toast({ title: 'تم رفع الصورة', description: 'تم رفع صورة الملف الشخصي بنجاح' })
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء رفع الصورة', variant: 'destructive' })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user!, ...data.user })
        setShowProfileModal(false)
        toast({ title: 'تم التحديث', description: 'تم تحديث الملف الشخصي بنجاح' })
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' })
    }
  }

  const formatTime = (minutes: number) => { const hours = Math.floor(minutes / 60); const mins = minutes % 60; if (hours > 0 && mins > 0) return `${hours} ساعة و ${mins} دقيقة`; if (hours > 0) return `${hours} ساعة`; return `${mins} دقيقة` }
  
  // تحويل الأرقام العربية إلى أرقام عربية غربية
  const toWesternNumbers = (num: number | string): string => {
    const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    const str = String(num)
    let result = str
    arabicNums.forEach((arabic, western) => {
      result = result.replace(new RegExp(arabic, 'g'), String(western))
    })
    return result
  }
  
  // تنسيق الأرقام بالأرقام الغربية
  const formatNumber = (num: number): string => toWesternNumbers(num)
  const formatDate = (date: string | Date): string => {
    const d = new Date(date)
    return toWesternNumbers(d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))
  }
  const formatTime24 = (date: string | Date): string => {
    const d = new Date(date)
    return toWesternNumbers(d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
  }
  
  const getTrustBadge = (level: string) => { const badges: Record<string, { class: string; icon: string }> = { 'خليفة مميز': { class: 'trust-excellent', icon: '⭐' }, 'خليفة صادق': { class: 'trust-very-good', icon: '✨' }, 'خليفة موثوق': { class: 'trust-good', icon: '✓' }, 'تحت المراقبة': { class: 'trust-warning', icon: '⚠' }, 'مجمد': { class: 'trust-frozen', icon: '❄' }, 'مميز': { class: 'trust-excellent', icon: '⭐' }, 'موثوق جداً': { class: 'trust-very-good', icon: '✨' }, 'موثوق': { class: 'trust-good', icon: '✓' }, 'محذر': { class: 'trust-warning', icon: '⚠' } }; return badges[level] || badges['خليفة موثوق'] }
  const getServiceCategories = () => { const serviceCats = categories.filter(c => c.type === 'SERVICE'); return serviceCats.filter((cat, index, self) => index === self.findIndex(c => c.name === cat.name)) }
  const getProductCategories = () => { const productCats = categories.filter(c => c.type === 'PRODUCT'); return productCats.filter((cat, index, self) => index === self.findIndex(c => c.name === cat.name)) }

  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <motion.div className="flex flex-col items-center gap-6">
          <motion.div className="w-20 h-20 rounded-2xl gradient-emerald shadow-xl flex items-center justify-center" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Scale className="w-10 h-10 text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold text-emerald-700">جاري التحميل...</motion.div>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #10B981 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
          <motion.div className="absolute top-20 left-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="absolute bottom-20 right-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)' }} animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-emerald-100/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                <motion.div className="w-12 h-12 rounded-xl gradient-emerald shadow-lg flex items-center justify-center" whileHover={{ scale: 1.05 }}>
                  <Scale className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">ميزان الوصل</h1>
                  <p className="text-xs text-slate-500">مذهب العدل والتبادل</p>
                </div>
              </motion.div>
              <div className="flex items-center gap-3">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Button onClick={() => { setAuthMode('login'); setShowAuthModal(true) }} variant="ghost" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50">تسجيل الدخول</Button>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Button onClick={() => { setAuthMode('register'); setShowCovenant(true) }} className="gradient-emerald text-white shadow-lg hover:shadow-xl transition-all">
                    <Heart className="w-4 h-4 ml-2" />
                    انضم للمجتمع
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        <section className="relative py-8 px-4 overflow-hidden">
          <div className="container mx-auto">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center mb-4">
              <motion.div variants={fadeInUp} className="mb-3">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 text-sm">
                  <Sparkle className="w-4 h-4 ml-1" />
                  دعوة للبشرية جمعاء
                </Badge>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-slate-800 mb-3">
                بالعَدل قامت<span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent"> السماوات والأرض </span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-slate-600 mb-2">دعوة للعودة إلى الأصل • لا حدود • لا فوارق</motion.p>
              <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-500" /> نية حسنة</span>
                <span className="flex items-center gap-1"><Scale className="w-4 h-4 text-emerald-500" /> عدل</span>
                <span className="flex items-center gap-1"><Handshake className="w-4 h-4 text-amber-500" /> تكافل</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-500" /> نزاهة</span>
              </motion.div>
            </motion.div>

            <BalanceScale />

            {/* شريط الحالة - أسفل الميزان */}
            <motion.div
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-6 py-3 flex items-center justify-center gap-6 border border-slate-100 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-emerald-500"
                  animate={{ boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.4)', '0 0 0 8px rgba(16, 185, 129, 0)', '0 0 0 0 rgba(16, 185, 129, 0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-bold text-emerald-600">متوازن</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <Timer className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-700">5,280</span>
                  <span className="text-slate-500">ساعة</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
                  <Handshake className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-700">1,240</span>
                  <span className="text-slate-500">تبادل</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }} className="flex flex-wrap gap-4 justify-center mt-6">
              <Button size="lg" onClick={() => { setAuthMode('register'); setShowCovenant(true) }} className="gradient-emerald text-white text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all group">
                أصبح خليفة
                <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50" onClick={() => { setAuthMode('login'); setShowAuthModal(true) }}>
                <Eye className="w-5 h-5 ml-2" />
                لدي حساب
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">مبادئ مذهب ميزان الوصل</motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">دستور عالمي للبشرية جمعاء • لا يفرق بين لون أو جنس أو أرض</motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-4 gap-6">
              {[{ icon: Scale, title: 'العدل', desc: 'نعطي كل ذي حق حقه بلا محاباة', color: 'emerald', verse: 'وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ' }, { icon: Heart, title: 'النية الحسنة', desc: 'نبتغي الأجر من الله أولاً', color: 'rose', verse: 'وَمَا تُنفِقُوا مِنْ خَيْرٍ فَلِأَنفُسِكُم' }, { icon: Handshake, title: 'التكافل', desc: 'نتعاون على البر والتقوى', color: 'amber', verse: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى' }, { icon: Shield, title: 'النزاهة', desc: 'نحاسب أنفسنا قبل أن نُحاسب', color: 'blue', verse: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ' }].map((value, i) => (
                <motion.div key={i} variants={scaleIn} whileHover={{ y: -8 }}>
                  <Card className="h-full border-2 border-transparent hover:border-emerald-200 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl bg-gradient-to-b from-white to-slate-50">
                    <CardContent className="pt-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg flex items-center justify-center ${value.color === 'emerald' ? 'gradient-emerald' : value.color === 'rose' ? 'bg-gradient-to-br from-rose-400 to-pink-500' : value.color === 'amber' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}`}>
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-slate-800">{value.title}</h3>
                      <p className="text-slate-600 text-sm mb-4">{value.desc}</p>
                      <div className="pt-3 border-t border-slate-100"><p className="text-xs text-slate-500 italic leading-relaxed">{value.verse}</p></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* تفقه في مذهب ميزان الوصل - Learning Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 via-white to-teal-50" dir="rtl">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer} 
              className="text-center mb-12"
            >
              <motion.div variants={fadeInUp} className="mb-4">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 text-sm">
                  <BookOpen className="w-4 h-4 ml-1" />
                  مساحة التعلم والتفقه
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                تفقه في مذهب ميزان الوصل
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                كلكم راعٍ وكلكم مسؤولٌ عن رعيته • كل خليفة يحمل على عاتقه التعلم والتعليم والموازرة والتكاتف
              </motion.p>
            </motion.div>

            {/* What is a Khalifah? */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">ما معنى خليفة؟</CardTitle>
                      <CardDescription className="text-emerald-100">
                        فهم عمق الاستخلاف ومسؤوليته
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="p-5 bg-gradient-to-l from-emerald-50 to-teal-50 rounded-xl border-r-4 border-emerald-500">
                    <p className="text-slate-700 leading-loose text-lg">
                      <span className="font-bold text-emerald-700">الخليفة</span> في مذهب ميزان الوصل هو كل إنسان يحمل أمانة الاستخلاف في هذه الأرض، 
                      ليس مستهلكاً لها بل <span className="font-semibold">راعياً ومسؤولاً</span>. هذا اللقب ليس تشريفاً فحسب، بل هو 
                      <span className="font-bold text-emerald-600"> التزام ومسؤولية</span> تجاه الله أولاً وتجاه البشرية والكون.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                          <Scale className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800">الاستخلاف مسؤولية</h4>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        أن تكون خليفة يعني أنك مسؤول عن كل ما تحت يديك ومن حولك. مسؤول عن نفسك أولاً، 
                        ثم عن أهلك، ثم عن مجتمعك، ثم عن البيئة التي تعيش فيها.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800">الاستخلاف تكليف</h4>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        ليس الاستخلاف تشريفاً يدعو للتكبر، بل هو تكليف يحمل في طياته المسؤولية والعمل الصالح 
                        والسعي الدائم للإصلاح في الأرض.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-100 rounded-xl text-center">
                    <p className="text-slate-700 font-medium mb-2">﴿وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً﴾</p>
                    <p className="text-xs text-slate-500">سورة البقرة - آية 30</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* The Doctrine - منهج ميزان الوصل */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10"
            >
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-amber-500 to-orange-600 text-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Scroll className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">ما هو مذهب ميزان الوصل؟</CardTitle>
                      <CardDescription className="text-amber-100">
                        فهم المنهج والدستور والمسار
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="p-5 bg-gradient-to-l from-amber-50 to-orange-50 rounded-xl border-r-4 border-amber-500">
                    <p className="text-slate-700 leading-loose text-lg">
                      <span className="font-bold text-amber-700">مذهب ميزان الوصل</span> هو منهاج حياة يستند إلى العدل أساساً للتعامل البشري، 
                      ويدعو إلى <span className="font-semibold">العودة للأصل</span> والتخلص من الزيف والسراب. 
                      هو دعوة عالمية للبشرية جمعاء، لا يفرق بين لون أو جنس أو أرض، 
                      فالمعيار الوحيد هو <span className="font-bold text-amber-600">الالتزام بالدستور والنزاهة</span>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <Sparkle className="w-5 h-5 text-amber-500" />
                      أركان المذهب الخمسة
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {/* الركن الأول: النية والصدق */}
                      <div className="p-4 bg-gradient-to-b from-rose-50 to-white rounded-xl border border-rose-200 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-rose-100 text-rose-700 text-[10px] mb-1">١</Badge>
                        <h5 className="font-bold text-slate-800 text-sm">النية والصدق</h5>
                        <p className="text-[10px] text-slate-500 mt-1">أساس كل أفعالنا</p>
                      </div>
                      {/* الركن الثاني: الاستخلاف والبيئة */}
                      <div className="p-4 bg-gradient-to-b from-emerald-50 to-white rounded-xl border border-emerald-200 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full gradient-emerald flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px] mb-1">٢</Badge>
                        <h5 className="font-bold text-slate-800 text-sm">الاستخلاف</h5>
                        <p className="text-[10px] text-slate-500 mt-1">راعٍ للأرض لا مستهلك</p>
                      </div>
                      {/* الركن الثالث: العدالة والتبادل */}
                      <div className="p-4 bg-gradient-to-b from-amber-50 to-white rounded-xl border border-amber-200 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <Scale className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 text-[10px] mb-1">٣</Badge>
                        <h5 className="font-bold text-slate-800 text-sm">العدالة</h5>
                        <p className="text-[10px] text-slate-500 mt-1">لا ضرر ولا ضرار</p>
                      </div>
                      {/* الركن الرابع: العلم والابتكار */}
                      <div className="p-4 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-200 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 text-[10px] mb-1">٤</Badge>
                        <h5 className="font-bold text-slate-800 text-sm">العلم والابتكار</h5>
                        <p className="text-[10px] text-slate-500 mt-1">عبادة وخدمة للإنسانية</p>
                      </div>
                      {/* الركن الخامس: الوصل والذكر */}
                      <div className="p-4 bg-gradient-to-b from-purple-50 to-white rounded-xl border border-purple-200 text-center col-span-2 md:col-span-1">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
                          <Handshake className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 text-[10px] mb-1">٥</Badge>
                        <h5 className="font-bold text-slate-800 text-sm">الوصل والذكر</h5>
                        <p className="text-[10px] text-slate-500 mt-1">الرابط مع الأصل</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-100 rounded-xl">
                    <p className="text-slate-700 text-center">
                      <span className="font-bold text-emerald-600">لا حدود جغرافية</span> • 
                      <span className="font-bold text-amber-600 mx-2">لا فوارق عنصرية</span> • 
                      <span className="font-bold text-blue-600">المعيار هو الالتزام</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning and Teaching - التعلم والتعليم */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10"
            >
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-blue-500 to-indigo-600 text-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">التعلم والتعليم</CardTitle>
                      <CardDescription className="text-blue-100">
                        واجب كل خليفة نحو نفسه ومجتمعه
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="p-5 bg-gradient-to-l from-blue-50 to-indigo-50 rounded-xl border-r-4 border-blue-500">
                    <p className="text-slate-700 leading-loose text-lg">
                      قال رسول الله ﷺ: <span className="font-bold text-blue-700">"كلكم راعٍ وكلكم مسؤولٌ عن رعيته"</span>، 
                      فكل خليفة يحمل مسؤولية التعلم المستمر والتعليم لمن حوله. العلم في مذهبنا عبادة، 
                      والتعليم صدقة جارية لا تنقطع.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                          <Feather className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">التعلم واجب</h4>
                      </div>
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                          <span className="text-sm text-slate-600">طلب العلم فريضة على كل مسلم ومسلمة</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                          <span className="text-sm text-slate-600">التفقه في الدين وفهم أسرار الشريعة</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                          <span className="text-sm text-slate-600">تعلم ما ينفع الناس ويخدم الحياة</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-5 bg-white rounded-xl border-2 border-indigo-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">التعليم أمانة</h4>
                      </div>
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                          <span className="text-sm text-slate-600">تبليغ العلم وإفادة الآخرين</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                          <span className="text-sm text-slate-600">الصبر على التعليم والتيسير على المتعلم</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                          <span className="text-sm text-slate-600">إخلاص النية في نفع الغير</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Solidarity and Cooperation - التكاتف والتكافل */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-10"
            >
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-purple-500 to-violet-600 text-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Handshake className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">التكاتف والتكافل</CardTitle>
                      <CardDescription className="text-purple-100">
                        المجتمع الواحد كالجسد الواحد
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="p-5 bg-gradient-to-l from-purple-50 to-violet-50 rounded-xl border-r-4 border-purple-500">
                    <p className="text-slate-700 leading-loose text-lg">
                      في مذهب ميزان الوصل، لا يعيش الخليفة لنفسه فقط، بل هو جزء من جسد واحد. 
                      <span className="font-bold text-purple-700"> المؤمن للمؤمن كالبنيان يشد بعضه بعضاً</span>. 
                      التكافل يعني أن نحمل هموم بعضنا، ونتعاون على البر والتقوى.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h5 className="font-bold text-slate-800 mb-2">المواساة</h5>
                      <p className="text-xs text-slate-600">مشاركة الأفراح والأحزان</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h5 className="font-bold text-slate-800 mb-2">التعاون</h5>
                      <p className="text-xs text-slate-600">يد واحدة لا تصفق</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h5 className="font-bold text-slate-800 mb-2">النصرة</h5>
                      <p className="text-xs text-slate-600">نصرة المظلوم والأخذ على يد الظالم</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-100 rounded-xl text-center">
                    <p className="text-slate-700 font-medium">﴿وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ﴾</p>
                    <p className="text-xs text-slate-500 mt-1">سورة المائدة - آية 2</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="p-8 bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl shadow-2xl text-white">
                <h3 className="text-2xl font-bold mb-3">هل أنت مستعد لتصبح خليفة؟</h3>
                <p className="mb-6 opacity-90 max-w-xl mx-auto">
                  انضم لمذهب ميزان الوصل • التزم بالميثاق • كن ابن الوصل • لا حدود بيننا
                </p>
                <Button 
                  size="lg" 
                  onClick={() => { setAuthMode('register'); setShowCovenant(true) }}
                  className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-10 py-6 shadow-xl"
                >
                  ابدأ رحلتك الآن
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Levels - مقياس النزاهة وحسن النية */}
        <section className="py-16 px-4 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
          <div className="container mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-10">
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">مقياس النزاهة وحسن النية</motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-300 max-w-2xl mx-auto">
                شهادة المجتمع على التزام الخلفاء بمبادئ المذهب
              </motion.p>
              <motion.p variants={fadeInUp} className="text-sm text-slate-400 max-w-xl mx-auto mt-2 italic">
                "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى"
              </motion.p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { level: 'خليفة مميز', score: '90%+', desc: 'نزاهة استثنائية', color: 'from-emerald-400 to-green-500', icon: '⭐' }, 
                { level: 'خليفة صادق', score: '70-89%', desc: 'نزاهة عالية', color: 'from-teal-400 to-cyan-500', icon: '✨' }, 
                { level: 'خليفة موثوق', score: '50-69%', desc: 'نزاهة جيدة', color: 'from-amber-400 to-yellow-500', icon: '✓' }, 
                { level: 'تحت المراقبة', score: '30-49%', desc: 'يحتاج تحسين', color: 'from-orange-400 to-red-500', icon: '⚠' }, 
                { level: 'مجمد', score: '< 30%', desc: 'مراجعة الحساب', color: 'from-gray-400 to-gray-600', icon: '❄' }
              ].map((trust, i) => (
                <motion.div key={i} variants={scaleIn} whileHover={{ scale: 1.05, y: -5 }} className={`bg-gradient-to-br ${trust.color} rounded-2xl p-4 text-center shadow-xl cursor-pointer`}>
                  <div className="text-3xl mb-1">{trust.icon}</div>
                  <div className="font-bold text-sm md:text-base">{trust.level}</div>
                  <div className="text-xs opacity-90 mb-1">{trust.score}</div>
                  <div className="text-[10px] opacity-75">{trust.desc}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* شرح المقياس */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                يتم تقييم النزاهة بناءً على التزام الخليفة بميثاق الوصل والعهد، 
                وشهادة المجتمع على حسن تعامله وصدق نيته.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Covenant Modal */}
        <Dialog open={showCovenant} onOpenChange={setShowCovenant}>
          <DialogContent className="max-w-3xl max-h-[90vh] p-0" dir="rtl">
            <DialogHeader className="sr-only">
              <DialogTitle>ميثاق الوصل والعهد</DialogTitle>
              <DialogDescription>دستور الانضمام لمذهب ميزان الوصل</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[85vh] p-6">
              <CovenantCharter onAgree={() => { setCovenantAgreed(true); setShowCovenant(false); setShowAuthModal(true) }} agreed={covenantAgreed} />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Auth Modal */}
        <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">{authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب خليفة'}</DialogTitle>
              <DialogDescription className="text-center">{authMode === 'login' ? 'أدخل بياناتك للوصول إلى حسابك' : 'انضم لمذهب ميزان الوصل • دعوة عالمية للبشرية'}</DialogDescription>
            </DialogHeader>
            <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">دخول</TabsTrigger><TabsTrigger value="register">تسجيل</TabsTrigger></TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div><Label>البريد الإلكتروني</Label><Input type="email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} required /></div>
                  <div><Label>كلمة المرور</Label><Input type="password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} required /></div>
                  <Button type="submit" className="w-full gradient-emerald text-white">تسجيل الدخول</Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div><Label>الاسم الكامل</Label><Input value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} required /></div>
                  <div><Label>البريد الإلكتروني</Label><Input type="email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} required /></div>
                  <div><Label>كلمة المرور</Label><Input type="password" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} required /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>الدولة</Label><Select value={authForm.country} onValueChange={(v) => setAuthForm({...authForm, country: v, city: ''})}><SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger><SelectContent>{locations?.countries.map(c => (<SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>))}</SelectContent></Select></div>
                    <div><Label>المدينة</Label><Select value={authForm.city} onValueChange={(v) => setAuthForm({...authForm, city: v})}><SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger><SelectContent>{authForm.country && locations?.cities[authForm.country]?.map(city => (<SelectItem key={city} value={city}>{city}</SelectItem>))}</SelectContent></Select></div>
                  </div>
                  <Button type="submit" className="w-full gradient-emerald text-white">إنشاء حساب خليفة</Button>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <footer className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center"><Scale className="w-5 h-5 text-white" /></div>
                <div><span className="font-bold text-lg">ميزان الوصل</span><p className="text-xs text-slate-400">مذهب العدل والتبادل</p></div>
              </div>
              <p className="text-slate-300 text-sm text-center md:text-right max-w-lg italic">
                "كلُّ إنسانٍ خليفةٌ في هذه الأرض، والانتماء الحقيقي للأصل لا للأوطان المصطنعة"
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Logged in Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-emerald-50/30 to-teal-50/30">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-emerald-100/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div className="w-10 h-10 rounded-xl gradient-emerald shadow flex items-center justify-center" whileHover={{ scale: 1.1 }}><Scale className="w-5 h-5 text-white" /></motion.div>
              <div><h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">ميزان الوصل</h1></div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative"><Bell className="w-5 h-5" />{unreadCount > 0 && <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2 font-bold border-b">الإشعارات</div>
                  <ScrollArea className="h-64">{notifications.length === 0 ? <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div> : notifications.slice(0, 10).map(n => <div key={n.id} className={`p-3 border-b ${!n.read ? 'bg-emerald-50' : ''}`}><div className="font-medium">{n.title}</div><div className="text-sm text-gray-500">{n.message}</div></div>)}</ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-emerald-300" />
                    ) : (
                      <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                    )}
                    <span className="hidden md:inline">{user.name}</span>
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">خليفة</Badge>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300" />
                      ) : (
                        <div className="w-12 h-12 rounded-full gradient-emerald flex items-center justify-center text-white text-lg font-bold">{user.name[0]}</div>
                      )}
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getTrustBadge(user.trustLevel).class + ' text-white'}>{getTrustBadge(user.trustLevel).icon} {user.trustLevel}</Badge>
                      <span className="text-sm text-gray-500">{formatNumber(user.integrityScore)}%</span>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={openProfileModal}><User className="w-4 h-4 ml-2" />ملفي الشخصي</DropdownMenuItem>
                  <DropdownMenuItem><Clock className="w-4 h-4 ml-2" />رصيد الوقت: {formatTime(user.timeBalance)}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowCovenant(true)}><BookOpen className="w-4 h-4 ml-2" />ميثاق الوصل</DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowAdminDashboard(true)} className="text-purple-600 font-bold">
                        <Lock className="w-4 h-4 ml-2" />لوحة تحكم الخليفة
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500"><LogOut className="w-4 h-4 ml-2" />تسجيل الخروج</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className="gradient-emerald p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">مرحباً، {user.name}!</h2>
                    <Badge className="bg-white/20 text-white">خليفة</Badge>
                  </div>
                  <p className="opacity-90">{user.city && user.country ? `${user.city}، ${locations?.countries.find(c => c.code === user.country)?.name}` : 'مرحباً بك في مذهب ميزان الوصل • لا حدود بيننا'}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="text-center bg-white/20 backdrop-blur rounded-xl px-6 py-3"><div className="text-3xl font-bold">{formatNumber(Math.floor(user.timeBalance / 60))}</div><div className="text-sm opacity-90">ساعة متبقية</div></div>
                  <div className="text-center bg-white/20 backdrop-blur rounded-xl px-6 py-3"><div className="text-3xl font-bold">{formatNumber(user.totalExchanges)}</div><div className="text-sm opacity-90">تبادل ناجح</div></div>
                  <div className="text-center bg-white/20 backdrop-blur rounded-xl px-6 py-3"><div className="text-3xl font-bold">{formatNumber(user.integrityScore)}%</div><div className="text-sm opacity-90">نزاهة</div></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full max-w-3xl mx-auto mb-6 bg-white/80 backdrop-blur">
            <TabsTrigger value="services" className="flex items-center gap-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"><Briefcase className="w-4 h-4" /><span className="hidden sm:inline">الخدمات</span></TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white"><Package className="w-4 h-4" /><span className="hidden sm:inline">المنتجات</span></TabsTrigger>
            <TabsTrigger value="khalifas" className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"><Users className="w-4 h-4" /><span className="hidden sm:inline">الخلفاء</span></TabsTrigger>
            <TabsTrigger value="integrity" className="flex items-center gap-1 data-[state=active]:bg-teal-500 data-[state=active]:text-white"><Shield className="w-4 h-4" /><span className="hidden sm:inline">النزاهة</span></TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"><MessageCircle className="w-4 h-4" /><span className="hidden sm:inline">المجتمع</span></TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1 data-[state=active]:bg-slate-600 data-[state=active]:text-white"><Phone className="w-4 h-4" /><span className="hidden sm:inline">تواصل</span></TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0"><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-500" />إضافة خدمة</CardTitle></CardHeader><CardContent>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div><Label>عنوان الخدمة</Label><Input value={serviceForm.title} onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})} required /></div>
                  <div><Label>الوصف</Label><Textarea value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} rows={3} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>النوع</Label><Select value={serviceForm.type} onValueChange={(v) => setServiceForm({...serviceForm, type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="OFFER">أعرض خدمة</SelectItem><SelectItem value="REQUEST">أطلب خدمة</SelectItem></SelectContent></Select></div>
                    <div><Label>الفئة</Label><Select value={serviceForm.category} onValueChange={(v) => setServiceForm({...serviceForm, category: v})}><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent>{getServiceCategories().map(c => <SelectItem key={c.id || c.name} value={c.name}>{c.nameAr}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <div><Label>المدة (دقيقة)</Label><Input type="number" value={serviceForm.duration} onChange={(e) => setServiceForm({...serviceForm, duration: parseInt(e.target.value) || 60})} /></div>
                  <div>
                    <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" />الصور (اختياري - حتى 4 صور)</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-emerald-300 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors">
                        <Upload className="w-6 h-6 text-emerald-500 mb-1" />
                        <span className="text-sm text-gray-500">اضغط لاختيار صور</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={async (e) => {
                            const images = await handleImageUpload(e.target.files, 'service')
                            if (images.length > 0) {
                              setServiceForm({...serviceForm, images: [...serviceForm.images, ...images]})
                            }
                          }}
                        />
                      </label>
                    </div>
                    {serviceForm.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {serviceForm.images.map((img, i) => (
                          <div key={i} className="relative">
                            <img src={img} alt={`صورة ${i+1}`} className="w-16 h-16 object-cover rounded-lg border" />
                            <button 
                              type="button"
                              onClick={() => setServiceForm({...serviceForm, images: serviceForm.images.filter((_, idx) => idx !== i)})}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full gradient-emerald text-white font-bold">نشر الخدمة</Button>
                </form>
              </CardContent></Card>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold">الخدمات المتاحة</h3><Select value={serviceFilter.type} onValueChange={(v) => { setServiceFilter({...serviceFilter, type: v}); setTimeout(fetchServices, 0) }}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">الكل</SelectItem><SelectItem value="OFFER">عروض</SelectItem><SelectItem value="REQUEST">طلبات</SelectItem></SelectContent></Select></div>
                <div className="grid gap-4">{services.length === 0 ? <Card className="text-center py-8"><CardContent><Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">لا توجد خدمات</p></CardContent></Card> : services.map(s => {
                  const serviceImages = s.images ? JSON.parse(s.images) : []
                  return <Card key={s.id} className="shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-emerald-300 border-2 border-transparent" onClick={() => setSelectedService(s)}><CardContent className="p-4">
                    <div className="flex gap-4">
                      {serviceImages[0] ? (
                        <img src={serviceImages[0]} alt={s.title} className="w-24 h-24 object-cover rounded-lg shrink-0" />
                      ) : (
                        <div className="w-24 h-24 bg-emerald-100 rounded-lg shrink-0 flex items-center justify-center">
                          <Briefcase className="w-10 h-10 text-emerald-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={s.type === 'OFFER' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}>{s.type === 'OFFER' ? 'عرض' : 'طلب'}</Badge>
                              <Badge variant="outline">{s.category}</Badge>
                            </div>
                            <h4 className="font-bold text-lg">{s.title}</h4>
                            <p className="text-gray-600 text-sm line-clamp-2">{s.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatTime(s.duration)}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.user.city || 'غير محدد'}</span>
                            </div>
                          </div>
                          <div className="text-left shrink-0">
                            <div className="flex items-center gap-2 mb-2">
                              {s.user.image ? (
                                <img src={s.user.image} alt={s.user.name} className="w-8 h-8 rounded-full object-cover border border-emerald-300" />
                              ) : (
                                <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center text-white text-sm font-bold">{s.user.name[0]}</div>
                              )}
                              <div>
                                <div className="font-medium text-sm">{s.user.name}</div>
                                <Badge className={getTrustBadge(s.user.trustLevel).class + ' text-xs text-white'}>{s.user.trustLevel}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        {serviceImages.length > 1 && (
                          <div className="flex gap-2 mt-2">
                            {serviceImages.slice(1, 4).map((img: string, i: number) => (
                              <img key={i} src={img} alt={`${s.title} ${i+2}`} className="w-12 h-12 object-cover rounded border" />
                            ))}
                            {serviceImages.length > 4 && (
                              <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500">+{serviceImages.length - 4}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent></Card>
                })}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0"><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-amber-500" />إضافة منتج</CardTitle></CardHeader><CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div><Label>اسم المنتج</Label><Input value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required /></div>
                  <div><Label>الوصف</Label><Textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} rows={2} /></div>
                  <div className="grid grid-cols-2 gap-2"><div><Label>الكمية</Label><Input type="number" value={productForm.quantity} onChange={(e) => setProductForm({...productForm, quantity: parseFloat(e.target.value) || 1})} /></div><div><Label>الوحدة</Label><Select value={productForm.unit} onValueChange={(v) => setProductForm({...productForm, unit: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="كيلو">كيلو</SelectItem><SelectItem value="لتر">لتر</SelectItem><SelectItem value="قطعة">قطعة</SelectItem></SelectContent></Select></div></div>
                  <div className="grid grid-cols-2 gap-2"><div><Label>النوع</Label><Select value={productForm.type} onValueChange={(v) => setProductForm({...productForm, type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="OFFER">أعرض</SelectItem><SelectItem value="REQUEST">أطلب</SelectItem></SelectContent></Select></div><div><Label>الفئة</Label><Select value={productForm.category} onValueChange={(v) => setProductForm({...productForm, category: v})}><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent>{getProductCategories().map(c => <SelectItem key={c.id || c.name} value={c.name}>{c.nameAr}</SelectItem>)}</SelectContent></Select></div></div>
                  <div><Label>الجودة</Label><Select value={productForm.quality} onValueChange={(v) => setProductForm({...productForm, quality: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ممتاز">ممتاز</SelectItem><SelectItem value="جيد جداً">جيد جداً</SelectItem><SelectItem value="جيد">جيد</SelectItem></SelectContent></Select></div>
                  <div>
                    <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" />الصور (اختياري - حتى 4 صور)</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:bg-amber-50 transition-colors">
                        <Upload className="w-6 h-6 text-amber-500 mb-1" />
                        <span className="text-sm text-gray-500">اضغط لاختيار صور</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={async (e) => {
                            const images = await handleImageUpload(e.target.files, 'product')
                            if (images.length > 0) {
                              setProductForm({...productForm, images: [...productForm.images, ...images]})
                            }
                          }}
                        />
                      </label>
                    </div>
                    {productForm.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {productForm.images.map((img, i) => (
                          <div key={i} className="relative">
                            <img src={img} alt={`صورة ${i+1}`} className="w-16 h-16 object-cover rounded-lg border" />
                            <button 
                              type="button"
                              onClick={() => setProductForm({...productForm, images: productForm.images.filter((_, idx) => idx !== i)})}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold">نشر المنتج</Button>
                </form>
              </CardContent></Card>
              <div className="md:col-span-2"><h3 className="text-xl font-bold mb-4">المنتجات المتاحة</h3><div className="grid gap-4">{products.length === 0 ? <Card className="text-center py-8"><CardContent><Package className="w-12 h-12 mx-auto text-gray-300 mb-4" /><p className="text-gray-500">لا توجد منتجات</p></CardContent></Card> : products.map(p => {
                const productImages = p.images ? JSON.parse(p.images) : []
                return <Card key={p.id} className="shadow-lg hover:shadow-xl transition-all cursor-pointer hover:border-amber-300 border-2 border-transparent" onClick={() => setSelectedProduct(p)}><CardContent className="p-4">
                  <div className="flex gap-4">
                    {productImages[0] ? (
                      <img src={productImages[0]} alt={p.name} className="w-24 h-24 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-24 h-24 bg-amber-100 rounded-lg shrink-0 flex items-center justify-center">
                        <Package className="w-10 h-10 text-amber-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-amber-500 text-white">{p.type === 'OFFER' ? 'عرض' : 'طلب'}</Badge>
                            <Badge variant="outline">{p.category}</Badge>
                            <Badge variant="outline" className="text-amber-600 border-amber-300">{p.quality}</Badge>
                          </div>
                          <h4 className="font-bold text-lg">{p.name}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{p.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span>{p.quantity} {p.unit}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.user.city || 'غير محدد'}</span>
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <div className="flex items-center gap-2 mb-2">
                            {p.user.image ? (
                              <img src={p.user.image} alt={p.user.name} className="w-8 h-8 rounded-full object-cover border border-amber-300" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">{p.user.name[0]}</div>
                            )}
                            <div>
                              <div className="font-medium text-sm">{p.user.name}</div>
                              <Badge className={getTrustBadge(p.user.trustLevel).class + ' text-xs text-white'}>{p.user.trustLevel}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      {productImages.length > 1 && (
                        <div className="flex gap-2 mt-2">
                          {productImages.slice(1, 4).map((img: string, i: number) => (
                            <img key={i} src={img} alt={`${p.name} ${i+2}`} className="w-12 h-12 object-cover rounded border" />
                          ))}
                          {productImages.length > 4 && (
                            <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500">+{productImages.length - 4}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent></Card>
              })}</div></div>
            </div>
          </TabsContent>

          <TabsContent value="khalifas">
            <KhalifasTab user={user} toast={toast} />
          </TabsContent>

          <TabsContent value="integrity">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0"><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" />شهادة نزاهتك</CardTitle></CardHeader><CardContent><div className="text-center mb-6"><div className="text-5xl font-bold text-emerald-600 mb-2">{user.integrityScore}%</div><Badge className={getTrustBadge(user.trustLevel).class + ' text-lg px-4 py-2'}>{getTrustBadge(user.trustLevel).icon} {user.trustLevel}</Badge><p className="text-xs text-slate-500 mt-2">شهادة المجتمع على حسن نيتك</p></div><Progress value={user.integrityScore} className="h-4 mb-4" /><div className="space-y-2 text-sm text-gray-600"><p>• شهادة إيجابية: +2% نزاهة</p><p>• شهادة سلبية: -5% نزاهة</p><p>• أقل من 30%: مراجعة الحساب</p></div></CardContent></Card>
              <Card className="shadow-lg border-0"><CardHeader><CardTitle>مقياس النزاهة</CardTitle></CardHeader><CardContent><div className="space-y-3">{[{ level: 'خليفة مميز', score: '90%+', desc: 'نزاهة استثنائية', color: 'trust-excellent', icon: '⭐' }, { level: 'خليفة صادق', score: '70-89%', desc: 'نزاهة عالية', color: 'trust-very-good', icon: '✨' }, { level: 'خليفة موثوق', score: '50-69%', desc: 'نزاهة جيدة', color: 'trust-good', icon: '✓' }, { level: 'تحت المراقبة', score: '30-49%', desc: 'يحتاج تحسين', color: 'trust-warning', icon: '⚠' }, { level: 'مجمد', score: '< 30%', desc: 'مراجعة الحساب', color: 'trust-frozen', icon: '❄' }].map((t, i) => <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${t.color} text-white`}><div className="flex items-center gap-3"><span className="text-2xl">{t.icon}</span><div><span className="font-bold">{t.level}</span><p className="text-xs opacity-80">{t.desc}</p></div></div><span className="font-bold">{t.score}</span></div>)}</div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-500" />
                    مشاركة جديدة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPost} className="space-y-4">
                    <div>
                      <Label>النوع</Label>
                      <Select value={postForm.type} onValueChange={(v) => setPostForm({...postForm, type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="POST">منشور</SelectItem>
                          <SelectItem value="DISCUSSION">نقاش</SelectItem>
                          <SelectItem value="SUGGESTION">اقتراح</SelectItem>
                          <SelectItem value="SUCCESS_STORY">قصة نجاح</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>العنوان</Label>
                      <Input value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} required />
                    </div>
                    <div>
                      <Label>المحتوى</Label>
                      <Textarea value={postForm.content} onChange={(e) => setPostForm({...postForm, content: e.target.value})} rows={4} required />
                    </div>
                    <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold">
                      نشر
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">مجتمع الوصل</h3>
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">لا توجد مشاركات</p>
                      </CardContent>
                    </Card>
                  ) : (
                    posts.map(p => (
                      <Card key={p.id} className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-4">
                          {/* Post Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {p.user.image ? (
                                <img src={p.user.image} alt={p.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-purple-200" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">{p.user.name[0]}</div>
                              )}
                              <div>
                                <div className="font-bold">{p.user.name}</div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{p.type}</Badge>
                                  <span className="text-xs text-gray-500">{formatDate(p.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={getTrustBadge(p.user.trustLevel).class + ' text-white text-xs'}>
                              {p.user.integrityScore}%
                            </Badge>
                          </div>
                          
                          {/* Post Content */}
                          <h4 className="font-bold text-lg mb-2 text-slate-800">{p.title}</h4>
                          <p className="text-slate-600 mb-4 leading-relaxed">{p.content}</p>
                          
                          {/* Islamic Reactions */}
                          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gradient-to-l from-purple-50 via-white to-purple-50 rounded-xl border border-purple-100">
                            <span className="text-sm text-slate-600 ml-2">رد فعل:</span>
                            {[
                              { type: 'POSITIVE', emoji: '🤲', label: 'بارك الله', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300' },
                              { type: 'POSITIVE', emoji: '💚', label: 'ما شاء الله', color: 'bg-teal-100 hover:bg-teal-200 text-teal-700 border-teal-300' },
                              { type: 'POSITIVE', emoji: '✨', label: 'جزاك الله خيراً', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300' },
                              { type: 'NEGATIVE', emoji: '💭', label: 'نصيحة', color: 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300' }
                            ].map((reaction, i) => (
                              <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                onClick={() => handlePostVote(p.id, reaction.type as 'POSITIVE' | 'NEGATIVE')}
                                className={`${reaction.color} border font-medium`}
                              >
                                <span className="ml-1">{reaction.emoji}</span>
                                {reaction.label}
                              </Button>
                            ))}
                          </div>
                          
                          {/* Vote Counts with Islamic Labels */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                              <span>🤲</span>
                              <span className="font-bold">{formatNumber(p.positiveVotes)}</span>
                              <span className="text-xs">بارك الله</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                              <span>💭</span>
                              <span className="font-bold">{formatNumber(p.negativeVotes)}</span>
                              <span className="text-xs">نصيحة</span>
                            </div>
                          </div>
                          
                          {/* Comments Section */}
                          <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <MessageCircle className="w-4 h-4 text-purple-500" />
                              <span className="font-bold text-sm">التعليقات ({formatNumber(p.comments?.length || 0)})</span>
                            </div>
                            
                            {/* Existing Comments */}
                            {p.comments && p.comments.length > 0 && (
                              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {p.comments.map((comment) => (
                                  <div key={comment.id} className="flex gap-2 p-3 bg-slate-50 rounded-xl">
                                    {comment.user.image ? (
                                      <img src={comment.user.image} alt={comment.user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-white text-sm font-bold">{comment.user.name[0]}</div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{comment.user.name}</span>
                                        <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                      </div>
                                      <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Add Comment */}
                            <div className="flex gap-2">
                              <Input
                                placeholder="اكتب تعليقاً..."
                                value={commentForm.content}
                                onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                                className="flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddComment(p.id, commentForm.content)
                                    setCommentForm({ content: '' })
                                  }
                                }}
                              />
                              <Button 
                                size="sm"
                                onClick={() => {
                                  handleAddComment(p.id, commentForm.content)
                                  setCommentForm({ content: '' })
                                }}
                                className="bg-purple-500 hover:bg-purple-600 text-white"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0"><CardHeader><CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5 text-emerald-500" />تواصل معنا</CardTitle></CardHeader><CardContent>
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2"><div><Label>الاسم</Label><Input value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} required /></div><div><Label>البريد</Label><Input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} required /></div></div>
                  <div className="grid grid-cols-2 gap-2"><div><Label>الموضوع</Label><Input value={contactForm.subject} onChange={(e) => setContactForm({...contactForm, subject: e.target.value})} required /></div><div><Label>الفئة</Label><Select value={contactForm.category} onValueChange={(v) => setContactForm({...contactForm, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="GENERAL">استفسار</SelectItem><SelectItem value="SUPPORT">دعم</SelectItem><SelectItem value="COMPLAINT">شكوى</SelectItem><SelectItem value="SUGGESTION">اقتراح</SelectItem></SelectContent></Select></div></div>
                  <div><Label>الرسالة</Label><Textarea value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} rows={4} required /></div>
                  <Button type="submit" className="w-full gradient-emerald text-white"><Send className="w-4 h-4 ml-2" />إرسال</Button>
                </form>
              </CardContent></Card>
              <Card className="shadow-lg border-0"><CardHeader><CardTitle>الأسئلة الشائعة</CardTitle></CardHeader><CardContent className="space-y-4"><div><h4 className="font-bold">كيف يعمل بنك الوقت؟</h4><p className="text-sm text-gray-600">كل خليفة جديد يحصل على 5 ساعات مجانية للتبادل.</p></div><Separator /><div><h4 className="font-bold">ما هو نظام النزاهة؟</h4><p className="text-sm text-gray-600">نظام تصويت مجتمعي لضمان الشفافية والموثوقية.</p></div><Separator /><div><h4 className="font-bold">كيف أزيد رصيد الساعات؟</h4><p className="text-sm text-gray-600">من خلال تقديم خدمات أو منتجات للمجتمع.</p></div></CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Covenant Modal for logged in users */}
      <Dialog open={showCovenant} onOpenChange={setShowCovenant}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0" dir="rtl">
          <DialogHeader className="sr-only">
            <DialogTitle>ميثاق الوصل والعهد</DialogTitle>
            <DialogDescription>دستور الانضمام لمذهب ميزان الوصل</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[85vh] p-6">
            <CovenantCharter agreed={true} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0" dir="rtl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedService?.title}</DialogTitle>
            <DialogDescription>تفاصيل الخدمة</DialogDescription>
          </DialogHeader>
          {selectedService && (() => {
            const serviceImages = selectedService.images ? JSON.parse(selectedService.images) : []
            return (
              <div className="p-6">
                {/* Images Gallery */}
                {serviceImages.length > 0 && (
                  <div className="mb-4">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-100">
                      <img 
                        src={serviceImages[0]} 
                        alt={selectedService.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {serviceImages.length > 1 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {serviceImages.map((img: string, i: number) => (
                          <img 
                            key={i} 
                            src={img} 
                            alt={`${selectedService.title} ${formatNumber(i+1)}`} 
                            className="w-20 h-20 object-cover rounded-lg border-2 border-transparent hover:border-emerald-500 cursor-pointer shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Service Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={selectedService.type === 'OFFER' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}>
                      {selectedService.type === 'OFFER' ? 'عرض خدمة' : 'طلب خدمة'}
                    </Badge>
                    <Badge variant="outline">{selectedService.category}</Badge>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800">{selectedService.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{selectedService.description || 'لا يوجد وصف'}</p>
                  
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(selectedService.duration)}
                    </span>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-bold text-slate-700 mb-2">مقدم الخدمة</h4>
                    <div className="flex items-center gap-3">
                      {selectedService.user.image ? (
                        <img src={selectedService.user.image} alt={selectedService.user.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300" />
                      ) : (
                        <div className="w-12 h-12 rounded-full gradient-emerald flex items-center justify-center text-white text-lg font-bold">
                          {selectedService.user.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold">{selectedService.user.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTrustBadge(selectedService.user.trustLevel).class + ' text-white text-xs'}>
                            {selectedService.user.trustLevel}
                          </Badge>
                          <span className="text-sm text-slate-500">{formatNumber(selectedService.user.integrityScore)}% نزاهة</span>
                        </div>
                        {selectedService.user.city && (
                          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {selectedService.user.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  {selectedService.user.id !== user.id && (
                    <Button 
                      onClick={() => {
                        handleExchangeRequest('SERVICE', selectedService.user.id, selectedService.id, selectedService.duration)
                        setSelectedService(null)
                      }}
                      className="flex-1 gradient-emerald text-white font-bold py-3"
                    >
                      <Handshake className="w-5 h-5 ml-2" />
                      طلب تبادل
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedService(null)} className="px-6">
                    إغلاق
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0" dir="rtl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>تفاصيل المنتج</DialogDescription>
          </DialogHeader>
          {selectedProduct && (() => {
            const productImages = selectedProduct.images ? JSON.parse(selectedProduct.images) : []
            return (
              <div className="p-6">
                {/* Images Gallery */}
                {productImages.length > 0 && (
                  <div className="mb-4">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-100">
                      <img 
                        src={productImages[0]} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {productImages.length > 1 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {productImages.map((img: string, i: number) => (
                          <img 
                            key={i} 
                            src={img} 
                            alt={`${selectedProduct.name} ${formatNumber(i+1)}`} 
                            className="w-20 h-20 object-cover rounded-lg border-2 border-transparent hover:border-amber-500 cursor-pointer shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Product Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500 text-white">
                      {selectedProduct.type === 'OFFER' ? 'عرض منتج' : 'طلب منتج'}
                    </Badge>
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                    <Badge variant="outline" className="text-amber-600 border-amber-300">{selectedProduct.quality}</Badge>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800">{selectedProduct.name}</h2>
                  <p className="text-slate-600 leading-relaxed">{selectedProduct.description || 'لا يوجد وصف'}</p>
                  
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {formatNumber(selectedProduct.quantity)} {selectedProduct.unit}
                    </span>
                  </div>
                  
                  {/* Provider Info */}
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-bold text-slate-700 mb-2">صاحب المنتج</h4>
                    <div className="flex items-center gap-3">
                      {selectedProduct.user.image ? (
                        <img src={selectedProduct.user.image} alt={selectedProduct.user.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-300" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg font-bold">
                          {selectedProduct.user.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold">{selectedProduct.user.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTrustBadge(selectedProduct.user.trustLevel).class + ' text-white text-xs'}>
                            {selectedProduct.user.trustLevel}
                          </Badge>
                        </div>
                        {selectedProduct.user.city && (
                          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {selectedProduct.user.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  {selectedProduct.user.id !== user.id && (
                    <Button 
                      onClick={() => {
                        handleExchangeRequest('PRODUCT', selectedProduct.user.id, selectedProduct.id, 60)
                        setSelectedProduct(null)
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3"
                    >
                      <Handshake className="w-5 h-5 ml-2" />
                      طلب تبادل
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedProduct(null)} className="px-6">
                    إغلاق
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">الملف الشخصي</DialogTitle>
            <DialogDescription className="text-center">تحديث بياناتك الشخصية</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {profileForm.image ? (
                  <img 
                    src={profileForm.image} 
                    alt="صورة الملف" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-300 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full gradient-emerald flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user?.name?.[0] || '?'}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors shadow-md">
                  <Upload className="w-4 h-4 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProfileImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                {uploadingImage ? 'جاري الرفع...' : 'اضغط على الأيقونة لرفع صورة'}
              </p>
            </div>
            
            <div>
              <Label>الاسم الكامل</Label>
              <Input 
                value={profileForm.name} 
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <Input 
                value={profileForm.phone} 
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} 
                placeholder="اختياري"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>الدولة</Label>
                <Select 
                  value={profileForm.country} 
                  onValueChange={(v) => setProfileForm({...profileForm, country: v, city: ''})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.countries.map(c => (
                      <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>المدينة</Label>
                <Select 
                  value={profileForm.city} 
                  onValueChange={(v) => setProfileForm({...profileForm, city: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {profileForm.country && locations?.cities[profileForm.country]?.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>الحي</Label>
              <Input 
                value={profileForm.neighborhood} 
                onChange={(e) => setProfileForm({...profileForm, neighborhood: e.target.value})} 
                placeholder="اختياري"
              />
            </div>
            <Button type="submit" className="w-full gradient-emerald text-white font-bold">
              حفظ التغييرات
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Dashboard */}
      {showAdminDashboard && user?.isAdmin && (
        <AdminDashboard user={user} onClose={() => setShowAdminDashboard(false)} />
      )}

      <footer className="bg-slate-900 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2"><Scale className="w-5 h-5 text-emerald-400" /><span className="font-bold text-lg">ميزان الوصل</span></div>
          <p className="text-slate-300 text-sm italic max-w-lg mx-auto">"كلُّ إنسانٍ خليفةٌ في هذه الأرض، والانتماء الحقيقي للأصل لا للأوطان المصطنعة"</p>
        </div>
      </footer>
    </div>
  )
}
