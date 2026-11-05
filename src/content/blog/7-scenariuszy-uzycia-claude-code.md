---
title: "7 zastosowań Claude Code w codziennej pracy"
seoTitle: "Do czego służy Claude Code? 7 zastosowań z przykładami"
description: "Poznanie nowego projektu, naprawa błędów, refaktoryzacja, testy, pull requesty, mockupy i dokumentacja - 7 zastosowań Claude Code z gotowymi poleceniami."
pubDate: 2025-10-23
updatedDate: 2026-11-05
heroImage: ../../assets/blog/heroes/7-scenariuszy-uzycia-claude-code.jpg
tags: ['Claude Code', 'Automatyzacja pracy', 'Dobre praktyki', 'Produktywność']
readingTime: 6
heroImageAlt: "Ilustracja do artykułu o siedmiu praktycznych zastosowaniach Claude Code"
---

Claude Code nie służy tylko do pisania nowego kodu. Najwięcej czasu oszczędza przy zadaniach, które
wymagają przeczytania wielu plików: poznawaniu projektu, szukaniu przyczyny błędu, testach i
opisach zmian. Poniżej siedem takich sytuacji z poleceniami, które można skopiować. Opis dotyczy
stanu z listopada 2026.

## 1. Poznanie nowego projektu

Dołączasz do projektu albo przejmujesz kod po kimś. Zamiast przeglądać katalogi ręcznie, uruchom
Claude Code w repozytorium i zadawaj pytania:

```text
Opisz ten projekt: do czego służy, jakie technologie wykorzystuje, jak go uruchomić lokalnie.
```

```text
Jak działa logowanie użytkownika? Przejdź od formularza do zapisu sesji
i wypisz pliki po kolei.
```

Claude przeszukuje pliki sam i odpowiada z nazwami plików i funkcji. Każdą odpowiedź da się
sprawdzić, otwierając wskazane miejsce. Gdy coś się nie zgadza, dopytaj: „pokaż fragment, na
którym to opierasz”.

## 2. Szukanie przyczyny błędu

Wklej komunikat błędu i opisz, kiedy występuje:

```text
Na produkcji pojawia się błąd:
TypeError: Cannot read properties of undefined (reading 'map')
  at UserList (UserList.tsx:42)
Występuje po wejściu na listę użytkowników zaraz po zalogowaniu.
Znajdź przyczynę, napisz test, który ją odtwarza, a dopiero potem popraw kod.
```

Kolejność „test, potem poprawka” jest ważna. Test pokazuje, że Claude znalazł prawdziwą przyczynę,
a nie tylko ukrył objaw, na przykład dopisując `?.` w miejscu błędu.

## 3. Refaktoryzacja starszego kodu

Przy zmianach w wielu plikach zacznij od [Plan Mode](/blog/plan-mode-claude-code-jak-uzywac/).
Naciskaj `Shift+Tab`, aż pojawi się `plan mode on`, albo poprzedź polecenie słowem `/plan`:

```text
/plan Przepisz moduł db/users.js z callbacków na async/await.
Zachowaj publiczne API funkcji, a zmianę sprawdź istniejącymi testami.
```

Claude czyta kod i pisze plan, ale nie zmienia plików, dopóki planu nie zatwierdzisz. W planie
sprawdź listę plików i sposób weryfikacji. Jeśli refaktoryzacja pójdzie źle,
[/rewind](/blog/checkpointy-claude-code-rewind-cofanie-zmian/) cofa zmiany.

## 4. Testy dla kodu bez testów

```text
Uruchom testy z pomiarem pokrycia i wskaż trzy pliki w src/services
z najniższym pokryciem.
```

```text
Dopisz testy dla payment-service.js. Uwzględnij odrzuconą kartę, przekroczony
czas odpowiedzi bramki i ponowienie po błędzie przejściowym. Uruchom testy.
```

Claude uruchamia testy sam, więc widzi, które przechodzą. Przejrzyj jednak, co testy faktycznie
sprawdzają. Test, który zawsze przechodzi, nic nie mówi o kodzie.

## 5. Commity i pull requesty

```text
Przejrzyj moje zmiany, podziel je na logiczne commity i zaproponuj opisy.
```

```text
Utwórz pull request z tej gałęzi. W opisie: co się zmienia, dlaczego
i jak to przetestować.
```

Do tworzenia PR na GitHubie Claude używa narzędzia `gh`, jeśli jest zainstalowane i zalogowane.
Opis powstaje na podstawie faktycznych zmian w kodzie, więc nie zawiera wymyślonych liczb, o ile
ich nie podasz.

## 6. Ekran z obrazka

Claude Code czyta obrazy. Zrzut ekranu albo makietę wklejasz do pola polecenia (`Ctrl+V`),
przeciągasz plik do terminala albo podajesz ścieżkę:

```text
Zbuduj formularz logowania według makiety design/logowanie.png.
Użyj istniejących komponentów z src/components/ui.
```

Ten sam sposób działa przy błędach wyglądu: wklej zrzut ekranu i opisz, co jest nie tak.

## 7. Dokumentacja

```text
Dodaj komentarze JSDoc do funkcji eksportowanych z user-service.js.
Opisz parametry, wartość zwracaną i rzucane błędy. Nie zmieniaj logiki.
```

```text
Na podstawie kodu napisz w README sekcję o uruchamianiu projektu lokalnie.
Każde polecenie sprawdź, uruchamiając je.
```

Druga prośba jest ważna: dokumentacja, której polecenia zostały uruchomione, jest zgodna z
projektem, a nie tylko wiarygodnie brzmi.

## Dodatkowo: automatyczne sprawdzanie przez hooki

Hooki to polecenia, które Claude Code uruchamia sam w określonych momentach, na przykład po każdej
edycji pliku. Ten wpis w `.claude/settings.json` formatuje każdy plik zaraz po tym, jak Claude go
zmieni (wymaga narzędzia `jq`, które czyta ścieżkę pliku z danych przekazanych do hooka):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" }
        ]
      }
    ]
  }
}
```

Więcej przykładów w artykule o [hookach jako lekkim CI](/blog/claude-code-hooki-ci-light/).

## Wspólna zasada

We wszystkich siedmiu sytuacjach lepszy wynik daje polecenie, które mówi, jak sprawdzić efekt:
„uruchom testy”, „sprawdź polecenie”, „nie zmieniaj logiki”. Claude Code sprawdza swoją pracę,
jeśli wie, czym ją sprawdzić.

## Co dalej

- [Pierwsze kroki z Claude Code](/blog/pierwsze-kroki-z-claude-code/).
- [Zaawansowane techniki](/blog/zaawansowane-techniki-claude-code/) - poziom effort, własne skille,
  hooki i subagenty.
- [Oficjalne przykłady typowych zadań](https://docs.anthropic.com/en/docs/claude-code/common-workflows).

Te zastosowania ćwiczymy na repozytorium Twojego zespołu na
[warsztacie Claude Code](https://claudecodelab.pl/kurs). Możesz też
[umówić 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
