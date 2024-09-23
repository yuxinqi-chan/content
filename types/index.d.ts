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

export interface Link extends ULink {
  label: string;
  class?: string;
  click?: (...args: any[]) => void;
}

export interface AsideLink extends Link {
  icon?: string;
  iconClass?: string;
}

export interface HeaderPopoverLink extends Link {
  description?: string;
  icon?: string;
  iconClass?: string;
}

export interface HeaderLink extends Link {
  children?: HeaderPopoverLink[];
}

export interface FooterLink extends Link {}

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
