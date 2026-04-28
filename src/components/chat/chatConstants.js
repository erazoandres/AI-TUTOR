import { BookOpen, LayoutGrid, MessageSquare } from "lucide-react";

export const TOPIC_STATUS_LABELS = {
  pendiente: "Pendiente",
  visto: "Visto",
  dominado: "Dominado",
  repasar: "Repasar",
};

export const STATUS_BADGES = {
  pendiente: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  visto: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200",
  dominado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  repasar: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
};

export const WORKSPACE_TABS = [
  { id: "chat", label: "Hablar", icon: MessageSquare },
  { id: "practice", label: "Practicar", icon: BookOpen },
  { id: "topics", label: "Temas", icon: LayoutGrid },
];
