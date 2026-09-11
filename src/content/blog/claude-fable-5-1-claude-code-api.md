---
title: "Claude Fable 5.1: co nowego w Claude Code i API?"
seoTitle: "Claude Fable 5.1: możliwości, ceny i Claude Code"
description: "Claude Fable 5.1 to model Anthropic do długich zadań agentowych. Sprawdź możliwości, ceny, kontekst 1 mln oraz zastosowania w Claude Code i API w praktyce."
pubDate: 2026-09-11
heroImage: ../../assets/blog/heroes/claude-fable-5-1.png
heroImageAlt: "Claude Fable 5.1 jako wieloetapowy agent programistyczny pracujący nad kodem, researchem i testami"
tags: ["Claude Fable 5.1", "Claude Code", "Anthropic", "AI Coding", "AI Agents"]
keywords: ["Claude Fable 5.1", "Fable 5.1", "Claude Code", "model Anthropic", "agent programistyczny AI", "Claude API"]
category: deep-dive
readingTime: 9
draft: false
author: ClaudeCodeLab
---

Claude Fable 5.1 to nowy model Anthropic przeznaczony do wymagającego rozumowania i długich zadań agentowych. Ma pracować nie tylko nad pojedynczą odpowiedzią, ale nad całym procesem: od analizy repozytorium, przez plan i implementację, po testy, poprawki oraz raport z wykonania.

Dla użytkowników Claude Code najważniejsze pytanie brzmi jednak inaczej: czy Fable 5.1 rzeczywiście poprawi codzienną pracę z kodem i kiedy jego wyższy koszt ma uzasadnienie? W tym artykule sprawdzamy potwierdzone parametry modelu, ceny API, zmiany względem Fable 5 i praktyczny plan wdrożenia.

## Claude Fable 5.1 w skrócie

Anthropic udostępnił Claude Fable 5.1 1 września 2026 roku. Model ma identyfikator API `claude-fable-5-1` i jest dostępny przez Claude API, Amazon Bedrock, Google Cloud, Microsoft Foundry oraz Claude Platform on AWS.

| Parametr | Claude Fable 5.1 |
| --- | --- |
| Identyfikator API | `claude-fable-5-1` |
| Okno kontekstu | 1 000 000 tokenów |
| Maksymalna odpowiedź | 128 000 tokenów |
| Dane wejściowe | tekst i obrazy |
| Wyjście | tekst |
| Rozumowanie | adaptive thinking, zawsze włączone |
| Poziomy effort | `low`, `medium`, `high`, `xhigh`, `max` |
| Domyślny effort w API | `high` |
| Wejście API | 10 USD za 1 mln tokenów |
| Wyjście API | 50 USD za 1 mln tokenów |

Według [oficjalnej karty modelu Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview) jest to najdroższy i najwolniejszy model w aktualnej, ogólnodostępnej rodzinie Claude. Anthropic rekomenduje Claude Opus 5 jako punkt startu dla większości zadań. Fable 5.1 ma sens przede wszystkim wtedy, gdy zadanie wymaga długiego horyzontu pracy albo Opus 5 na wyższym poziomie effort nadal nie osiąga oczekiwanej jakości.

To ważne zastrzeżenie. Fable 5.1 nie jest automatycznie najlepszym modelem do każdego promptu. Jest narzędziem do najtrudniejszej części pracy.

## Co zmienia Claude Fable 5.1?

### Dłuższa i bardziej samodzielna praca agenta

Najważniejszym kierunkiem rozwoju jest praca nad zadaniami trwającymi wiele godzin i obejmującymi kilka aplikacji lub narzędzi. Model ma lepiej planować kolejne etapy, wracać do wcześniejszych ustaleń, reagować na błędy narzędzi i przekazywać czytelne aktualizacje postępu.

W programowaniu oznacza to zadania wykraczające poza wygenerowanie jednej funkcji. Fable 5.1 jest pozycjonowany pod zmiany obejmujące całe repozytorium, rozbudowane code review, optymalizację wydajności, tworzenie testów i wieloetapowe sesje autonomiczne.

Nie usuwa to potrzeby kontroli. Agent nadal powinien pracować w ograniczonym zakresie, mieć jasne kryteria odbioru i uruchamiać testy. Im dłuższa sesja, tym większe znaczenie mają uprawnienia, checkpointy i możliwość zatrzymania błędnego kierunku.

### Kontekst 1 mln tokenów bez dodatkowego trybu

Claude Fable 5.1 ma domyślne okno kontekstu 1 mln tokenów. W jednym żądaniu można więc zmieścić obszerną historię pracy, dokumentację i duży fragment kodu. Maksymalna odpowiedź wynosi 128 tys. tokenów, przy czym do limitu wlicza się zarówno widoczna odpowiedź, jak i tokeny rozumowania.

Duże okno kontekstu nie jest zachętą do przesyłania całego monorepo przy każdym kroku. Zyskuje na wartości wtedy, gdy agent potrafi wyszukiwać potrzebne pliki i utrzymywać stabilny, cache'owany początek rozmowy. Nadmiar nieaktualnych instrukcji może pogorszyć wynik tak samo jak zbyt mała ilość danych.

### Adaptive thinking i pięć poziomów effort

W Fable 5.1 adaptive thinking jest zawsze włączone. Zamiast ręcznie ustalać osobny budżet rozumowania, sterujesz poziomem `effort`: od `low` do `max`.

Anthropic zaleca rozpoczęcie od `high`, ale w powtarzalnych workflowach warto przetestować również `low` i `medium`. Niższy effort oznacza zwykle krótsze rozumowanie, mniej wywołań narzędzi oraz niższy koszt. `xhigh` i `max` powinny pozostać dla zadań, w których jakość ma większe znaczenie niż czas oraz liczba tokenów.

Nowością jest możliwość zmiany effort w trakcie rozmowy bez utraty cache promptu. Funkcja per-message effort jest dostępna w becie i wymaga odpowiedniego nagłówka API. Dzięki temu analiza architektury może działać na `high`, a końcowe podsumowanie na `low`, bez ponownego zapisywania całego prefiksu do cache.

Szczegóły konfiguracji opisuje [dokumentacja poziomów effort](https://platform.claude.com/docs/en/build-with-claude/effort).

### Tańsze odczyty z prompt cache

Bazowe ceny Fable 5.1 nie zmieniły się względem Fable 5: 10 USD za milion tokenów wejściowych i 50 USD za milion tokenów wyjściowych. Największa różnica dotyczy odczytu prompt cache.

| Rodzaj tokenów | Cena za 1 mln tokenów |
| --- | ---: |
| Zwykłe wejście | 10 USD |
| Zapis cache na 5 minut | 12,50 USD |
| Zapis cache na 1 godzinę | 20 USD |
| Odczyt z cache | 0,25 USD |
| Wyjście | 50 USD |

Odczyt cache kosztuje jedną czwartą wcześniejszej stawki Fable 5. Anthropic szacuje, że typowe obciążenia rozliczane tokenowo mogą być dzięki temu o około 25 procent tańsze, a mocno agentowe workflowy nawet o około 45 procent tańsze. To prognoza producenta, a nie gwarancja dla każdego wdrożenia.

Rzeczywisty wynik zależy od tego, czy aplikacja utrzymuje identyczny prefiks promptu. Zmiana instrukcji systemowej, kolejności narzędzi albo wcześniejszej wiadomości może unieważnić cache. Wtedy zamiast taniego odczytu pojawia się koszt nowego zapisu. Aktualne stawki i zasady znajdziesz w [dokumentacji prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching).

## Claude Fable 5.1 w Claude Code

Fable 5.1 został dodany do Claude Code jako domyślny model w wariancie Fable. To naturalne środowisko dla jego możliwości: agent może czytać repozytorium, edytować pliki, uruchamiać polecenia i testy oraz kontynuować pracę przez wiele kroków.

Najlepsze zastosowania w Claude Code to między innymi:

- migracje obejmujące wiele modułów,
- implementacja funkcji z testami i aktualizacją dokumentacji,
- diagnoza błędów rozproszonych po kilku usługach,
- code review większego zakresu zmian,
- porządkowanie długu technicznego z zachowaniem publicznego API,
- praca z dokumentami, arkuszami i prezentacjami powiązanymi z projektem.

Do drobnej poprawki CSS albo wygenerowania prostego testu Fable 5.1 może być niepotrzebnie kosztowny i wolny. Rozsądny routing kieruje rutynowe zadania do Sonnet lub Opus, a Fable uruchamia dopiero wtedy, gdy złożoność albo liczba nieudanych prób uzasadnia wyższą stawkę.

## Jak wdrożyć Fable 5.1 bez przepalania budżetu?

### 1. Zacznij od mierzalnego zadania

Wybierz zmianę, którą można jednoznacznie odebrać: build przechodzi, testy są zielone, interfejs publiczny nie został naruszony, a zakres zmian odpowiada zleceniu. Nie zaczynaj od polecenia "ulepsz cały projekt".

### 2. Porównaj co najmniej trzy konfiguracje

Uruchom ten sam zestaw zadań na przykład na Opus 5 `high`, Fable 5.1 `low` i Fable 5.1 `high`. Porównuj nie cenę pojedynczego tokena, lecz koszt zaakceptowanego zadania, liczbę poprawek człowieka i czas do wdrożenia.

### 3. Pilnuj stabilności cache

Nie przepisuj instrukcji systemowej przy każdej turze. Utrzymuj stałą kolejność narzędzi, dodawaj nowe instrukcje zgodnie z mechanizmem wspieranym przez API i obserwuj metryki `cache_read_input_tokens` oraz `cache_creation_input_tokens`.

### 4. Ogranicz uprawnienia agenta

Długi horyzont pracy zwiększa zarówno potencjalną produktywność, jak i koszt błędnej decyzji. Użyj sandboxa, przeglądu zmian, approval workflow oraz limitów wydatków. Model nie powinien samodzielnie publikować, usuwać danych ani wykonywać operacji produkcyjnych bez jawnej zgody.

### 5. Sprawdź wymagania dotyczące danych

Anthropic informuje, że Fable 5.1 wymaga domyślnie 30-dniowej retencji danych na potrzeby monitorowania bezpieczeństwa. Dla części kwalifikujących się klientów dostępne są odrębne ustalenia, w tym zero data retention. Przed przesłaniem kodu lub danych klienta trzeba sprawdzić warunki własnej organizacji, region przetwarzania i umowę z dostawcą.

## Czy Claude Fable 5.1 jest lepszy od Fable 5?

Fable 5.1 ma ten sam cennik bazowy, ale znacznie tańszy odczyt cache i nowe mechanizmy dla długich sesji. Anthropic pokazuje też wyższe wyniki w swoich testach zadań terminalowych, automatyzacji, kodowania i pracy z dokumentami.

Warto traktować je jako dane producenta, nie uniwersalny ranking. Wynik benchmarku nie uwzględnia jakości instrukcji w Twoim repozytorium, uprawnień narzędzi, czasu code review ani kosztu poprawienia błędnej implementacji. Odpowiedź powinna dać dopiero próba na własnym zestawie zadań.

## FAQ: Claude Fable 5.1

### Kiedy wydano Claude Fable 5.1?

Anthropic udostępnił model 1 września 2026 roku. Jego identyfikator w Claude API to `claude-fable-5-1`.

### Czy Claude Fable 5.1 jest dostępny w Claude Code?

Tak. Fable 5.1 został dodany do Claude Code jako domyślny model dla wariantu Fable. Dostęp użytkownika może jednak zależeć od planu, ustawień organizacji i wybranego dostawcy.

### Ile kosztuje Claude Fable 5.1?

W Claude API bazowa cena wynosi 10 USD za milion tokenów wejściowych i 50 USD za milion tokenów wyjściowych. Odczyt z prompt cache kosztuje 0,25 USD za milion tokenów. Batch API daje 50 procent rabatu na wejście i wyjście.

### Jak duży kontekst ma Fable 5.1?

Model ma domyślne okno kontekstu 1 mln tokenów i może wygenerować do 128 tys. tokenów w jednym żądaniu. Tokeny rozumowania również mieszczą się w tym limicie.

### Czy Fable 5.1 powinien być domyślnym modelem dla całego zespołu?

Nie bez testu. Anthropic zaleca Opus 5 dla większości zadań, a Fable 5.1 dla najbardziej wymagającego rozumowania i długich workflowów. W praktyce najlepszy jest routing oparty na trudności zadania i koszcie zaakceptowanego wyniku.

## Czy warto używać Claude Fable 5.1?

Tak, jeśli Twoim problemem są zadania, które kończą się niepowodzeniem z powodu utraty kontekstu, błędnego planu lub zbyt krótkiego horyzontu pracy agenta. Nie, jeśli większość zespołu potrzebuje szybkiej pomocy przy małych, dobrze opisanych zmianach.

Największą zmianą nie jest sam milion tokenów kontekstu. Jest nią połączenie długiej pracy, adaptive thinking, sterowania effort i bardzo taniego odczytu cache. Ten zestaw może poprawić ekonomię rozbudowanych sesji w Claude Code, ale tylko wtedy, gdy workflow jest dobrze zaprojektowany i mierzony.

Jeśli chcesz porównać model Anthropic z ofertą OpenAI, przeczytaj także [GPT-6 Astra: co zmienia w pracy z kodem?](/blog/gpt-6-astra-openai-co-zmienia-w-pracy-z-kodem/) oraz nasze porównanie [GPT-6 Astra vs Claude Fable 5.1](/blog/gpt-6-astra-vs-claude-fable-5-1/).

Jeśli potrzebujesz pilota Claude Code na realnym repozytorium, [umów 30-minutową rozmowę kwalifikacyjną](https://calendly.com/kamil-spartcom/30min).

## Źródła

- [Claude Fable 5.1 - karta modelu](https://platform.claude.com/docs/en/models/fable-5-1/overview)
- [Claude Fable 5.1 i Claude Mythos 5.1 - ogłoszenie](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [Effort w Claude API](https://platform.claude.com/docs/en/build-with-claude/effort)
- [Prompt caching w Claude API](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Claude Code - informacje o wydaniach](https://platform.claude.com/docs/en/release-notes/claude-code)
