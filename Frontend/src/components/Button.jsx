import React from 'react';

/**
 * Reusable Button component aligned with the DESIGN.md hierarchy
 * and the Obsidian Black & Cool Red theme revisions.
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center gap-2 font-sans font-medium text-sm transition-all duration-200 cursor-pointer rounded-lg px-4 py-2.5 h-10 select-none focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#08080a] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none';

  const variants = {
    primary: 'bg-red-600 border border-red-700 hover:bg-red-500 text-white shadow-md shadow-red-950/20 active:scale-98',
    secondary: 'bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/60 hover:border-zinc-700 text-zinc-300 hover:text-white shadow-sm active:scale-98',
    danger: 'bg-amber-600 border border-amber-700 hover:bg-amber-500 text-white shadow-md shadow-amber-950/20 active:scale-98',
    ghost: 'bg-transparent hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 active:scale-98 border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
