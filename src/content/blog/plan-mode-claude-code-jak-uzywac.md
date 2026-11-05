---
title: "Plan Mode w Claude Code: jak planować zmiany, zanim agent ruszy kod"
description: "Plan Mode włączasz przez Shift+Tab, /plan lub --permission-mode plan. Co Claude może w tym trybie, jak zatwierdzić albo poprawić plan i kiedy go używać."
seoTitle: "Plan Mode w Claude Code: jak włączyć i zatwierdzić plan"
pubDate: Oct 14 2026
tags: ['Claude Code', 'Plan Mode', 'Tryby uprawnień', 'Workflow']
category: guide
keywords: ['Plan Mode Claude Code', 'plan mode claude', 'jak włączyć plan mode', 'Claude Code tryb planowania', 'Shift+Tab Claude Code', 'permission mode plan']
readingTime: 6
---

Plan Mode to tryb pracy Claude Code, w którym agent najpierw bada projekt i pisze plan zmian, a
plików źródłowych nie zmienia. Zmiany zaczyna wprowadzać dopiero po tym, jak zatwierdzisz plan.

Dzięki temu błędne założenie wychodzi na etapie planu, który czytasz w minutę. Bez planu to samo
założenie wychodzi dopiero w gotowym kodzie, który trzeba przejrzeć i często cofnąć.

Opis opiera się na oficjalnej dokumentacji Claude Code (stan z października 2026).

## Co Claude może, a czego nie może w Plan Mode

W Plan Mode Claude:

- czyta pliki projektu,
- uruchamia polecenia, które pomagają zbadać projekt (wyszukiwanie, listowanie plików, testy),
- zadaje pytania, gdy czegoś nie wie,
- pisze plan zmian.

Nie edytuje plików źródłowych, dopóki nie zatwierdzisz planu.

Polecenia powłoki podlegają tym samym kontrolom co zwykle. Jeśli w sesji działa auto mode, każde
polecenie sprawdza dodatkowy model (klasyfikator) i blokuje ryzykowne. Jeśli auto mode nie
działa, polecenia spoza wbudowanej listy poleceń tylko do odczytu wymagają Twojej zgody.

## Jak włączyć Plan Mode

Są trzy sposoby.

**1. Klawisz Shift+Tab w trakcie sesji.** Każde naciśnięcie zmienia tryb uprawnień. Naciskaj,
aż na pasku stanu pod polem polecenia pojawi się `⏸ plan mode on`. Ponowne Shift+Tab wychodzi
z Plan Mode bez zatwierdzania planu.

**2. Prefiks `/plan` przed jednym poleceniem.** Dobre, gdy chcesz zaplanować jedno konkretne
zadanie:

```text
/plan dodaj eksport faktur do CSV w module raportów
```

**3. Start całej sesji w Plan Mode:**

```bash
claude --permission-mode plan
```

Jeśli w danym projekcie chcesz zawsze zaczynać od planu, ustaw tryb domyślny w pliku
`.claude/settings.json` w repozytorium:

```json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

W rozszerzeniu VS Code służy do tego ustawienie `claudeCode.initialPermissionMode` z wartością
`plan`.

## Zatwierdzenie planu

Gdy plan jest gotowy, Claude pokazuje go i pyta, co dalej. Masz trzy odpowiedzi:

- **Yes, and use auto mode** - zatwierdzasz plan, a Claude wprowadza zmiany w auto mode. Gdy auto
  mode jest niedostępny (np. wyłączyła go organizacja), opcja nazywa się **Yes, auto-accept
  edits** i Claude edytuje pliki bez pytania o każdą zmianę.
- **Yes, manually approve edits** - zatwierdzasz plan, ale każdą edycję pliku akceptujesz
  osobno.
- **No, keep planning** - zostajesz w Plan Mode i piszesz, co w planie zmienić.

Zatwierdzenie kończy Plan Mode. Żeby znów zaplanować kolejne zadanie, wróć do Plan Mode przez
Shift+Tab albo zacznij polecenie od `/plan`.

**Poprawianie planu ręcznie.** Gdy plan jest wyświetlony, naciśnij `Ctrl+G`. Plan otworzy się w
Twoim domyślnym edytorze tekstu. Możesz dopisać kroki, usunąć zbędne albo zmienić kolejność, a
Claude będzie pracował według poprawionej wersji.

## Kiedy używać Plan Mode

Plan Mode opłaca się, gdy pomyłka jest droga albo trudna do zauważenia:

- **Zmiana w wielu plikach** - refaktoryzacja, zmiana nazwy w całym projekcie, migracja
  biblioteki.
- **Nieznany kod** - pierwsze zadanie w cudzym repozytorium albo w module, którego nie znasz.
- **Zmiany w danych i konfiguracji** - migracje bazy, skrypty wdrożeniowe, ustawienia serwera.
- **Zadanie opisane ogólnie** - gdy sam nie wiesz jeszcze dokładnie, czego chcesz. Plan pokaże,
  jak Claude zrozumiał polecenie.

Przy małych, jasnych zmianach (literówka, jedna funkcja z testem) Plan Mode tylko spowalnia pracę.

## Jak czytać plan

Zanim zatwierdzisz, sprawdź cztery rzeczy:

1. **Lista plików.** Czy plan zmienia tylko te pliki, które powinien? Plik spoza zakresu to
   sygnał, że Claude źle zrozumiał zadanie.
2. **Założenia.** Czy plan opiera się na faktach z projektu („funkcja X jest używana w trzech
   miejscach”), czy na domysłach? Domysły popraw przez **No, keep planning**.
3. **Sposób sprawdzenia.** Czy plan mówi, jak Claude sprawdzi wynik - którym testem, którym
   poleceniem? Plan bez kroku sprawdzenia warto uzupełnić.
4. **Kolejność.** Przy zmianach w danych najpierw kopia zapasowa albo tryb próbny, potem zmiana.

## Przykład

Polecenie w Plan Mode:

```text
W module zamówień rabat liczy się od kwoty brutto, a powinien od netto.
Znajdź wszystkie miejsca, gdzie liczony jest rabat, i zaplanuj poprawkę z testami.
```

Claude przeszukuje projekt, czyta funkcje liczące rabat i istniejące testy, a potem pokazuje plan:
które dwie funkcje zmienić, który test dziś przechodzi tylko przypadkiem, jakie trzy nowe
przypadki testowe dodać i jakim poleceniem uruchomić testy. Jeśli w planie brakuje faktur
korygujących, piszesz to w **No, keep planning** i dostajesz poprawiony plan - zanim powstała
choć jedna linia kodu.

## Co dalej

Jeśli dopiero zaczynasz, zobacz najpierw
[instalację Claude Code na Windows, macOS i Linux](https://blog.claudecodelab.pl/blog/instalacja-claude-code-windows-mac-linux/)
oraz [start pracy w zespole](https://blog.claudecodelab.pl/blog/claude-code-po-polsku-jak-zaczac-w-zespole/).

Planowanie zadań, czytanie planów i ustawienie uprawnień ćwiczymy na
[warsztacie Claude Code](https://claudecodelab.pl/kurs), na repozytorium Twojego zespołu. Możesz
też [umówić 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
