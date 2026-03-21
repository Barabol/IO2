# Wszystkie wzorce są testowane, a ich zastosowanie jest przedstawione w testach jednostkowych.

# Wzorce konstrukcyjne

- Singleton(poprawione)\
Menu.java

- Prototyp(poprawione)\
Pizza.java

# Wzorce projektowe

- Kompozyt\
Menu.java\
Został zastosowany by ułatwić ewentualne rozszeżanie aplikacji

- Fasada\
EKasjerka.java\
Został zastosowany by ułatwić kożystanie z grupy obiektów menu i zamówienie

- Pyłek(Poprawione)\
Napoj.java\
Dodatek.java\
Pizza.java\
Menu.java\
EKasjerka.java\
Zamowienie.java\
klasa menu zawiera listy z napojami, dodatkami i pizzami, które po referencji są przypisywane do zamuwienia\ 

Został zastosowany by zaoszczędzić pamięć i przyśpieszyć dodawanie elementów do zamówienia


# Czynnościowe wzorce projektowe

- Iterator\
SubMenu.java\
Został zastosowany by była możliwość prostej iteracji po wszystkich elementach submenu

- Odwiedzający\
SubMenu.java\
Został zastosowany by umożliwić aktualizacje własności obiektów w każdym submenu

- Strategia\
SubMenu.java\
Został zastosowany by umożliwić filtrowanie elementów w każdym submenu\

Wszystkie czynnościowe wzorce projektowe zostały zaimplementowane w klasie "SubMenu" z powodu na częste jej użycie w wielu miejscach w programie.\
Dzięki temu jesteśmy w stanie kożystać w wielu miejscach z powyższych wzorców czynnościowych.


