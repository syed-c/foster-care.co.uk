"use client";
import Link from "next/link";
import { Button } from '@/components/ui/button';

interface CustomButtonProps {
  text: string;
  link: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const CustomButton = ({ text, link, variant = 'default', size = 'default', className }: CustomButtonProps) => {
  return (
    <Link href={link}>
      <Button variant={variant} size={size} className={className}>
        {text}
      </Button>
    </Link>
  );
};