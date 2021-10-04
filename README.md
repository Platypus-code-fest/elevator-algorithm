# Elevator Algorithm

Many of us ride elevators every day. We feel like we understand how they work, how they decide where to go. If you were asked to put it into words, you might say that an elevator goes wherever it's told, and in doing so, goes as far in one direction as it can before turning around. Sounds simple, right? Can you put it into code?

### Evaluation criteria:

- Standard elevator algorithm (60 points)

  - Your program will use a standard time sequence events as the input and output a standard status output.

  - After comparing the program output with the correct result, the percentage of the correctness will be your program score. For example, if your program output only has 30% correctness, your score will be 18 points.

  - If your program does not follow the standard format strictly, your score will be reduced by 20 points.

- Smart elevator algorithm (30 points)

  - The only criteria is the average passenger time. It starts when the passenger clicks the up/down button on the floor and ends when the passenger steps out of the elevator. We assume that the passenger steps out of the elevator right after the elevator stops on the target floor.

  - The first place will receive 30 points. The second place will receive 20 points. The third place will receive 10 points. The rest will receive 0 points.

- On time turn in bonus points (20 points)

  - If the program is delivered before 4:00 MT, the full bonus points will be earned.

  - If the program is delivered between 4:00 and 4:15 MT, 10 bonus points will be earned.

  - If it is delivered between 4:15 MT and 4:30 MT, no bonus points will be earned.

  - No program is accepted after 4:30 MT.

### Program Delivery and Evaluation Process

- At 4:00PM MT, the evaluation input file and standard output file will be sent out through email

- Each team will be evaluated by an assigned team. It includes the program demo and lively generating the output file.

- Every 50 seconds correctness may earn 10 points when evaluating the standard elevator algorithm. The rest time and the passenger spending time statistics may earn 10 points. Therefore, the full score is 60 points.

### Common Information

- The input file includes the events that the passengers click the up or down button when waiting for the elevator.

- Floor range: 1 - 12

- In the beginning, the elevator stays on floor 1 idle at 00:00.

- Time range: from 00:00 to 59:59

- Elevator’s moving speed is 10 seconds per floor

- At each floor stop, the elevator will wait 15 seconds for passengers to get on and off.

- At each floor stop, the elevator will take 5 seconds to change direction without passengers getting on and off.

- The elevator can only change direction when it stops on a floor.

- The idle elevator may stay as is.

### Input file format

Time — Passengers — From Floor # — To Floor #

- Time: MM:SS

- Passenger: Julie, Bob, Michael, Sharon, Steve, Christine,

- From Location #: The floor number of waiting for the elevator

- To Location #: The target floor number of the passenger

### Output file format

Time — Passengers — Elevator Floor # — Floor button pressed in the elevator — Up button pressed floor list — Down button pressed floor list — Elevator Next Moving Direction

- Time: MM:SS

- Passengers: people in the elevator

- Elevator floor #: current floor number of the elevator location. If it is between two floors, it can be a decimal number, such as 2.5

- The floor button pressed in the elevator: The floors are chosen by the passengers in the elevator

- The up button pressed out of the elevator: The floors where the passengers click the up button

- The down button pressed out of the elevator: The floors where the passengers click the down button

- Elevator next moving direction: up/down/(empty)

The following example may illustrate many assumptions which are not described fully above.

**Input file example:**

00:05 — Julie — 6 — 8 (at 00:05, Julie waits at floor 6 and her target floor is 8)

01:02 — Sharon — 9 — 12 (at 01:02, Sharon waits at floor 9 and her target floor is 12)

01:05 — Christine — 9 — 11 (at 01:05, Christine waits at floor 9 and her target floor is 11)

01:25 — Steve — 11 — 3 (at 01:25, Steve waits at floor 11 and his target floor is 3)

02:32 — Bob — 5 — 6 (at 02:32, Bob waits at floor 5 and his target floor is 6)

**Output file example:**

00:00 — — 1 — — — —

00:05 — — 1 — — 6 — — Up

00:10 — — 1.5 — — 6 — — Up

00:15 — — 2 — — 6 — — UP

00:20 — — 2.5 — — 6 — — UP

00:25 — — 3 — — 6 — — UP

00:30 — — 3.5 — — 6 — — UP

00:35 — — 4 — — 6 — — UP

00:40 — — 4.5 — — 6 — — UP

00:45 — — 5 — — 6 — — UP

00:50 — — 5.5 — — 6 — — UP

00:55 — Julie — 6 — 8 — — — UP

01:00 — Julie — 6 — 8 — 9 — — UP

01:05 — Julie — 6 — 8 — 9 — — UP

01:10 — Julie — 6 — 8 — 9 — — UP

01:15 — Julie — 6.5 — 8 — 9 — — UP

01:20 — Julie — 7 — 8 — 9 — — UP

01:25 — Julie — 7.5 — 8 — 9 — 11 — UP

01:30 — — 8 — — 9 — 11 — UP

01:35 — — 8 — — 9 — 11 — UP

01:40 — — 8 — — 9 — 11 — UP

01:45 — — 8 — — 9 — 11 — UP

01:50 — — 8.5 — — 9 — 11 — UP

01:55 — Sharon,Christine — 9 — 11, 12 — — 11 — UP

02:00 — Sharon,Christine — 9 — 11,12 — — 11 — UP

02:05 — Sharon,Christine — 9 — 11,12 — — 11 — UP

02:10 — Sharon,Christine — 9 — 11,12 — — 11 — UP

02:15 — Sharon,Christine — 9.5 — 11,12 — — 11 — UP

02:20 — Sharon,Christine — 10 — 11,12 — — 11 — UP

02:25 — Sharon,Christine — 10.5 — 11,12 — — 11 — UP

02:30 — Sharon — 11 — 12 — — 11 — UP

02:35 — Sharon — 11 — 12 — 5 — 11 — UP

02:40 — Sharon — 11 — 12 — 5 — 11 — UP

02:45 — Sharon — 11 — 12 — 5 — 11 — UP

02:50 — Sharon — 11.5 — 12 — 5 — 11 — UP

02:55 — — 12 — — 5 — 11 — Down

03:00 — — 12 — — 5 — 11 — Down

03:05 — — 12 — — 5 — 11 — Down

03:10 — — 12 — — 5 — 11 — Down

03:15 — — 11.5 — — 5 — 11 — Down

03:20 — Steve — 11 — 3 — 5 — — Down

03:25 — Steve — 11 — 3 — 5 — — Down

03:30 — Steve — 11 — 3 — 5 — — Down

03:35 — Steve — 11 — 3 — 5 — — Down

03:40 — Steve — 10.5 — 3 — 5 — — Down

03:45 — Steve — 10 — 3 — 5 — — Down

03:50 — Steve — 9.5 — 3 — 5 — — Down

03:55 — Steve — 9 — 3 — 5 — — Down

04:00 — Steve — 8.5 — 3 — 5 — — Down

04:05 — Steve — 8 — 3 — 5 — — Down

04:10 — Steve — 7.5 — 3 — 5 — — Down

04:15 — Steve — 7 — 3 — 5 — — Down

04:20 — Steve — 6.5 — 3 — 5 — — Down

04:25 — Steve — 6 — 3 — 5 — — Down

04:30 — Steve — 5.5 — 3 — 5 — — Down

04:35 — Steve — 5 — 3 — 5 — — Down

04:40 — Steve — 4.5 — 3 — 5 — — Down

04:45 — Steve — 4 — 3 — 5 — — Down

04:50 — Steve — 3.5 — 3 — 5 — — Down

04:55 — — 3 — — 5 — — Up

05:00 — — 3 — — 5 — — Up

05:05 — — 3 — — 5 — — Up

05:10 — — 3 — — 5 — — Up

05:15 — — 3.5 — — 5 — — Up

05:20 — — 4 — — 5 — — Up

05:25 — — 4.5 — — 5 — — Up

05:30 — Bob — 5 — 6 — — — Up

05:35 — Bob — 5 — 6 — — — Up

05:40 — Bob — 5 — 6 — — — Up

05:45 — Bob — 5 — 6 — — — Up

05:50 — Bob — 5.5 — 6 — — — Up

05:55 — — 6 — — — —

Julie: 85 seconds

Sharon: 113 seconds

Christine: 85 seconds

Steve: 210 seconds

Bob: 203 seconds

Avg: 139.2 seconds
