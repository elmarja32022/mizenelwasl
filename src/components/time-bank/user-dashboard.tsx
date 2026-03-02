'use client';

import { motion } from 'framer-motion';
import { Clock, Star, Award, TrendingUp, MapPin, Settings, LogOut, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    city?: string | null;
    country?: string | null;
    timeBalance: number;
    integrityScore: number;
    trustLevel: string;
    rating: number;
    totalExchanges: number;
  };
  onLogout: () => void;
  notificationsCount: number;
  onShowNotifications: () => void;
}

export function UserDashboard({
  user,
  onLogout,
  notificationsCount,
  onShowNotifications,
}: UserDashboardProps) {
  const hours = Math.floor(user.timeBalance / 60);
  const minutes = user.timeBalance % 60;

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'مميز':
        return 'bg-emerald-500';
      case 'موثوق جداً':
        return 'bg-teal-500';
      case 'موثوق':
        return 'bg-amber-500';
      case 'محذر':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-white/30">
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="h-4 w-4" />
              <span>
                {user.city && user.country ? `${user.city}، ${user.country}` : 'الموقع غير محدد'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 relative"
            onClick={onShowNotifications}
          >
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Time Balance */}
        <Card className="bg-white/20 backdrop-blur-sm border-0">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-amber-300" />
            <div className="text-3xl font-bold">{hours}:{minutes.toString().padStart(2, '0')}</div>
            <div className="text-sm text-white/80">ساعات رصيدك</div>
          </CardContent>
        </Card>

        {/* Integrity Score */}
        <Card className="bg-white/20 backdrop-blur-sm border-0">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-emerald-300" />
            <div className="text-3xl font-bold">{user.integrityScore}%</div>
            <div className="text-sm text-white/80">نقاط النزاهة</div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card className="bg-white/20 backdrop-blur-sm border-0">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
            <div className="text-3xl font-bold">{user.rating.toFixed(1)}</div>
            <div className="text-sm text-white/80">التقييم</div>
          </CardContent>
        </Card>

        {/* Total Exchanges */}
        <Card className="bg-white/20 backdrop-blur-sm border-0">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-teal-300" />
            <div className="text-3xl font-bold">{user.totalExchanges}</div>
            <div className="text-sm text-white/80">تبادل ناجح</div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Level Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">مستوى الثقة</span>
          <Badge className={`${getTrustLevelColor(user.trustLevel)} text-white`}>
            {user.trustLevel}
          </Badge>
        </div>
        <Progress value={user.integrityScore} className="h-2 bg-white/20" />
      </div>
    </motion.div>
  );
}
