export interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface TabComponentProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}
