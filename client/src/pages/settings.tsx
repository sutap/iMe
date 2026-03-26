import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGoals } from "@/hooks/use-goals";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useNotifications } from "@/hooks/use-notifications";
import { useFinance } from "@/hooks/use-finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  User, Moon, Bell, Target, Wallet, LogOut, ChevronRight,
  Footprints, Droplets, Flame, BedDouble, PiggyBank, Tag, Plus, Pencil, Trash2, Crown
} from "lucide-react";

interface SettingsProps {
  userId: number;
}

const C = { bg: '#e6e8d4', card: '#f0ede4', primary: '#7d9b6f', clay: '#c4a882', text: '#3d3d2e', muted: '#8a8a72', border: '#d8d5c8', danger: '#c47a5a' };

export default function Settings({ userId }: SettingsProps) {
  const { user, logoutMutation } = useAuth();
  const { goals, updateGoals, createGoals, isSaving: isSavingGoals } = useGoals(userId);
  const { isDark, toggleDarkMode } = useDarkMode();
  const { permission, requestPermission } = useNotifications();
  const { budgetCategories, createBudgetCategory, updateBudgetCategory, deleteBudgetCategory } = useFinance(userId);
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({ displayName: user?.displayName || "", email: user?.email || "" });
  const [goalData, setGoalData] = useState({
    stepsGoal: goals?.stepsGoal || 10000,
    waterGoal: goals?.waterGoal || 8,
    sleepGoal: goals?.sleepGoal || 8,
    caloriesGoal: goals?.caloriesGoal || 2000,
    savingsGoal: goals?.savingsGoal || 500,
    monthlyBudget: goals?.monthlyBudget || 1500,
  });
  const [newCategory, setNewCategory] = useState({ name: "", limit: "" });
  const [editCategory, setEditCategory] = useState<{ id: number; name: string; limit: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'U';

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      await apiRequest("PUT", `/api/users/${user.id}/profile`, profileData);
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "Profile updated", description: "Your profile has been saved." });
    } catch {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveGoals = () => {
    const data = {
      stepsGoal: Number(goalData.stepsGoal),
      waterGoal: Number(goalData.waterGoal),
      sleepGoal: Number(goalData.sleepGoal),
      caloriesGoal: Number(goalData.caloriesGoal),
      savingsGoal: Number(goalData.savingsGoal),
      monthlyBudget: Number(goalData.monthlyBudget),
    };
    if (goals) {
      updateGoals(data);
    } else {
      createGoals({ userId, ...data });
    }
    toast({ title: "Goals saved", description: "Your goals have been updated." });
  };

  const handleNotifications = async () => {
    if (permission === "granted") {
      await apiRequest("PUT", `/api/users/${userId}/profile`, { notificationsEnabled: !user?.notificationsEnabled });
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    } else {
      const result = await requestPermission();
      if (result === "granted") {
        await apiRequest("PUT", `/api/users/${userId}/profile`, { notificationsEnabled: true });
        await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        toast({ title: "Notifications enabled", description: "You'll receive reminders for your events." });
      } else {
        toast({ title: "Permission denied", description: "Please allow notifications in your browser settings.", variant: "destructive" });
      }
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.limit) return;
    createBudgetCategory({ userId, name: newCategory.name, limit: parseFloat(newCategory.limit), color: C.primary, icon: "tag" });
    setNewCategory({ name: "", limit: "" });
    toast({ title: "Category added", description: `${newCategory.name} budget added.` });
  };

  const handleUpdateCategory = () => {
    if (!editCategory) return;
    updateBudgetCategory({ id: editCategory.id, category: { name: editCategory.name, limit: parseFloat(editCategory.limit) } });
    setEditCategory(null);
    toast({ title: "Category updated" });
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User, desc: "Name, email, photo" },
    { id: "goals", label: "Goals", icon: Target, desc: "Daily targets & budgets" },
    { id: "budget", label: "Budget Categories", icon: Wallet, desc: "Spending limits per category" },
    { id: "appearance", label: "Appearance", icon: Moon, desc: "Dark mode & theme" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Reminders & alerts" },
    { id: "premium", label: "iMe Premium", icon: Crown, desc: "Unlock all features" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: C.text }}>Settings</h1>

      {/* Profile Card */}
      <Card className="border-0 rounded-2xl shadow-sm mb-4" style={{ backgroundColor: C.card }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2" style={{ borderColor: C.border }}>
              <AvatarImage src={user?.profilePicture || ''} />
              <AvatarFallback className="text-xl font-semibold" style={{ backgroundColor: C.bg, color: C.primary }}>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg" style={{ color: C.text }}>{user?.displayName || user?.username}</p>
              <p className="text-sm" style={{ color: C.muted }}>{user?.email || 'No email set'}</p>
              {user?.isPremium && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${C.clay}30`, color: C.clay }}>Premium</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card className="border-0 rounded-2xl shadow-sm mb-4" style={{ backgroundColor: C.card }}>
        {sections.map((section, i) => (
          <div key={section.id}>
            <button
              className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.primary}15` }}>
                  <section.icon className="h-5 w-5" style={{ color: C.primary }} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm" style={{ color: C.text }}>{section.label}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{section.desc}</p>
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`} style={{ color: C.muted }} />
            </button>

            {activeSection === section.id && (
              <div className="px-4 pb-4">
                <Separator className="mb-4" style={{ backgroundColor: C.border }} />

                {/* Profile Section */}
                {section.id === "profile" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium mb-1 block" style={{ color: C.muted }}>Display Name</Label>
                      <Input value={profileData.displayName} onChange={e => setProfileData(p => ({ ...p, displayName: e.target.value }))}
                        className="rounded-xl border-0 text-sm" style={{ backgroundColor: C.bg, color: C.text }} />
                    </div>
                    <div>
                      <Label className="text-xs font-medium mb-1 block" style={{ color: C.muted }}>Email</Label>
                      <Input type="email" value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))}
                        className="rounded-xl border-0 text-sm" style={{ backgroundColor: C.bg, color: C.text }} />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="w-full rounded-xl text-white border-0" style={{ backgroundColor: C.primary }}>
                      {isSavingProfile ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                )}

                {/* Goals Section */}
                {section.id === "goals" && (
                  <div className="space-y-3">
                    {[
                      { key: "stepsGoal", label: "Daily Steps Goal", icon: Footprints, unit: "steps" },
                      { key: "waterGoal", label: "Daily Water Goal", icon: Droplets, unit: "glasses" },
                      { key: "sleepGoal", label: "Sleep Goal", icon: BedDouble, unit: "hours" },
                      { key: "caloriesGoal", label: "Calories Goal", icon: Flame, unit: "kcal" },
                      { key: "monthlyBudget", label: "Monthly Budget", icon: Wallet, unit: "$" },
                      { key: "savingsGoal", label: "Monthly Savings Goal", icon: PiggyBank, unit: "$" },
                    ].map(field => (
                      <div key={field.key} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C.primary}15` }}>
                          <field.icon className="h-4 w-4" style={{ color: C.primary }} />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs mb-0.5 block" style={{ color: C.muted }}>{field.label}</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={(goalData as any)[field.key]}
                              onChange={e => setGoalData(g => ({ ...g, [field.key]: e.target.value }))}
                              className="rounded-xl border-0 text-sm h-8"
                              style={{ backgroundColor: C.bg, color: C.text }}
                            />
                            <span className="text-xs whitespace-nowrap" style={{ color: C.muted }}>{field.unit}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={handleSaveGoals} disabled={isSavingGoals} className="w-full rounded-xl text-white border-0" style={{ backgroundColor: C.primary }}>
                      {isSavingGoals ? 'Saving...' : 'Save Goals'}
                    </Button>
                  </div>
                )}

                {/* Budget Categories Section */}
                {section.id === "budget" && (
                  <div className="space-y-3">
                    {budgetCategories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: C.bg }}>
                        {editCategory?.id === cat.id ? (
                          <div className="flex gap-2 flex-1 mr-2">
                            <Input value={editCategory.name} onChange={e => setEditCategory(ec => ec ? { ...ec, name: e.target.value } : null)}
                              className="rounded-lg border-0 text-sm h-8 flex-1" style={{ backgroundColor: C.card, color: C.text }} />
                            <Input type="number" value={editCategory.limit} onChange={e => setEditCategory(ec => ec ? { ...ec, limit: e.target.value } : null)}
                              className="rounded-lg border-0 text-sm h-8 w-24" style={{ backgroundColor: C.card, color: C.text }} placeholder="$" />
                            <Button size="sm" onClick={handleUpdateCategory} className="text-white border-0 h-8 px-3 rounded-lg" style={{ backgroundColor: C.primary }}>Save</Button>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm font-medium" style={{ color: C.text }}>{cat.name}</p>
                              <p className="text-xs" style={{ color: C.muted }}>Limit: ${cat.limit}/mo</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => setEditCategory({ id: cat.id, name: cat.name, limit: String(cat.limit) })}
                                className="h-7 w-7 p-0 rounded-lg" style={{ color: C.muted }}>
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => deleteBudgetCategory(cat.id)}
                                className="h-7 w-7 p-0 rounded-lg" style={{ color: C.danger }}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input placeholder="Category name" value={newCategory.name} onChange={e => setNewCategory(n => ({ ...n, name: e.target.value }))}
                        className="rounded-xl border-0 text-sm flex-1" style={{ backgroundColor: C.bg, color: C.text }} />
                      <Input type="number" placeholder="Limit $" value={newCategory.limit} onChange={e => setNewCategory(n => ({ ...n, limit: e.target.value }))}
                        className="rounded-xl border-0 text-sm w-24" style={{ backgroundColor: C.bg, color: C.text }} />
                      <Button onClick={handleAddCategory} className="rounded-xl border-0 text-white px-3" style={{ backgroundColor: C.primary }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Appearance Section */}
                {section.id === "appearance" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: C.text }}>Dark Mode</p>
                        <p className="text-xs" style={{ color: C.muted }}>Switch to a darker theme</p>
                      </div>
                      <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
                    </div>
                  </div>
                )}

                {/* Notifications Section */}
                {section.id === "notifications" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: C.text }}>Push Notifications</p>
                        <p className="text-xs" style={{ color: C.muted }}>
                          {permission === "granted" ? "Enabled — you'll get event reminders" :
                           permission === "denied" ? "Blocked in browser settings" :
                           "Get reminders for upcoming events"}
                        </p>
                      </div>
                      <Switch
                        checked={user?.notificationsEnabled && permission === "granted"}
                        onCheckedChange={handleNotifications}
                        disabled={permission === "denied"}
                      />
                    </div>
                    {permission === "denied" && (
                      <p className="text-xs p-3 rounded-xl" style={{ backgroundColor: `${C.danger}15`, color: C.danger }}>
                        Notifications are blocked. Please enable them in your browser settings.
                      </p>
                    )}
                  </div>
                )}

                {/* Premium Section */}
                {section.id === "premium" && (
                  <div className="space-y-4">
                    {user?.isPremium ? (
                      <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${C.clay}20` }}>
                        <Crown className="h-8 w-8 mx-auto mb-2" style={{ color: C.clay }} />
                        <p className="font-semibold" style={{ color: C.text }}>You're a Premium member!</p>
                        <p className="text-xs mt-1" style={{ color: C.muted }}>Enjoy all iMe Premium features.</p>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.clay}15` }}>
                          <Crown className="h-8 w-8 mb-2" style={{ color: C.clay }} />
                          <p className="font-semibold mb-2" style={{ color: C.text }}>Upgrade to iMe Premium</p>
                          <ul className="space-y-1">
                            {["Unlimited event reminders", "Advanced finance insights", "Custom goal tracking", "Priority support", "Ad-free experience"].map(f => (
                              <li key={f} className="text-xs flex items-center gap-2" style={{ color: C.muted }}>
                                <span style={{ color: C.primary }}>✓</span> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl text-center border-2" style={{ borderColor: C.border, backgroundColor: C.bg }}>
                            <p className="font-bold text-lg" style={{ color: C.text }}>$4.99</p>
                            <p className="text-xs" style={{ color: C.muted }}>per month</p>
                          </div>
                          <div className="p-3 rounded-xl text-center border-2" style={{ borderColor: C.primary, backgroundColor: `${C.primary}10` }}>
                            <p className="font-bold text-lg" style={{ color: C.primary }}>$39.99</p>
                            <p className="text-xs" style={{ color: C.muted }}>per year (save 33%)</p>
                          </div>
                        </div>
                        <Button className="w-full rounded-xl text-white border-0" style={{ backgroundColor: C.clay }}>
                          <Crown className="h-4 w-4 mr-2" /> Upgrade to Premium
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {i < sections.length - 1 && <Separator style={{ backgroundColor: C.border }} />}
          </div>
        ))}
      </Card>

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full rounded-2xl border-0 text-sm font-medium"
        style={{ backgroundColor: `${C.danger}15`, color: C.danger }}
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
}
