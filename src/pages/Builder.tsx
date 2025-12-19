import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Moon, Sun, Download, Eye, ArrowLeft, Undo2, Redo2, Save, FolderOpen
} from "lucide-react";
import JSZip from "jszip";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { TemplatesModal } from "@/components/builder/TemplatesModal";
import { SaveProjectModal } from "@/components/builder/SaveProjectModal";
import { LoadProjectModal } from "@/components/builder/LoadProjectModal";
import { SectionElement, PageSection, ElementType, NavbarSettings, FooterSettings, PageConfig } from "@/types/builder";
import { useBuilderHistory } from "@/hooks/useBuilderHistory";
import { useBuilderStorage } from "@/hooks/useBuilderStorage";

const defaultNavbar: NavbarSettings = {
  enabled: false,
  backgroundColor: '#1f2937',
  transparent: false,
  blur: false,
  floating: false,
  borderRadius: '0px',
  position: 'fixed'
};

const defaultFooter: FooterSettings = {
  showTerms: false,
  showPolicy: false,
  termsLink: '#',
  policyLink: '#'
};

const Builder = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const {
    currentState,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useBuilderHistory([], defaultNavbar, defaultFooter);

  const { savedProjects, saveProject, loadProject, deleteProject } = useBuilderStorage();
  
  const [sections, setSections] = useState<PageSection[]>(currentState.sections);
  const [navbar, setNavbar] = useState<NavbarSettings>(currentState.navbar);
  const [footer, setFooter] = useState<FooterSettings>(currentState.footer);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  // Sync state from history
  useEffect(() => {
    setSections(currentState.sections);
    setNavbar(currentState.navbar);
    setFooter(currentState.footer);
  }, [currentState]);

  const saveToHistory = useCallback((newSections: PageSection[], newNavbar?: NavbarSettings, newFooter?: FooterSettings) => {
    pushState({
      sections: newSections,
      navbar: newNavbar || navbar,
      footer: newFooter || footer
    });
  }, [pushState, navbar, footer]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && profile && profile.subscription_status !== 'active') {
      toast.error("Sua assinatura não está ativa. Faça o pagamento para acessar o builder.");
      navigate('/');
    }
  }, [profile, loading, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setShowSaveModal(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const createElement = (type: ElementType, order: number): SectionElement => ({
    id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: type === 'heading' ? 'Novo Título' : 
             type === 'text' ? 'Novo texto aqui' : 
             type === 'button' ? 'Clique Aqui' :
             type === 'terms' ? 'Termos de Uso' :
             type === 'policy' ? 'Política de Privacidade' :
             '',
    order,
    position: 'center',
    settings: {
      fontSize: type === 'heading' ? '32px' : '16px',
      fontWeight: type === 'heading' ? 'bold' : 'normal',
      color: 'inherit',
      animationEnabled: false,
      animationType: 'fade',
      ...(type === 'button' && { 
        backgroundColor: '#6366f1', 
        color: '#ffffff', 
        padding: '12px 24px',
        borderRadius: '8px',
        link: '#'
      }),
      ...((type === 'terms' || type === 'policy') && {
        link: '#'
      }),
      ...(type === 'image' && { width: '100%', height: 'auto', src: '', alt: '', isBackground: false }),
      ...(type === 'video' && { width: '100%', src: '', isBackground: false }),
    },
  });

  const addSection = (type: string) => {
    const timestamp = Date.now();
    const newSection: PageSection = {
      id: `section-${timestamp}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      settings: {
        backgroundColor: 'transparent',
        padding: '80px',
        textAlign: 'center',
        animationEnabled: false,
      },
      elements: [],
    };

    // Add default elements based on section type
    if (type === 'hero') {
      newSection.elements = [
        createElement('heading', 0),
        createElement('text', 1),
        createElement('button', 2),
      ];
      newSection.elements[0].content = 'Bem-vindo ao seu site';
      newSection.elements[0].settings.fontSize = '48px';
      newSection.elements[1].content = 'Uma descrição incrível para seu projeto';
      newSection.elements[1].settings.fontSize = '18px';
      newSection.elements[2].content = 'Começar Agora';
      newSection.settings.padding = '120px';
      newSection.settings.backgroundGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (type === 'features') {
      newSection.elements = [
        { ...createElement('heading', 0), content: 'Nossos Recursos', settings: { ...createElement('heading', 0).settings, fontSize: '36px' } },
        { ...createElement('text', 1), content: 'Descubra tudo que oferecemos' },
      ];
    } else if (type === 'contact') {
      newSection.elements = [
        { ...createElement('heading', 0), content: 'Entre em Contato', settings: { ...createElement('heading', 0).settings, fontSize: '36px' } },
        { ...createElement('text', 1), content: 'Estamos aqui para ajudar' },
      ];
    } else if (type === 'gallery') {
      newSection.elements = [
        { ...createElement('heading', 0), content: 'Nossa Galeria', settings: { ...createElement('heading', 0).settings, fontSize: '36px' } },
      ];
    } else if (type === 'testimonials') {
      newSection.elements = [
        { ...createElement('heading', 0), content: 'O que dizem nossos clientes', settings: { ...createElement('heading', 0).settings, fontSize: '36px' } },
      ];
    } else if (type === 'pricing') {
      newSection.elements = [
        { ...createElement('heading', 0), content: 'Nossos Planos', settings: { ...createElement('heading', 0).settings, fontSize: '36px' } },
        { ...createElement('text', 1), content: 'Escolha o melhor para você' },
      ];
    } else if (type === 'cta') {
      newSection.elements = [
        { ...createElement('heading', 0), content: 'Pronto para começar?', settings: { ...createElement('heading', 0).settings, fontSize: '36px' } },
        { ...createElement('button', 1), content: 'Fale Conosco', settings: { backgroundColor: '#6366f1', color: '#ffffff', padding: '16px 48px', borderRadius: '8px', link: '#' } },
      ];
      newSection.settings.backgroundGradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else if (type === 'footer') {
      newSection.elements = [
        { ...createElement('text', 0), content: '© 2024 Sua Empresa. Todos os direitos reservados.', settings: { fontSize: '14px', color: 'inherit' } },
      ];
      if (footer.showTerms) {
        newSection.elements.push({ ...createElement('terms', 1), settings: { link: footer.termsLink } });
      }
      if (footer.showPolicy) {
        newSection.elements.push({ ...createElement('policy', 2), settings: { link: footer.policyLink } });
      }
      newSection.settings.backgroundColor = '#1f2937';
      newSection.settings.padding = '40px';
    }

    const newSections = [...sections, newSection];
    setSections(newSections);
    saveToHistory(newSections);
    setSelectedSection(newSection.id);
    toast.success('Seção adicionada!');
  };

  const addElement = (type: ElementType) => {
    if (!selectedSection) {
      toast.error('Selecione uma seção primeiro');
      return;
    }

    const section = sections.find(s => s.id === selectedSection);
    const order = section ? section.elements.length : 0;
    const newElement = createElement(type, order);

    const newSections = sections.map(s => 
      s.id === selectedSection 
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    );
    setSections(newSections);
    saveToHistory(newSections);
    setSelectedElement(newElement.id);
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    const newSections = sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    setSections(newSections);
    saveToHistory(newSections);
  };

  const updateElement = (sectionId: string, elementId: string, updates: Partial<SectionElement>) => {
    const newSections = sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            elements: section.elements.map(el =>
              el.id === elementId ? { ...el, ...updates } : el
            ),
          }
        : section
    );
    setSections(newSections);
    saveToHistory(newSections);
  };

  const deleteSection = (sectionId: string) => {
    const newSections = sections.filter(s => s.id !== sectionId);
    setSections(newSections);
    saveToHistory(newSections);
    if (selectedSection === sectionId) {
      setSelectedSection(null);
      setSelectedElement(null);
    }
    toast.success('Seção removida');
  };

  const deleteElement = (sectionId: string, elementId: string) => {
    const newSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, elements: section.elements.filter(el => el.id !== elementId) }
        : section
    );
    setSections(newSections);
    saveToHistory(newSections);
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  const duplicateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const newSection = {
        ...section,
        id: `section-${Date.now()}`,
        name: `${section.name} (cópia)`,
        elements: section.elements.map(el => ({ ...el, id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` })),
      };
      const index = sections.findIndex(s => s.id === sectionId);
      const newSections = [...sections];
      newSections.splice(index + 1, 0, newSection);
      setSections(newSections);
      saveToHistory(newSections);
      toast.success('Seção duplicada!');
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === sectionId);
    if (direction === 'up' && index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      setSections(newSections);
      saveToHistory(newSections);
    } else if (direction === 'down' && index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setSections(newSections);
      saveToHistory(newSections);
    }
  };

  const moveElement = (sectionId: string, elementId: string, direction: 'up' | 'down') => {
    const newSections = sections.map(section => {
      if (section.id !== sectionId) return section;
      
      const elements = [...section.elements];
      const index = elements.findIndex(e => e.id === elementId);
      
      if (direction === 'up' && index > 0) {
        [elements[index - 1], elements[index]] = [elements[index], elements[index - 1]];
        elements.forEach((el, i) => el.order = i);
      } else if (direction === 'down' && index < elements.length - 1) {
        [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
        elements.forEach((el, i) => el.order = i);
      }
      
      return { ...section, elements };
    });
    
    setSections(newSections);
    saveToHistory(newSections);
  };

  const updateElementPosition = (sectionId: string, elementId: string, position: 'left' | 'center' | 'right') => {
    updateElement(sectionId, elementId, { position });
  };

  const updateNavbar = (updates: Partial<NavbarSettings>) => {
    const newNavbar = { ...navbar, ...updates };
    setNavbar(newNavbar);
    saveToHistory(sections, newNavbar, footer);
  };

  const updateFooter = (updates: Partial<FooterSettings>) => {
    const newFooter = { ...footer, ...updates };
    setFooter(newFooter);
    saveToHistory(sections, navbar, newFooter);
  };

  const loadTemplate = (config: PageConfig) => {
    setSections(config.sections);
    setNavbar(config.navbar);
    setFooter(config.footer);
    saveToHistory(config.sections, config.navbar, config.footer);
    setShowTemplates(false);
    toast.success('Template carregado!');
  };

  const handleSaveProject = (name: string) => {
    const config: PageConfig = { navbar, footer, sections };
    saveProject(name, config);
    setShowSaveModal(false);
  };

  const handleLoadProject = (id: string) => {
    const project = loadProject(id);
    if (project) {
      setSections(project.config.sections);
      setNavbar(project.config.navbar);
      setFooter(project.config.footer);
      saveToHistory(project.config.sections, project.config.navbar, project.config.footer);
      setShowLoadModal(false);
    }
  };

  const generateHTML = () => {
    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Site</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
`;

    // Navbar
    if (navbar.enabled) {
      html += `  <nav class="navbar">\n`;
      if (navbar.logo) {
        html += `    <img src="${navbar.logo}" alt="Logo" class="navbar-logo">\n`;
      }
      html += `    <div class="navbar-links">\n`;
      sections.forEach(section => {
        html += `      <a href="#${section.id}">${section.name}</a>\n`;
      });
      html += `    </div>\n  </nav>\n`;
    }

    sections.forEach(section => {
      const hasBackgroundVideo = section.settings.backgroundVideo;
      html += `  <section class="section section-${section.type}${section.settings.animationEnabled ? ' animate-on-scroll' : ''}" id="${section.id}">\n`;
      
      if (hasBackgroundVideo) {
        html += `    <video class="section-bg-video" autoplay muted loop playsinline><source src="${section.settings.backgroundVideo}" type="video/mp4"></video>\n`;
      }
      if (section.settings.backgroundOverlay) {
        html += `    <div class="section-overlay"></div>\n`;
      }
      
      html += `    <div class="container">\n`;
      
      section.elements.forEach(element => {
        const animClass = element.settings.animationEnabled ? ` animate-${element.settings.animationType || 'fade'}` : '';
        const posClass = ` pos-${element.position}`;
        
        if (element.type === 'heading') {
          html += `      <h2 class="element-heading${animClass}${posClass}">${element.content}</h2>\n`;
        } else if (element.type === 'text') {
          html += `      <p class="element-text${animClass}${posClass}">${element.content}</p>\n`;
        } else if (element.type === 'button') {
          html += `      <a href="${element.settings.link || '#'}" class="element-button${animClass}${posClass}">${element.content}</a>\n`;
        } else if (element.type === 'terms') {
          html += `      <a href="${element.settings.link || '#'}" class="element-link${posClass}">Termos de Uso</a>\n`;
        } else if (element.type === 'policy') {
          html += `      <a href="${element.settings.link || '#'}" class="element-link${posClass}">Política de Privacidade</a>\n`;
        } else if (element.type === 'image' && element.settings.src) {
          if (element.settings.isBackground) {
            // Background images handled in CSS
          } else {
            html += `      <img src="${element.settings.src}" alt="${element.settings.alt || ''}" class="element-image${animClass}${posClass}">\n`;
          }
        } else if (element.type === 'video' && element.settings.src) {
          if (!element.settings.isBackground) {
            html += `      <video src="${element.settings.src}" class="element-video${animClass}${posClass}" controls></video>\n`;
          }
        }
      });
      
      html += `    </div>\n`;
      html += `  </section>\n`;
    });

    html += `  <script src="animations.js"></script>\n`;
    html += `</body>
</html>`;
    return html;
  };

  const generateCSS = () => {
    let css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.section {
  position: relative;
  padding: 80px 0;
  overflow: hidden;
}

.section-bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 0;
}

.section-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

/* Position classes */
.pos-left { text-align: left; }
.pos-center { text-align: center; }
.pos-right { text-align: right; }

/* Navbar */
.navbar {
  position: ${navbar.position || 'fixed'};
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background-color: ${navbar.transparent ? 'transparent' : navbar.backgroundColor};
  ${navbar.blur ? 'backdrop-filter: blur(10px);' : ''}
  ${navbar.floating ? 'margin: 16px; border-radius: ' + (navbar.borderRadius || '12px') + ';' : ''}
}

.navbar-logo {
  height: 40px;
  width: auto;
}

.navbar-links {
  display: flex;
  gap: 24px;
}

.navbar-links a {
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.3s;
}

.navbar-links a:hover {
  opacity: 0.8;
}

/* Animation classes */
.animate-fade { opacity: 0; transition: opacity 0.6s ease-out; }
.animate-fade.visible { opacity: 1; }

.animate-slide-up { opacity: 0; transform: translateY(30px); transition: all 0.6s ease-out; }
.animate-slide-up.visible { opacity: 1; transform: translateY(0); }

.animate-slide-down { opacity: 0; transform: translateY(-30px); transition: all 0.6s ease-out; }
.animate-slide-down.visible { opacity: 1; transform: translateY(0); }

.animate-scale { opacity: 0; transform: scale(0.9); transition: all 0.6s ease-out; }
.animate-scale.visible { opacity: 1; transform: scale(1); }

.animate-on-scroll { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

`;

    sections.forEach(section => {
      css += `#${section.id} {\n`;
      if (section.settings.backgroundColor && section.settings.backgroundColor !== 'transparent') {
        css += `  background-color: ${section.settings.backgroundColor};\n`;
      }
      if (section.settings.backgroundGradient) {
        css += `  background: ${section.settings.backgroundGradient};\n`;
      }
      if (section.settings.backgroundImage) {
        css += `  background-image: url('${section.settings.backgroundImage}');\n`;
        css += `  background-size: cover;\n`;
        css += `  background-position: center;\n`;
      }
      if (section.settings.backgroundOverlay) {
        css += `}\n#${section.id} .section-overlay {\n`;
        css += `  background: ${section.settings.backgroundOverlay};\n`;
      }
      css += `  padding: ${section.settings.padding || '80px'} 0;\n`;
      css += `  text-align: ${section.settings.textAlign || 'center'};\n`;
      if (section.settings.textColor) {
        css += `  color: ${section.settings.textColor};\n`;
      }
      css += `}\n\n`;
    });

    return css;
  };

  const generateJS = () => {
    return `// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('[class*="animate-"]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => observer.observe(el));
});
`;
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    
    zip.file('index.html', generateHTML());
    zip.file('styles.css', generateCSS());
    zip.file('animations.js', generateJS());
    
    const publicFolder = zip.folder('public');
    publicFolder?.file('README.txt', 'Coloque suas imagens e assets aqui.');

    const content = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'meu-site.zip';
    link.click();
    
    toast.success('Download iniciado!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-border glass-strong flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Afility Pages" 
              className="w-8 h-8 rounded-lg object-contain"
            />
            <span className="font-display font-semibold">Afility Pages</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Desfazer (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Refazer (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
          >
            Templates
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLoadModal(true)}
          >
            <FolderOpen className="w-4 h-4 mr-1" />
            Carregar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveModal(true)}
          >
            <Save className="w-4 h-4 mr-1" />
            Salvar
          </Button>

          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-1" />
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Button variant="hero" size="sm" onClick={downloadZip}>
            <Download className="w-4 h-4 mr-1" />
            Download ZIP
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {!previewMode && (
          <BuilderSidebar
            sections={sections}
            selectedSection={selectedSection}
            selectedElement={selectedElement}
            navbar={navbar}
            footer={footer}
            onSelectSection={setSelectedSection}
            onSelectElement={setSelectedElement}
            onAddSection={addSection}
            onAddElement={addElement}
            onUpdateSection={updateSection}
            onUpdateElement={updateElement}
            onDeleteSection={deleteSection}
            onDeleteElement={deleteElement}
            onDuplicateSection={duplicateSection}
            onMoveSection={moveSection}
            onMoveElement={moveElement}
            onUpdateElementPosition={updateElementPosition}
            onUpdateNavbar={updateNavbar}
            onUpdateFooter={updateFooter}
          />
        )}

        {/* Preview */}
        <div className={`${previewMode ? 'w-full' : 'w-[80%]'} bg-muted/30 overflow-auto`}>
          <BuilderCanvas
            sections={sections}
            navbar={navbar}
            footer={footer}
            selectedSection={selectedSection}
            selectedElement={selectedElement}
            onSelectSection={setSelectedSection}
            onSelectElement={setSelectedElement}
            onMoveElement={moveElement}
            onUpdateElementPosition={updateElementPosition}
            previewMode={previewMode}
          />
        </div>
      </div>

      {/* Modals */}
      <TemplatesModal
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelectTemplate={loadTemplate}
      />

      <SaveProjectModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveProject}
      />

      <LoadProjectModal
        open={showLoadModal}
        onOpenChange={setShowLoadModal}
        projects={savedProjects}
        onLoad={handleLoadProject}
        onDelete={deleteProject}
      />
    </div>
  );
};

export default Builder;
