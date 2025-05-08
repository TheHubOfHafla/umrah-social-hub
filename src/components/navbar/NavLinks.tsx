
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/"
  }, 
  {
    label: "Organizers",
    href: "/organizers"
  }
];

const NavLinks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation = navItems.map(item => ({
    ...item,
    active: location.pathname === item.href
  }));

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigation.map(item => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink 
              asChild 
              className={cn(
                "px-3 md:px-4 py-1.5 text-sm md:text-base font-medium tracking-wide transition-all duration-200 rounded-md",
                "hover:text-purple-600 hover:bg-purple-50",
                item.active ? "text-purple-600 font-semibold border-b-2 border-purple-600" : "text-gray-700 bg-transparent"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <button>{item.label}</button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
