export type ElementType = 'heading' | 'text' | 'button' | 'image' | 'video' | 'list' | 'divider' | 'terms' | 'policy';

export type ElementPosition = 'left' | 'center' | 'right';

export interface SectionElement {
  id: string;
  type: ElementType;
  content: string;
  order: number;
  position: ElementPosition;
  settings: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    link?: string;
    src?: string;
    alt?: string;
    width?: string;
    height?: string;
    textAlign?: 'left' | 'center' | 'right';
    isBackground?: boolean;
    animationEnabled?: boolean;
    animationType?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
  };
}

export interface NavbarSettings {
  enabled: boolean;
  backgroundColor?: string;
  transparent?: boolean;
  blur?: boolean;
  floating?: boolean;
  borderRadius?: string;
  logo?: string;
  position?: 'fixed' | 'sticky' | 'absolute';
}

export interface FooterSettings {
  termsLink?: string;
  policyLink?: string;
  showTerms?: boolean;
  showPolicy?: boolean;
}

export interface PageSection {
  id: string;
  name: string;
  type: string;
  settings: {
    backgroundColor?: string;
    backgroundGradient?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundOverlay?: string;
    padding?: string;
    textAlign?: 'left' | 'center' | 'right';
    textColor?: string;
    animationEnabled?: boolean;
  };
  elements: SectionElement[];
}

export interface PageConfig {
  navbar: NavbarSettings;
  footer: FooterSettings;
  sections: PageSection[];
}

export interface HistoryState {
  sections: PageSection[];
  navbar: NavbarSettings;
  footer: FooterSettings;
}

export interface Template {
  id: string;
  name: string;
  category: 'presell' | 'landing' | 'homepage' | 'blog';
  complexity: 'minimal' | 'medium' | 'robust';
  thumbnail: string;
  config: PageConfig;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  config: PageConfig;
}

export type SectionType = 
  | 'hero'
  | 'features'
  | 'about'
  | 'services'
  | 'gallery'
  | 'testimonials'
  | 'pricing'
  | 'team'
  | 'contact'
  | 'cta'
  | 'faq'
  | 'footer'
  | 'custom';
