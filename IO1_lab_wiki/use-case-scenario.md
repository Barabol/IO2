<!---->

## Nazwa: Zamówienie internetowe

- Warunki początkowe:
  - Klient musi mieć dostęp do aplikacji webowej
  - Musi istnieć przynajmniej jeden wariant pizzy
  - Musi istnieć przynajmniej jeden dodatek
  - Musi istnieć przynajmniej jeden napój
- Warunki końcowe:
  - Zamówienie zostało złożone
  - Zamówienie zostało opłacone
  - Zaczęto realizacje zamówienia
- Aktorzy:
  - Klient
- Przepływ zdarzeń:
   1. Klient wchodzi na strone internetową
   2. System wyświetla ofertę
   3. Klient kompletuje zamówienie
   4. System wyświetla szczególy zamówienia
   5. Klient składa zamówienie
   6. Klient wybiera rodziaj odbioru
   7. Wykonywany jest scenariusz płatności
   8. System oznacza status zamówienia na "do realizacji"
   9. System wysyła potwierdzenie zamówienia
  10. System powiadamia klienta o przewidywanym czasie realizacji
- Alternatywne przypływy zdarzeń:
  - 7.Klient wybiera metodę płatności przy odbiorze
  - 8.System oznacza status zamówienia na "do realizacji"
  - 9.System wysyła potwierdzenie zamówienia
  - 10.System powiadamia klienta o przewidywanym czasie realizacji
  - 11.Klient otrzymuje i opłaca zamówienie.

## Nazwa: Opłata zamówienia

- Warunki początkowe:
  - Klient jest w stanie opłacić zamówienie
- Warunki końcowe:
  - Zamówienie zostało opłacone
- Aktorzy:
  - Klient
- Przepływ zdarzeń:
  1. Klient wybiera opcję płatności kartą
- Alternatywne przypływy zdarzeń:
  - 1\. Klient wybiera płatność internetową
  - 1\. Klient wybirera opcję płatności na miejscu
  - 1\. Transakcja zakończyła się niepowodzeniem POWRÓT DO PUNKTU 1

## Nazwa: Opłata zamówienia na miejscu

- Warunki początkowe:
  - Klient wybrał sposób opłaty zamówienia na miejscu
  - Klient jest w stanie opłacić zamówienie
- Warunki końcowe:
  - Zamówienie zostało opłacone
- Aktorzy:
  - Klient
  - Dostawca
  - Kasjer
- Przepływ zdarzeń:
  1. Klient płaci kartą na miejscu
- Alternatywne przypływy zdarzeń:
  - 1\. Klient wybiera płatność internetową na miejscu
  - 1\. Klient wybiera płatność gotówką na miejscu
  - 1\. Transakcja zakończyła się niepowodzeniem POWRÓT DO PUNKTU 1

<!---->

## Nazwa: Dostawa

- Warunki początkowe:

  \-Klient złożył zamówienie\
  -Zamówienie zostało skompletowane\
  -Dostawa jest możliwa\\
- Warunki końcowe:

  \-Klient otrzymuje zamówienie\\
- Aktorzy:
  - Dostawca
  - Klient
  - Kucharz
- Przepływ zdarzeń:
  1. Odebranie gotowego zamówienia od kucharza przez dostawce
  2. Zmiana statusu zamówienia na "w trakcie dostawy"
  3. Dostarczenie zamówienia na wskazany wcześniej adres
  4. Zamówienie zmienia status na "zrealizowane"
- Alternatywne przypływy zdarzeń:

  4.Realizowany jest scenariusz opłaty na miejscu\
  5.Klient otrzymuje zamówienie po potwierdzeniu realizacji transakcji

<!---->

## Nazwa: Odbiór zamówienia na miejscu

- Warunki początkowe:
  - Klient złożył zamówienie
  - Zamówienie zostało skompletowane
  - Klient wybrał odbiór osobisty
- Warunki końcowe:
  - Klient otrzymał zamówienie
- Aktorzy:
  - Klient
  - Kasjer
  - Kucharz
- Przepływ zdarzeń:
  1. Kucharz informuje kasjera o gotowości zamówienia
  2. Kasjer zmienia status zamówienia na „do odbioru"
  3. Klient zgłasza się po odbiór
  4. Kasjer wydaje zamówienie klientowi
  5. Kasjer zmienia status zamówienia na „zrealizowane"
- Alternatywne przepływy zdarzeń:
  - 4a. Klient wybiera płatność przy odbiorze → realizowany jest scenariusz „Opłata zamówienia na miejscu"

## Nazwa: Zamówienie produktów

- Warunki początkowe:
- Kucharz zauważył niski poziom zapasów
- Dostępny jest dostawca produktów
- Warunki końcowe:
- Produkty zostały zamówione
- Aktorzy:
- Kucharz
- Przepływ zdarzeń:

1. Kucharz sprawdza stan magazynowy
2. Kucharz wybiera produkty wymagające uzupełnienia
3. Kucharz wysyła zamówienie do dostawcy

- Alternatywne przepływy zdarzeń:

\--- brak ---

## Nazwa: Dostarczenie produktów do pizzerii

- Warunki początkowe:
  - Restauracja złożyła zamówienie na produkty
  - Produkty są dostępne u dostawcy
- Warunki końcowe:
  - Produkty dostarczono do pizzerii
- Aktorzy:
  - Dostawca
  - Kucharz
- Przepływ zdarzeń:
  1. Dostawca kompletuje zamówienie produktów
  2. Dostawca dostarcza produkty do pizzerii
  3. Kucharz odbiera dostawę
  4. Dostawca wysyła potwierdzenie dostarczenia produktów
- Alternatywne przepływy zdarzeń:
  - 2a. Produkty są niedostępne → dostawca informuje kucharza → kucharz modyfikuje zamówienie

## Nazwa: Zamówienie na miejscu lub telefoniczne

- Warunki początkowe:
- Klient zdecydował się zamówić pizzę
- Pracownik restauracji jest dostępny
- Warunki końcowe:
- Zamówienie zostało złożone
- Zamówienie oczekuje na realizację
- Aktorzy:
- Klient
- Kasjer
- Przepływ zdarzeń:

1. Klient podaje zamówienie kasjerowi (osobiście lub telefonicznie)
2. Kasjer wprowadza zamówienie do systemu
3. System generuje numer zamówienia
4. Kasjer przekazuje numer zamówienia klientowi
5. Status zamówienia zmienia się na „do realizacji"

- Alternatywne przepływy zdarzeń:
- 1a. Klient zmienia zamówienie → kasjer aktualizuje je w systemie
- 1b. Klient rezygnuje → proces zostaje anulowany

<!---->

## Nazwa: Realizacja zamówienia

- Warunki początkowe:
  - Zamówienie zostało przyjęte
  - Wszystkie potrzebne produkty są dostępne
- Warunki końcowe:
  - Zamówienie zostało przygotowane
- Aktorzy:
  - Kucharz
- Przepływ zdarzeń:
  1. Kucharz odbiera zamówienie z systemu
  2. Kucharz przygotowuje pizze i dodatki
  3. Kucharz oznacza zamówienie jako „gotowe"
  4. System informuje kasjera lub dostawcę o gotowości
- Alternatywne przepływy zdarzeń:
  - 2a. Brakuje produktów → uruchamiany jest scenariusz „Zamówienie produktów"

<!---->

## Nazwa: Aktualizacja menu

- Warunki początkowe:
  - Manager posiada uprawnienia do edycji menu
  - System działa poprawnie
- Warunki końcowe:
  - Menu zostało zaktualizowane
- Aktorzy:
  - Manager
- Przepływ zdarzeń:
  1. Manager wchodzi w panel edycji menu
  2. Manager wybiera jedną z opcji:
     - zmiana ceny produktu
     - dodanie produktu
     - usunięcie produktu
  3. System zapisuje zmiany
  4. Menu zostaje zaktualizowane
- Alternatywne przepływy zdarzeń:
  - 3a. Manager anuluje wprowadzanie zmian → menu pozostaje bez modyfikacji

![Diagram bez tytułu.drawio.png](uploads/37b5539393735ade82f65f1f3d19a686/Diagram_bez_tytu%C5%82u.drawio.png)