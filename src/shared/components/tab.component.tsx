import type { TabComponentProps } from "../typings/tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabComponent = ({ items, activeTab, onTabChange }: TabComponentProps) => {
  return (
    <Tabs defaultValue={activeTab} className="w-[400px]">
      <TabsList className="bg-[#EAEBEB] h-12 p-1">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            onClick={() => onTabChange(item.value)}
            className={`flex items-center justify-center text-sm font-medium gap-2 cursor-pointer px-4 transition-all duration-300 text-[#251F2D] font-medium ${
              activeTab === item.value ? "!shadow-lg" : ""
            }`}
          >
            {item?.icon}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default TabComponent;
