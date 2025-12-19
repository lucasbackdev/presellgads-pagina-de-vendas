import { Template, PageSection, NavbarSettings, FooterSettings } from '@/types/builder';

const defaultNavbar: NavbarSettings = {
  enabled: true,
  backgroundColor: '#1f2937',
  transparent: false,
  blur: false,
  floating: false,
  borderRadius: '0px',
  position: 'fixed'
};

const defaultFooter: FooterSettings = {
  showTerms: true,
  showPolicy: true,
  termsLink: '#',
  policyLink: '#'
};

// Pre-sell Templates
const presellMinimal: PageSection[] = [
  {
    id: 'hero-1',
    name: 'Hero',
    type: 'hero',
    settings: {
      backgroundColor: '#111827',
      padding: '100px',
      textAlign: 'center',
      textColor: '#ffffff'
    },
    elements: [
      { id: 'el-1', type: 'heading', content: 'Descubra o Segredo Para [Benefício Principal]', order: 0, position: 'center', settings: { fontSize: '42px', fontWeight: 'bold', color: '#ffffff', animationEnabled: true, animationType: 'fade' } },
      { id: 'el-2', type: 'text', content: 'Uma frase poderosa que gera curiosidade e desejo', order: 1, position: 'center', settings: { fontSize: '18px', color: '#9ca3af', animationEnabled: true, animationType: 'slide-up' } },
      { id: 'el-3', type: 'button', content: 'QUERO SABER MAIS', order: 2, position: 'center', settings: { backgroundColor: '#10b981', color: '#ffffff', padding: '16px 48px', borderRadius: '8px', link: '#', animationEnabled: true, animationType: 'scale' } }
    ]
  },
  {
    id: 'content-1',
    name: 'Conteúdo',
    type: 'features',
    settings: {
      backgroundColor: '#ffffff',
      padding: '80px',
      textAlign: 'center',
      textColor: '#111827'
    },
    elements: [
      { id: 'el-4', type: 'heading', content: 'Por que você precisa disso?', order: 0, position: 'center', settings: { fontSize: '32px', fontWeight: 'bold', color: '#111827' } },
      { id: 'el-5', type: 'text', content: 'Explicação dos benefícios e como vai transformar a vida do cliente', order: 1, position: 'center', settings: { fontSize: '16px', color: '#4b5563' } }
    ]
  },
  {
    id: 'cta-1',
    name: 'CTA Final',
    type: 'cta',
    settings: {
      backgroundGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-6', type: 'heading', content: 'Não Perca Essa Oportunidade!', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-7', type: 'button', content: 'ACESSAR AGORA', order: 1, position: 'center', settings: { backgroundColor: '#ffffff', color: '#10b981', padding: '18px 56px', borderRadius: '8px', link: '#' } }
    ]
  }
];

const presellMedium: PageSection[] = [
  {
    id: 'hero-1',
    name: 'Hero',
    type: 'hero',
    settings: {
      backgroundGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
      padding: '120px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-1', type: 'text', content: '🔥 OFERTA EXCLUSIVA', order: 0, position: 'center', settings: { fontSize: '14px', color: '#fbbf24' } },
      { id: 'el-2', type: 'heading', content: 'A Estratégia Secreta de 7 Dígitos', order: 1, position: 'center', settings: { fontSize: '48px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-3', type: 'text', content: 'Descubra como pessoas comuns estão faturando mais de R$100.000 por mês trabalhando de casa', order: 2, position: 'center', settings: { fontSize: '20px', color: '#e0e7ff' } },
      { id: 'el-4', type: 'button', content: 'REVELAR O MÉTODO', order: 3, position: 'center', settings: { backgroundColor: '#fbbf24', color: '#1e3a8a', padding: '18px 56px', borderRadius: '12px', link: '#' } }
    ]
  },
  {
    id: 'proof-1',
    name: 'Prova Social',
    type: 'testimonials',
    settings: {
      backgroundColor: '#f3f4f6',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-5', type: 'heading', content: '+5.000 Pessoas Já Transformaram Suas Vidas', order: 0, position: 'center', settings: { fontSize: '32px', fontWeight: 'bold', color: '#111827' } },
      { id: 'el-6', type: 'text', content: '"Esse método mudou completamente minha vida financeira. Em 3 meses já estava faturando 5 dígitos!"', order: 1, position: 'center', settings: { fontSize: '18px', color: '#4b5563' } }
    ]
  },
  {
    id: 'benefits-1',
    name: 'Benefícios',
    type: 'features',
    settings: {
      backgroundColor: '#ffffff',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-7', type: 'heading', content: 'O Que Você Vai Receber:', order: 0, position: 'center', settings: { fontSize: '32px', fontWeight: 'bold', color: '#111827' } },
      { id: 'el-8', type: 'text', content: '✅ Módulo 1 - Estratégia Completa\n✅ Módulo 2 - Ferramentas Secretas\n✅ Módulo 3 - Automação Total\n✅ Bônus Exclusivos', order: 1, position: 'center', settings: { fontSize: '18px', color: '#4b5563' } }
    ]
  },
  {
    id: 'urgency-1',
    name: 'Urgência',
    type: 'cta',
    settings: {
      backgroundColor: '#dc2626',
      padding: '60px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-9', type: 'heading', content: '⏰ VAGAS LIMITADAS!', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-10', type: 'text', content: 'Apenas 47 vagas restantes. Garanta a sua agora!', order: 1, position: 'center', settings: { fontSize: '18px', color: '#fef2f2' } },
      { id: 'el-11', type: 'button', content: 'GARANTIR MINHA VAGA', order: 2, position: 'center', settings: { backgroundColor: '#ffffff', color: '#dc2626', padding: '18px 56px', borderRadius: '8px', link: '#' } }
    ]
  }
];

const presellRobust: PageSection[] = [
  ...presellMedium,
  {
    id: 'video-1',
    name: 'Vídeo de Vendas',
    type: 'hero',
    settings: {
      backgroundColor: '#000000',
      padding: '60px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-12', type: 'heading', content: 'Assista ao Vídeo Completo', order: 0, position: 'center', settings: { fontSize: '28px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-13', type: 'video', content: '', order: 1, position: 'center', settings: { src: '', width: '100%' } }
    ]
  },
  {
    id: 'guarantee-1',
    name: 'Garantia',
    type: 'features',
    settings: {
      backgroundColor: '#f0fdf4',
      padding: '60px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-14', type: 'heading', content: '🛡️ Garantia de 7 Dias', order: 0, position: 'center', settings: { fontSize: '32px', fontWeight: 'bold', color: '#166534' } },
      { id: 'el-15', type: 'text', content: 'Se você não ficar 100% satisfeito, devolvemos seu dinheiro sem perguntas.', order: 1, position: 'center', settings: { fontSize: '18px', color: '#15803d' } }
    ]
  }
];

// Landing Page Templates
const landingMinimal: PageSection[] = [
  {
    id: 'hero-1',
    name: 'Hero',
    type: 'hero',
    settings: {
      backgroundColor: '#ffffff',
      padding: '100px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-1', type: 'heading', content: 'Solução Simples para [Problema]', order: 0, position: 'center', settings: { fontSize: '48px', fontWeight: 'bold', color: '#111827' } },
      { id: 'el-2', type: 'text', content: 'Uma descrição clara e objetiva do que você oferece', order: 1, position: 'center', settings: { fontSize: '18px', color: '#6b7280' } },
      { id: 'el-3', type: 'button', content: 'Começar Grátis', order: 2, position: 'center', settings: { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 40px', borderRadius: '6px', link: '#' } }
    ]
  },
  {
    id: 'features-1',
    name: 'Recursos',
    type: 'features',
    settings: {
      backgroundColor: '#f9fafb',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-4', type: 'heading', content: 'Por que nos escolher?', order: 0, position: 'center', settings: { fontSize: '32px', fontWeight: 'bold', color: '#111827' } },
      { id: 'el-5', type: 'text', content: 'Três motivos principais que diferenciam sua solução', order: 1, position: 'center', settings: { fontSize: '16px', color: '#6b7280' } }
    ]
  }
];

const landingMedium: PageSection[] = [
  ...landingMinimal,
  {
    id: 'social-proof',
    name: 'Prova Social',
    type: 'testimonials',
    settings: {
      backgroundColor: '#ffffff',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-6', type: 'heading', content: 'Empresas que confiam em nós', order: 0, position: 'center', settings: { fontSize: '24px', fontWeight: '600', color: '#374151' } }
    ]
  },
  {
    id: 'cta-1',
    name: 'CTA',
    type: 'cta',
    settings: {
      backgroundGradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-7', type: 'heading', content: 'Pronto para começar?', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-8', type: 'button', content: 'Criar Conta Grátis', order: 1, position: 'center', settings: { backgroundColor: '#ffffff', color: '#2563eb', padding: '16px 48px', borderRadius: '8px', link: '#' } }
    ]
  }
];

const landingRobust: PageSection[] = [
  ...landingMedium,
  {
    id: 'pricing-1',
    name: 'Preços',
    type: 'pricing',
    settings: {
      backgroundColor: '#f9fafb',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-9', type: 'heading', content: 'Planos e Preços', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#111827' } },
      { id: 'el-10', type: 'text', content: 'Escolha o plano ideal para você', order: 1, position: 'center', settings: { fontSize: '18px', color: '#6b7280' } }
    ]
  },
  {
    id: 'faq-1',
    name: 'FAQ',
    type: 'faq',
    settings: {
      backgroundColor: '#ffffff',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-11', type: 'heading', content: 'Perguntas Frequentes', order: 0, position: 'center', settings: { fontSize: '32px', fontWeight: 'bold', color: '#111827' } }
    ]
  }
];

// Homepage Templates
const homepageMinimal: PageSection[] = [
  {
    id: 'hero-1',
    name: 'Hero',
    type: 'hero',
    settings: {
      backgroundColor: '#18181b',
      padding: '120px',
      textAlign: 'left'
    },
    elements: [
      { id: 'el-1', type: 'heading', content: 'Sua Empresa', order: 0, position: 'left', settings: { fontSize: '56px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-2', type: 'text', content: 'Transformando ideias em realidade desde 2020', order: 1, position: 'left', settings: { fontSize: '20px', color: '#a1a1aa' } },
      { id: 'el-3', type: 'button', content: 'Conhecer →', order: 2, position: 'left', settings: { backgroundColor: 'transparent', color: '#ffffff', padding: '0', borderRadius: '0', link: '#' } }
    ]
  }
];

const homepageMedium: PageSection[] = [
  ...homepageMinimal,
  {
    id: 'services-1',
    name: 'Serviços',
    type: 'services',
    settings: {
      backgroundColor: '#ffffff',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-4', type: 'heading', content: 'Nossos Serviços', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#18181b' } }
    ]
  },
  {
    id: 'about-1',
    name: 'Sobre',
    type: 'about',
    settings: {
      backgroundColor: '#f4f4f5',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-5', type: 'heading', content: 'Sobre Nós', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#18181b' } },
      { id: 'el-6', type: 'text', content: 'Nossa história e missão', order: 1, position: 'center', settings: { fontSize: '18px', color: '#52525b' } }
    ]
  }
];

const homepageRobust: PageSection[] = [
  ...homepageMedium,
  {
    id: 'team-1',
    name: 'Equipe',
    type: 'team',
    settings: {
      backgroundColor: '#ffffff',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-7', type: 'heading', content: 'Nossa Equipe', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#18181b' } }
    ]
  },
  {
    id: 'contact-1',
    name: 'Contato',
    type: 'contact',
    settings: {
      backgroundColor: '#18181b',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-8', type: 'heading', content: 'Entre em Contato', order: 0, position: 'center', settings: { fontSize: '36px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-9', type: 'text', content: 'contato@suaempresa.com', order: 1, position: 'center', settings: { fontSize: '18px', color: '#a1a1aa' } }
    ]
  }
];

// Blog Templates
const blogMinimal: PageSection[] = [
  {
    id: 'header-1',
    name: 'Header',
    type: 'hero',
    settings: {
      backgroundColor: '#ffffff',
      padding: '60px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-1', type: 'heading', content: 'Blog', order: 0, position: 'center', settings: { fontSize: '48px', fontWeight: 'bold', color: '#111827' } },
      { id: 'el-2', type: 'text', content: 'Artigos, novidades e insights', order: 1, position: 'center', settings: { fontSize: '18px', color: '#6b7280' } }
    ]
  }
];

const blogMedium: PageSection[] = [
  {
    id: 'header-1',
    name: 'Header',
    type: 'hero',
    settings: {
      backgroundGradient: 'linear-gradient(135deg, #f0abfc 0%, #c084fc 100%)',
      padding: '80px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-1', type: 'heading', content: 'Nosso Blog', order: 0, position: 'center', settings: { fontSize: '48px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-2', type: 'text', content: 'Conteúdo exclusivo para você crescer', order: 1, position: 'center', settings: { fontSize: '20px', color: '#fdf4ff' } }
    ]
  },
  {
    id: 'featured-1',
    name: 'Destaque',
    type: 'features',
    settings: {
      backgroundColor: '#ffffff',
      padding: '60px',
      textAlign: 'left'
    },
    elements: [
      { id: 'el-3', type: 'heading', content: 'Artigo em Destaque', order: 0, position: 'left', settings: { fontSize: '14px', fontWeight: '600', color: '#a855f7' } },
      { id: 'el-4', type: 'heading', content: 'Título do Artigo Principal', order: 1, position: 'left', settings: { fontSize: '32px', fontWeight: 'bold', color: '#111827' } }
    ]
  }
];

const blogRobust: PageSection[] = [
  ...blogMedium,
  {
    id: 'categories-1',
    name: 'Categorias',
    type: 'features',
    settings: {
      backgroundColor: '#f9fafb',
      padding: '40px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-5', type: 'heading', content: 'Categorias', order: 0, position: 'center', settings: { fontSize: '24px', fontWeight: 'bold', color: '#111827' } }
    ]
  },
  {
    id: 'newsletter-1',
    name: 'Newsletter',
    type: 'cta',
    settings: {
      backgroundColor: '#7c3aed',
      padding: '60px',
      textAlign: 'center'
    },
    elements: [
      { id: 'el-6', type: 'heading', content: 'Receba Novidades', order: 0, position: 'center', settings: { fontSize: '32px', fontWeight: 'bold', color: '#ffffff' } },
      { id: 'el-7', type: 'text', content: 'Assine nossa newsletter e receba conteúdo exclusivo', order: 1, position: 'center', settings: { fontSize: '16px', color: '#ede9fe' } },
      { id: 'el-8', type: 'button', content: 'Inscrever-se', order: 2, position: 'center', settings: { backgroundColor: '#ffffff', color: '#7c3aed', padding: '14px 40px', borderRadius: '8px', link: '#' } }
    ]
  }
];

export const templates: Template[] = [
  // Pre-sell
  {
    id: 'presell-minimal',
    name: 'Pré-Venda Minimalista',
    category: 'presell',
    complexity: 'minimal',
    thumbnail: '🎯',
    config: { navbar: { ...defaultNavbar, enabled: false }, footer: defaultFooter, sections: presellMinimal }
  },
  {
    id: 'presell-medium',
    name: 'Pré-Venda Completa',
    category: 'presell',
    complexity: 'medium',
    thumbnail: '🚀',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: presellMedium }
  },
  {
    id: 'presell-robust',
    name: 'Pré-Venda Profissional',
    category: 'presell',
    complexity: 'robust',
    thumbnail: '💎',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: presellRobust }
  },
  // Landing
  {
    id: 'landing-minimal',
    name: 'Landing Simples',
    category: 'landing',
    complexity: 'minimal',
    thumbnail: '📄',
    config: { navbar: { ...defaultNavbar, transparent: true }, footer: defaultFooter, sections: landingMinimal }
  },
  {
    id: 'landing-medium',
    name: 'Landing Padrão',
    category: 'landing',
    complexity: 'medium',
    thumbnail: '📊',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: landingMedium }
  },
  {
    id: 'landing-robust',
    name: 'Landing Completa',
    category: 'landing',
    complexity: 'robust',
    thumbnail: '🏆',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: landingRobust }
  },
  // Homepage
  {
    id: 'homepage-minimal',
    name: 'Homepage Clean',
    category: 'homepage',
    complexity: 'minimal',
    thumbnail: '🏠',
    config: { navbar: { ...defaultNavbar, transparent: true }, footer: defaultFooter, sections: homepageMinimal }
  },
  {
    id: 'homepage-medium',
    name: 'Homepage Corporativa',
    category: 'homepage',
    complexity: 'medium',
    thumbnail: '🏢',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: homepageMedium }
  },
  {
    id: 'homepage-robust',
    name: 'Homepage Completa',
    category: 'homepage',
    complexity: 'robust',
    thumbnail: '🌟',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: homepageRobust }
  },
  // Blog
  {
    id: 'blog-minimal',
    name: 'Blog Simples',
    category: 'blog',
    complexity: 'minimal',
    thumbnail: '✏️',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: blogMinimal }
  },
  {
    id: 'blog-medium',
    name: 'Blog Moderno',
    category: 'blog',
    complexity: 'medium',
    thumbnail: '📝',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: blogMedium }
  },
  {
    id: 'blog-robust',
    name: 'Blog Profissional',
    category: 'blog',
    complexity: 'robust',
    thumbnail: '📚',
    config: { navbar: defaultNavbar, footer: defaultFooter, sections: blogRobust }
  }
];

export const getTemplatesByCategory = (category: Template['category']) => 
  templates.filter(t => t.category === category);

export const getTemplateById = (id: string) => 
  templates.find(t => t.id === id);
