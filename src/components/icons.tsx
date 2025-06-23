import { UserPlus } from "lucide-react";
import Image, { ImageProps } from "next/image";

export const Icons = {
  Logo: (props: Omit<ImageProps, 'src' | 'alt'>) => (<Image src="/logo.png" alt="logo" {...props} />),
  UserPlus
}

export type Icon = keyof typeof Icons
