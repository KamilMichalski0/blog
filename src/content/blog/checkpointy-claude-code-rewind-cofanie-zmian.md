---
title: "Checkpointy w Claude Code: jak cofnąć zmiany agenta przez /rewind"
description: "Jak działają checkpointy w Claude Code, jak cofnąć kod i rozmowę klawiszem Esc Esc albo poleceniem /rewind, co oznacza każda opcja menu i których zmian checkpoint nie cofnie."
seoTitle: "Checkpointy w Claude Code: cofanie zmian /rewind"
pubDate: Oct 26 2026
tags: ['Claude Code', 'Checkpointy', 'Rewind', 'Workflow']
category: guide
keywords: ['checkpointy Claude Code', 'Claude Code rewind', 'jak cofnąć zmiany Claude Code', 'Claude Code cofnij', 'Esc Esc Claude Code', 'Claude Code undo']
readingTime: 6
---

Claude Code przed każdym Twoim poleceniem zapisuje stan plików, które edytuje. Taki zapis to
checkpoint. Gdy agent pójdzie w złą stronę, wracasz do stanu sprzed wybranego polecenia: cofasz
kod, rozmowę albo jedno i drugie. Nie trzeba ręcznie odkręcać zmian ani prosić Claude, żeby
„przywrócił, jak było”.

Opis opiera się na oficjalnej dokumentacji Claude Code (stan z października 2026).

## Kiedy powstaje checkpoint

Checkpoint powstaje automatycznie przy każdym poleceniu, które wysyłasz i które zaczyna nową turę
pracy agenta. Niczego nie trzeba włączać.

- Claude Code trzyma zapisy plików dla 100 ostatnich checkpointów w sesji.
- Checkpointy są zapisane razem z rozmową, więc działają także po wznowieniu sesji
  (`claude --resume`).
- Zapisy plików są domyślnie usuwane około 30 dni po ostatnim zapisie w danej sesji. Dłuższy okres
  ustawisz w `cleanupPeriodDays` w ustawieniach.

## Jak cofnąć zmiany

Menu cofania otwierasz na dwa sposoby:

- naciśnij **Esc dwa razy**, gdy pole polecenia jest puste,
- albo wpisz `/rewind`.

Jeśli w polu polecenia jest tekst, podwójne Esc najpierw go czyści. Tekst trafia do historii, więc
po wyjściu z menu odzyskasz go strzałką w górę.

Menu pokazuje listę poleceń wysłanych w tej sesji. Wybierasz polecenie, do którego chcesz wrócić,
a potem jedną z opcji:

| Opcja | Co robi |
| --- | --- |
| **Restore code and conversation** | Cofa pliki i rozmowę do stanu sprzed wybranego polecenia |
| **Restore conversation** | Cofa tylko rozmowę, pliki zostają takie, jakie są teraz |
| **Restore code** | Cofa tylko pliki, rozmowa zostaje |
| **Summarize from here** | Zastępuje rozmowę od tego miejsca streszczeniem |
| **Summarize up to here** | Zastępuje streszczeniem rozmowę przed tym miejscem, późniejsze wiadomości zostają |
| **Never mind** | Wraca do listy bez zmian |

Opcje cofania kodu pojawiają się tylko wtedy, gdy po wybranym poleceniu Claude zmienił jakieś
pliki. Po cofnięciu rozmowy wybrane polecenie wraca do pola tekstowego, więc możesz je poprawić
i wysłać jeszcze raz.

## Którą opcję wybrać

**Agent zepsuł kod i poszedł w złym kierunku** - wybierz **Restore code and conversation**.
Wracasz do czystego stanu i piszesz polecenie od nowa, tym razem z brakującą informacją. Sama
rozmowa z błędnym założeniem zostaje usunięta, więc Claude nie będzie się do niego odnosił.

**Kod jest dobry, ale rozmowa się rozjechała** - wybierz **Restore conversation**. Przydaje się,
gdy po udanej zmianie zadałeś kilka pytań pobocznych i chcesz wrócić do głównego wątku bez
zaśmiecania kontekstu.

**Chcesz porównać dwa podejścia** - Claude robi wersję A, oglądasz wynik, wybierasz
**Restore code** i prosisz o wersję B. Rozmowa zostaje, więc Claude pamięta, co nie zagrało
w wersji A.

**Długa sesja debugowania zjada kontekst** - wybierz pierwsze polecenie po ustaleniach
i **Summarize from here**. Początkowe instrukcje zostają w całości, a długie próby zamieniają się
w streszczenie. Strzałkami podświetl opcję i dopisz w wierszu **add context (optional)**, na czym
streszczenie ma się skupić, na przykład „zostaw dokładne komunikaty błędów”. Streszczenie nie
zmienia plików na dysku.

## Czego checkpoint nie cofnie

Checkpoint śledzi pliki, które Claude zmienia swoimi narzędziami do edycji. Kilka rodzajów zmian
jest poza nim:

- **Pliki zmienione tylko poleceniami w terminalu.** Jeśli Claude uruchomił skrypt, który
  wygenerował albo usunął pliki, a sam ich wcześniej nie edytował, `/rewind` ich nie przywróci.
  Dotyczy to też migracji bazy danych, instalacji pakietów i wszystkiego, co dzieje się poza
  plikami projektu.
- **Większość zmian subagentów.** Pliki zmienione przez subagenta, których Claude wcześniej nie
  edytował w Twojej rozmowie, zostają bez zmian.
- **Twoje ręczne zmiany i zmiany z innych sesji**, o ile nie dotyczą tych samych plików, które
  edytuje bieżąca sesja.
- **Dowiązania symboliczne i twarde.** Claude Code je pomija i pokazuje komunikat
  `Restored the code, but skipped N files`.
- **Wiadomości wysłane w trakcie pracy agenta.** W menu mają oznaczenie **No code restore**.
  Żeby cofnąć zmiany z takiej tury, wybierz polecenie, które ją rozpoczęło.

Dlatego checkpoint nie zastępuje Gita. Checkpoint służy do szybkiego cofnięcia w trakcie sesji.
Git przechowuje historię na stałe, obejmuje wszystkie pliki i pozwala dzielić się zmianami
z zespołem.

## Bezpieczny sposób pracy

1. Przed większym zadaniem zrób commit. Wtedy `git diff` pokazuje dokładnie to, co zmienił agent,
   a `git restore` cofa także pliki, których checkpoint nie śledzi.
2. Przy zmianach na wielu plikach zacznij od [Plan Mode](https://blog.claudecodelab.pl/blog/plan-mode-claude-code-jak-uzywac/).
   Błędne założenie poprawiasz wtedy w planie, zanim powstanie kod.
3. Gdy wynik Ci się nie podoba, użyj Esc Esc zamiast pisać „cofnij to”. Prośba o cofnięcie to
   kolejna tura, w której agent sam odtwarza poprzedni stan i może się pomylić. `/rewind`
   przywraca zapisany stan plików.
4. Polecenia, które zmieniają coś poza plikami (baza danych, wdrożenie, wysyłka), zatwierdzaj
   ręcznie. Tych zmian nie cofnie ani checkpoint, ani Git.

## Co dalej

Jeśli dopiero zaczynasz, zobacz
[instalację Claude Code na Windows, macOS i Linux](https://blog.claudecodelab.pl/blog/instalacja-claude-code-windows-mac-linux/)
oraz [start pracy w zespole](https://blog.claudecodelab.pl/blog/claude-code-po-polsku-jak-zaczac-w-zespole/).

Cofanie zmian, Plan Mode i ustawienie uprawnień ćwiczymy na
[warsztacie Claude Code](https://claudecodelab.pl/kurs), na repozytorium Twojego zespołu. Możesz
też [umówić 30 minut rozmowy](https://calendly.com/kamil-spartcom/30min).
