import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabComponentProps } from "@/shared/typings/tab";
import clsx from "clsx";

const TabComponent = ({
  items,
  activeTab,
  onTabChange,
  className,
  ToggleViewComponent,
}: TabComponentProps) => {
  return (
    <Tabs defaultValue={activeTab} className={clsx("w-full", className)}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <TabsList
          className={`bg-[#EAEBEB] h-16 p-1.5 rounded-[12px] gap-1 ${
            ToggleViewComponent ? "w-fit" : "w-full"
          }`}
        >
          {items.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              onClick={() => onTabChange(item.value)}
              className={clsx(
                "flex items-center justify-center text-sm gap-2 cursor-pointer px-5 py-2.5 rounded-[8px]",
                "transition-all duration-300 font-medium",
                "text-[#6B7280] hover:text-[#251F2D]",
                "data-[state=active]:bg-white data-[state=active]:text-[#251F2D]",
                "data-[state=active]:shadow-[0px_2px_4px_-2px_rgba(12,12,13,0.08),0px_4px_8px_-2px_rgba(12,12,13,0.1)]",
              )}
            >
              <span className="text-base">{item?.icon}</span>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {ToggleViewComponent && <ToggleViewComponent />}
      </div>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value} className="mt-6">
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabComponent;
