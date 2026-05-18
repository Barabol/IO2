import { useState } from "react";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import { ShoppingCart, Search, TrendingUp, Star, Flame, Leaf } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { motion } from "motion/react";

const allPizzas = [
  {
    id: "1",
    name: "Margherita Premium",
    description: "Sos pomidorowy, mozzarella, świeża bazylia",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1773944052254-b15b9b4a8736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Bestseller",
    vegetarian: true,
    spicy: false,
    premium: false,
  },
  {
    id: "2",
    name: "Pepperoni Deluxe",
    description: "Podwójne pepperoni, mozzarella, oregano",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1759311943662-5ff7fc6ee5c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Bestseller",
    vegetarian: false,
    spicy: false,
    premium: false,
  },
  {
    id: "3",
    name: "Quattro Formaggi",
    description: "4 sery premium: mozzarella, gorgonzola, parmezan, ricotta",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1734774421809-48eac182a5cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Premium",
    vegetarian: true,
    spicy: false,
    premium: true,
  },
  {
    id: "4",
    name: "Rustica Prosciutto",
    description: "Prosciutto crudo, rukola, parmezan, oliwa truflowa",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1767065603908-a1abede9db4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: "Premium",
    vegetarian: false,
    spicy: false,
    premium: true,
  },
  {
    id: "5",
    name: "Diavola",
    description: "Pikantne salami, papryczki jalapeno, tabasco",
    price: 42.99,
    image: "https://images.unsplash.com/photo-1760538635911-dee3b46f2011?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: null,
    vegetarian: false,
    spicy: true,
    premium: false,
  },
  {
    id: "6",
    name: "Verdura",
    description: "Papryka, cukinia, bakłażan, pomidorki cherry, rukola",
    price: 38.99,
    image: "https://images.unsplash.com/photo-1763478279302-fb574409a302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    badge: null,
    vegetarian: true,
    spicy: false,
    premium: false,
  },
];

const extras = [
  { id: "extra-cheese", name: "Dodatkowy ser", price: 5.00 },
  { id: "mushrooms", name: "Pieczarki", price: 4.00 },
  { id: "olives", name: "Oliwki", price: 4.00 },
  { id: "bacon", name: "Bekon", price: 6.00 },
  { id: "pepperoni", name: "Pepperoni", price: 6.00 },
  { id: "basil", name: "Świeża bazylia", price: 3.00 },
];

const sizes = [
  { id: "small", name: "Mała (25cm)", priceMultiplier: 0.8 },
  { id: "medium", name: "Średnia (30cm)", priceMultiplier: 1.0 },
  { id: "large", name: "Duża (40cm)", priceMultiplier: 1.3 },
];

export default function Menu() {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [filterPremium, setFilterPremium] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<typeof allPizzas[0] | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPizzas = allPizzas.filter(pizza => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pizza.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVegetarian = !filterVegetarian || pizza.vegetarian;
    const matchesSpicy = !filterSpicy || pizza.spicy;
    const matchesPremium = !filterPremium || pizza.premium;

    return matchesSearch && matchesVegetarian && matchesSpicy && matchesPremium;
  });

  const handleOpenDialog = (pizza: typeof allPizzas[0]) => {
    setSelectedPizza(pizza);
    setSelectedSize(sizes[1]);
    setSelectedExtras([]);
    setIsDialogOpen(true);
  };

  const handleToggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const calculateTotalPrice = () => {
    if (!selectedPizza) return 0;
    const basePrice = selectedPizza.price * selectedSize.priceMultiplier;
    const extrasPrice = selectedExtras.reduce((sum, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    return basePrice + extrasPrice;
  };

  const handleAddToCart = () => {
    if (!selectedPizza) return;

    const selectedExtrasNames = selectedExtras.map(id => extras.find(e => e.id === id)?.name || '');

    addItem({
      id: `${selectedPizza.id}-${selectedSize.id}-${selectedExtras.join(',')}`,
      name: `${selectedPizza.name} (${selectedSize.name})`,
      price: calculateTotalPrice(),
      size: selectedSize.name,
      image: selectedPizza.image,
      extras: selectedExtrasNames,
    });

    toast.success(`${selectedPizza.name} dodana do koszyka!`);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Menu</h1>
          <p className="text-muted-foreground">Wybierz swoją ulubioną pizzę</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-card rounded-2xl p-6 border shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Szukaj pizzy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter checkboxes */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="vegetarian"
                  checked={filterVegetarian}
                  onCheckedChange={(checked) => setFilterVegetarian(!!checked)}
                />
                <Label htmlFor="vegetarian" className="flex items-center gap-1 cursor-pointer">
                  <Leaf className="h-4 w-4 text-accent" />
                  Wegetariańskie
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="spicy"
                  checked={filterSpicy}
                  onCheckedChange={(checked) => setFilterSpicy(!!checked)}
                />
                <Label htmlFor="spicy" className="flex items-center gap-1 cursor-pointer">
                  <Flame className="h-4 w-4 text-primary" />
                  Ostre
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="premium"
                  checked={filterPremium}
                  onCheckedChange={(checked) => setFilterPremium(!!checked)}
                />
                <Label htmlFor="premium" className="flex items-center gap-1 cursor-pointer">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Premium
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Pizza Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPizzas.map((pizza, index) => (
            <motion.div
              key={pizza.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50 h-full flex flex-col">
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {pizza.badge && (
                      <Badge variant={pizza.badge === "Bestseller" ? "default" : "secondary"}>
                        {pizza.badge === "Bestseller" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {pizza.badge}
                      </Badge>
                    )}
                    {pizza.vegetarian && (
                      <Badge variant="outline" className="bg-accent/90 text-white border-0">
                        <Leaf className="h-3 w-3 mr-1" />
                        Vege
                      </Badge>
                    )}
                    {pizza.spicy && (
                      <Badge variant="outline" className="bg-primary/90 text-white border-0">
                        <Flame className="h-3 w-3 mr-1" />
                        Ostre
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2">{pizza.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {pizza.description}
                  </p>
                  <div className="text-2xl font-bold text-primary">
                    od {pizza.price.toFixed(2)} zł
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => handleOpenDialog(pizza)}
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

        {filteredPizzas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nie znaleziono pizzy spełniającej kryteria wyszukiwania
            </p>
          </div>
        )}
      </div>

      {/* Customization Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPizza?.name}</DialogTitle>
            <DialogDescription>{selectedPizza?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Size Selection */}
            <div>
              <Label className="text-lg mb-3 block">Wybierz rozmiar</Label>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map(size => (
                  <Button
                    key={size.id}
                    variant={selectedSize.id === size.id ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="h-auto py-3 flex flex-col items-center"
                  >
                    <span className="font-bold">{size.name}</span>
                    <span className="text-xs opacity-70">
                      +{((size.priceMultiplier - 1) * 100).toFixed(0)}%
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <Label className="text-lg mb-3 block">Dodatkowe składniki</Label>
              <div className="grid grid-cols-2 gap-3">
                {extras.map(extra => (
                  <div
                    key={extra.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                      selectedExtras.includes(extra.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleToggleExtra(extra.id)}
                  >
                    <Checkbox
                      id={extra.id}
                      checked={selectedExtras.includes(extra.id)}
                      onCheckedChange={() => handleToggleExtra(extra.id)}
                    />
                    <Label htmlFor={extra.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{extra.name}</div>
                      <div className="text-sm text-muted-foreground">+{extra.price.toFixed(2)} zł</div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-secondary/20 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Pizza ({selectedSize.name})</span>
                <span className="font-medium">
                  {selectedPizza && (selectedPizza.price * selectedSize.priceMultiplier).toFixed(2)} zł
                </span>
              </div>
              {selectedExtras.length > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Dodatki</span>
                  <span className="font-medium">
                    {selectedExtras.reduce((sum, id) => {
                      const extra = extras.find(e => e.id === id);
                      return sum + (extra?.price || 0);
                    }, 0).toFixed(2)} zł
                  </span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="text-lg font-bold">Łącznie</span>
                <span className="text-2xl font-bold text-primary">
                  {calculateTotalPrice().toFixed(2)} zł
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddToCart} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Dodaj do koszyka
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
