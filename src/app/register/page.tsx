'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react'

interface RegistrationFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "applicant" | "employer";
}
const Registration: React.FC = () => {
    const [formData, setFormData] = useState<RegistrationFormData>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "applicant",
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputValue = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = (e: any) => {

    }
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                        <UserCheck className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    required
                                    value={formData.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputValue("name", e.target.value)}
                                    className={`pl-10 `}
                                />
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <Label htmlFor="userName">Username *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="userName"
                                    type="text"
                                    placeholder="Choose a username"
                                    required
                                    value={formData.username}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputValue("username", e.target.value)}
                                    // className={`pl-10 ${errors.userName ? "border-destructive" : ""
                                    className={`pl-10 `}
                                />
                            </div>
                            {/* {errors.userName && (
                                <p className="text-sm text-destructive">
                                    {errors.userName.message}
                                </p>
                            )} */}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputValue("email", e.target.value)}
                                    // {...register("email")}
                                    required
                                    className={`pl-10 `}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2 w-full">
                            <Label htmlFor="role">I am a *</Label>
                            {/* <Controller
                                name="role"
                                control={control}
                                render={({ field }) => ( */}
                            <Select value={formData.role} onValueChange={(value: "applicant" | "employer") => handleInputValue("role", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="applicant">Job Applicant</SelectItem>
                                    <SelectItem value="employer">Employer</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* )} */}
                            {/* ></Controller> */}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    required
                                    value={formData.password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputValue("password", e.target.value)}
                                    // {...register("password")}
                                    className={`pl-10 pr-10 `}
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputValue("confirmPassword", e.target.value)}
                                    // {...register("confirmPassword")}
                                    className={`pl-10 pr-10 `}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?
                                <Link
                                    href="/login"
                                    className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Registration