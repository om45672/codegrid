import { UserRole } from '@/lib/generated/prisma/enums'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
export const Navbar = ({ userRole }: { userRole: UserRole }) => {
    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-white/15 dark:hover:bg-black/15">
                <div className='px-6 py-4 flex justify-between items-center'>
                    <Link href={"/"} className="flex items-center gap-2">
                        <Image src={"/logo.svg"} alt="TreeBio" width={42} height={42} />
                        <span className="font-bold text-2xl tracking-widest text-amber-300">
                            Codegrid
                        </span>
                    </Link>
                    <div className='flex items-center gap-4'>
                        <ModeToggle />
                        <Link
                            href="/problems"
                            className="text-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
                        >
                            <Button variant={"outline"} size={"default"} className='hover:bg-amber-500 dark:hover:bg-amber-500 hover:cursor-pointer hover:text-white dark:hover:text-white rounded-lg'>
                                Problems
                            </Button>
                        </Link>
                        <Link
                            href="/about"
                            className="text-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
                        >
                            <Button variant={"outline"} size={"default"} className='hover:bg-amber-500 dark:hover:bg-amber-500 hover:cursor-pointer hover:text-white dark:hover:text-white rounded-lg'>
                                About
                            </Button>
                        </Link>
                        <Link
                            href="/profile"
                            className="text-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400"
                        >
                            <Button variant={"outline"} size={"default"} className='hover:bg-amber-500 dark:hover:bg-amber-500 hover:cursor-pointer hover:text-white dark:hover:text-white rounded-lg'>
                                Profile
                            </Button>
                        </Link>

                        
                        <Show when={"signed-in"}>
                            {
                                userRole && userRole === UserRole.ADMIN && (
                                    <Link href={"/create-problem"} className="text-md font-medium text-zinc-600 dark:text-zinc-400 hover:text-amber-600 cursor-pointer dark:hover:text-amber-400">
                                        <Button variant={"outline"} size={"default"} className='hover:bg-amber-500 dark:hover:bg-amber-500 hover:cursor-pointer hover:text-white dark:hover:text-white rounded-lg'>
                                            Create Problem
                                        </Button>
                                    </Link>
                                )
                            }
                            <UserButton />
                        </Show>
                        <Show when={"signed-out"}>
                            <SignInButton>
                                <Button
                                    size="sm"
                                    className="text-sm font-medium bg-slate-700 hover:bg-slate-900 hover:cursor-pointer text-white rounded-lg"
                                >
                                    Sign in
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button
                                    size="sm"
                                    className="text-sm font-medium bg-amber-400 hover:cursor-pointer hover:bg-amber-500 text-white rounded-lg"
                                >
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </Show>
                    </div>

                </div>
            </div>
        </nav>

    )
}
