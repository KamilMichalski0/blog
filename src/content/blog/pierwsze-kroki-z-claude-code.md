---
title: "Claude Code: pierwsze kroki i instalacja"
seoTitle: "Pierwsze kroki z Claude Code: logowanie, komendy, projekt"
description: "Jak uruchomić Claude Code w terminalu, zalogować się, poznać projekt pierwszym poleceniem i wprowadzić pierwszą zmianę. Najważniejsze komendy i skróty."
pubDate: 2025-10-23
updatedDate: 2026-11-05
heroImage: ../../assets/blog/heroes/pierwsze-kroki-z-claude-code.jpg
tags: ['Claude Code', 'Tutorial', 'Instalacja', 'Początkujący']
readingTime: 5
heroImageAlt: "Ilustracja do artykułu o pierwszych krokach z Claude Code"
---

Ten poradnik prowadzi od instalacji do pierwszej zmiany w projekcie: logowanie, pierwsze pytania
o kod, zatwierdzanie zmian i komendy, których używa się codziennie. Opis dotyczy stanu z listopada
2026.

## 1. Instalacja

Claude Code instaluje się jednym poleceniem. Na macOS, Linuxie i w WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

W Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Ta metoda nie wymaga Node.js i sama aktualizuje Claude Code. Starsze poradniki pokazują
instalację przez `npm install -g`. Nadal działa, ale nie jest już zalecana. Pozostałe metody
(Homebrew, WinGet) i najczęstsze błędy opisuje
[poradnik instalacji dla Windows, macOS i Linux](/blog/instalacja-claude-code-windows-mac-linux/).

Sprawdzenie, czy wszystko działa:

```bash
claude --version
claude doctor
```

## 2. Logowanie

Uruchom Claude Code:

```bash
claude
```

Przy pierwszym uruchomieniu otworzy się przeglądarka z logowaniem. Wybierasz jedną z dwóch opcji:

- **konto Claude z subskrypcją** (Pro, Max, Team, Enterprise),
- **konto Claude Console** z kredytami API.

Darmowy plan Claude nie obejmuje Claude Code. Konto zmienisz później poleceniem `/login`.

## 3. Pierwsza sesja w projekcie

Uruchamiaj Claude Code zawsze w katalogu projektu. Claude ma wtedy dostęp do plików tego katalogu
i podkatalogów:

```bash
cd ~/projekty/sklep
claude
```

Przy pierwszym uruchomieniu w nowym katalogu Claude zapyta, czy ufasz temu folderowi. Potwierdź
tylko dla własnych projektów.

Zacznij od pytań, nie od zmian:

```text
Czego dotyczy ten projekt i jak uruchomić testy?
```

```text
Gdzie jest obsługa płatności? Wypisz pliki i opisz przepływ jednym akapitem.
```

Claude sam przeszukuje pliki. Nie musisz ich wklejać. Jeśli chcesz wskazać konkretny plik, wpisz
`@` i zacznij pisać jego nazwę.

## 4. Plik CLAUDE.md

Wpisz w sesji:

```text
/init
```

Claude przejrzy projekt i utworzy plik `CLAUDE.md` z opisem struktury, poleceniami do budowania i
testów oraz konwencjami. Ten plik jest czytany na początku każdej kolejnej sesji. Przejrzyj go i
dopisz zasady, których Claude nie wyczyta z kodu, na przykład „nie zmieniaj migracji, które już są
na produkcji”.

## 5. Pierwsza zmiana

Opisz małe, sprawdzalne zadanie:

```text
Dodaj walidację adresu e-mail w formularzu rejestracji, tak jak w formularzu logowania.
Dopisz test i uruchom testy.
```

Claude pokaże zmianę w pliku i zapyta o zgodę. Masz trzy odpowiedzi: zgoda na tę jedną edycję,
zgoda na wszystkie edycje w tej sesji albo odmowa z komentarzem, co zrobić inaczej. To samo dotyczy
poleceń w terminalu, na przykład uruchomienia testów.

Jeśli wynik Ci się nie podoba, naciśnij **Esc dwa razy** albo wpisz `/rewind`. Kod i rozmowa wrócą
do stanu sprzed zmiany. Szczegóły w artykule o
[checkpointach i /rewind](/blog/checkpointy-claude-code-rewind-cofanie-zmian/).

## Komendy i skróty na co dzień

| Komenda lub skrót | Co robi |
|---|---|
| `claude` | Nowa sesja w bieżącym katalogu |
| `claude -c` | Wznawia ostatnią rozmowę w tym katalogu |
| `/resume` | Lista wcześniejszych rozmów do wznowienia |
| `/clear` | Czyści rozmowę i zaczyna od nowa |
| `/compact` | Streszcza długą rozmowę, żeby zwolnić miejsce w kontekście |
| `/context` | Pokazuje, ile kontekstu jest zajęte |
| `/model` | Zmiana modelu |
| `/help` | Lista wszystkich komend |
| `Esc` | Przerywa Claude w trakcie pracy |
| `Esc` `Esc` | Cofnięcie do wcześniejszego punktu (`/rewind`) |
| `Shift+Tab` | Zmiana trybu: zwykły, automatyczna akceptacja edycji, [Plan Mode](/blog/plan-mode-claude-code-jak-uzywac/) |
| `!polecenie` | Uruchamia polecenie powłoki bez udziału Claude |

## Dobre nawyki od pierwszego dnia

- **Jedno zadanie na rozmowę.** Po skończeniu zadania użyj `/clear`. Stary kontekst z innego
  zadania tylko przeszkadza.
- **Polecenie z kryterium sprawdzenia.** „Dodaj X i uruchom testy” daje lepszy wynik niż „dodaj
  X”, bo Claude sam sprawdzi, czy działa.
- **Najpierw zrozumienie, potem zmiana.** Przy nieznanym kodzie zacznij od pytań albo od Plan
  Mode.
- **Commit przed większą zmianą.** Checkpointy cofają edycje Claude, ale git jest pewniejszy.

## Co dalej

- [Czym jest Claude Code](/blog/wprowadzenie-do-claude-code/) - przegląd możliwości.
- [7 zastosowań Claude Code w codziennej pracy](/blog/7-scenariuszy-uzycia-claude-code/).
- [Start z Claude Code w zespole](/blog/claude-code-po-polsku-jak-zaczac-w-zespole/) - wspólny
  CLAUDE.md, uprawnienia i pierwszy serwer MCP.
- [Oficjalny quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart).

Pierwsze kroki na repozytorium Twojego zespołu przechodzimy razem na
[warsztacie Claude Code](https://claudecodelab.pl/kurs). Możesz też
[umówić 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
