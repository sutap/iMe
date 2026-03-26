import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export function useDarkMode() {
  const { user } = useAuth();
  const isDark = user?.darkMode ?? false;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = async () => {
    if (!user) return;
    const newValue = !isDark;
    await apiRequest("PUT", `/api/users/${user.id}/profile`, { darkMode: newValue });
    await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    await queryClient.invalidateQueries({ queryKey: [`/api/users/${user.id}`] });
  };

  return { isDark, toggleDarkMode };
}
