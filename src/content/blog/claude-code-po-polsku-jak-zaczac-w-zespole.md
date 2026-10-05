---
title: "Claude Code po polsku: jak zacząć pracę w zespole"
description: "Instalacja Claude Code, konto, plik CLAUDE.md po polsku, uprawnienia i pierwszy serwer MCP. Praktyczny start dla zespołu, krok po kroku."
seoTitle: "Claude Code po polsku: start w zespole"
pubDate: Oct 05 2026
tags: ['Claude Code', 'Instalacja', 'CLAUDE.md', 'MCP', 'Zespół IT']
category: tutorial
keywords: ['Claude Code po polsku', 'Claude Code instalacja', 'jak zainstalować Claude Code', 'Claude Code jak zacząć', 'CLAUDE.md', 'Claude Code w zespole']
readingTime: 7
---

Claude Code to agent, który pracuje w terminalu, w katalogu projektu. Czyta pliki, uruchamia
polecenia, edytuje kod i korzysta z zewnętrznych narzędzi przez serwery MCP. Rozumie polecenia
po polsku i odpowiada po polsku bez dodatkowej konfiguracji.

Ten wpis opisuje start w zespole: instalację, konto, wspólne instrukcje projektu i ustawienia,
które warto ustalić, zanim pięć osób zacznie używać agenta każda na swój sposób.

## 1. Instalacja

Zalecana metoda to instalator natywny. Aktualizuje się sam w tle.

macOS, Linux i WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows, PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Na Windows można też użyć `winget install Anthropic.ClaudeCode`, a na macOS
`brew install --cask claude-code`. Te dwie metody nie aktualizują się same.

Po instalacji otwórz nowy terminal i sprawdź:

```bash
claude --version
claude doctor
```

`claude doctor` pokazuje stan instalacji i błędy w plikach ustawień. Jeśli terminal nie widzi
polecenia `claude`, katalog instalacji nie trafił jeszcze do zmiennej PATH - rozwiązanie jest
w dokumentacji instalacji.

Na Windows masz dwie drogi: natywnie albo w WSL 2. Jeśli projekty i narzędzia zespołu są
linuksowe (Docker, skrypty bash), wybierz WSL 2. Na natywnym Windows warto zainstalować Git
for Windows, bo wtedy agent używa Git Bash do poleceń powłoki.

## 2. Konto

Claude Code wymaga płatnego konta: Pro, Max, Team lub Enterprise, albo konta w Console
z rozliczeniem za użycie API. Darmowy plan claude.ai nie obejmuje Claude Code. Po pierwszym
uruchomieniu `claude` przeglądarka poprosi o zalogowanie.

Dla zespołu zwykle lepszy jest plan Team lub Enterprise niż prywatne konta pracowników.
Firma zarządza wtedy dostępem centralnie, a dane służbowe nie przechodzą przez prywatne
subskrypcje.

## 3. CLAUDE.md: wspólne instrukcje projektu

To najważniejszy krok dla zespołu. `CLAUDE.md` to plik w katalogu głównym repozytorium, który
Claude Code czyta na początku każdej sesji. Trafia do repozytorium, więc wszyscy pracują z tymi
samymi instrukcjami.

W katalogu projektu uruchom `claude` i wpisz:

```
/init
```

Agent przejrzy repozytorium i przygotuje pierwszą wersję pliku: strukturę projektu, polecenia
budowania i testów, konwencje. Potem uzupełnij go ręcznie o to, czego z kodu nie widać.
Przykład fragmentu:

```markdown
## Język
Odpowiadaj po polsku. Nazwy zmiennych, funkcji i komunikaty commitów po angielsku.

## Polecenia
- testy: `npm test`
- lint: `npm run lint` - uruchom przed każdym commitem

## Zasady
- Nie zmieniaj plików w `migrations/` bez pytania.
- Nowe endpointy zawsze z testem integracyjnym.
- Dane klientów tylko z bazy testowej, nigdy z produkcji.
```

Dwie praktyczne zasady:

- **Pisz konkretnie.** "Uruchom `npm run lint` przed commitem" działa. "Dbaj o jakość kodu"
  nie zmienia nic.
- **Dopisuj po błędzie.** Gdy agent zrobi coś źle, zapisz regułę, która by temu zapobiegła.
  Plik rośnie razem z doświadczeniem zespołu.

## 4. Uprawnienia

Domyślnie Claude Code pyta o zgodę przed edycją plików i uruchomieniem poleceń. Po kilku
dniach zespół zwykle wie, które polecenia są bezpieczne. Wspólne ustawienia projektu trzyma
się w `.claude/settings.json`, który też trafia do repozytorium:

```json
{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(npm run lint)"],
    "deny": ["Read(./.env)", "Read(./secrets/**)"]
  }
}
```

Lista `allow` zdejmuje pytania przy rutynowych poleceniach. Lista `deny` blokuje dostęp do
plików, których agent nie powinien czytać, na przykład z hasłami. Bieżące uprawnienia można
przejrzeć poleceniem `/permissions`.

## 5. Tryb planowania

Przy większych zmianach przełącz agenta w tryb planowania (Shift+Tab). Agent najpierw czyta
kod i przedstawia plan, a dopiero po akceptacji edytuje pliki. To dobra domyślna praktyka dla
osób, które dopiero uczą się pracy z agentem: widać, co agent zamierza zrobić, zanim to zrobi.

## 6. Pierwszy serwer MCP

Serwery MCP (Model Context Protocol) dają agentowi dostęp do systemów spoza repozytorium:
bazy danych, systemu zgłoszeń, CRM, dokumentacji. Serwer dodaje się poleceniem
`claude mcp add`. Konfigurację wspólną dla zespołu trzyma się w pliku `.mcp.json` w katalogu
projektu.

Zacznij od jednego serwera, który ma sens w codziennej pracy, na przykład dostępu do systemu
zgłoszeń albo bazy testowej. Dla każdego serwera ustal dwie rzeczy: jakie narzędzia wystawia
i z jakimi uprawnieniami się łączy. Agent może zrobić tylko to, na co pozwala serwer, więc
operacji nieodwracalnych najlepiej w ogóle nie wystawiać.

Przykład z praktyki: [agent w Claude Code obsługuje CRM przez serwer MCP](https://blog.claudecodelab.pl/blog/agent-ai-crm-claude-code-mcp/).

## Najczęstsze błędy na starcie

- **Każdy z własnymi instrukcjami.** Bez wspólnego `CLAUDE.md` każdy uczy agenta od zera
  i wyniki w zespole są nierówne.
- **Brak kryterium sprawdzenia.** Agent oddaje kod, który wygląda dobrze. Bez testów albo
  innego sprawdzalnego kryterium trzeba czytać wszystko ręcznie.
- **Zbyt szerokie uprawnienia od pierwszego dnia.** Lepiej zacząć od pytań o zgodę i stopniowo
  dopisywać polecenia do `allow`.
- **Start od największego problemu.** Pierwsze zadanie powinno być małe i dobrze sprawdzalne.

## Co dalej

Instalacja i konfiguracja to godzina pracy. Trudniejsza część to wypracowanie w zespole
sposobu pracy z agentem: jak dzielić zadania, jak pisać instrukcje, jak sprawdzać wyniki i do
których systemów go podłączyć.

Tego uczymy na warsztacie Claude Code dla zespołów - na Waszym repozytorium i Waszych
systemach, nie na przykładowym projekcie. Szczegóły:
[warsztat Claude Code](https://claudecodelab.pl/kurs). Możesz też
[umówić 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
