declare module "@/shared/typings/tab" {
  export interface TabItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
    /** The content to render when this tab is active */
    content: React.ReactNode;
  }

  export interface TabComponentProps {
    items: TabItem[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    ToggleViewComponent?: React.ComponentType;
    className?: string;

  }
}