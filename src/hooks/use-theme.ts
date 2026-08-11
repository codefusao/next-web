import { useThemeStore } from "@/store/theme-store";

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);
  const setMode = useThemeStore((state) => state.setMode);

  return {
    mode,
    toggle,
    setMode,
  };
}
