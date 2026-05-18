import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Pizza } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Wypełnij wszystkie pola");
      return;
    }

    toast.success("Zalogowano pomyślnie!");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 text-foreground mb-6">
              <Pizza className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">PizzaPremium</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Witaj ponownie!</h1>
            <p className="text-muted-foreground">
              Zaloguj się, aby kontynuować zamawianie
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Logowanie</CardTitle>
              <CardDescription>
                Wpisz swój email i hasło
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label htmlFor="remember" className="cursor-pointer text-sm">
                      Zapamiętaj mnie
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-sm">
                    Zapomniałeś hasła?
                  </Button>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Zaloguj się
                </Button>

                <div className="text-center text-sm">
                  Nie masz konta?{" "}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Zarejestruj się
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setEmail("demo@pizzapremium.pl");
                setPassword("demo123");
                toast.info("Użyj tych danych demo do zalogowania");
              }}
              className="text-sm text-muted-foreground"
            >
              Użyj konta demo
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-white text-center"
          >
            <img
              src="https://images.unsplash.com/photo-1772958984376-ca6f3f54fd8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Pizza"
              className="rounded-3xl shadow-2xl mb-8 max-w-lg mx-auto"
            />
            <h2 className="text-4xl font-bold mb-4">
              Najlepsza pizza w mieście
            </h2>
            <p className="text-xl opacity-90">
              Dołącz do tysięcy zadowolonych klientów
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
