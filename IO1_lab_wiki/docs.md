# 1. Opis problemu:

System obsługi zamówień w pizzerii ma umożliwiać składanie i zarządzanie zamówieniami pizzy przez klientów oraz wspierać pracę personelu.

## Opis modelowanej rzeczywistości:

- Pizza - pozycja z menu opisana nazwą, rozmiarem, składnikami i ceną
- Cena - wartośc sprzedawanego towaru
- Zamówienie - zestaw zamówionych produktów wraz z informacjami o kliencie, sposobem dostawy, formą płatności, aktualnym statusem zamówienia itd.
- Klient - osoba składająca zamówienie, posiadająca dane kontaktowe i adres dostawy
- Pracownicy - personel pizzerii składający się z:
  - kasjerów/kelnerów - przyjmują płatności również dostarcza pizze do stolika
  - kucharzy - przygotowują pizzę,
  - dostawców - dostarczają pizzę
  - manager - aktualizuje ofertę, nadzoruje pracowników

## Użytkownicy systemu:

System przewiduje pięć ról: klient, kasjer, kucharz, dostawca, manager.\
Każda rola korzysta z systemu w innym celu (złożenie zamówienia, przyjęcie płatności itd.)

## Opis funkcjonalności systemu:

#### Wymagania funkcjonalne

- Składanie zamówienia - klient wybiera pizzę z menu, określa jej rozmiar, dodatki, sposób odbioru (na miejscu, odbiór osobisty czy dostawa) i podaje dane kontaktowe.
- Modyfikacja i anulowanie - nim zostanie zaczęte przygotowywanie zamówienia klient może zamówienie. zmienić lub je anulować
- Płatność - system obsługuje płatność online, kartą przy terminalu płatniczym oraz gotówką w restauracji lub podczas odbioru pizzy.
- Skompletowanie zamówienia pizzy - kucharz otrzymuje listę zamówień, przygotowuje odpowiednie pizze i oznacza je jako gotowe.
- Dostawa - dostawca odbiera gotowe zamówienie, otrzymuje szczegóły klienta i dostarcza pizzę.
- Aktualizacja menu i składników - manager może dodawać, usuwać lub modyfikować menu oraz zarządzać personelem.
- Raportowanie - system generuje raporty - liczba zamowien, najpopularniejsze dania, czas realizacji itp.

#### Wymagania niefunkcjonalne

- System powinien być zaprojektowany w taki sposób, aby nowy użytkownik mógł wykonać podstawowe operacje bez konieczności szkolenia.
  - Co najmniej 80% uzytkowników testowych powinno być w stanie złożyć zamówienie do 5 minut od zalogowania/założenia konta
- Wydajny
  - Będący w stanie zapewnić co najmniej 3000 zapytań na sekundę
- Bezpieczny
  - System pozbywa się danych wrażliwych klientów (Adres zamieszkania, imię, nazwisko itd.) do 14 dni od zakończenia transakcji.
  - System co miesiąc wykonuje eksport danych niewrażliwych z bazy do szyfrowanego plilku.
  - Odpowiednie uprawnienia uniemożliwiające nie autoryzowany dostęp do danych
- Niezawodny
  - Będący w stanie funkcjonować przez co najmniej 80% czasu

# 2. Słownik pojęć:

- Zamówienie -- zbiór produktów zamówionych przez klienta z informacjami o dostawie, płatności i statusie.
- Pizza - produkt w menu opisany nazwą, rozmiarem, składnikami i ceną.
- Składnik - pojedynczy element używany do przygotowania pizzy (np. ser, szynka).
- Menu -- lista wszystkich dostępnych pizz, dodatków i napojów z cenami.
- Klient -- osoba składająca zamówienie; posiada dane kontaktowe i adres dostawy.
- Kasjer -- pracownik przyjmujący zamówienia w lokalu i obsługujący płatności.
- Kucharz -- pracownik przygotowujący pizzę zgodnie z zamówieniem.
- Dostawca -- pracownik odpowiedzialny za dostawę gotowych zamówień.
- Manager -- osoba nadzorująca system, aktualizująca menu i zarządzająca zapasami.
- Status zamówienia -- aktualny etap realizacji: złożone, w przygotowaniu, gotowe, w dostawie, zrealizowane, anulowane.
- Płatność -- proces uiszczenia opłaty za zamówienie (gotówka, karta, online).

# 3. User stories:

- Jako klient chcę poznać menu pizzerii by być w stanie wybrać idealną pizzę.
- Jako klient chcę złożyć zamówienie na pizzę ponieważ jestem głodny.
- Jako klient chcę dodawać lub usuwać składniki w zamówieniu, aby dostosować pizzę do swoich preferencji smakowych.
- Jako klient chcę móc śledzić status mojego zamówienia, aby wiedzieć, kiedy będzie gotowe do odbioru lub dostawy.

<!---->

- Jako kasjer chcę przyjmować płatności różnymi metodami (gotówka, karta, online), aby obsłużyć wszystkich klientów.
- Jako kasjer chcę zmieniać status zamówienia, aby klient miał informacje dotyczące realizacji zamówienia.
- Jako kasjer chcę kompletować zamówienie od klienta aby móc je zrealizować.
- Jako kasjer chcę dawać klientom numerki zamówienia w celu późniejszej identyfikacji.
- Jako kasjer chcę wiedzieć z którego stolika wyszło zamówienie by być w stanie dostarczyć je do odpowoiedzniego klienta

<!---->

- Jako kucharz chcę otrzymywać listę zamówień będących posortowanych względem godziny zamówienia, aby sprawnie organizować pracę w kuchni.
- Jako kucharz chcę mieć możliwość przekazania gotowego zamówienia do dostawy aby klient mógł sprawinie otrzymać zamówienie.
- Jako kucharz chcę mieć możliwość składania zamówień na brakujące produkty u dostawcy aby uzupełniać braki w asortymencie kuchni.

<!---->

- Jako dostawca chcę widzieć adres dostawy i szczegóły zamówienia, aby dostarczyć pizzę na czas.

<!---->

- Jako manager chcę móc aktualizować menu i ustalać ceny, aby reagować na zmieniające się preferencje klientów.

# Use case diagram:

![t.png](uploads/b64c224d95404c35093674a60ee3aa9d/t.png)