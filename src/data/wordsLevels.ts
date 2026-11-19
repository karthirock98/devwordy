import type { WordEntry } from '../game/types';

/**
 * Words added so every category has at least two basic (easy), two mid-level (medium)
 * and two advanced (hard) concepts. Facts and hints must never contain the answer.
 */
export const LEVEL_WORDS: WordEntry[] = [
  /* ---------- Programming Concepts ---------- */
  {
    id: 'variable',
    word: 'Variable',
    category: 'Programming Concepts',
    difficulty: 'easy',
    fact: 'Usually the very first thing taught in any programming course, right after printing text.',
    definition: 'A named place in memory that holds a value your program can read and change.',
    explanation:
      'You give a value a name so you can use it later: a score, a username, a list of items. In most languages you declare it once and then assign new values to it as the program runs.',
    example: 'let score = 0; then score = score + 10 after each correct answer.',
    code: { language: 'js', snippet: `let score = 0;\nscore += 10;\nconsole.log(score); // 10` },
    hints: ['Almost every line of code reads or writes one.', 'It has a name and holds a value.', 'Its value can vary while the program runs.'],
  },
  {
    id: 'monad',
    word: 'Monad',
    category: 'Programming Concepts',
    difficulty: 'hard',
    fact: 'Famous for the joke that once you understand it, you lose the ability to explain it.',
    definition: 'A design pattern from functional programming that wraps a value and chains operations on it with a single bind step.',
    explanation:
      'It gives you a standard way to sequence computations that carry extra context, such as "may be missing", "may fail" or "happens later". JavaScript promises with .then() behave much like one.',
    example: 'Chaining Maybe values so the chain stops safely as soon as one value is missing.',
    hints: ['A pattern from functional programming, central in Haskell.', 'It wraps a value and has a "bind" or flatMap operation.', 'Five letters, from category theory.'],
  },

  /* ---------- React ---------- */
  {
    id: 'props',
    word: 'Props',
    category: 'React',
    difficulty: 'easy',
    fact: 'Passed down from parent to child, and read-only for the child that receives them.',
    definition: 'The inputs a React component receives from its parent, like arguments to a function.',
    explanation:
      'A parent writes them as JSX attributes and the child reads them as one object. The child must not change them; if data has to change, it lives in state instead.',
    example: '<Avatar name="Ada" size={48} /> passes name and size to Avatar.',
    code: { language: 'tsx', snippet: `function Greeting({ name }: { name: string }) {\n  return <h1>Hello, {name}</h1>;\n}\n\n<Greeting name="Ada" />` },
    hints: ['Data handed from a parent component to a child.', 'They look like HTML attributes in JSX.', 'Short for "properties".'],
  },
  {
    id: 'react-context',
    word: 'Context',
    category: 'React',
    difficulty: 'medium',
    fact: 'React\'s built-in cure for "prop drilling" through many layers of components.',
    definition: 'A React feature that shares a value with a whole component tree without passing it through every level as props.',
    explanation:
      'You create it, wrap part of the tree in its Provider, and any component inside can read the value with a hook. It suits app-wide data such as the theme, the signed-in user or the language.',
    example: 'A ThemeProvider at the top so any button deep in the tree can read the theme.',
    code: { language: 'tsx', snippet: `const Theme = createContext('dark');\n\nfunction Button() {\n  const theme = useContext(Theme);\n  return <button className={theme}>OK</button>;\n}` },
    hints: ['It avoids passing the same prop through many layers.', 'You wrap the tree in a Provider and read it with a hook.', 'The surrounding circumstances of something.'],
  },

  /* ---------- Backend Development ---------- */
  {
    id: 'rest',
    word: 'REST',
    category: 'Backend Development',
    difficulty: 'easy',
    fact: 'Described in Roy Fielding\'s PhD thesis in the year 2000.',
    definition: 'An architectural style for web APIs where resources live at URLs and are handled with standard HTTP methods.',
    explanation:
      'Each resource, such as /users/42, is read with GET, created with POST, updated with PUT or PATCH and removed with DELETE. Every request carries everything the server needs, so the server keeps no session state between calls.',
    example: 'GET /api/orders/7 returns order 7 as JSON.',
    hints: ['The most common style for HTTP APIs.', 'Resources at URLs, verbs like GET and POST.', 'A four-letter acronym that also means to relax.'],
  },
  {
    id: 'rate-limiting',
    word: 'Rate Limiting',
    category: 'Backend Development',
    difficulty: 'medium',
    fact: 'Why public APIs answer with HTTP 429 "Too Many Requests" when you call them too fast.',
    definition: 'Capping how many requests a client may make in a period of time.',
    explanation:
      'The server counts requests per user, key or IP address, for example with a token bucket, and rejects or delays the extra ones. It protects the service from abuse, runaway scripts and sudden load.',
    example: 'Allowing 100 requests per minute per API key.',
    hints: ['It protects an API from too many calls.', 'Exceeding it often returns HTTP 429.', 'Two words: how fast, and a cap.'],
  },
  {
    id: 'circuit-breaker',
    word: 'Circuit Breaker',
    category: 'Backend Development',
    difficulty: 'hard',
    fact: 'Borrowed from the electrical safety switch in your home\'s fuse box.',
    definition: 'A pattern that stops calling a failing service for a while, so failures do not pile up and spread.',
    explanation:
      'After too many errors it "opens" and fails fast instead of waiting on timeouts. After a pause it lets a few test calls through, and if they succeed it "closes" again and normal traffic resumes.',
    example: 'A shop stops calling a slow payment provider for 30 seconds and shows a friendly error instead.',
    hints: ['A resilience pattern for calls between services.', 'It has open, closed and half-open states.', 'Named after the switch that trips when wiring overloads.'],
  },

  /* ---------- Computer Science ---------- */
  {
    id: 'array',
    word: 'Array',
    category: 'Computer Science',
    difficulty: 'easy',
    fact: 'Reading item number 1,000,000 takes the same time as reading the first.',
    definition: 'An ordered collection of items stored one after another and accessed by a numbered index.',
    explanation:
      'Because the items sit side by side in memory, the computer can jump straight to any position. Most languages start counting at index 0.',
    example: 'const days = ["Mon", "Tue", "Wed"]; days[1] is "Tue".',
    hints: ['The most basic way to store a list of values.', 'You reach items by index, usually starting at 0.', 'Five letters; also means an impressive range.'],
  },
  {
    id: 'dynamic-programming',
    word: 'Dynamic Programming',
    category: 'Computer Science',
    difficulty: 'hard',
    fact: 'Its inventor picked the name partly because it sounded impressive to funding officials.',
    definition: 'Solving a problem by breaking it into overlapping subproblems and reusing their saved answers.',
    explanation:
      'Instead of recomputing the same subproblem again and again, you store each result in a table, from the top down with memoisation or from the bottom up. It turns many exponential algorithms into polynomial ones.',
    example: 'Computing the cheapest path through a grid by filling in a table of best costs cell by cell.',
    hints: ['An algorithm technique coined by Richard Bellman.', 'Overlapping subproblems and optimal substructure.', 'Two words; the second is what developers do all day.'],
  },
  {
    id: 'turing-machine',
    word: 'Turing Machine',
    category: 'Computer Science',
    difficulty: 'hard',
    fact: 'Described in 1936, years before any electronic computer existed.',
    definition: 'A theoretical model of computation: a head reading and writing symbols on an endless tape according to fixed rules.',
    explanation:
      'Despite how simple it is, it can compute anything any real computer can. It is used to define what "computable" means and to prove some problems, like the halting problem, can never be solved.',
    example: 'Calling a programming language "complete" in this sense means it can simulate one.',
    hints: ['A thought experiment, not real hardware.', 'A tape, a read/write head and a table of rules.', 'Named after a British mathematician who broke Enigma.'],
  },

  /* ---------- Operating Systems ---------- */
  {
    id: 'kernel',
    word: 'Kernel',
    category: 'Operating Systems',
    difficulty: 'easy',
    fact: 'Linus Torvalds released the most famous open-source one in 1991.',
    definition: 'The core of an operating system, which manages the CPU, memory and devices for every program.',
    explanation:
      'Programs cannot touch hardware directly; they ask this core through system calls. It decides which program runs when, how memory is shared and how data reaches disks and networks.',
    example: 'Linux, used by Android phones and most web servers.',
    hints: ['The heart of every operating system.', 'Programs talk to it through system calls.', 'Also the inner part of a nut or seed.'],
  },
  {
    id: 'process',
    word: 'Process',
    category: 'Operating Systems',
    difficulty: 'easy',
    fact: 'Your task manager lists every one of these running on your machine right now.',
    definition: 'A running instance of a program, with its own memory space and resources.',
    explanation:
      'When you start a program the operating system creates one, gives it memory and an ID, and schedules it on the CPU. Several can run the same program independently, like two browser windows.',
    example: 'Each tab in Chrome runs separately so one crash does not take down the others.',
    hints: ['A program while it is running.', 'Each has its own ID and memory space.', 'Seven letters; also a series of steps.'],
  },

  /* ---------- Databases ---------- */
  {
    id: 'primary-key',
    word: 'Primary Key',
    category: 'Databases',
    difficulty: 'easy',
    fact: 'Every row has exactly one, and no two rows may ever share it.',
    definition: 'A column, or set of columns, that uniquely identifies each row in a table.',
    explanation:
      'It must be unique and never empty, so the database can find, update and link each row reliably. Other tables point to it with foreign keys.',
    example: 'An auto-incrementing id column in a users table.',
    hints: ['It uniquely identifies a row.', 'Rows in other tables refer to it to link records.', 'Two words: "main", and what opens a lock.'],
  },
  {
    id: 'write-ahead-log',
    word: 'Write Ahead Log',
    category: 'Databases',
    difficulty: 'hard',
    fact: 'The reason a database can survive a power cut in the middle of saving your data.',
    definition: 'A journal where a database records every change before applying it to the data files.',
    explanation:
      'If the server crashes, it replays the journal on restart to finish or undo half-done work. The same journal is often streamed to replicas to keep them in sync.',
    example: 'PostgreSQL recovering cleanly after an unexpected shutdown.',
    hints: ['A durability technique, often shortened to WAL.', 'Changes are recorded before they are applied.', 'Three words: record it first, then do it.'],
  },

  /* ---------- Networking ---------- */
  {
    id: 'handshake',
    word: 'Handshake',
    category: 'Networking',
    difficulty: 'medium',
    fact: 'TCP\'s version takes three messages: SYN, SYN-ACK and ACK.',
    definition: 'The opening exchange of messages two machines use to agree on how they will communicate.',
    explanation:
      'Before data flows, both sides confirm they are reachable and agree on settings such as sequence numbers, or, for TLS, encryption keys and certificates. Only then does the real conversation start.',
    example: 'A browser and a server agreeing on encryption keys before an HTTPS page loads.',
    hints: ['It happens before any real data is sent.', 'TCP does it in three steps.', 'Also how people greet each other in business.'],
  },
  {
    id: 'anycast',
    word: 'Anycast',
    category: 'Networking',
    difficulty: 'hard',
    fact: 'Lets one public DNS address be answered from hundreds of data centres worldwide.',
    definition: 'A routing method where many servers share one IP address and each user reaches the nearest one.',
    explanation:
      'Several locations announce the same address and the internet\'s routing sends each packet to the closest of them. It cuts latency and soaks up attacks by spreading traffic across sites.',
    example: 'Public DNS resolvers that answer from the data centre nearest to you.',
    hints: ['One IP address, many servers.', 'Relies on BGP routing to pick the closest site.', 'Related to unicast and multicast.'],
  },
  {
    id: 'congestion-control',
    word: 'Congestion Control',
    category: 'Networking',
    difficulty: 'hard',
    fact: 'Added to TCP after the internet suffered a "collapse" in 1986 that cut speeds a thousandfold.',
    definition: 'Algorithms that make senders slow down when the network is overloaded and speed up when it is clear.',
    explanation:
      'The sender watches for lost packets or rising delay and shrinks how much data it has in flight, then grows it again carefully. Algorithms like CUBIC and BBR keep the network fast and fair for everyone.',
    example: 'A video call lowering its bitrate when your Wi-Fi gets busy.',
    hints: ['It keeps the network from being overwhelmed.', 'TCP uses algorithms like CUBIC and BBR for it.', 'Two words: a traffic jam, and keeping it in check.'],
  },

  /* ---------- Software Architecture ---------- */
  {
    id: 'mvc',
    word: 'MVC',
    category: 'Software Architecture',
    difficulty: 'easy',
    fact: 'Created at Xerox PARC in the late 1970s for the Smalltalk language.',
    definition: 'A pattern that splits an app into the data, the screens that show it, and the code that handles input.',
    explanation:
      'The data layer holds state and rules, the screens display it, and a coordinating layer turns user actions into updates. Keeping them apart makes each part easier to change and test.',
    example: 'Ruby on Rails and ASP.NET organise apps this way.',
    hints: ['A classic way to split an app into three layers.', 'Data, display, and input handling.', 'A three-letter acronym.'],
  },
  {
    id: 'monolith',
    word: 'Monolith',
    category: 'Software Architecture',
    difficulty: 'medium',
    fact: 'Many big tech companies started as one of these before splitting it up.',
    definition: 'An application built and deployed as one single unit, with all features in one codebase and process.',
    explanation:
      'It is simple to build, test and deploy at first. As it grows, teams step on each other and one change means redeploying everything, which is why some split it into services.',
    example: 'A shop where catalogue, checkout and accounts live in one deployable app.',
    hints: ['The opposite of microservices.', 'One codebase, one deployment.', 'Also a huge single block of stone.'],
  },
  {
    id: 'event-sourcing',
    word: 'Event Sourcing',
    category: 'Software Architecture',
    difficulty: 'hard',
    fact: 'Your bank balance works this way: it is the sum of every transaction ever made.',
    definition: 'Storing every change to the data as an event, instead of only the current state.',
    explanation:
      'The current state is rebuilt by replaying the events in order. You get a full audit trail and can answer "what did it look like last Tuesday?", at the cost of more complex reads.',
    example: 'An order history of placed, paid, shipped and refunded events from which status is derived.',
    hints: ['Often paired with CQRS.', 'You store what happened, not just the result.', 'Two words: things that happen, and where data comes from.'],
  },

  /* ---------- TypeScript ---------- */
  {
    id: 'interface',
    word: 'Interface',
    category: 'TypeScript',
    difficulty: 'easy',
    fact: 'Disappears entirely when your code is compiled to JavaScript.',
    definition: 'A named description of the shape an object must have: its properties and their types.',
    explanation:
      'You declare which fields an object has and what types they hold, and the compiler checks every object against it. It can be extended and merged, which makes it handy for describing APIs.',
    example: 'Describing a User with id: number and name: string.',
    code: { language: 'ts', snippet: `interface User {\n  id: number;\n  name: string;\n}\n\nconst ada: User = { id: 1, name: 'Ada' };` },
    hints: ['It describes the shape of an object.', 'Declared with a keyword and curly braces; erased at runtime.', 'Also the point where two systems meet.'],
  },
  {
    id: 'enum',
    word: 'Enum',
    category: 'TypeScript',
    difficulty: 'easy',
    fact: 'One of the few TypeScript features that produces real JavaScript code at runtime.',
    definition: 'A named set of related constant values.',
    explanation:
      'Instead of scattering magic numbers or strings, you list the allowed values once under one name. Many teams now prefer string union types, which give similar safety with no runtime code.',
    example: 'Direction.Up, Direction.Down, Direction.Left, Direction.Right.',
    code: { language: 'ts', snippet: `enum Direction {\n  Up,\n  Down,\n}\n\nmove(Direction.Up);` },
    hints: ['A fixed list of named constants.', 'Like Direction.Up and Direction.Down.', 'Its full name means a numbered listing of things.'],
  },
  {
    id: 'union-type',
    word: 'Union Type',
    category: 'TypeScript',
    difficulty: 'medium',
    fact: 'Written with a single vertical bar between the options.',
    definition: 'A type that allows a value to be one of several types.',
    explanation:
      'string | number accepts either, and "a" | "b" accepts only those two strings. You narrow it with checks such as typeof before using features only one option has.',
    example: "type Status = 'idle' | 'loading' | 'error';",
    code: { language: 'ts', snippet: `type Id = string | number;\n\nfunction show(id: Id) {\n  return typeof id === 'number' ? id.toFixed(0) : id;\n}` },
    hints: ['It lets a value be one of several kinds of thing.', 'Written with the | symbol.', 'Two words; the first is also what workers form to bargain together.'],
  },
  {
    id: 'conditional-type',
    word: 'Conditional Type',
    category: 'TypeScript',
    difficulty: 'hard',
    fact: 'Brings the ternary operator, "A extends B ? X : Y", into compile-time checks.',
    definition: 'A type that picks one of two types depending on whether a type matches a condition.',
    explanation:
      'Combined with generics and the infer keyword, it lets you compute new types from others. Built-in helpers such as ReturnType and Exclude are made with it.',
    example: 'type IsString<T> = T extends string ? true : false;',
    hints: ['An if/else that runs inside the compiler, not at runtime.', 'Uses extends, ?, and often infer.', 'Two words: depending on a test, and a kind or sort.'],
  },

  /* ---------- Angular ---------- */
  {
    id: 'angular-component',
    word: 'Component',
    category: 'Angular',
    difficulty: 'easy',
    fact: 'Marked with an @ decorator that names its selector, template and styles.',
    definition: 'A building block of an Angular app that pairs an HTML template with a TypeScript class.',
    explanation:
      'Each one controls a piece of the screen, such as a header or a product card. The class holds the data and logic, and the template shows it; you place it on a page with its selector tag.',
    example: '<app-product-card> rendering one product in a list.',
    hints: ['The basic UI building block in Angular.', 'A class plus a template plus a selector.', 'Also any part of a larger whole.'],
  },
  {
    id: 'angular-service',
    word: 'Service',
    category: 'Angular',
    difficulty: 'easy',
    fact: 'Usually marked providedIn: \'root\' so the whole app shares one instance.',
    definition: 'An Angular class that holds shared logic or data, such as API calls, and is injected where needed.',
    explanation:
      'Instead of putting HTTP calls or shared state inside components, you put them here and ask for it in a constructor or with inject(). Angular creates it and hands the same instance to everyone.',
    example: 'A CartService that several components use to read and update the cart.',
    hints: ['Shared logic that components ask for.', 'Marked @Injectable and provided by dependency injection.', 'Also what a waiter gives you at a restaurant.'],
  },
  {
    id: 'content-projection',
    word: 'Content Projection',
    category: 'Angular',
    difficulty: 'hard',
    fact: 'Done with the <ng-…> slot tag, which works like <slot> in web components.',
    definition: 'Passing HTML from a parent into chosen places inside a child component\'s template.',
    explanation:
      'The child marks one or more slots with ng-content, optionally with a select attribute, and the parent\'s inner markup is shown there. It lets you build reusable wrappers such as cards and dialogs.',
    example: 'A <app-card> that shows whatever title and body you put between its tags.',
    hints: ['Its slots are marked with an ng- tag in the child template.', 'React does the same thing with the children prop.', 'Two words: what is inside, and what a cinema does with film.'],
  },

  /* ---------- Git & Version Control ---------- */
  {
    id: 'commit',
    word: 'Commit',
    category: 'Git & Version Control',
    difficulty: 'easy',
    fact: 'Each one is named by a 40-character hash of its contents and history.',
    definition: 'A saved snapshot of your project at a point in time, with a message describing the change.',
    explanation:
      'You stage the changes you want and record them together. Each snapshot points to its parent, which forms the history you can browse, compare and go back to.',
    example: 'git commit -m "Fix login button alignment"',
    hints: ['A snapshot in a repository\'s history.', 'It has an author, a message and a hash.', 'Also means to pledge yourself to something.'],
  },
  {
    id: 'reflog',
    word: 'Reflog',
    category: 'Git & Version Control',
    difficulty: 'hard',
    fact: 'The safety net that rescues work after a reset you regret.',
    definition: 'Git\'s local record of every position HEAD and your branches have pointed to.',
    explanation:
      'Even after a hard reset, a deleted branch or a messy rebase, the old commits are still listed here for a while. You find the right entry and reset or check it out to recover the work.',
    example: 'git reflog, then git reset --hard HEAD@{2} to undo a bad reset.',
    hints: ['It lets you recover "lost" commits.', 'It records where HEAD has been.', 'Short for "reference log".'],
  },
  {
    id: 'bisect',
    word: 'Bisect',
    category: 'Git & Version Control',
    difficulty: 'hard',
    fact: 'Finds the bad change among 1,000 commits in about ten steps.',
    definition: 'A Git command that binary-searches your history to find the commit that introduced a bug.',
    explanation:
      'You mark one commit as good and one as bad, and Git checks out the midpoint for you to test. Each answer halves the range until a single culprit commit remains; it can even run a test script for you.',
    example: 'git bisect start, git bisect bad, git bisect good v1.2',
    hints: ['A Git command for hunting down a bug.', 'It uses binary search over commits.', 'A geometry word: to cut into two equal parts.'],
  },

  /* ---------- DevOps ---------- */
  {
    id: 'infrastructure-as-code',
    word: 'Infrastructure as Code',
    category: 'DevOps',
    difficulty: 'medium',
    fact: 'Lets a whole data centre setup be reviewed in a pull request.',
    definition: 'Defining servers, networks and other infrastructure in version-controlled files instead of setting them up by hand.',
    explanation:
      'Tools like Terraform read the files and create or update the real resources to match. Environments become repeatable, reviewable and easy to rebuild.',
    example: 'A Terraform file that creates a database, a load balancer and three servers.',
    hints: ['Terraform and Pulumi are popular tools for it.', 'Your servers are described in files under version control.', 'Three words, often shortened to IaC.'],
  },
  {
    id: 'canary-release',
    word: 'Canary Release',
    category: 'DevOps',
    difficulty: 'hard',
    fact: 'Named after the birds miners carried underground to warn of toxic gas.',
    definition: 'Rolling a new version out to a small share of users first, and widening it only if it behaves well.',
    explanation:
      'A few percent of traffic goes to the new version while you watch errors and latency. If something looks wrong you roll back with little harm; if not, you send it to everyone.',
    example: 'Sending 5% of traffic to v2 for an hour before a full rollout.',
    hints: ['A careful way to ship a new version.', 'Only a small group of users gets it first.', 'Named after a small yellow bird used in coal mines.'],
  },
  {
    id: 'chaos-engineering',
    word: 'Chaos Engineering',
    category: 'DevOps',
    difficulty: 'hard',
    fact: 'Netflix made it famous with a tool that randomly shut down its own production servers.',
    definition: 'Deliberately injecting failures into a system to prove it can survive them.',
    explanation:
      'You form a hypothesis, then kill servers, add latency or cut network links in a controlled way and watch what happens. Weak spots show up in a planned experiment instead of a real outage.',
    example: 'Turning off one availability zone during work hours to check traffic fails over.',
    hints: ['Breaking things on purpose to build confidence.', 'Netflix\'s "Monkey" tool is the classic example.', 'Two words: total disorder, and the discipline of building systems.'],
  },

  /* ---------- Cloud Computing ---------- */
  {
    id: 'availability-zone',
    word: 'Availability Zone',
    category: 'Cloud Computing',
    difficulty: 'medium',
    fact: 'Each cloud region contains several, kilometres apart with separate power and cooling.',
    definition: 'An isolated data centre, or group of them, inside a cloud region.',
    explanation:
      'They are close enough for fast links but far enough apart that a fire or power cut hits only one. Spreading your servers across several keeps the app running when one fails.',
    example: 'Running app servers in eu-west-1a and eu-west-1b.',
    hints: ['A building block of cloud regions.', 'You spread servers across several so one outage does not take you down.', 'Two words, shortened to two letters by cloud providers.'],
  },
  {
    id: 'cold-start',
    word: 'Cold Start',
    category: 'Cloud Computing',
    difficulty: 'hard',
    fact: 'Can add a second or more to the first request after a serverless function sits idle.',
    definition: 'The extra delay when a platform must start a fresh instance before it can handle a request.',
    explanation:
      'Serverless platforms shut idle instances down, so the next request waits for a new one to boot, load code and connect. Teams reduce it with smaller bundles, faster runtimes or pre-warmed instances.',
    example: 'A Lambda function that answers in 20 ms when warm but 900 ms after an idle hour.',
    hints: ['A latency problem in serverless computing.', 'It happens after a function has been idle.', 'Two words: the opposite of warm, and the beginning.'],
  },
  {
    id: 'service-mesh',
    word: 'Service Mesh',
    category: 'Cloud Computing',
    difficulty: 'hard',
    fact: 'Usually works by putting a small proxy "sidecar" next to every app.',
    definition: 'An infrastructure layer that handles traffic, security and monitoring between microservices.',
    explanation:
      'Instead of every service implementing retries, encryption and metrics, a proxy beside each one does it, controlled centrally. Istio and Linkerd are common examples.',
    example: 'Turning on mutual TLS between all services without changing any code.',
    hints: ['Istio and Linkerd are examples.', 'Sidecar proxies sit next to each running app instance.', 'Two words: something offered to customers, and a woven net.'],
  },

  /* ---------- Cybersecurity ---------- */
  {
    id: 'zero-day',
    word: 'Zero Day',
    category: 'Cybersecurity',
    difficulty: 'hard',
    fact: 'Unknown flaws like these can sell for over a million dollars on grey markets.',
    definition: 'A software vulnerability that attackers know about before the vendor has a fix.',
    explanation:
      'The name means the developers have had no time at all to patch it. Defenders rely on layered security and quick detection, because no update can protect them yet.',
    example: 'A browser flaw exploited in the wild before the patch ships.',
    hints: ['A vulnerability with no patch yet.', 'Attackers find it before the vendor does.', 'Two words: a number, and a unit of time.'],
  },
  {
    id: 'side-channel',
    word: 'Side Channel',
    category: 'Cybersecurity',
    difficulty: 'hard',
    fact: 'Spectre and Meltdown leaked secrets from CPUs just by measuring timing.',
    definition: 'An attack that learns secrets from indirect signals such as timing, power use or sound, not from a bug in the logic.',
    explanation:
      'Even correct code can leak: if checking a password takes longer when more characters match, timing reveals it bit by bit. Defences include constant-time code and adding noise.',
    example: 'Recovering an encryption key by measuring how long each operation takes.',
    hints: ['It does not break the algorithm itself.', 'It measures timing, power or sound.', 'Two words: not the front, and a path for information.'],
  },

  /* ---------- Artificial Intelligence ---------- */
  {
    id: 'training-data',
    word: 'Training Data',
    category: 'Artificial Intelligence',
    difficulty: 'easy',
    fact: 'Large language models learn from trillions of words of it.',
    definition: 'The examples a machine-learning model learns from.',
    explanation:
      'The model adjusts itself to fit these examples, so their quality decides how good and how fair it will be. Biased or messy examples lead to biased or messy predictions.',
    example: 'Thousands of labelled cat and dog photos used to teach an image classifier.',
    hints: ['What a model learns from.', 'Its quality limits the model\'s quality.', 'Two words: practice, and information.'],
  },
  {
    id: 'gradient-descent',
    word: 'Gradient Descent',
    category: 'Artificial Intelligence',
    difficulty: 'medium',
    fact: 'Often explained as walking down a foggy mountain by always stepping downhill.',
    definition: 'An optimisation method that repeatedly nudges a model\'s parameters in the direction that reduces its error.',
    explanation:
      'It measures how the error changes as each parameter changes, then takes a small step the other way. The step size, called the learning rate, decides how fast and how safely it converges.',
    example: 'Training a neural network over millions of small update steps.',
    hints: ['How most neural networks are trained.', 'It uses slopes and a learning rate.', 'Two words: a slope, and going down.'],
  },
  {
    id: 'backpropagation',
    word: 'Backpropagation',
    category: 'Artificial Intelligence',
    difficulty: 'hard',
    fact: 'Popularised in a 1986 paper that helped revive neural-network research.',
    definition: 'The algorithm that works out how much each weight in a neural network contributed to the error.',
    explanation:
      'After a forward pass makes a prediction, the error is sent backwards layer by layer using the chain rule from calculus. The result tells the optimiser how to adjust every weight.',
    example: 'Each training step of a deep network runs one forward and one backward pass.',
    hints: ['Uses the chain rule from calculus.', 'The error flows from the output layer towards the input.', 'One long word: backwards plus spreading.'],
  },

  /* ---------- Node.js ---------- */
  {
    id: 'npm',
    word: 'NPM',
    category: 'Node.js',
    difficulty: 'easy',
    fact: 'Its registry hosts over two million packages, the largest of any language.',
    definition: 'The default package manager for Node.js and the registry it downloads from.',
    explanation:
      'You list dependencies in package.json and one install command downloads them into node_modules. It also runs project scripts such as build and test.',
    example: 'npm install react, then npm run dev.',
    hints: ['The tool that installs Node packages.', 'It reads package.json.', 'A three-letter acronym.'],
  },
  {
    id: 'worker-threads',
    word: 'Worker Threads',
    category: 'Node.js',
    difficulty: 'hard',
    fact: 'Lets single-threaded Node finally use every CPU core for heavy maths.',
    definition: 'A Node.js module that runs JavaScript in parallel threads, each with its own event loop.',
    explanation:
      'CPU-heavy work such as image resizing would block the main event loop. Moving it to these lets the server keep answering requests while the work happens alongside, with results sent back as messages.',
    example: 'Hashing large files in the background without freezing an API.',
    hints: ['A Node module for CPU-heavy work.', 'They talk to the main thread with postMessage.', 'Two words: an employee, and strands of execution.'],
  },

  /* ---------- Java ---------- */
  {
    id: 'type-erasure',
    word: 'Type Erasure',
    category: 'Java',
    difficulty: 'hard',
    fact: 'Why a List<String> and a List<Integer> are the same class at runtime.',
    definition: 'The Java compiler removing generic type information after checking it, so it is gone at runtime.',
    explanation:
      'Generics were added in Java 5 without changing the JVM, so the compiler checks them and then replaces them with plain Object and casts. That is why you cannot write new T() or check instanceof List<String>.',
    example: 'list.getClass() is the same for every kind of ArrayList.',
    hints: ['A consequence of how Java generics were added.', 'Generic info exists at compile time but not at runtime.', 'Two words: a kind, and wiping out.'],
  },

  /* ---------- C# ---------- */
  {
    id: 'expression-tree',
    word: 'Expression Tree',
    category: 'C#',
    difficulty: 'hard',
    fact: 'The trick that lets Entity Framework turn your C# lambdas into SQL.',
    definition: 'A data structure that represents code as a tree of objects that can be inspected and translated.',
    explanation:
      'When a lambda is assigned to Expression<Func<...>>, the compiler builds a description of it instead of runnable code. Libraries then walk the tree and translate it, for example into a database query.',
    example: 'db.Users.Where(u => u.Age > 18) becoming a SQL WHERE clause.',
    hints: ['How LINQ providers turn lambdas into SQL.', 'Code represented as data you can inspect.', 'Two words: a formula, and something with branches.'],
  },

  /* ---------- Python ---------- */
  {
    id: 'metaclass',
    word: 'Metaclass',
    category: 'Python',
    difficulty: 'hard',
    fact: 'In Python, the built-in "type" is one, and it is an instance of itself.',
    definition: 'The class of a class: it controls how classes themselves are created.',
    explanation:
      'Just as a class builds objects, this builds classes. Frameworks such as Django use it to turn simple class definitions into database models; most code never needs one.',
    example: 'A model base class that registers every subclass automatically.',
    hints: ['A class whose instances are classes.', 'Python\'s built-in "type" is one.', 'One word: "beyond" plus a blueprint for objects.'],
  },

  /* ---------- Programming Languages ---------- */
  {
    id: 'haskell',
    word: 'Haskell',
    category: 'Programming Languages',
    difficulty: 'hard',
    fact: 'Evaluates nothing until it is actually needed, by default.',
    definition: 'A purely functional, lazily evaluated programming language with a strong static type system.',
    explanation:
      'Functions have no side effects unless their type says so, and values are computed only when needed. It is used in research, finance and compilers, and shaped features of many other languages.',
    example: 'Defining an infinite list of primes and taking only the first ten.',
    hints: ['A purely functional language.', 'Lazy evaluation and type classes.', 'Named after the logician whose surname is also a spicy dish.'],
  },
  {
    id: 'erlang',
    word: 'Erlang',
    category: 'Programming Languages',
    difficulty: 'hard',
    fact: 'Built at Ericsson for telephone switches that had to run for years without stopping.',
    definition: 'A language for highly concurrent, fault-tolerant systems built from many lightweight processes.',
    explanation:
      'Programs are made of millions of tiny isolated processes that pass messages and are restarted by supervisors when they crash. WhatsApp and many telecom systems run on it; Elixir runs on the same virtual machine.',
    example: 'A chat server handling millions of connections, each in its own process.',
    hints: ['Made for telecoms at a Swedish company.', 'Famous for "let it crash" and supervisors.', 'Elixir runs on its BEAM virtual machine.'],
  },
];
