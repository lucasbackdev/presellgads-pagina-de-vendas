import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100),
  fullName: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100).optional(),
});

type Stage = "form" | "awaiting_payment" | "processing_payment";

const paymentUrls: Record<string, string> = {
  monthly: "https://pay.kiwify.com.br/b2ljTnq",
  annual: "https://pay.kiwify.com.br/U04NUHy",
  lifetime: "https://pay.kiwify.com.br/U04NUHy",
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, signOut, profile, loading: authLoading } = useAuth();

  const selectedPlan = (location.state as any)?.plan as "monthly" | "annual" | "lifetime" | undefined;
  const step = (location.state as any)?.step as "payment" | undefined;
  const mode = (location.state as any)?.mode as "signup" | "demo" | undefined;

  const defaultIsLogin = useMemo(() => {
    if (mode === "signup") return false;
    if (step === "payment") return true;
    return true;
  }, [mode, step]);

  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [stage, setStage] = useState<Stage>(step === "payment" ? "awaiting_payment" : "form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Se já estiver logado mas sem plano ativo, cair direto na tela de pagamento/liberação
    if (!authLoading && profile && profile.subscription_status !== "active") {
      setStage("awaiting_payment");
      setIsLogin(true);
    }
  }, [authLoading, profile]);

  const validateForm = () => {
    try {
      if (isLogin) {
        authSchema.pick({ email: true, password: true }).parse({ email, password });
      } else {
        authSchema.parse({ email, password, fullName });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const openPayment = () => {
    if (!selectedPlan) {
      toast.error("Selecione um plano na home para continuar.");
      return;
    }

    setStage("processing_payment");
    window.open(paymentUrls[selectedPlan], "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Email ou senha incorretos");
          } else {
            toast.error(error.message);
          }
          return;
        }

        // Se não estiver ativo, não deixa entrar direto no builder
        if (profile?.subscription_status !== "active") {
          setStage("awaiting_payment");
          return;
        }

        toast.success("Login realizado com sucesso!");
        navigate("/builder");
        return;
      }

      // Signup
      const { error } = await signUp(email, password, fullName);
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Não mantém a sessão logada após cadastro
      await signOut();

      toast.success("Conta criada! Agora faça o pagamento e aguarde a liberação.");
      setStage("awaiting_payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </button>

        <div className="p-8 rounded-3xl bg-card shadow-elevated animate-scale-in">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.png"
              alt="Afility Pages"
              className="w-12 h-12 rounded-xl object-contain"
              loading="lazy"
            />
            <div>
              <h1 className="font-display text-2xl font-bold">
                {stage !== "form" ? "Pagamento & Liberação" : isLogin ? "Entrar" : "Criar Conta"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {stage !== "form"
                  ? "Crie a conta, pague e aguarde a liberação no painel admin"
                  : isLogin
                    ? "Acesse sua conta"
                    : "Comece a criar sites incríveis"}
              </p>
            </div>
          </div>

          {stage !== "form" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    {stage === "awaiting_payment" ? (
                      <p className="text-sm text-muted-foreground">
                        Aguardando pagamento. Clique no botão abaixo para pagar. Depois disso, aguarde a liberação.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Processando pagamento, aguarde para a liberação.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={openPayment}
                disabled={stage === "processing_payment"}
              >
                {stage === "processing_payment" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </span>
                ) : (
                  "Ir para pagamento"
                )}
              </Button>

              <Button variant="outline" size="lg" className="w-full" onClick={() => setStage("form")}
              >
                Voltar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? "border-destructive" : ""}
                    autoComplete="off"
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                  autoComplete="off"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando...
                  </span>
                ) : isLogin ? (
                  "Entrar"
                ) : (
                  "Criar Conta"
                )}
              </Button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
