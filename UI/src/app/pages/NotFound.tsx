import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Pizza, Home, Menu } from "lucide-react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <Pizza className="h-24 w-24 mx-auto mb-6 text-primary opacity-50" />
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-2">Strona nie znaleziona</h2>
          <p className="text-muted-foreground">
            Ups! Wygląda na to, że zabłądziłeś. Ta strona nie istnieje.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="h-5 w-5" />
              Strona główna
            </Button>
          </Link>
          <Link to="/menu">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <Menu className="h-5 w-5" />
              Zobacz menu
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
