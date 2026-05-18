import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Package, MapPin, User, Settings, Clock, CheckCircle, Truck, ChefHat, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

const orderHistory = [
  {
    id: "ORD-2026-001",
    date: "2026-05-18",
    time: "14:30",
    status: "delivered",
    total: 89.99,
    items: [
      { name: "Margherita Premium", quantity: 2, price: 39.99 },
      { name: "Pepperoni Deluxe", quantity: 1, price: 45.99 },
    ],
  },
  {
    id: "ORD-2026-002",
    date: "2026-05-15",
    time: "19:15",
    status: "in_progress",
    total: 124.99,
    items: [
      { name: "Quattro Formaggi", quantity: 1, price: 49.99 },
      { name: "Rustica Prosciutto", quantity: 1, price: 54.99 },
    ],
  },
  {
    id: "ORD-2026-003",
    date: "2026-05-12",
    time: "12:45",
    status: "preparing",
    total: 42.99,
    items: [
      { name: "Diavola", quantity: 1, price: 42.99 },
    ],
  },
  {
    id: "ORD-2026-004",
    date: "2026-05-10",
    time: "20:00",
    status: "delivered",
    total: 169.98,
    items: [
      { name: "Margherita Premium", quantity: 3, price: 39.99 },
      { name: "Verdura", quantity: 1, price: 38.99 },
    ],
  },
];

const savedAddresses = [
  { id: "1", name: "Dom", street: "ul. Przykładowa 123", city: "Warszawa", postalCode: "00-001", phone: "+48 123 456 789", default: true },
  { id: "2", name: "Praca", street: "ul. Biurowa 45", city: "Warszawa", postalCode: "00-002", phone: "+48 987 654 321", default: false },
];

const statusConfig = {
  pending: { label: "Oczekuje", icon: Clock, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950" },
  preparing: { label: "Przygotowywanie", icon: ChefHat, color: "text-blue-600 bg-blue-50 dark:bg-blue-950" },
  in_progress: { label: "W drodze", icon: Truck, color: "text-purple-600 bg-purple-50 dark:bg-purple-950" },
  delivered: { label: "Dostarczone", icon: CheckCircle, color: "text-green-600 bg-green-50 dark:bg-green-950" },
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [profileData, setProfileData] = useState({
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@email.pl",
    phone: "+48 123 456 789",
  });

  const handleSaveProfile = () => {
    toast.success("Profil zaktualizowany pomyślnie!");
  };

  const handleReorder = (order: typeof orderHistory[0]) => {
    toast.success(`Dodano ${order.items.length} pizze do koszyka`, {
      description: "Przejdź do koszyka, aby dokończyć zamówienie",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-muted-foreground">{profileData.email}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid mb-8">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Zamówienia
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2">
              <MapPin className="h-4 w-4" />
              Adresy
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historia zamówień</CardTitle>
                <CardDescription>
                  Przeglądaj swoje poprzednie i aktualne zamówienia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderHistory.map((order, index) => {
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-2">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg">{order.id}</h3>
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.date} • {order.time}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {order.total.toFixed(2)} zł
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-2 mb-4">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {item.price.toFixed(2)} zł
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleReorder(order)}
                              className="flex-1 gap-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Zamów ponownie
                            </Button>
                            {order.status === "in_progress" && (
                              <Button variant="default" className="flex-1">
                                Śledź zamówienie
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Zapisane adresy</CardTitle>
                <CardDescription>
                  Zarządzaj swoimi adresami dostaw
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedAddresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-2">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">{address.name}</h3>
                            {address.default && (
                              <Badge variant="secondary">Domyślny</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            Edytuj
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{address.street}</p>
                          <p>{address.postalCode} {address.city}</p>
                          <p>Tel: {address.phone}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <Button variant="outline" className="w-full gap-2">
                  <MapPin className="h-4 w-4" />
                  Dodaj nowy adres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dane osobowe</CardTitle>
                <CardDescription>
                  Zaktualizuj swoje informacje osobiste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Imię</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nazwisko</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} type="button" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Zapisz zmiany
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zmiana hasła</CardTitle>
                <CardDescription>
                  Zabezpiecz swoje konto silnym hasłem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Obecne hasło</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nowe hasło</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Potwierdź nowe hasło</Label>
                    <Input id="confirmNewPassword" type="password" />
                  </div>
                  <Button type="button" onClick={() => toast.success("Hasło zmienione pomyślnie!")}>
                    Zmień hasło
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
