import { UserPlus } from "lucide-react";
import { ImgHTMLAttributes } from "react";

export const Icons = {
  Logo: (props: ImgHTMLAttributes<HTMLImageElement>) => (<img src="/logo.png" alt="logo" {...props} />),
  UserPlus
}

export type Icon = keyof typeof Icons
