import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Layers, Palette, Download, Eye, Moon, Sun, Snowflake, Gift, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import painelImg from "@/assets/painel.png";
import plataformaImg from "@/assets/plataforma.png";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = (plan: string) => {
    const message = encodeURIComponent(`Olá, Lucas. Quero adquirir o plano ${plan}.`);
    return `https://wa.me/5521975560574?text=${message}`;
  };

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: Layers, title: "Seções Prontas", desc: "Dezenas de seções pré-construídas para escolher" },
    { icon: Palette, title: "Design Personalizado", desc: "Edite cores, fontes e estilos em tempo real" },
    { icon: Eye, title: "Preview ao Vivo", desc: "Veja suas mudanças instantaneamente" },
    { icon: Download, title: "Exportar ZIP", desc: "Baixe HTML, CSS e assets prontos" },
  ];

  // Snow particles
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
    size: 4 + Math.random() * 8,
  }));

  // Twinkle lights colors
  const twinkleLights = [
    { color: '#22c55e', delay: 0 },
    { color: '#ef4444', delay: 0.2 },
    { color: '#3b82f6', delay: 0.4 },
    { color: '#eab308', delay: 0.6 },
    { color: '#22c55e', delay: 0.8 },
    { color: '#ef4444', delay: 1.0 },
    { color: '#3b82f6', delay: 1.2 },
    { color: '#eab308', delay: 1.4 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Snow Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white/80 animate-snowfall"
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              fontSize: `${flake.size}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Floating Header */}
      <header 
        className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-6xl transition-all duration-300"
      >
        <div 
          className="glass-strong rounded-2xl px-6 h-16 flex items-center justify-between"
          style={{ 
            backdropFilter: `blur(${Math.min(20 + scrollY * 0.05, 40)}px)`
          }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Presell Gads" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
        <div className="container mx-auto text-center relative z-10">
          <h1 
            className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            Crie Sites <span className="gradient-text">Incríveis</span>
            <br />Sem Escrever Código
          </h1>
          <p 
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" 
            style={{ animationDelay: '0.2s', transform: `translateY(${scrollY * 0.05}px)` }}
          >
            O construtor visual mais poderoso para criar landing pages, portfólios e sites completos em minutos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {/* Main CTA with Christmas lights */}
            <div className="relative group">
              {/* Twinkle lights around button */}
              <div className="absolute -top-3 left-0 right-0 flex justify-center gap-4">
                {twinkleLights.map((light, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-christmas-twinkle"
                    style={{
                      backgroundColor: light.color,
                      boxShadow: `0 0 8px ${light.color}, 0 0 16px ${light.color}`,
                      animationDelay: `${light.delay}s`,
                    }}
                  />
                ))}
              </div>
              
              <a 
                href={whatsappLink('vitalício')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #dc2626 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite',
                }}
              >
                <Gift className="w-5 h-5" />
                <span>Oferta de Natal de <s className="opacity-60">R$ 227</s> por R$ 127/único</span>
              </a>
              
              {/* Bottom twinkle lights */}
              <div className="absolute -bottom-3 left-0 right-0 flex justify-center gap-4">
                {twinkleLights.slice().reverse().map((light, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-christmas-twinkle"
                    style={{
                      backgroundColor: light.color,
                      boxShadow: `0 0 8px ${light.color}, 0 0 16px ${light.color}`,
                      animationDelay: `${light.delay + 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            <Button variant="outline" size="xl" onClick={scrollToDemo}>
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Section with Painel Image */}
      <section id="demo-section" className="py-20 px-6 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Painel do Construtor
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Interface intuitiva e poderosa para criar suas páginas
          </p>
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-elevated border border-border">
            <img 
              src={painelImg} 
              alt="Painel do construtor Presell Gads" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Plataforma de Aulas
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Acesso vitalício a todas as aulas e atualizações futuras
          </p>
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-elevated border border-border">
            <img 
              src={plataformaImg} 
              alt="Plataforma de aulas Presell Gads" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 
            className="font-display text-3xl md:text-4xl font-bold text-center mb-4"
            style={{ opacity: Math.min(1, (scrollY - 200) / 200) }}
          >
            Tudo que você precisa
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Ferramentas profissionais para criar qualquer tipo de página web
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliation Section - Golden Card */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div 
            className="relative p-8 md:p-12 rounded-3xl overflow-hidden animate-gold-glitter"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 25%, #B8860B 50%, #DAA520 75%, #FFD700 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 4s ease infinite, goldGlitter 2s ease-in-out infinite',
            }}
          >
            {/* Glitter border effect */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shimmer 2s linear infinite',
              }}
            />
            
            {/* Stars decoration */}
            <div className="absolute top-4 right-4 animate-sparkle">
              <Star className="w-8 h-8 text-white/80 fill-white/40" />
            </div>
            <div className="absolute top-8 left-8 animate-sparkle" style={{ animationDelay: '0.5s' }}>
              <Star className="w-6 h-6 text-white/60 fill-white/20" />
            </div>
            <div className="absolute bottom-8 right-12 animate-sparkle" style={{ animationDelay: '1s' }}>
              <Star className="w-5 h-5 text-white/70 fill-white/30" />
            </div>
            
            <div className="relative z-10 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-amber-900">
                💰 Programa de Afiliação
              </h2>
              <p className="text-lg md:text-xl text-amber-800 mb-6 max-w-2xl mx-auto">
                A partir de <strong>Janeiro de 2026</strong>, o produto passará a custar <strong>R$ 297</strong>.
                Seja um afiliado e ganhe <strong className="text-2xl">50% de comissão</strong> por cada venda!
              </p>
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <p className="text-amber-900 font-bold text-2xl md:text-3xl">
                  R$ 148,50 de comissão por venda!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-muted/30" id="pricing">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Planos Simples
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Escolha o plano ideal para você e comece a criar hoje
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Monthly Plan */}
            <div className="relative p-8 rounded-3xl bg-card shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 animate-fade-in-up">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-muted rounded-full text-sm font-medium">
                Mais Flexível
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Mensal</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-5xl font-bold">R$47</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Acesso completo ao builder', 'Seções ilimitadas', 'Exportar projetos', 'Templates premium', 'Suporte prioritário'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <a 
                href={whatsappLink('mensal')}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                >
                  Assinar Mensal
                </Button>
              </a>
            </div>

            {/* Annual Plan */}
            <div className="relative p-8 rounded-3xl gradient-border glow-border animate-fade-in-up hover:-translate-y-2 transition-all duration-500" style={{ animationDelay: '0.1s' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full text-sm font-medium">
                Melhor Valor
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Anual</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-5xl font-bold">R$227</span>
                <span className="text-muted-foreground">/ano</span>
              </div>
              <p className="text-sm text-accent font-medium mb-6">Economize R$337 por ano!</p>
              <ul className="space-y-4 mb-8">
                {['Tudo do plano mensal', '12 meses de acesso', 'Economia de 60%', 'Novos templates grátis', 'Suporte VIP'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <a 
                href={whatsappLink('anual')}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                >
                  Assinar Anual
                </Button>
              </a>
            </div>

            {/* Lifetime Christmas Plan */}
            <div 
              className="relative p-8 rounded-3xl overflow-hidden animate-fade-in-up hover:-translate-y-2 transition-all duration-500" 
              style={{ animationDelay: '0.2s' }}
            >
              {/* Christmas Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-green-700 to-red-600 animate-christmas-gradient" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_70%)]" />
              
              {/* Twinkle lights on card */}
              <div className="absolute top-0 left-0 right-0 flex justify-between px-4 py-2">
                {twinkleLights.map((light, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-christmas-twinkle"
                    style={{
                      backgroundColor: light.color,
                      boxShadow: `0 0 6px ${light.color}, 0 0 12px ${light.color}`,
                      animationDelay: `${light.delay}s`,
                    }}
                  />
                ))}
              </div>
              
              {/* Sparkle Effects */}
              <div className="absolute top-8 right-4 animate-sparkle">
                <Snowflake className="w-6 h-6 text-white/80" />
              </div>
              <div className="absolute top-16 left-4 animate-sparkle" style={{ animationDelay: '0.5s' }}>
                <Snowflake className="w-4 h-4 text-white/60" />
              </div>
              <div className="absolute bottom-24 right-8 animate-sparkle" style={{ animationDelay: '1s' }}>
                <Snowflake className="w-5 h-5 text-white/70" />
              </div>

              {/* Santa on top */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-4xl animate-bounce-slow">
                🎅
              </div>

              {/* Glowing border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-glow-pulse" />
              
              <div className="relative z-10 pt-4">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full text-sm font-bold flex items-center gap-1 animate-pulse">
                  <Gift className="w-4 h-4" />
                  Oferta de Natal!
                </div>
                
                <h3 className="font-display text-2xl font-bold mb-2 text-white mt-4">Vitalício</h3>
                
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg text-white/60 line-through">R$227</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display text-5xl font-bold text-white">R$127</span>
                  <span className="text-white/80">/único</span>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
                  <p className="text-xs text-white font-medium text-center">
                    ⏰ Oferta válida até 31/12/2025
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {['Acesso VITALÍCIO', 'Todas as atualizações futuras', 'Templates exclusivos', 'Suporte premium', 'Sem mensalidades'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href={whatsappLink('vitalício')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-white text-red-600 hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Garantir Oferta de Natal
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Lifetime availability notice */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground bg-muted/50 inline-block px-6 py-3 rounded-full">
              💡 O plano <strong>Vitalício</strong> ficará disponível por <strong>R$297,00</strong> a partir de <strong>Janeiro de 2026</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Presell Gads" 
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Presell Gads. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
