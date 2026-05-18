import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import {
  Pizza, Users, ShoppingCart, TrendingUp, DollarSign, Package,
  Plus, Edit, Trash2, Eye, EyeOff, LayoutDashboard
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

const statsData = [
  { label: "Dzisiejszy przychód", value: "2,450 zł", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
  { label: "Zamówienia dzisiaj", value: "47", change: "+8.2%", icon: ShoppingCart, color: "text-blue-600" },
  { label: "Aktywni użytkownicy", value: "1,234", change: "+23.1%", icon: Users, color: "text-purple-600" },
  { label: "Średnia ocena", value: "4.9", change: "+0.2", icon: TrendingUp, color: "text-yellow-600" },
];

const chartData = [
  { name: "Pon", zamowienia: 45, przychod: 2100 },
  { name: "Wt", zamowienia: 52, przychod: 2450 },
  { name: "Śr", zamowienia: 38, przychod: 1900 },
  { name: "Czw", zamowienia: 61, przychod: 2800 },
  { name: "Pt", zamowienia: 74, przychod: 3400 },
  { name: "Sob", zamowienia: 89, przychod: 4200 },
  { name: "Ndz", zamowienia: 67, przychod: 3100 },
];

const pizzasData = [
  { id: "1", name: "Margherita Premium", price: 39.99, listed: true, sales: 245 },
  { id: "2", name: "Pepperoni Deluxe", price: 45.99, listed: true, sales: 198 },
  { id: "3", name: "Quattro Formaggi", price: 49.99, listed: true, sales: 167 },
  { id: "4", name: "Rustica Prosciutto", price: 54.99, listed: true, sales: 134 },
  { id: "5", name: "Diavola", price: 42.99, listed: true, sales: 112 },
];

const ordersData = [
  { id: "ORD-001", customer: "Jan Kowalski", total: 89.99, status: "preparing", time: "10 min temu" },
  { id: "ORD-002", customer: "Anna Nowak", total: 124.99, status: "in_progress", time: "25 min temu" },
  { id: "ORD-003", customer: "Piotr Wiśniewski", total: 42.99, status: "pending", time: "5 min temu" },
  { id: "ORD-004", customer: "Maria Kowalczyk", total: 169.98, status: "delivered", time: "1 godz. temu" },
];

const statusLabels = {
  pending: "Oczekuje",
  preparing: "Przygotowanie",
  in_progress: "W drodze",
  delivered: "Dostarczone",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pizzas, setPizzas] = useState(pizzasData);
  const [isAddPizzaOpen, setIsAddPizzaOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState<typeof pizzasData[0] | null>(null);
  const [newPizza, setNewPizza] = useState({ name: "", price: "" });

  const handleToggleListed = (id: string) => {
    setPizzas(prev => prev.map(p =>
      p.id === id ? { ...p, listed: !p.listed } : p
    ));
    toast.success("Status pizzy zaktualizowany");
  };

  const handleDeletePizza = (id: string) => {
    setPizzas(prev => prev.filter(p => p.id !== id));
    toast.success("Pizza usunięta");
  };

  const handleAddPizza = () => {
    if (!newPizza.name || !newPizza.price) {
      toast.error("Wypełnij wszystkie pola");
      return;
    }

    const pizza = {
      id: String(pizzas.length + 1),
      name: newPizza.name,
      price: parseFloat(newPizza.price),
      listed: true,
      sales: 0,
    };

    setPizzas(prev => [...prev, pizza]);
    setNewPizza({ name: "", price: "" });
    setIsAddPizzaOpen(false);
    toast.success("Pizza dodana pomyślnie!");
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setPizzas(prev => prev.map(p =>
      p.id === id ? { ...p, price: newPrice } : p
    ));
    setEditingPizza(null);
    toast.success("Cena zaktualizowana");
  };

  return (
    <div className="min-h-screen bg-secondary/5 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-3 rounded-xl">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Panel Administratora</h1>
          </div>
          <p className="text-muted-foreground">Zarządzaj swoją pizzerią</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="pizzas" className="gap-2">
              <Pizza className="h-4 w-4" />
              Pizze
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Zamówienia
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Użytkownicy
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-opacity-10 ${stat.color.replace('text-', 'bg-')}/10`}>
                            <Icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {stat.change}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Zamówienia w tym tygodniu</CardTitle>
                  <CardDescription>Liczba zamówień dziennie</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="zamowienia" fill="#E53935" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Przychód w tym tygodniu</CardTitle>
                  <CardDescription>Dzienny przychód w zł</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="przychod"
                        stroke="#43A047"
                        strokeWidth={3}
                        dot={{ fill: '#43A047', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Pizzas */}
            <Card>
              <CardHeader>
                <CardTitle>Najpopularniejsze pizze</CardTitle>
                <CardDescription>Bestsellery tego miesiąca</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pizzas.slice(0, 5).map((pizza, index) => (
                    <div key={pizza.id} className="flex items-center gap-4">
                      <div className="font-bold text-2xl text-muted-foreground w-8">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{pizza.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {pizza.sales} sprzedanych
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {pizza.price.toFixed(2)} zł
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pizzas Tab */}
          <TabsContent value="pizzas" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Zarządzanie pizzami</CardTitle>
                    <CardDescription>Edytuj ceny i dostępność</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddPizzaOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Dodaj pizzę
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nazwa</TableHead>
                      <TableHead>Cena</TableHead>
                      <TableHead>Sprzedanych</TableHead>
                      <TableHead>Widoczna</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pizzas.map(pizza => (
                      <TableRow key={pizza.id}>
                        <TableCell className="font-medium">{pizza.name}</TableCell>
                        <TableCell>
                          {editingPizza?.id === pizza.id ? (
                            <div className="flex gap-2 items-center">
                              <Input
                                type="number"
                                step="0.01"
                                defaultValue={pizza.price}
                                className="w-24"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdatePrice(pizza.id, parseFloat((e.target as HTMLInputElement).value));
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  const input = document.querySelector(`input[defaultValue="${pizza.price}"]`) as HTMLInputElement;
                                  handleUpdatePrice(pizza.id, parseFloat(input.value));
                                }}
                              >
                                OK
                              </Button>
                            </div>
                          ) : (
                            <span>{pizza.price.toFixed(2)} zł</span>
                          )}
                        </TableCell>
                        <TableCell>{pizza.sales}</TableCell>
                        <TableCell>
                          <Switch
                            checked={pizza.listed}
                            onCheckedChange={() => handleToggleListed(pizza.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingPizza(pizza)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePizza(pizza.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aktywne zamówienia</CardTitle>
                <CardDescription>Zarządzaj statusem zamówień</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Klient</TableHead>
                      <TableHead>Wartość</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Czas</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersData.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="font-bold">{order.total.toFixed(2)} zł</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "delivered" ? "secondary" : "default"}>
                            {statusLabels[order.status as keyof typeof statusLabels]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.time}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Zmień status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Użytkownicy</CardTitle>
                <CardDescription>Lista zarejestrowanych użytkowników</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Panel zarządzania użytkownikami</p>
                  <p className="text-sm">Funkcja w rozwoju</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Pizza Dialog */}
        <Dialog open={isAddPizzaOpen} onOpenChange={setIsAddPizzaOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nową pizzę</DialogTitle>
              <DialogDescription>
                Wypełnij formularz, aby dodać pizzę do menu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="pizzaName">Nazwa pizzy</Label>
                <Input
                  id="pizzaName"
                  placeholder="np. Margherita Premium"
                  value={newPizza.name}
                  onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pizzaPrice">Cena (zł)</Label>
                <Input
                  id="pizzaPrice"
                  type="number"
                  step="0.01"
                  placeholder="39.99"
                  value={newPizza.price}
                  onChange={(e) => setNewPizza({ ...newPizza, price: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPizzaOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={handleAddPizza}>
                Dodaj pizzę
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
