import HeaderLayoutComponent from "./components/header.layout.component";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gradient-to-b from-[#E4D6FA]/60 to-[#F8F8F9] min-h-screen">
      <HeaderLayoutComponent />
      <div className="container mx-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
