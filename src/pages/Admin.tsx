import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  Play,
  Pause,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_plan: "free" | "monthly" | "annual";
  subscription_status: "pending" | "active" | "paused" | "expired" | "cancelled";
  subscription_activated_at: string | null;
  subscription_expires_at: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-get-profiles");
      if (error) throw error;
      setUsers(data.profiles || []);
    } catch (e: any) {
      toast.error("Erro ao carregar usuários");
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateProfile = async (userId: string, updates: Record<string, any>) => {
    try {
      const { error } = await supabase.functions.invoke("admin-update-profile", {
        body: { userId, updates },
      });
      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  };

  const activatePlan = async (userId: string, plan: "monthly" | "annual") => {
    const now = new Date();
    const expiresAt = new Date();

    if (plan === "monthly") expiresAt.setDate(expiresAt.getDate() + 30);
    else expiresAt.setDate(expiresAt.getDate() + 365);

    const success = await updateProfile(userId, {
      subscription_plan: plan,
      subscription_status: "active",
      subscription_activated_at: now.toISOString(),
      subscription_expires_at: expiresAt.toISOString(),
    });

    if (success) {
      toast.success(`Plano ${plan === "monthly" ? "mensal" : "anual"} ativado!`);
      fetchUsers();
    } else {
      toast.error("Erro ao ativar plano");
    }
  };

  const activateLifetime = async (userId: string) => {
    const now = new Date();
    const expiresAt = new Date("2099-12-31");

    const success = await updateProfile(userId, {
      subscription_plan: "annual",
      subscription_status: "active",
      subscription_activated_at: now.toISOString(),
      subscription_expires_at: expiresAt.toISOString(),
    });

    if (success) {
      toast.success("Plano vitalício ativado!");
      fetchUsers();
    } else {
      toast.error("Erro ao ativar plano");
    }
  };

  const pauseSubscription = async (userId: string) => {
    const success = await updateProfile(userId, { subscription_status: "paused" });
    if (success) {
      toast.success("Assinatura pausada");
      fetchUsers();
    } else {
      toast.error("Erro ao pausar assinatura");
    }
  };

  const resumeSubscription = async (userId: string) => {
    const success = await updateProfile(userId, { subscription_status: "active" });
    if (success) {
      toast.success("Assinatura reativada");
      fetchUsers();
    } else {
      toast.error("Erro ao reativar assinatura");
    }
  };

  const removeUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;

    const success = await updateProfile(userId, {
      subscription_plan: "free",
      subscription_status: "cancelled",
      subscription_expires_at: null,
    });

    if (success) {
      toast.success("Usuário removido");
      fetchUsers();
    } else {
      toast.error("Erro ao remover usuário");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "paused":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "expired":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      active: "Ativo",
      paused: "Pausado",
      expired: "Expirado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      free: "Gratuito",
      monthly: "Mensal",
      annual: "Anual",
    };
    return labels[plan] || plan;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Afility Pages" className="w-10 h-10 rounded-xl object-contain" loading="lazy" />
              <h1 className="font-display text-2xl font-bold">Painel Admin</h1>
            </div>
          </div>
          <Button variant="outline" onClick={fetchUsers} disabled={loadingUsers}>
            Atualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-card shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Total de Usuários</p>
            <p className="font-display text-3xl font-bold">{users.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-card shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Assinantes Ativos</p>
            <p className="font-display text-3xl font-bold text-green-500">
              {users.filter((u) => u.subscription_status === "active").length}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Plano Mensal</p>
            <p className="font-display text-3xl font-bold text-primary">
              {users.filter((u) => u.subscription_plan === "monthly" && u.subscription_status === "active").length}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Plano Anual</p>
            <p className="font-display text-3xl font-bold text-accent">
              {users.filter((u) => u.subscription_plan === "annual" && u.subscription_status === "active").length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Usuários
            </h2>
            <p className="text-sm text-muted-foreground">{loadingUsers ? "Carregando..." : ""}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Expira em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((userProfile) => (
                  <tr key={userProfile.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{userProfile.full_name || "Sem nome"}</p>
                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          userProfile.subscription_plan === "annual"
                            ? "bg-accent/10 text-accent"
                            : userProfile.subscription_plan === "monthly"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {getPlanLabel(userProfile.subscription_plan)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(userProfile.subscription_status)}
                        <span className="text-sm">{getStatusLabel(userProfile.subscription_status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {userProfile.subscription_expires_at
                        ? new Date(userProfile.subscription_expires_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {userProfile.subscription_status !== "active" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => activatePlan(userProfile.id, "monthly")}>
                              <Calendar className="w-4 h-4 mr-1" /> Mensal
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => activatePlan(userProfile.id, "annual")}>
                              <Calendar className="w-4 h-4 mr-1" /> Anual
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => activateLifetime(userProfile.id)}>
                              ♾️ Vitalício
                            </Button>
                          </>
                        )}
                        {userProfile.subscription_status === "active" && (
                          <Button variant="outline" size="sm" onClick={() => pauseSubscription(userProfile.id)}>
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {userProfile.subscription_status === "paused" && (
                          <Button variant="outline" size="sm" onClick={() => resumeSubscription(userProfile.id)}>
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeUser(userProfile.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
