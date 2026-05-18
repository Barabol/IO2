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

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("Wypełnij wszystkie pola");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Hasła nie są zgodne");
      return;
    }

    if (!acceptTerms) {
      toast.error("Musisz zaakceptować regulamin");
      return;
    }

    toast.success("Konto utworzone pomyślnie! 🎉");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-accent to-accent/80">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-white text-center"
          >
            <img
              src="https://images.unsplash.com/photo-1754799565126-fe1ad148db85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Pizza Chef"
              className="rounded-3xl shadow-2xl mb-8 max-w-lg mx-auto"
            />
            <h2 className="text-4xl font-bold mb-4">
              Dołącz do rodziny PizzaPremium
            </h2>
            <p className="text-xl opacity-90">
              -20% rabatu na pierwsze zamówienie!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
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
            <h1 className="text-3xl font-bold mb-2">Stwórz konto</h1>
            <p className="text-muted-foreground">
              Załóż darmowe konto i zacznij zamawiać
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rejestracja</CardTitle>
              <CardDescription>
                Wypełnij formularz, aby utworzyć konto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      placeholder="Jan"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      placeholder="Kowalski"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Powtórz hasło</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                    Akceptuję{" "}
                    <Button variant="link" className="px-0 h-auto text-sm">
                      regulamin
                    </Button>
                    {" "}i{" "}
                    <Button variant="link" className="px-0 h-auto text-sm">
                      politykę prywatności
                    </Button>
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Utwórz konto
                </Button>

                <div className="text-center text-sm">
                  Masz już konto?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Zaloguj się
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
