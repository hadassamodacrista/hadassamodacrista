import Image from "next/image";

export function Logo({ size = 56 }: { size?: number }) {
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
