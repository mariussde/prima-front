import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
}

export function Logo({ className = "", showText = true, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo-marius.svg"
        alt="Prima Logo"
        width={96}
        height={96}
        className="h-16 w-16 md:h-20 md:w-20 object-contain"
        priority
      />
      {/* {showText && <span className="font-bold">Prima</span>} */}
    </Link>
  );
}
