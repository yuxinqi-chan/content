import type {
  Link as ULink,
  Avatar,
  Badge,
  Chip,
  Command,
  Tooltip,
} from "#ui/types";
import type { ParsedContent } from "@nuxt/content";
import type { Avatar, Badge, Link } from "#ui/types";

export interface NLink extends ULink {
  label: string;
  class?: string;
  click?: (...args: any[]) => void;
}

export interface AsideLink extends NLink {
  icon?: string;
  iconClass?: string;
}

export interface HeaderPopoverLink extends NLink {
  description?: string;
  icon?: string;
  iconClass?: string;
}

export interface HeaderLink extends NLink {
  children?: HeaderPopoverLink[];
}

export interface FooterLink extends NLink {}

export interface BlogPost extends ParsedContent {
  title: string;
  description: string;
  date: string;
  image?: HTMLImageElement;
  badge?: Badge;
  authors?: ({
    name: string;
    description?: string;
    avatar?: Avatar;
  } & Link)[];
}
