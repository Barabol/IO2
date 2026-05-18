import { Outlet, Link, useLocation } from "react-router";
import { ShoppingCart, Pizza, User, Moon, Sun, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useCart, CartProvider } from "../context/CartContext";
import { Badge } from "./ui/badge";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

function LayoutContent() {
  const { totalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-secondary-foreground hover:opacity-80 transition">
              <Pizza className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">PizzaPremium</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-secondary-foreground hover:text-primary transition ${isActive('/') ? 'text-primary' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className={`text-secondary-foreground hover:text-primary transition ${isActive('/menu') ? 'text-primary' : ''}`}
              >
                Menu
              </Link>
              <Link
                to="/dashboard"
                className={`text-secondary-foreground hover:text-primary transition ${isActive('/dashboard') ? 'text-primary' : ''}`}
              >
                <User className="h-5 w-5" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-secondary-foreground hover:text-primary"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link to="/cart">
                <Button variant="default" size="sm" className="relative gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Koszyk
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative text-secondary-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-secondary-foreground">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-secondary text-secondary-foreground">
                  <div className="flex flex-col gap-4 mt-8">
                    <Link
                      to="/"
                      className="text-lg hover:text-primary transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/menu"
                      className="text-lg hover:text-primary transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Menu
                    </Link>
                    <Link
                      to="/dashboard"
                      className="text-lg hover:text-primary transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Moje konto
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start gap-2"
                    >
                      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      {theme === "dark" ? "Jasny motyw" : "Ciemny motyw"}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-secondary text-secondary-foreground border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">PizzaPremium</h3>
              <p className="text-sm opacity-80">Najlepsza pizza w Twoim mieście</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Kontakt</h3>
              <p className="text-sm opacity-80">tel: +48 123 456 789</p>
              <p className="text-sm opacity-80">email: info@pizzapremium.pl</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Social Media</h3>
              <p className="text-sm opacity-80">Facebook | Instagram | Twitter</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10 text-center text-sm opacity-60">
            © 2026 PizzaPremium. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </footer>

      {/* Floating Cart Button - Mobile Only */}
      {totalItems > 0 && (
        <Link to="/cart" className="md:hidden">
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
            size="icon"
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function Layout() {
  return (
    <CartProvider>
      <LayoutContent />
    </CartProvider>
  );
}
