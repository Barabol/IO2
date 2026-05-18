import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { ShoppingBag, Minus, Plus, X, CreditCard, Wallet, Truck, MapPin, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { motion } from "motion/react";

const deliveryMethods = [
  { id: "standard", name: "Dostawa standardowa", time: "30-45 min", price: 0 },
  { id: "express", name: "Dostawa ekspresowa", time: "15-20 min", price: 10 },
];

const paymentMethods = [
  { id: "card", name: "Karta płatnicza", icon: CreditCard },
  { id: "cash", name: "Gotówka przy odbiorze", icon: Wallet },
];

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0].id);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const selectedDelivery = deliveryMethods.find(m => m.id === deliveryMethod);
  const deliveryPrice = selectedDelivery?.price || 0;
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = totalPrice + deliveryPrice - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PIZZA20") {
      const discountAmount = totalPrice * 0.2;
      setAppliedCoupon({ code: "PIZZA20", discount: discountAmount });
      toast.success("Kupon zastosowany! -20% rabatu");
    } else {
      toast.error("Nieprawidłowy kod kuponu");
    }
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error("Koszyk jest pusty");
      return;
    }

    if (!address.street || !address.city || !address.postalCode || !address.phone) {
      toast.error("Wypełnij wszystkie dane adresowe");
      return;
    }

    toast.success("Zamówienie złożone pomyślnie! 🍕", {
      description: `Dostawa w ${selectedDelivery?.time}`,
    });

    setTimeout(() => {
      clearCart();
      navigate("/dashboard");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Koszyk jest pusty</h2>
          <p className="text-muted-foreground mb-6">
            Dodaj pizzę do koszyka, aby kontynuować
          </p>
          <Link to="/menu">
            <Button size="lg">Zobacz menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Koszyk</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Twoje pizze ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex gap-4 p-4 bg-secondary/20 rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.size}</p>
                            {item.extras.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.extras.map((extra, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {extra}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {(item.price * item.quantity).toFixed(2)} zł
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adres dostawy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="street">Ulica i numer</Label>
                    <Input
                      id="street"
                      placeholder="ul. Przykładowa 123"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Miasto</Label>
                    <Input
                      id="city"
                      placeholder="Warszawa"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Kod pocztowy</Label>
                    <Input
                      id="postalCode"
                      placeholder="00-000"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      placeholder="+48 123 456 789"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Metoda dostawy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="space-y-3">
                    {deliveryMethods.map(method => (
                      <div
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                          deliveryMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setDeliveryMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-muted-foreground">{method.time}</div>
                            </div>
                            <div className="font-bold">
                              {method.price === 0 ? "Gratis" : `${method.price.toFixed(2)} zł`}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Metoda płatności
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map(method => {
                      const Icon = method.icon;
                      return (
                        <div
                          key={method.id}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                          <Icon className="h-5 w-5" />
                          <Label htmlFor={`payment-${method.id}`} className="flex-1 cursor-pointer font-medium">
                            {method.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Podsumowanie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                <div className="space-y-2">
                  <Label htmlFor="coupon" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Kod rabatowy
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="PIZZA20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      variant="outline"
                      disabled={!!appliedCoupon}
                    >
                      Zastosuj
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm text-accent">
                      <span>Kupon: {appliedCoupon.code}</span>
                      <span>-{appliedCoupon.discount.toFixed(2)} zł</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Suma produktów</span>
                    <span>{totalPrice.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dostawa</span>
                    <span>{deliveryPrice === 0 ? "Gratis" : `${deliveryPrice.toFixed(2)} zł`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-accent">
                      <span>Rabat</span>
                      <span>-{discount.toFixed(2)} zł</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Łącznie</span>
                  <span className="text-2xl font-bold text-primary">
                    {finalTotal.toFixed(2)} zł
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  Złóż zamówienie
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Klikając "Złóż zamówienie" akceptujesz regulamin i politykę prywatności
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
