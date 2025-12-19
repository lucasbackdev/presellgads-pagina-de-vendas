import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageSection, SectionElement, ElementType, NavbarSettings, FooterSettings } from "@/types/builder";
import { 
  Plus, Layout, Type, Image, Square, Video, 
  ChevronDown, ChevronRight, Trash2, Copy, ChevronUp,
  Layers, Settings, AlignLeft, AlignCenter, AlignRight,
  Navigation, FileText, Shield, Move
} from "lucide-react";

interface BuilderSidebarProps {
  sections: PageSection[];
  selectedSection: string | null;
  selectedElement: string | null;
  navbar: NavbarSettings;
  footer: FooterSettings;
  onSelectSection: (id: string | null) => void;
  onSelectElement: (id: string | null) => void;
  onAddSection: (type: string) => void;
  onAddElement: (type: ElementType) => void;
  onUpdateSection: (sectionId: string, updates: Partial<PageSection>) => void;
  onUpdateElement: (sectionId: string, elementId: string, updates: Partial<SectionElement>) => void;
  onDeleteSection: (sectionId: string) => void;
  onDeleteElement: (sectionId: string, elementId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onMoveElement: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
  onUpdateElementPosition: (sectionId: string, elementId: string, position: 'left' | 'center' | 'right') => void;
  onUpdateNavbar: (updates: Partial<NavbarSettings>) => void;
  onUpdateFooter: (updates: Partial<FooterSettings>) => void;
}

const sectionTypes = [
  { type: 'hero', label: 'Hero', icon: Layout },
  { type: 'features', label: 'Recursos', icon: Layers },
  { type: 'about', label: 'Sobre', icon: Type },
  { type: 'gallery', label: 'Galeria', icon: Image },
  { type: 'testimonials', label: 'Depoimentos', icon: Type },
  { type: 'pricing', label: 'Preços', icon: Square },
  { type: 'contact', label: 'Contato', icon: Type },
  { type: 'cta', label: 'CTA', icon: Square },
  { type: 'footer', label: 'Rodapé', icon: Layout },
  { type: 'custom', label: 'Personalizado', icon: Plus },
];

const elementTypes: { type: ElementType; label: string; icon: typeof Type }[] = [
  { type: 'heading', label: 'Título', icon: Type },
  { type: 'text', label: 'Texto', icon: AlignLeft },
  { type: 'button', label: 'Botão', icon: Square },
  { type: 'image', label: 'Imagem', icon: Image },
  { type: 'video', label: 'Vídeo', icon: Video },
  { type: 'terms', label: 'Termos', icon: FileText },
  { type: 'policy', label: 'Política', icon: Shield },
];

export const BuilderSidebar = ({
  sections,
  selectedSection,
  selectedElement,
  navbar,
  footer,
  onSelectSection,
  onSelectElement,
  onAddSection,
  onAddElement,
  onUpdateSection,
  onUpdateElement,
  onDeleteSection,
  onDeleteElement,
  onDuplicateSection,
  onMoveSection,
  onMoveElement,
  onUpdateElementPosition,
  onUpdateNavbar,
  onUpdateFooter,
}: BuilderSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'elements' | 'settings' | 'navbar'>('sections');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const currentSection = sections.find(s => s.id === selectedSection);
  const currentElement = currentSection?.elements.find(e => e.id === selectedElement);

  return (
    <div className="w-[20%] min-w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-sidebar-border shrink-0">
        {[
          { id: 'sections', icon: Layers },
          { id: 'elements', icon: Plus },
          { id: 'settings', icon: Settings },
          { id: 'navbar', icon: Navigation },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-sidebar-primary border-b-2 border-sidebar-primary' 
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4 mx-auto" />
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
                Adicionar Seção
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {sectionTypes.map((section) => (
                  <button
                    key={section.type}
                    onClick={() => onAddSection(section.type)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-sidebar-foreground"
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="text-xs">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-sidebar-border pt-4">
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
                Estrutura da Página
              </h3>
              <div className="space-y-1">
                {sections.map((section, index) => (
                  <div key={section.id}>
                    <div className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group ${
                      selectedSection === section.id 
                        ? 'bg-sidebar-primary/20 text-sidebar-primary' 
                        : 'hover:bg-sidebar-accent text-sidebar-foreground'
                    }`}>
                      <button onClick={() => toggleExpanded(section.id)} className="p-1">
                        {expandedSections.has(section.id) 
                          ? <ChevronDown className="w-3 h-3" />
                          : <ChevronRight className="w-3 h-3" />
                        }
                      </button>
                      <span 
                        onClick={() => { onSelectSection(section.id); onSelectElement(null); }}
                        className="flex-1 text-sm"
                      >
                        {section.name}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <button onClick={() => onMoveSection(section.id, 'up')} disabled={index === 0} className="p-1 hover:bg-sidebar-accent rounded disabled:opacity-30">
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => onMoveSection(section.id, 'down')} disabled={index === sections.length - 1} className="p-1 hover:bg-sidebar-accent rounded disabled:opacity-30">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button onClick={() => onDuplicateSection(section.id)} className="p-1 hover:bg-sidebar-accent rounded">
                          <Copy className="w-3 h-3" />
                        </button>
                        <button onClick={() => onDeleteSection(section.id)} className="p-1 hover:bg-destructive/20 rounded text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {expandedSections.has(section.id) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {section.elements.sort((a, b) => a.order - b.order).map((element, elIndex) => (
                          <div
                            key={element.id}
                            onClick={() => { onSelectSection(section.id); onSelectElement(element.id); }}
                            className={`flex items-center justify-between p-2 rounded text-sm cursor-pointer group ${
                              selectedElement === element.id
                                ? 'bg-sidebar-primary/20 text-sidebar-primary'
                                : 'hover:bg-sidebar-accent text-sidebar-foreground/80'
                            }`}
                          >
                            <span className="capitalize truncate">{element.type}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              <button onClick={(e) => { e.stopPropagation(); onMoveElement(section.id, element.id, 'up'); }} className="p-1 hover:bg-sidebar-accent rounded" disabled={elIndex === 0}>
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); onMoveElement(section.id, element.id, 'down'); }} className="p-1 hover:bg-sidebar-accent rounded" disabled={elIndex === section.elements.length - 1}>
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); onDeleteElement(section.id, element.id); }} className="p-1 hover:bg-destructive/20 rounded text-destructive">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Elements Tab */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
              Adicionar Elemento
            </h3>
            {!selectedSection ? (
              <p className="text-sm text-sidebar-foreground/60 text-center py-4">
                Selecione uma seção primeiro
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {elementTypes.map((element) => (
                  <button
                    key={element.type}
                    onClick={() => onAddElement(element.type)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors text-sidebar-foreground"
                  >
                    <element.icon className="w-5 h-5" />
                    <span className="text-xs">{element.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {currentElement ? (
              <>
                <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">Configurar Elemento</h3>
                <div className="space-y-3">
                  {currentElement.type !== 'image' && currentElement.type !== 'video' && (
                    <div>
                      <Label className="text-xs text-sidebar-foreground/70">Conteúdo</Label>
                      <Input value={currentElement.content} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { content: e.target.value })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Posição</Label>
                    <div className="flex gap-2 mt-1">
                      {(['left', 'center', 'right'] as const).map(pos => (
                        <Button key={pos} variant={currentElement.position === pos ? 'default' : 'outline'} size="sm" onClick={() => onUpdateElementPosition(selectedSection!, currentElement.id, pos)}>
                          {pos === 'left' ? <AlignLeft className="w-4 h-4" /> : pos === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Tamanho da Fonte</Label>
                    <Input value={currentElement.settings.fontSize || '16px'} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, fontSize: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                  </div>

                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Cor</Label>
                    <div className="flex gap-2 mt-1">
                      <input type="color" value={currentElement.settings.color === 'inherit' ? '#ffffff' : currentElement.settings.color || '#ffffff'} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, color: e.target.value } })} className="w-10 h-10 rounded cursor-pointer" />
                      <Input value={currentElement.settings.color || 'inherit'} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, color: e.target.value } })} className="flex-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                    </div>
                  </div>

                  {(currentElement.type === 'button' || currentElement.type === 'terms' || currentElement.type === 'policy') && (
                    <div>
                      <Label className="text-xs text-sidebar-foreground/70">Link URL</Label>
                      <Input value={currentElement.settings.link || '#'} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, link: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="https://..." />
                    </div>
                  )}

                  {currentElement.type === 'button' && (
                    <div>
                      <Label className="text-xs text-sidebar-foreground/70">Cor de Fundo</Label>
                      <div className="flex gap-2 mt-1">
                        <input type="color" value={currentElement.settings.backgroundColor || '#6366f1'} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, backgroundColor: e.target.value } })} className="w-10 h-10 rounded cursor-pointer" />
                        <Input value={currentElement.settings.backgroundColor || '#6366f1'} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, backgroundColor: e.target.value } })} className="flex-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                      </div>
                    </div>
                  )}

                  {(currentElement.type === 'image' || currentElement.type === 'video') && (
                    <>
                      <div>
                        <Label className="text-xs text-sidebar-foreground/70">URL da {currentElement.type === 'image' ? 'Imagem' : 'Vídeo'}</Label>
                        <Input value={currentElement.settings.src || ''} onChange={(e) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, src: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="https://..." />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-sidebar-foreground/70">Usar como Fundo</Label>
                        <Switch checked={currentElement.settings.isBackground || false} onCheckedChange={(checked) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, isBackground: checked } })} />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-sidebar-foreground/70">Animação ao Scroll</Label>
                    <Switch checked={currentElement.settings.animationEnabled || false} onCheckedChange={(checked) => onUpdateElement(selectedSection!, currentElement.id, { settings: { ...currentElement.settings, animationEnabled: checked } })} />
                  </div>
                </div>
              </>
            ) : currentSection ? (
              <>
                <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">Configurar Seção</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Nome da Seção</Label>
                    <Input value={currentSection.name} onChange={(e) => onUpdateSection(currentSection.id, { name: e.target.value })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                  </div>
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Cor de Fundo</Label>
                    <div className="flex gap-2 mt-1">
                      <input type="color" value={currentSection.settings.backgroundColor === 'transparent' ? '#ffffff' : currentSection.settings.backgroundColor || '#ffffff'} onChange={(e) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, backgroundColor: e.target.value } })} className="w-10 h-10 rounded cursor-pointer" />
                      <Input value={currentSection.settings.backgroundColor || 'transparent'} onChange={(e) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, backgroundColor: e.target.value } })} className="flex-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Gradiente</Label>
                    <Input value={currentSection.settings.backgroundGradient || ''} onChange={(e) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, backgroundGradient: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="linear-gradient(...)" />
                  </div>
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Imagem de Fundo</Label>
                    <Input value={currentSection.settings.backgroundImage || ''} onChange={(e) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, backgroundImage: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="https://..." />
                  </div>
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Vídeo de Fundo</Label>
                    <Input value={currentSection.settings.backgroundVideo || ''} onChange={(e) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, backgroundVideo: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="https://..." />
                  </div>
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Overlay/Gradiente sobre Fundo</Label>
                    <Input value={currentSection.settings.backgroundOverlay || ''} onChange={(e) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, backgroundOverlay: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="linear-gradient(...) ou rgba(...)" />
                  </div>
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Padding</Label>
                    <Input value={currentSection.settings.padding || '80px'} onChange={(e) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, padding: e.target.value } })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-sidebar-foreground/70">Animação ao Scroll</Label>
                    <Switch checked={currentSection.settings.animationEnabled || false} onCheckedChange={(checked) => onUpdateSection(currentSection.id, { settings: { ...currentSection.settings, animationEnabled: checked } })} />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-sidebar-foreground/60 text-center py-4">Selecione uma seção ou elemento</p>
            )}
          </div>
        )}

        {/* Navbar/Footer Tab */}
        {activeTab === 'navbar' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">Barra Superior</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-sidebar-foreground/70">Ativar Navbar</Label>
                  <Switch checked={navbar.enabled} onCheckedChange={(checked) => onUpdateNavbar({ enabled: checked })} />
                </div>
                {navbar.enabled && (
                  <>
                    <div>
                      <Label className="text-xs text-sidebar-foreground/70">Logo URL</Label>
                      <Input value={navbar.logo || ''} onChange={(e) => onUpdateNavbar({ logo: e.target.value })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="https://..." />
                    </div>
                    <div>
                      <Label className="text-xs text-sidebar-foreground/70">Cor de Fundo</Label>
                      <div className="flex gap-2 mt-1">
                        <input type="color" value={navbar.backgroundColor || '#1f2937'} onChange={(e) => onUpdateNavbar({ backgroundColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                        <Input value={navbar.backgroundColor || '#1f2937'} onChange={(e) => onUpdateNavbar({ backgroundColor: e.target.value })} className="flex-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-sidebar-foreground/70">Transparente</Label>
                      <Switch checked={navbar.transparent || false} onCheckedChange={(checked) => onUpdateNavbar({ transparent: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-sidebar-foreground/70">Efeito Blur</Label>
                      <Switch checked={navbar.blur || false} onCheckedChange={(checked) => onUpdateNavbar({ blur: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-sidebar-foreground/70">Flutuante</Label>
                      <Switch checked={navbar.floating || false} onCheckedChange={(checked) => onUpdateNavbar({ floating: checked })} />
                    </div>
                    {navbar.floating && (
                      <div>
                        <Label className="text-xs text-sidebar-foreground/70">Raio da Borda</Label>
                        <Input value={navbar.borderRadius || '12px'} onChange={(e) => onUpdateNavbar({ borderRadius: e.target.value })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-sidebar-border pt-4">
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">Rodapé</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-sidebar-foreground/70">Mostrar Termos</Label>
                  <Switch checked={footer.showTerms || false} onCheckedChange={(checked) => onUpdateFooter({ showTerms: checked })} />
                </div>
                {footer.showTerms && (
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Link Termos</Label>
                    <Input value={footer.termsLink || '#'} onChange={(e) => onUpdateFooter({ termsLink: e.target.value })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="https://..." />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-sidebar-foreground/70">Mostrar Política</Label>
                  <Switch checked={footer.showPolicy || false} onCheckedChange={(checked) => onUpdateFooter({ showPolicy: checked })} />
                </div>
                {footer.showPolicy && (
                  <div>
                    <Label className="text-xs text-sidebar-foreground/70">Link Política</Label>
                    <Input value={footer.policyLink || '#'} onChange={(e) => onUpdateFooter({ policyLink: e.target.value })} className="mt-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground" placeholder="https://..." />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
