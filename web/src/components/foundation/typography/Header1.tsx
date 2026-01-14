import type { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ITypographyH1Props {
  children : ReactNode;
  className?: string;
}

export const Header1:FC<ITypographyH1Props> = ({ children, className }) => {
    const classes = twMerge('scroll-m-20 text-4xl font-extrabold tracking-tight text-balance', className);  
    return (
        <h1 className={classes}>
            {children }
        </h1>
    );
};