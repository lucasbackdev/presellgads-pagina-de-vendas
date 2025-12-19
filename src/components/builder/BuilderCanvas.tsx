import { PageSection, SectionElement, NavbarSettings, FooterSettings } from "@/types/builder";
import { useState, useRef } from "react";

interface BuilderCanvasProps {
  sections: PageSection[];
  navbar: NavbarSettings;
  footer: FooterSettings;
  selectedSection: string | null;
  selectedElement: string | null;
  onSelectSection: (id: string | null) => void;
  onSelectElement: (id: string | null) => void;
  onMoveElement: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
  onUpdateElementPosition: (sectionId: string, elementId: string, position: 'left' | 'center' | 'right') => void;
  previewMode: boolean;
}

export const BuilderCanvas = ({
  sections,
  navbar,
  footer,
  selectedSection,
  selectedElement,
  onSelectSection,
  onSelectElement,
  onMoveElement,
  onUpdateElementPosition,
  previewMode,
}: BuilderCanvasProps) => {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, elementId: string, sectionId: string) => {
    if (previewMode) return;
    setDraggedElement(elementId);
    e.dataTransfer.setData('elementId', elementId);
    e.dataTransfer.setData('sectionId', sectionId);
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string, targetIndex: number) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData('elementId');
    const sectionId = e.dataTransfer.getData('sectionId');
    
    if (sectionId === targetSectionId) {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        const currentIndex = section.elements.findIndex(el => el.id === elementId);
        if (currentIndex < targetIndex) {
          onMoveElement(sectionId, elementId, 'down');
        } else if (currentIndex > targetIndex) {
          onMoveElement(sectionId, elementId, 'up');
        }
      }
    }
    setDraggedElement(null);
  };

  const handlePositionDrop = (e: React.DragEvent, sectionId: string, elementId: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    let position: 'left' | 'center' | 'right' = 'center';
    if (x < width * 0.33) position = 'left';
    else if (x > width * 0.66) position = 'right';
    
    onUpdateElementPosition(sectionId, elementId, position);
    setDraggedElement(null);
  };

  const renderElement = (element: SectionElement, sectionId: string, index: number) => {
    const isSelected = selectedElement === element.id;
    const isDragging = draggedElement === element.id;
    
    const positionStyles: React.CSSProperties = {
      display: 'flex',
      justifyContent: element.position === 'left' ? 'flex-start' : 
                      element.position === 'right' ? 'flex-end' : 'center',
    };

    const baseStyles: React.CSSProperties = {
      fontSize: element.settings.fontSize,
      fontWeight: element.settings.fontWeight,
      color: element.settings.color,
      marginBottom: '16px',
      opacity: isDragging ? 0.5 : 1,
    };

    const wrapperClass = !previewMode 
      ? `relative cursor-move transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-primary/50'}`
      : '';

    const handleClick = (e: React.MouseEvent) => {
      if (!previewMode) {
        e.stopPropagation();
        onSelectElement(element.id);
        onSelectSection(sectionId);
      }
    };

    const elementContent = () => {
      switch (element.type) {
        case 'heading':
          return <h2 style={baseStyles}>{element.content}</h2>;
        case 'text':
          return <p style={baseStyles}>{element.content}</p>;
        case 'button':
          return (
            <a
              href={previewMode ? element.settings.link : undefined}
              style={{
                ...baseStyles,
                backgroundColor: element.settings.backgroundColor,
                color: element.settings.color,
                padding: element.settings.padding,
                borderRadius: element.settings.borderRadius,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              {element.content}
            </a>
          );
        case 'terms':
        case 'policy':
          return (
            <a
              href={previewMode ? element.settings.link : undefined}
              style={{ ...baseStyles, textDecoration: 'underline' }}
            >
              {element.type === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
            </a>
          );
        case 'image':
          return element.settings.src ? (
            <img
              src={element.settings.src}
              alt={element.settings.alt || ''}
              className="max-w-full h-auto"
              style={{ marginBottom: '16px' }}
            />
          ) : (
            <div
              className="flex items-center justify-center bg-muted rounded-lg"
              style={{ width: '100%', height: '200px', marginBottom: '16px' }}
            >
              <span className="text-muted-foreground">Adicione uma URL de imagem</span>
            </div>
          );
        case 'video':
          return element.settings.src ? (
            <video
              src={element.settings.src}
              controls
              className="max-w-full"
              style={{ marginBottom: '16px' }}
            />
          ) : (
            <div
              className="flex items-center justify-center bg-muted rounded-lg"
              style={{ width: '100%', height: '200px', marginBottom: '16px' }}
            >
              <span className="text-muted-foreground">Adicione uma URL de vídeo</span>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        key={element.id}
        draggable={!previewMode}
        onDragStart={(e) => handleDragStart(e, element.id, sectionId)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handlePositionDrop(e, sectionId, element.id)}
        onClick={handleClick}
        className={wrapperClass}
        style={positionStyles}
      >
        {elementContent()}
      </div>
    );
  };

  if (sections.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h3 className="font-display text-lg font-semibold mb-2">Comece a criar</h3>
        <p className="text-sm text-center max-w-xs">
          Adicione uma seção ou escolha um template para começar
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`min-h-full ${previewMode ? '' : 'p-4'}`}>
      {/* Navbar Preview */}
      {navbar.enabled && (
        <nav
          className={`flex items-center justify-between px-8 py-4 ${navbar.floating ? 'mx-4 mt-4 rounded-xl' : ''}`}
          style={{
            backgroundColor: navbar.transparent ? 'transparent' : navbar.backgroundColor,
            backdropFilter: navbar.blur ? 'blur(10px)' : undefined,
            borderRadius: navbar.floating ? navbar.borderRadius : undefined,
            position: previewMode ? 'sticky' : 'relative',
            top: 0,
            zIndex: 50,
          }}
        >
          {navbar.logo && <img src={navbar.logo} alt="Logo" className="h-10" />}
          <div className="flex gap-4">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} className="text-white hover:opacity-80 text-sm">
                {s.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className={`${previewMode ? '' : 'bg-card rounded-xl shadow-card overflow-hidden'}`}>
        {sections.map((section, sectionIndex) => {
          const isSelected = selectedSection === section.id && !selectedElement;
          
          const sectionStyle: React.CSSProperties = {
            padding: section.settings.padding || '80px',
            textAlign: section.settings.textAlign || 'center',
            backgroundColor: section.settings.backgroundColor !== 'transparent' 
              ? section.settings.backgroundColor 
              : undefined,
            background: section.settings.backgroundGradient || undefined,
            backgroundImage: section.settings.backgroundImage 
              ? `url(${section.settings.backgroundImage})` 
              : undefined,
            backgroundSize: section.settings.backgroundImage ? 'cover' : undefined,
            backgroundPosition: section.settings.backgroundImage ? 'center' : undefined,
            color: section.settings.textColor || 'inherit',
            position: 'relative',
          };

          return (
            <section
              key={section.id}
              id={section.id}
              onClick={(e) => {
                if (!previewMode) {
                  e.stopPropagation();
                  onSelectSection(section.id);
                  onSelectElement(null);
                }
              }}
              className={`relative transition-all ${
                !previewMode 
                  ? `cursor-pointer ${isSelected ? 'ring-2 ring-inset ring-primary' : 'hover:ring-2 hover:ring-inset hover:ring-primary/50'}`
                  : ''
              } ${section.settings.animationEnabled ? 'animate-fade-in' : ''}`}
              style={sectionStyle}
            >
              {/* Background Video */}
              {section.settings.backgroundVideo && (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={section.settings.backgroundVideo}
                />
              )}
              
              {/* Background Overlay */}
              {section.settings.backgroundOverlay && (
                <div
                  className="absolute inset-0"
                  style={{ background: section.settings.backgroundOverlay }}
                />
              )}

              {!previewMode && isSelected && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded capitalize z-10">
                  {section.name}
                </div>
              )}
              <div className="max-w-4xl mx-auto px-4 relative z-10">
                {section.elements
                  .sort((a, b) => a.order - b.order)
                  .map((element, index) => renderElement(element, section.id, index))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer Links Preview */}
      {(footer.showTerms || footer.showPolicy) && (
        <div className="flex justify-center gap-4 py-4 text-sm text-muted-foreground">
          {footer.showTerms && <a href={footer.termsLink}>Termos de Uso</a>}
          {footer.showPolicy && <a href={footer.policyLink}>Política de Privacidade</a>}
        </div>
      )}
    </div>
  );
};
