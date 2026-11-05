---
title: "Zaawansowane techniki Claude Code: effort, skille, hooki i subagenty"
seoTitle: "Claude Code dla zaawansowanych: effort, skille, hooki"
description: "Poziom effort zamiast think i ultrathink, własne skille w .claude/skills, hooki PreToolUse i PostToolUse, subagenty i tryb bez interakcji claude -p - z przykładami."
pubDate: 2025-10-23
updatedDate: 2026-11-05
heroImage: ../../assets/blog/heroes/zaawansowane-techniki-claude-code.jpg
tags: ['Claude Code', 'Zaawansowane', 'Skille', 'Hooki', 'Subagenty']
readingTime: 7
heroImageAlt: "Ilustracja do artykułu o zaawansowanych technikach pracy z Claude Code"
---

Gdy podstawy są opanowane, następny krok to dopasowanie Claude Code do projektu: ile ma myśleć
przy danym zadaniu, jakie powtarzalne procedury zna, co ma sprawdzać sam po każdej zmianie i jak
podzielić duże zadanie na mniejsze. Opis dotyczy stanu z listopada 2026.

Jeśli dopiero zaczynasz, przeczytaj najpierw
[pierwsze kroki z Claude Code](/blog/pierwsze-kroki-z-claude-code/).

## 1. Plan przed zmianą

Przy zmianach w wielu plikach zacznij od Plan Mode: Claude bada projekt i pisze plan, a pliki
zmienia dopiero po zatwierdzeniu. Włączasz go klawiszem `Shift+Tab`, prefiksem `/plan` przed
poleceniem albo flagą `claude --permission-mode plan`. Wszystkie opcje zatwierdzania i sposób
czytania planu opisuje [osobny poradnik o Plan Mode](/blog/plan-mode-claude-code-jak-uzywac/).

## 2. Poziom effort zamiast „think” i „ultrathink”

Starsze poradniki (także wcześniejsza wersja tego artykułu) podawały tabelę słów kluczowych:
„think” to 4 000 tokenów myślenia, „megathink” 10 000, „ultrathink” 32 000. Te liczby są
nieaktualne. Obecne modele same decydują, ile myśleć, a Ty ustawiasz ogólny poziom wysiłku.

Poziom ustawiasz na całą sesję przy starcie:

```bash
claude --effort high
```

Dostępne wartości to `low`, `medium`, `high`, `xhigh` i `max`. W trakcie sesji poziom zmienisz w
`/model`.

Praktyczna zasada:

- **niższy poziom** przy prostych, jasno opisanych zmianach: szybciej i taniej,
- **wyższy poziom** przy decyzjach architektonicznych, trudnych błędach i planowaniu migracji.

Wyższy poziom zużywa więcej limitu subskrypcji albo więcej tokenów API, więc nie ma sensu
zostawiać `max` na stałe.

## 3. Własne skille: powtarzalne procedury

Skill to plik z instrukcją, którą Claude Code wykonuje na żądanie albo sam, gdy zadanie do niej
pasuje. Dobre kandydatury to rzeczy, które tłumaczysz agentowi co tydzień: przegląd kodu według
zasad zespołu, przygotowanie wydania, dodanie nowego endpointu według wzorca.

Skill projektu to katalog w `.claude/skills/`. Przykład `.claude/skills/przeglad/SKILL.md`:

```markdown
---
name: przeglad
description: Przegląd zmian w bieżącej gałęzi pod kątem bezpieczeństwa i zasad zespołu
---

Porównaj bieżącą gałąź z main (git diff main...HEAD) i sprawdź:
1. dane z formularzy trafiające do zapytań SQL bez parametrów,
2. sekrety i klucze w kodzie,
3. nowe funkcje bez testów.

Dla każdego problemu podaj plik, linię i proponowaną poprawkę.
Skup się na: $ARGUMENTS
```

Wywołanie w sesji:

```text
/przeglad moduł płatności
```

Tekst po nazwie skilla trafia w miejsce `$ARGUMENTS`. Katalog `.claude/skills/` warto trzymać w
repozytorium, wtedy cały zespół ma te same procedury. Skille, które mają działać we wszystkich
Twoich projektach, umieszczasz w `~/.claude/skills/`.

Starszy format, czyli pojedyncze pliki w `.claude/commands/`, nadal działa. Nowe procedury lepiej
pisać jako skille, bo mogą zawierać dodatkowe pliki, na przykład szablony i skrypty.

## 4. Hooki: sprawdzanie, o którym agent nie zapomni

Instrukcja w CLAUDE.md to prośba. Hook to polecenie, które Claude Code uruchamia zawsze, w
określonym momencie. Najczęściej używane zdarzenia:

- `PreToolUse` - przed użyciem narzędzia, na przykład przed edycją pliku. Może zablokować akcję.
- `PostToolUse` - po użyciu narzędzia, na przykład po edycji: formatowanie, linter, testy.
- `Stop` - gdy Claude kończy odpowiedź: na przykład pełny zestaw testów.
- `SessionStart` - na początku sesji: na przykład wczytanie stanu zadań.

Przykład w `.claude/settings.json`: blokada edycji plików `.env`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path // empty' | grep -q '\\.env' && { echo 'Pliki .env edytuje tylko człowiek' >&2; exit 2; } || exit 0"
          }
        ]
      }
    ]
  }
}
```

Hook dostaje opis akcji jako JSON na wejściu standardowym. Kod wyjścia `2` blokuje akcję, a tekst
z wyjścia błędów trafia do Claude jako wyjaśnienie. Hooki uruchamiają dowolne polecenia na Twoim
komputerze, więc przed dodaniem cudzego hooka przeczytaj, co robi. Więcej przykładów w artykule o
[hookach jako lekkim CI](/blog/claude-code-hooki-ci-light/).

## 5. Subagenty: osobny kontekst dla zadania pobocznego

Długa sesja zapełnia kontekst: każdy przeczytany plik i wynik testów zostaje w rozmowie. Subagent
to osobna instancja Claude z własnym kontekstem. Dostaje zadanie, wykonuje je i zwraca tylko
wynik. Dobre zastosowania to przeszukanie dużego repozytorium, przegląd kodu i analiza logów.

Własnego subagenta tworzysz poleceniem `/agents` albo plikiem w `.claude/agents/`, na przykład
`.claude/agents/recenzent.md`:

```markdown
---
name: recenzent
description: Przegląd kodu po większej zmianie. Używaj po zakończeniu funkcji.
tools: Read, Grep, Glob, Bash
---

Jesteś recenzentem kodu w tym projekcie. Sprawdź ostatnie zmiany (git diff),
uruchom testy i wypisz problemy od najpoważniejszych. Niczego nie edytuj.
```

Pole `tools` ogranicza, czego subagent może używać. Recenzent bez narzędzi edycji nie zmieni
kodu, nawet jeśli uzna, że powinien.

## 6. Kontekst długiej sesji

- `/context` pokazuje, ile kontekstu zajmują rozmowa, pliki i narzędzia.
- `/compact` streszcza rozmowę. Możesz dodać, co zachować: `/compact zachowaj decyzje o schemacie
  bazy`.
- `/clear` zaczyna od zera. To najlepszy wybór przy przejściu do innego zadania.

Jedno zadanie na rozmowę daje zwykle lepszy wynik niż jedna długa sesja na cały dzień.

## 7. Claude Code bez interakcji: claude -p

Flaga `-p` uruchamia jedno polecenie, wypisuje wynik i kończy pracę. Tak Claude Code działa w
skryptach i w CI:

```bash
git diff main...HEAD | claude -p "Wypisz ryzykowne zmiany w tym diffie, maksymalnie 5 punktów"
```

W trybie bez interakcji nikt nie zatwierdza akcji, więc ustaw ograniczone uprawnienia, na
przykład tylko narzędzia do odczytu, zanim użyjesz go w automatyzacji.

## Od czego zacząć

Nie wdrażaj wszystkiego naraz. Rozsądna kolejność:

1. Plan Mode przy najbliższej większej zmianie.
2. Jeden skill dla procedury, którą tłumaczysz agentowi najczęściej.
3. Jeden hook `PostToolUse` z formatowaniem albo linterem.
4. Subagenty i `claude -p`, gdy poprzednie kroki działają.

## Co dalej

- [Plan Mode i Extended Thinking przy refaktoryzacji](/blog/plan-mode-extended-thinking-refaktoryzacja/).
- [Własne pluginy do Claude Code](/blog/custom-plugins-claude-code/) - jak spakować skille, hooki i
  agentów dla zespołu.
- Oficjalna dokumentacja: [skille](https://docs.anthropic.com/en/docs/claude-code/skills),
  [hooki](https://docs.anthropic.com/en/docs/claude-code/hooks),
  [subagenty](https://docs.anthropic.com/en/docs/claude-code/sub-agents).

Skille, hooki i subagentów dla Twojego repozytorium budujemy na
[warsztacie Claude Code](https://claudecodelab.pl/kurs). Możesz też
[umówić 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
