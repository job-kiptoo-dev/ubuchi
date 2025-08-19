"use client"

import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CartIcon from "./cart-icon"

interface AuthNavProps {
  user: any
  isAdmin?: boolean
}

export default function AuthNav({ user, isAdmin }: AuthNavProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/auth/login">
          <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Sign Up</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <CartIcon userId={user.id} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-emerald-800">{user.email}</div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              My Orders
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={signOut} className="w-full">
              <button type="submit" className="flex w-full items-center cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
