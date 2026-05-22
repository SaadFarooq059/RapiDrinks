import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizeClass?: string;
};

type LogoCloudProps = React.ComponentProps<"div">;

const logos: Logo[] = [
  { src: "/s1.png", alt: "Brand 1 Logo", sizeClass: "h-16 md:h-24" },
  { src: "/s2.png", alt: "Brand 2 Logo" },
  { src: "/s3.png", alt: "Brand 3 Logo" },
  { src: "/s4.png", alt: "Brand 4 Logo", sizeClass: "h-16 md:h-24" },
  { src: "/s5.jpg", alt: "Brand 5 Logo", sizeClass: "h-16 md:h-24" },
  { src: "/s6.jpg", alt: "Brand 6 Logo" },
];

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 border border-border",
        className
      )}
      {...props}
    >
      {logos.map((logo, index) => (
        <LogoCard
          key={logo.alt}
          logo={logo}
          className={cn(
            "border-border",
            index % 3 !== 2 && "border-r",
            index < 3 && "border-b",
            index % 2 === 0 ? "bg-secondary/30" : "bg-background"
          )}
        />
      ))}
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 py-8 md:py-10",
        className
      )}
      {...props}
    >
      <img
        alt={logo.alt}
        className={cn(
          "pointer-events-none w-auto max-w-[90%] object-contain select-none dark:brightness-0 dark:invert",
          logo.sizeClass ?? "h-14 md:h-20"
        )}
        height={logo.height || "auto"}
        src={logo.src}
        width={logo.width || "auto"}
      />
      {children}
    </div>
  );
}
