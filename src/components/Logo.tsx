import Image from "next/image";

type Props = {
  size?: number;
  variant?: "full" | "header";
};

export function Logo({ size = 56, variant = "full" }: Props) {
  if (variant === "header") {
    const width = size * 1.6;
    const height = size;
    return (
      <div className="relative overflow-hidden" style={{ width, height }}>
        <Image
          src="/logo.png"
          alt="Hadassa"
          fill
          priority
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="Hadassa"
      width={size}
      height={size}
      priority
      className="rounded-full object-contain"
      style={{ width: size, height: size }}
    />
  );
}
