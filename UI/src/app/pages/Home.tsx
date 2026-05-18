import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Star, TrendingUp, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { motion } from "motion/react";

const popularPizzas = [
  {
    id: "1",
    name: "Margherita Premium",
    description: "Sos pomidorowy, mozzarella, świeża bazylia",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1773944052254-b15b9b4a8736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Bestseller",
    size: "średnia"
  },
  {
    id: "2",
    name: "Pepperoni Deluxe",
    description: "Podwójne pepperoni, mozzarella, oregano",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1759311943662-5ff7fc6ee5c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Bestseller",
    size: "średnia"
  },
  {
    id: "3",
    name: "Quattro Formaggi",
    description: "4 sery premium: mozzarella, gorgonzola, parmezan, ricotta",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1734774421809-48eac182a5cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Premium",
    size: "średnia"
  },
  {
    id: "4",
    name: "Rustica Prosciutto",
    description: "Prosciutto crudo, rukola, parmezan, oliwa truflowa",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1767065603908-a1abede9db4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Premium",
    size: "średnia"
  },
];

export default function Home() {
  const { addItem } = useCart();

  const handleAddToCart = (pizza: typeof popularPizzas[0]) => {
    addItem({
      id: pizza.id,
      name: pizza.name,
      price: pizza.price,
      size: pizza.size,
      image: pizza.image,
      extras: [],
    });
    toast.success(`${pizza.name} dodana do koszyka!`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Najlepsza pizza<br />
                <span className="text-primary">w Twoim mieście</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-80">
                Ręcznie robione ciasto, świeże składniki premium, dostawa w 30 minut
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu">
                  <Button size="lg" className="text-lg px-8 h-14">
                    Zamów teraz
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                    Zobacz menu
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-primary">30min</div>
                  <div className="text-sm opacity-70">Dostawa</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-primary">4.9</div>
                  <div className="text-sm opacity-70">Ocena (2.5k)</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-primary">-20%</div>
                  <div className="text-sm opacity-70">Promocja</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1763478156969-4d7c0ab35590?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
                  alt="Pizza premium"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-xl border"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-accent text-accent-foreground rounded-full p-3">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold">Szybka dostawa</div>
                    <div className="text-sm opacity-70">30 minut lub gratis</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Pizzas */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Najpopularniejsze pizze
              </h2>
              <p className="text-muted-foreground">Nasze hity sprzedażowe</p>
            </div>
            <Link to="/menu">
              <Button variant="outline">
                Zobacz wszystkie
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPizzas.map((pizza, index) => (
              <motion.div
                key={pizza.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {pizza.badge && (
                      <Badge
                        variant={pizza.badge === "Bestseller" ? "default" : "secondary"}
                        className="absolute top-3 left-3"
                      >
                        {pizza.badge === "Bestseller" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {pizza.badge}
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{pizza.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {pizza.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {pizza.price.toFixed(2)} zł
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      onClick={() => handleAddToCart(pizza)}
                      className="w-full gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Dodaj do koszyka
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Dostawa 30 min</h3>
              <p className="text-muted-foreground">
                Gwarantujemy dostawę w 30 minut lub pizza gratis
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-2">Składniki premium</h3>
              <p className="text-muted-foreground">
                Tylko najwyższej jakości składniki od lokalnych dostawców
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">2500+ opinii</h3>
              <p className="text-muted-foreground">
                Średnia ocena 4.9/5 - zadowoleni klienci nas polecają
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Głodny? Zamów już teraz!
            </h2>
            <p className="text-white/90 text-lg mb-8">
              -20% na pierwsze zamówienie z kodem PIZZA20
            </p>
            <Link to="/menu">
              <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
                Zamów pizzę
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
