---
title: "Claude Code: pierwsze kroki i instalacja"
description: Dowiedz się, jak zainstalować i skonfigurować Claude Code oraz jak rozpocząć pierwszą pracę z tym narzędziem w terminalu.
pubDate: Jul 08 2022
heroImage: ../../assets/blog/heroes/pierwsze-kroki-z-claude-code.jpg
tags: ['Claude Code', 'Tutorial', 'Instalacja', 'Początkujący']
readingTime: 3
heroImageAlt: "Ilustracja do artykułu o pierwszych krokach z Claude Code"
---




Claude Code to narzędzie CLI od Anthropic, które wspiera programistów w pracy z kodem. W tym artykule pokazuję, jak je zainstalować, skonfigurować i rozpocząć pierwszą sesję w terminalu.

## Czym jest Claude Code?

Claude Code to narzędzie wiersza poleceń (CLI), które działa bezpośrednio w Twoim terminalu. W przeciwieństwie do tradycyjnych IDE czy edytorów, Claude Code integruje się z Twoim obecnym sposobem pracy, pozwalając na:

- **Tworzenie funkcji z opisów** - wystarczy opisać, co chcesz zrobić
- **Analizę i naprawę kodu** - automatyczne wykrywanie i rozwiązywanie błędów
- **Nawigację po projekcie** - inteligentne przeszukiwanie całej bazy kodu
- **Generowanie dokumentacji** - automatyczne tworzenie commitów i notatek do wydań

## Wymagania systemowe

Przed [instalacją](https://docs.anthropic.com/en/docs/claude-code/installation) upewnij się, że masz:

- **Node.js 18 lub nowszy** - sprawdź wersję poleceniem `node --version`
- **Konto Claude.ai** (subskrypcja) lub **Claude Console** (kredyty API)
- System operacyjny: macOS, Linux lub Windows (z WSL)

## Instalacja Claude Code

### Metoda 1: NPM (Rekomendowana)

Najprostsza metoda instalacji dla użytkowników Node.js:

```bash
npm install -g @anthropic-ai/claude-code
```

Flaga `-g` instaluje narzędzie globalnie, dzięki czemu będzie dostępne w każdym katalogu.

### Metoda 2: Pobierz z Oficjalnej Strony

Możesz również pobrać instalator bezpośrednio ze strony:

```
https://claude.ai/download
```

Wybierz wersję dla swojego systemu operacyjnego (macOS, Linux, Windows).

## Weryfikacja instalacji

Po instalacji sprawdź, czy wszystko działa poprawnie:

```bash
claude --version
```

Powinieneś zobaczyć numer wersji Claude Code.

## Pierwsza konfiguracja

### Uruchomienie i Autoryzacja

Uruchom Claude Code po raz pierwszy:

```bash
claude
```

Zostaniesz poproszony o uwierzytelnienie. Masz dwie opcje:

1. **Claude.ai** - dla użytkowników z subskrypcją
2. **Claude Console** - dla użytkowników z kredytami API

Dane uwierzytelniające zostaną zapisane lokalnie dla przyszłych sesji.

## Twój pierwszy projekt

Przejdź do katalogu swojego projektu:

```bash
cd ~/moje-projekty/moja-aplikacja
claude
```

Claude Code automatycznie przeanalizuje strukturę Twojego projektu bez konieczności ręcznego uploadowania plików!

## Podstawowe Komendy

### Zrozumienie Projektu

Zacznij od zadawania pytań:

```
Czego dotyczy ten projekt?
```

```
Jakie technologie są tutaj używane?
```

```
Wyjaśnij strukturę folderów
```

### Wprowadzanie Zmian

Poproś o modyfikacje konwersacyjnie:

```
Dodaj walidację inputu do formularza rejestracji
```

Claude pokaże proponowane zmiany i poprosi o zatwierdzenie przed edycją plików.

## Przydatne Komendy CLI

| Komenda | Funkcja |
|---------|----------|
| `claude` | Uruchom tryb interaktywny |
| `/help` | Wyświetl dostępne komendy |
| `/clear` | Zresetuj historię konwersacji |
| `/exit` | Zakończ sesję |
| `Shift+Tab` (2x) | Aktywuj Plan Mode (tylko odczyt) |

## Dobre Praktyki

### 1. Bądź Konkretny

❌ Źle: "Popraw kod"
✅ Dobrze: "Dodaj walidację email w komponencie LoginForm.tsx"

### 2. Dziel Zadania

Zamiast: "Zrefaktoruj całą aplikację"
Lepiej: "Najpierw przeanalizuj strukturę, potem zrefaktoruj moduł autoryzacji"

### 3. Pozwól Claude Eksplorować

Przed wprowadzeniem zmian, pozwól Claude zrozumieć kontekst:

```
Przeanalizuj, jak działa system autoryzacji w tym projekcie
```

## Przykładowy przebieg pracy

Oto typowy przebieg pracy z Claude Code:

```bash
# 1. Uruchom Claude w katalogu projektu
cd ~/projekt
claude

# 2. Zrozum projekt
> Wyjaśnij, jak działa routing w tej aplikacji

# 3. Wprowadź zmiany
> Dodaj middleware do logowania żądań HTTP

# 4. Przetestuj
> Uruchom testy dla nowego middleware

# 5. Stwórz commit
> Stwórz commit z opisem dodanego middleware
```

## Dokumentacja i zasoby

### Oficjalna Dokumentacja
- [Claude Code - Installation](https://docs.anthropic.com/en/docs/claude-code/installation)
- [Claude Code - Getting Started](https://docs.anthropic.com/en/docs/claude-code/getting-started)
- [Claude Code - Main Documentation](https://docs.anthropic.com/en/docs/claude-code/)

### Powiązane Artykuły
- [Wprowadzenie do Claude Code](/blog/wprowadzenie-do-claude-code)
- [7 Scenariuszy Użycia Claude Code](/blog/7-scenariuszy-uzycia-claude-code)
- [Zaawansowane Techniki Claude Code](/blog/zaawansowane-techniki-claude-code)
- [Automatyzacja pracy z Claude](/blog/automatyzacja-workflow-z-claude)
- [Budowanie Aplikacji Astro z Claude](/blog/budowanie-aplikacji-astro-z-claude)

## Co Dalej?

Teraz, gdy masz zainstalowane i skonfigurowane Claude Code, możesz:

- Eksperymentować z różnymi promptami
- Sprawdzić dokumentację zaawansowanych funkcji
- Przeczytać o [automatyzacji pracy z Claude](/blog/automatyzacja-workflow-z-claude)
- Poznać [budowanie aplikacji Astro z Claude](/blog/budowanie-aplikacji-astro-z-claude)

## Podsumowanie

Claude Code to potężne narzędzie, które może znacząco przyspieszyć Twój rozwój jako programisty. Pamiętaj:

- Instalacja jest prosta i zajmuje tylko chwilę
- Autoryzację wykonujesz tylko raz
- Claude automatycznie rozumie strukturę Twojego projektu
- Warto formułować polecenia możliwie konkretnie
- Duże zadania najlepiej dzielić na mniejsze kroki
