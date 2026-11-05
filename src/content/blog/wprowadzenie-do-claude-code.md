---
title: "Claude Code: wprowadzenie do pracy z AI"
seoTitle: "Czym jest Claude Code? Co potrafi i jak z niego korzystać"
description: "Claude Code to agent AI od Anthropic, który działa w terminalu: czyta projekt, edytuje pliki i uruchamia polecenia. Co potrafi, ile kosztuje dostęp i od czego zacząć."
pubDate: 2025-10-22
updatedDate: 2026-11-05
heroImage: ../../assets/blog/heroes/wprowadzenie-do-claude-code.jpg
tags: ["Claude Code","AI","Programowanie","Tutorial"]
draft: false
author: ClaudeCodeLab
readingTime: 5
heroImageAlt: "Ilustracja do artykułu wprowadzającego do Claude Code"
---

Claude Code to agent AI od Anthropic, który pracuje w Twoim projekcie. Uruchamiasz go w terminalu
w katalogu repozytorium, opisujesz zadanie zwykłym językiem, a on sam czyta potrzebne pliki,
wprowadza zmiany i uruchamia polecenia, na przykład testy. Każdą zmianę możesz obejrzeć i
zatwierdzić albo odrzucić.

Różnica w porównaniu z czatem w przeglądarce jest prosta: w czacie kopiujesz fragmenty kodu tam
i z powrotem. Claude Code widzi cały projekt i działa na plikach na Twoim dysku.

Opis dotyczy stanu z listopada 2026.

## Co Claude Code robi w praktyce

- **Odpowiada na pytania o projekt.** „Gdzie jest liczony rabat?”, „Co się stanie, jeśli zmienię
  tę funkcję?”. Przeszukuje pliki i wskazuje konkretne miejsca.
- **Wprowadza zmiany w wielu plikach naraz.** Nowa funkcja, poprawka błędu, zmiana nazwy w całym
  projekcie.
- **Uruchamia polecenia.** Testy, linter, build, git. Po zmianie sam sprawdza, czy testy
  przechodzą, i poprawia kod, jeśli nie.
- **Pracuje z gitem i pull requestami.** Pisze opis commita, tworzy gałąź, przygotowuje opis PR.
- **Łączy się z innymi narzędziami przez MCP.** Baza danych, przeglądarka, system zgłoszeń. Więcej
  w artykule o [MCP w Claude Code](/blog/mcp-model-context-protocol/).

Nie ogranicza się do jednego języka programowania. Działa z każdym projektem, który da się
otworzyć w terminalu.

## Gdzie działa

- **Terminal** na macOS, Linuxie i Windows (natywnie albo w WSL). To podstawowa wersja.
- **VS Code i JetBrains** przez rozszerzenia, które pokazują zmiany w edytorze.
- **Aplikacja desktopowa i przeglądarka** (claude.ai/code), gdzie zadanie może działać w chmurze.

Instalacja to jedno polecenie. Szczegóły dla każdego systemu są w poradniku
[jak zainstalować Claude Code na Windows, macOS i Linux](/blog/instalacja-claude-code-windows-mac-linux/).

## Jaki dostęp jest potrzebny

Claude Code wymaga płatnego dostępu. Są dwie drogi:

1. **Subskrypcja Claude** (Pro, Max, Team albo Enterprise). Płacisz stałą kwotę miesięcznie, a
   limity użycia zależą od planu.
2. **Konto w Claude Console** z kredytami API. Płacisz za faktycznie zużyte tokeny.

Darmowy plan Claude nie obejmuje Claude Code.

## Jak wygląda praca: przykład

W katalogu projektu uruchamiasz:

```bash
claude
```

i piszesz zadanie:

```text
W formularzu rejestracji brakuje walidacji adresu e-mail.
Dodaj ją tak jak w formularzu logowania i dopisz test.
```

Claude Code znajduje formularz logowania, sprawdza, jak tam wygląda walidacja, pokazuje proponowane
zmiany w obu plikach i pyta o zgodę na edycję. Potem uruchamia testy i pokazuje wynik. Jeśli test
nie przechodzi, poprawia kod w kolejnej turze.

Przy większych zmianach warto zacząć od [Plan Mode](/blog/plan-mode-claude-code-jak-uzywac/): Claude
najpierw pisze plan, a pliki zmienia dopiero po jego zatwierdzeniu. Gdy wynik się nie podoba,
[checkpointy i /rewind](/blog/checkpointy-claude-code-rewind-cofanie-zmian/) cofają zmiany.

## Trzy zasady na start

**1. Konkretne polecenia.** Zamiast „napraw ten błąd” napisz, co się dzieje, gdzie i jak to
sprawdzić: „Po kliknięciu Zapisz w edycji profilu pojawia się błąd 500. Znajdź przyczynę i
dopisz test, który go odtwarza”.

**2. Plik CLAUDE.md w projekcie.** To plik z zasadami projektu, który Claude Code czyta na początku
każdej sesji: jak uruchomić testy, jakie są konwencje, czego nie ruszać. Pierwszą wersję tworzy
polecenie `/init`. Więcej o tym w artykule o
[starcie z Claude Code w zespole](/blog/claude-code-po-polsku-jak-zaczac-w-zespole/).

**3. Ty sprawdzasz wynik.** Claude Code przyspiesza pisanie i szukanie, ale odpowiedzialność za
kod zostaje po Twojej stronie. Czytaj zmiany przed zatwierdzeniem i każ uruchamiać testy.

## Co dalej

- [Pierwsze kroki z Claude Code](/blog/pierwsze-kroki-z-claude-code/) - logowanie, podstawowe
  komendy i pierwsza zmiana w projekcie.
- [7 zastosowań Claude Code w codziennej pracy](/blog/7-scenariuszy-uzycia-claude-code/).
- [Zaawansowane techniki](/blog/zaawansowane-techniki-claude-code/) - poziom effort, własne skille,
  hooki i subagenty.
- [Oficjalna dokumentacja Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview).

Pracę z Claude Code na repozytorium Twojego zespołu ćwiczymy na
[warsztacie Claude Code](https://claudecodelab.pl/kurs). Możesz też
[umówić 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
