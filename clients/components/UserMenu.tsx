'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User } from 'lucide-react';

export default function UserMenu() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push('/login');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Đăng nhập
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Đăng ký</Button>
        </Link>
      </div>
    );
  }

  // Extraire les initiales du nom complet ou utiliser le nom d'utilisateur
  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.username?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div className="flex justify-start items-center gap-4">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full"
          >
            <Avatar>
              {user?.picture && (
                <AvatarImage src={user?.picture} />
              )}
              {!user?.picture && (
                <AvatarFallback>{getInitials()}</AvatarFallback>
              )}
            </Avatar>

          </Button>
        </DropdownMenuTrigger>
        <div className="flex flex-col items-start justify-center">
          <p className="text-white font-bold size-4 mb-2 cursor-pointer">{user?.username}</p>
          <p className="text-sm text-white">{user?.fullName}</p>
        </div>
      </div>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.fullName && (
              <p className="font-medium">{user.fullName}</p>
            )}
            <p className="text-sm text-muted-foreground">{user?.username}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex w-full cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Tài khoản</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile/settings" className="flex w-full cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>
        {user?.isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex w-full cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Administration</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 