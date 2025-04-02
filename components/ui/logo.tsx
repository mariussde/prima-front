import Link from "next/link"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
        <span className="font-bold">P</span>
      </div>
      {showText && <span className="font-bold">Prima</span>}
    </Link>
  )
} 
