---
title: "Instalacja Claude Code: Windows, macOS i Linux krok po kroku"
description: "Polecenie instalacji dla każdego systemu, Windows natywnie czy przez WSL, logowanie, sprawdzenie przez claude doctor i najczęstsze błędy - krok po kroku."
seoTitle: "Jak zainstalować Claude Code: Windows, macOS, Linux (2026)"
pubDate: Oct 14 2026
tags: ['Claude Code', 'Instalacja', 'Windows', 'WSL', 'macOS', 'Linux']
category: guide
keywords: ['instalacja Claude Code', 'jak zainstalować Claude Code', 'Claude Code Windows', 'Claude Code WSL', 'Claude Code instalacja Windows', 'claude doctor']
readingTime: 6
---

Claude Code instaluje się jednym poleceniem w terminalu. Najwięcej pytań pojawia się na
Windows: czy instalować natywnie, czy w WSL, czy potrzebny jest Git i dlaczego po instalacji
terminal nie widzi polecenia `claude`. Poniżej opisujemy instalację na każdym systemie i
sposób sprawdzenia, czy wszystko działa.

Opis opiera się na oficjalnej dokumentacji Claude Code (stan z października 2026).

## Wymagania

- **System**: macOS 13 lub nowszy, Windows 10 w wersji 1809 lub nowszej (albo Windows Server
  2019+), Ubuntu 20.04+, Debian 10+, Alpine 3.19+.
- **Sprzęt**: co najmniej 4 GB RAM, procesor x64 lub ARM64.
- **Internet**: Claude Code działa przez sieć, model nie pracuje lokalnie.
- **Konto**: płatny plan Pro, Max, Team lub Enterprise albo konto w Claude Console (rozliczenie
  za API). Darmowy plan claude.ai nie obejmuje Claude Code. Można też użyć Amazon Bedrock,
  Google Cloud lub Microsoft Foundry.

Node.js nie jest potrzebny przy instalacji natywnej. Jest potrzebny tylko przy instalacji
przez npm (wtedy w wersji 22 lub nowszej).

## macOS, Linux i WSL

Otwórz terminal i uruchom:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Instalator nie pokazuje postępu pobierania. Gdy skończy, otwórz **nowe** okno terminala i
sprawdź wersję:

```bash
claude --version
```

Na macOS można też użyć Homebrew: `brew install --cask claude-code`. Ta wersja nie aktualizuje
się sama - trzeba co jakiś czas uruchomić `brew upgrade claude-code`.

## Windows: natywnie czy w WSL?

Claude Code działa na Windows na dwa sposoby. Wybór zależy od tego, gdzie leżą Twoje projekty i
jakich narzędzi używasz.

| Sposób | Kiedy wybrać |
| --- | --- |
| Natywnie (PowerShell lub CMD) | Projekty i narzędzia windowsowe, np. .NET, pliki Office, ścieżki `C:\` |
| WSL 2 | Projekty linuksowe, Docker, skrypty bash; jedyna opcja z sandboxem dla poleceń |

Jeśli nie wiesz, co wybrać, a nie masz jeszcze WSL - zacznij od instalacji natywnej.

### Instalacja natywna

Najpierw sprawdź, w jakim terminalu jesteś. W PowerShell znak zachęty zaczyna się od `PS`, na
przykład `PS C:\Users\Jan>`. W CMD tego `PS` nie ma.

PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

CMD:

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

Uprawnienia administratora nie są potrzebne. Alternatywnie można użyć WinGet:
`winget install Anthropic.ClaudeCode` (bez automatycznych aktualizacji, aktualizacja przez
`winget upgrade Anthropic.ClaudeCode`).

**Git for Windows** jest opcjonalny, ale zalecany. Bez niego Claude Code wykonuje polecenia w
PowerShell. Z nim używa Git Bash, a większość przykładów i skryptów w projektach jest pisana
właśnie pod bash. Instalator Gita: [git-scm.com/downloads/win](https://git-scm.com/downloads/win).

### Instalacja w WSL

Otwórz terminal swojej dystrybucji WSL (np. Ubuntu) i uruchom polecenie linuksowe:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Claude Code instalujesz i uruchamiasz **wewnątrz WSL**, nie z PowerShell. Git for Windows nie
jest wtedy potrzebny.

Jedna praktyczna uwaga: trzymaj projekty na dysku WSL (np. `~/projekty`), a nie na `/mnt/c`.
Operacje na plikach Windows widzianych z WSL są wielokrotnie wolniejsze, co odczujesz przy
dużych repozytoriach i przy serwerach MCP uruchamianych lokalnie.

## Pierwsze uruchomienie i logowanie

Przejdź do katalogu projektu i uruchom:

```bash
cd ~/projekty/moj-projekt
claude
```

Przy pierwszym starcie Claude Code otworzy przeglądarkę z logowaniem do konta Claude. Po
zalogowaniu wracasz do terminala i możesz pisać polecenia - po polsku też.

## Sprawdzenie instalacji: claude doctor

```bash
claude doctor
```

To polecenie nie uruchamia sesji. Wypisuje stan instalacji, błędy w plikach ustawień, stan
automatycznych aktualizacji i ostrzeżenia z sugerowaną poprawką. Od niego warto zacząć, gdy coś
nie działa.

## Najczęstsze błędy

**`claude: command not found` albo `'claude' is not recognized`.** Katalog instalacji nie jest
jeszcze w zmiennej PATH. Najpierw zamknij terminal i otwórz nowy - to rozwiązuje większość
przypadków. Instalator natywny umieszcza program w `~/.local/bin` (na Windows w
`%USERPROFILE%\.local\bin`). Jeśli nowy terminal nie pomaga, dopisz ten katalog do PATH.

**`The token '&&' is not a valid statement separator`.** Polecenie dla CMD zostało wklejone do
PowerShell. Użyj wersji z `irm`.

**`'irm' is not recognized as an internal or external command`.** Odwrotna sytuacja: polecenie
dla PowerShell w CMD. Użyj wersji z `curl`.

**Claude Code nie znajduje Git Bash.** Wskaż ścieżkę w pliku `settings.json` (w katalogu
`%USERPROFILE%\.claude`):

```json
{
  "env": {
    "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
  }
}
```

**`sudo npm install -g` i błędy uprawnień.** Nie instaluj przez npm z `sudo`. Użyj instalatora
natywnego - nie wymaga ani Node.js, ani uprawnień administratora.

## Aktualizacje

Instalacja natywna aktualizuje się sama w tle. Nowa wersja zaczyna działać przy następnym
uruchomieniu. Aktualizację na żądanie robi `claude update`.

Jeśli wolisz wersje sprawdzone dłużej, przełącz kanał na `stable` w `/config` (pozycja
**Auto-update channel**). Kanał stable jest zwykle około tydzień za najnowszą wersją i pomija
wydania z poważnymi błędami. To dobry wybór dla zespołu, w którym wszyscy mają mieć ten sam
sposób działania narzędzia.

Instalacje z Homebrew, WinGet i menedżerów pakietów Linuxa (apt, dnf, apk) trzeba aktualizować
ręcznie, poleceniem właściwym dla danego menedżera.

## Co dalej

Po instalacji warto od razu przygotować plik `CLAUDE.md` z zasadami projektu i ustawić
uprawnienia. Opisaliśmy to w tekście
[Claude Code po polsku: jak zacząć pracę w zespole](https://blog.claudecodelab.pl/blog/claude-code-po-polsku-jak-zaczac-w-zespole/).
Przed pierwszą większą zmianą w kodzie przyda się
[tryb planowania (Plan Mode)](https://blog.claudecodelab.pl/blog/plan-mode-claude-code-jak-uzywac/).

Jeśli instalujecie Claude Code w całym zespole i chcecie od razu ustalić wspólne zasady pracy,
zobacz [warsztat Claude Code](https://claudecodelab.pl/kurs) albo
[umów 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
