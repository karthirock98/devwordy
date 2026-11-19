import type { WordEntry } from '../game/types';
import { MORE_WORDS } from './wordsMore';
import { LEVEL_WORDS } from './wordsLevels';

/**
 * The word bank. Hints must never contain the word itself.
 * `difficulty` is the level: easy = basic, medium = mid-level, hard = advanced.
 */
const CORE_WORDS: WordEntry[] = [
  {
    id: 'closure',
    word: 'Closure',
    category: 'JavaScript',
    difficulty: 'medium',
    fact: "Douglas Crockford's \"JavaScript: The Good Parts\" (2008) made this concept famous among web developers.",
    definition: 'A function bundled together with references to the variables of the scope it was created in.',
    explanation:
      'When a function is created inside another function, it keeps a live link to the outer function\'s variables, even after the outer function has returned. The inner function "closes over" that environment. This is how JavaScript gives you private state without classes: the variables cannot be reached from outside, only through the functions that captured them.',
    example: 'React hooks rely on this: event handlers defined inside a component remember the props and state from the render that created them.',
    code: {
      language: 'js',
      snippet: `function counter() {
  let count = 0;            // private
  return () => ++count;     // remembers count
}

const next = counter();
next(); // 1
next(); // 2`,
    },
    hints: [
      'This concept is closely related to functions and scope.',
      'It lets an inner function keep access to variables from its outer function after that function has returned.',
      'A JavaScript interview classic, often shown with a counter or a loop with setTimeout.',
    ],
  },
  {
    id: 'recursion',
    word: 'Recursion',
    category: 'Programming Concepts',
    difficulty: 'easy',
    fact: "Google famously answers searches for this word with \"Did you mean: …\" pointing back to itself.",
    definition: 'A technique where a function solves a problem by calling itself on smaller versions of the same problem.',
    explanation:
      'Every recursive function needs a base case that stops the calls and a recursive case that moves toward it. Each call gets its own stack frame, so very deep chains can overflow the call stack. It shines on naturally nested data such as trees, file systems and JSON.',
    example: 'Walking a folder tree to compute the total size of every file inside it.',
    code: {
      language: 'js',
      snippet: `function factorial(n) {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // calls itself
}`,
    },
    hints: [
      'A function that relies on itself.',
      'It always needs a base case, or it will blow the call stack.',
      'Factorials and tree traversals are textbook uses.',
    ],
  },
  {
    id: 'memoization',
    word: 'Memoization',
    category: 'Programming Concepts',
    difficulty: 'medium',
    fact: "Coined by Donald Michie in 1968, from the Latin \"memorandum\" — note the missing r.",
    definition: 'Caching the result of a function call so the same inputs return the stored result instead of recomputing it.',
    explanation:
      'A memoized function keeps a lookup table keyed by its arguments. The first call does the real work; later calls with the same arguments are answered from the table. It only works safely for pure functions, whose output depends only on their input. It trades memory for speed.',
    example: 'React\'s useMemo and React.memo skip expensive recalculation and re-rendering when inputs have not changed.',
    code: {
      language: 'js',
      snippet: `const cache = new Map();
function fib(n) {
  if (n < 2) return n;
  if (cache.has(n)) return cache.get(n);
  const value = fib(n - 1) + fib(n - 2);
  cache.set(n, value);
  return value;
}`,
    },
    hints: [
      'It is an optimization technique.',
      'It remembers the answers a function already computed for given inputs.',
      'React exposes it through a hook whose name starts with "use".',
    ],
  },
  {
    id: 'debouncing',
    word: 'Debouncing',
    category: 'JavaScript',
    difficulty: 'medium',
    fact: "Borrowed from hardware: mechanical keyboard switches still need it in firmware today.",
    definition: 'Delaying a function until a burst of repeated events has stopped for a set amount of time.',
    explanation:
      'Every new event resets a timer. The function only runs once the events go quiet for the whole wait period. The term comes from electronics, where a physical switch "bounces" and sends several signals for one press.',
    example: 'A search box that only calls the API once the user stops typing for 300 ms.',
    code: {
      language: 'js',
      snippet: `function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`,
    },
    hints: [
      'It controls how often an event handler runs.',
      'It waits until the events stop arriving before acting once.',
      'Perfect for search-as-you-type inputs. Its sibling technique runs at a fixed rate instead.',
    ],
  },
  {
    id: 'throttling',
    word: 'Throttling',
    category: 'JavaScript',
    difficulty: 'medium',
    fact: "Most public APIs (GitHub allows 5,000 requests/hour) apply this to clients.",
    definition: 'Limiting a function so it runs at most once in a given time window, no matter how often it is triggered.',
    explanation:
      'Unlike waiting for silence, this technique guarantees regular execution: the first call runs, and further calls are ignored until the window passes. It keeps high-frequency events such as scroll, resize or mousemove from overwhelming the main thread.',
    example: 'Updating an infinite-scroll position check at most every 200 ms while the user scrolls.',
    code: {
      language: 'js',
      snippet: `function throttle(fn, limit) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}`,
    },
    hints: [
      'It limits how often something can happen.',
      'It allows one run per time window and drops the rest.',
      'Also the word for what an API does when it slows down a client that sends too many requests.',
    ],
  },
  {
    id: 'hoisting',
    word: 'Hoisting',
    category: 'JavaScript',
    difficulty: 'easy',
    fact: "The term never appeared in the ECMAScript spec before ES2015; developers invented it.",
    definition: 'JavaScript\'s behavior of moving declarations to the top of their scope before code runs.',
    explanation:
      'During compilation, function declarations and var declarations are registered first. Functions can be called before they appear in the file; var variables exist but are undefined. let and const are also registered but sit in the "temporal dead zone" and throw if touched early.',
    example: 'Calling a helper function at the top of a file that is declared at the bottom works fine.',
    code: {
      language: 'js',
      snippet: `greet();               // works
console.log(x);        // undefined
var x = 5;

function greet() {
  console.log('hi');
}`,
    },
    hints: [
      'It is about declarations and where JavaScript "sees" them.',
      'var and function declarations act as if they were lifted to the top of their scope.',
      'Its name sounds like raising a flag up a pole.',
    ],
  },
  {
    id: 'hydration',
    word: 'Hydration',
    category: 'React',
    difficulty: 'hard',
    fact: "Next.js, Nuxt, Remix and Angular SSR all rely on this step after server rendering.",
    definition: 'Attaching client-side JavaScript and event listeners to HTML that was already rendered on the server.',
    explanation:
      'With server-side rendering, the browser receives ready-made HTML so content shows quickly. The framework then runs on the client, rebuilds its component tree and links it to the existing DOM instead of replacing it. If the server and client output differ, you get a mismatch warning.',
    example: 'A server-rendered product page that shows instantly and becomes clickable once the client JavaScript loads.',
    code: {
      language: 'tsx',
      snippet: `import { hydrateRoot } from 'react-dom/client';

hydrateRoot(
  document.getElementById('root')!,
  <App />
);`,
    },
    hints: [
      'It happens in the browser after server-side rendering.',
      'Static HTML is brought to life by attaching event handlers.',
      'Sounds like what you do with a glass of water.',
    ],
  },
  {
    id: 'middleware',
    word: 'Middleware',
    category: 'Backend Development',
    difficulty: 'easy',
    fact: "Express.js, downloaded over 30 million times a week, is built almost entirely around this idea.",
    definition: 'Code that sits between an incoming request and the final handler, able to inspect, change or stop it.',
    explanation:
      'Requests flow through a chain of these functions. Each one can read or modify the request and response, end the request early, or pass control to the next one. It keeps cross-cutting concerns like logging, authentication and parsing out of the business logic.',
    example: 'An Express app that checks a JWT on every request before it reaches the route handlers.',
    code: {
      language: 'js',
      snippet: `app.use((req, res, next) => {
  console.log(req.method, req.url);
  next(); // hand off to the next layer
});`,
    },
    hints: [
      'It lives in the request pipeline of a web server.',
      'Each layer can modify the request or call next().',
      'Its name says where it sits: in between.',
    ],
  },
  {
    id: 'polymorphism',
    word: 'Polymorphism',
    category: 'Computer Science',
    difficulty: 'medium',
    fact: "Simula 67, the first object-oriented language, already supported it in 1967.",
    definition: 'The ability of different types to be used through the same interface, each with its own behavior.',
    explanation:
      'Code can call area() on any shape without knowing whether it is a circle or a square; each class provides its own implementation. It is one of the pillars of object-oriented programming, along with encapsulation, inheritance and abstraction.',
    example: 'A payment system that calls pay() on CardPayment, PayPalPayment or CryptoPayment objects alike.',
    code: {
      language: 'ts',
      snippet: `interface Shape { area(): number }

class Circle implements Shape {
  constructor(private r: number) {}
  area() { return Math.PI * this.r ** 2 }
}
class Square implements Shape {
  constructor(private s: number) {}
  area() { return this.s ** 2 }
}`,
    },
    hints: [
      'One of the four pillars of OOP.',
      'One interface, many implementations.',
      'From Greek: "many forms".',
    ],
  },
  {
    id: 'deadlock',
    word: 'Deadlock',
    category: 'Operating Systems',
    difficulty: 'medium',
    fact: "Edward Coffman described the four conditions that cause it in 1971.",
    definition: 'A state where two or more processes wait forever, each holding a resource the other needs.',
    explanation:
      'It needs four conditions at once: mutual exclusion, hold and wait, no preemption and circular wait. Breaking any one prevents it. A common fix is to always acquire locks in the same global order.',
    example: 'Two database transactions each lock one row and then wait for the row the other locked.',
    hints: [
      'A concurrency problem.',
      'Process A waits for B, while B waits for A, and nobody moves.',
      'Its name combines "no life" with what you put on a door.',
    ],
  },
  {
    id: 'mutex',
    word: 'Mutex',
    category: 'Operating Systems',
    difficulty: 'medium',
    fact: "The Mars Pathfinder rover kept rebooting in 1997 because of a bug involving one of these.",
    definition: 'A lock that lets only one thread at a time enter a critical section of code.',
    explanation:
      'A thread must acquire it before touching shared data and release it afterward. Any other thread trying to acquire it blocks until it is released. Unlike a counting semaphore, it has an owner: only the thread that locked it should unlock it.',
    example: 'Protecting a shared bank balance so two threads cannot withdraw at the same time and corrupt it.',
    code: {
      language: 'go',
      snippet: `var mu sync.Mutex
var balance int

func deposit(n int) {
  mu.Lock()
  defer mu.Unlock()
  balance += n
}`,
    },
    hints: [
      'A synchronization primitive.',
      'Only one thread can hold it at a time.',
      'Short for "mutual exclusion".',
    ],
  },
  {
    id: 'semaphore',
    word: 'Semaphore',
    category: 'Operating Systems',
    difficulty: 'hard',
    fact: "Dijkstra named it after railway signals while working in the Netherlands in the 1960s.",
    definition: 'A counter used to control how many threads can access a limited resource at the same time.',
    explanation:
      'Threads call wait (decrement) to take a slot and signal (increment) to give it back. When the counter reaches zero, new threads block. Edsger Dijkstra introduced it in the 1960s. A version with a count of one behaves like a lock.',
    example: 'Allowing at most 10 simultaneous connections to a database from a worker pool.',
    hints: [
      'A synchronization primitive invented by Dijkstra.',
      'It is basically a counter of available slots, with wait and signal operations.',
      'Originally the name for flag or light signals used on railways.',
    ],
  },
  {
    id: 'garbage-collection',
    word: 'Garbage Collection',
    category: 'Computer Science',
    difficulty: 'medium',
    fact: "John McCarthy invented it for Lisp in 1959.",
    definition: 'Automatic memory management that frees memory occupied by objects a program can no longer reach.',
    explanation:
      'The runtime periodically finds objects that are unreachable from the program\'s roots (globals, the stack) and reclaims their memory. Common strategies include mark-and-sweep and generational collection. It prevents many memory bugs but can cause pauses.',
    example: 'JavaScript, Java, Go and C# all clean up unused objects for you, unlike C where you call free() yourself.',
    hints: [
      'It is about memory, and it happens automatically.',
      'The runtime reclaims objects nothing points to anymore.',
      'Named after a weekly municipal service.',
    ],
  },
  {
    id: 'sharding',
    word: 'Sharding',
    category: 'Databases',
    difficulty: 'hard',
    fact: "Ultima Online (1997) popularized the term by splitting players across parallel worlds.",
    definition: 'Splitting one large dataset horizontally across several databases, each holding a subset of the rows.',
    explanation:
      'A shard key (such as user ID) decides which database each row lives on. This spreads both storage and load across machines so the system can scale beyond one server. The cost is complexity: cross-shard queries and rebalancing are hard.',
    example: 'A social network storing users A–M on one cluster and N–Z on another.',
    hints: [
      'A strategy for scaling databases.',
      'Rows are split across machines by a key.',
      'Its name means a broken fragment of glass.',
    ],
  },
  {
    id: 'replication',
    word: 'Replication',
    category: 'Databases',
    difficulty: 'medium',
    fact: "Most production PostgreSQL and MySQL setups run at least one read-only copy for safety.",
    definition: 'Keeping copies of the same data on multiple database servers.',
    explanation:
      'A primary accepts writes and streams changes to replicas, which can serve reads and take over if the primary fails. It improves availability and read throughput. Replicas may lag slightly behind, which is called eventual consistency.',
    example: 'A read-heavy app sending writes to the primary and reporting queries to read replicas.',
    hints: [
      'It improves availability and read scaling.',
      'The same data lives on several servers at once.',
      'Think "copy", but in fancier words.',
    ],
  },
  {
    id: 'indexing',
    word: 'Indexing',
    category: 'Databases',
    difficulty: 'easy',
    fact: "A well-chosen one can turn a 10-second query into a 1-millisecond query.",
    definition: 'Building an extra data structure that lets a database find rows without scanning the whole table.',
    explanation:
      'Most databases use B-trees so a lookup takes logarithmic time instead of reading every row. Queries get faster, but writes get a bit slower because the structure must be updated too.',
    example: 'Adding one on users.email so login lookups stay instant with millions of users.',
    code: {
      language: 'sql',
      snippet: `CREATE INDEX idx_users_email
  ON users (email);`,
    },
    hints: [
      'It speeds up database reads.',
      'Usually implemented with a B-tree.',
      'A book has one at the back.',
    ],
  },
  {
    id: 'serialization',
    word: 'Serialization',
    category: 'Backend Development',
    difficulty: 'medium',
    fact: "Protocol Buffers, a binary format for it, was created at Google in 2001.",
    definition: 'Converting an in-memory object into a format that can be stored or sent, such as JSON or bytes.',
    explanation:
      'Objects in memory contain references and types that cannot travel over a network directly. This process flattens them into a string or byte stream; the reverse rebuilds the object. Formats include JSON, XML, Protocol Buffers and MessagePack.',
    example: 'An API turning a User object into JSON before sending it in an HTTP response.',
    code: {
      language: 'js',
      snippet: `const text = JSON.stringify({ id: 1, name: 'Ada' });
const user = JSON.parse(text); // the reverse`,
    },
    hints: [
      'It is about turning data into a transportable form.',
      'JSON.stringify does a form of it.',
      'Its opposite starts with "de-".',
    ],
  },
  {
    id: 'websocket',
    word: 'WebSocket',
    category: 'Networking',
    difficulty: 'easy',
    fact: "Standardized as RFC 6455 in 2011; Discord and Slack depend on it for live messages.",
    definition: 'A protocol that keeps one TCP connection open for two-way, real-time messages between browser and server.',
    explanation:
      'It starts as an HTTP request that is "upgraded". After that, either side can push messages at any time without new requests, which removes the overhead of polling.',
    example: 'Chat apps, live sports scores and multiplayer games.',
    code: {
      language: 'js',
      snippet: `const ws = new WebSocket('wss://example.com/chat');
ws.onmessage = (e) => console.log(e.data);
ws.send('hello');`,
    },
    hints: [
      'It is used for real-time communication.',
      'It starts as HTTP, then upgrades to a persistent full-duplex connection.',
      'Its URLs start with ws:// or wss://.',
    ],
  },
  {
    id: 'cors',
    word: 'CORS',
    category: 'Networking',
    difficulty: 'medium',
    fact: "Added to browsers around 2009 to loosen the strict same-origin policy safely.",
    definition: 'A browser mechanism that lets a server say which other origins may read its responses.',
    explanation:
      'Browsers block scripts from reading responses from a different origin by default (the same-origin policy). The server can relax this with headers such as Access-Control-Allow-Origin. For some requests the browser first sends an OPTIONS "preflight".',
    example: 'A React app on localhost:5173 calling an API on localhost:3000 needs the API to allow that origin.',
    code: {
      language: 'http',
      snippet: `Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST`,
    },
    hints: [
      'It is a browser security mechanism, and a four-letter acronym.',
      'It decides whether a page may read responses from another origin.',
      'Its errors often show up in the console when frontend and API live on different ports.',
    ],
  },
  {
    id: 'virtual-dom',
    word: 'Virtual DOM',
    category: 'React',
    difficulty: 'easy',
    fact: "React popularized it in 2013; Svelte and SolidJS later proved you can skip it.",
    definition: 'A lightweight in-memory copy of the UI tree that libraries compare to decide what to change in the real page.',
    explanation:
      'On each update a new tree is built in memory and compared with the previous one. Only the differences are applied to the real DOM, which is slow to touch. It lets you write UI declaratively without manually updating elements.',
    example: 'React re-renders a list in memory and only inserts the one new <li> into the page.',
    hints: [
      'A React-associated concept about rendering.',
      'An in-memory representation of the page that gets diffed.',
      'Two words: one means "not physically real", the other is the page tree.',
    ],
  },
  {
    id: 'dependency-injection',
    word: 'Dependency Injection',
    category: 'Software Architecture',
    difficulty: 'hard',
    fact: "Martin Fowler gave this pattern its current name in a 2004 article.",
    definition: 'A design pattern where an object receives the things it needs from outside instead of creating them itself.',
    explanation:
      'Instead of a class creating its own database client, the client is passed in through the constructor or a container. This decouples code, makes swapping implementations easy and makes testing simple, because you can pass in mocks.',
    example: 'Angular gives a component its HttpClient automatically just by listing it in the constructor.',
    code: {
      language: 'ts',
      snippet: `class UserService {
  constructor(private db: Database) {} // given, not created
}

const service = new UserService(new FakeDb()); // easy to test`,
    },
    hints: [
      'A design pattern that Angular is built around.',
      'Objects receive what they need instead of creating it.',
      'Two words: the first is what you "depend" on, the second is what a nurse does with a needle.',
    ],
  },
  {
    id: 'event-loop',
    word: 'Event Loop',
    category: 'JavaScript',
    difficulty: 'medium',
    fact: "Philip Roberts' talk \"What the heck is it anyway?\" (JSConf EU 2014) has millions of views.",
    definition: 'The mechanism that lets single-threaded JavaScript run asynchronous code by processing queued tasks one at a time.',
    explanation:
      'When the call stack is empty, it takes the next task from the queues and runs it. Microtasks (promise callbacks) run before the next macrotask (setTimeout, I/O). This is why a long synchronous loop freezes the page: nothing else can run.',
    example: 'Why setTimeout(fn, 0) runs after a resolved promise\'s .then callback.',
    code: {
      language: 'js',
      snippet: `setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// sync → promise → timeout`,
    },
    hints: [
      'It explains how async code runs in a single thread.',
      'It moves tasks from queues onto the call stack when it is empty.',
      'Two words: something that happens, and a structure that repeats forever.',
    ],
  },
  {
    id: 'promise',
    word: 'Promise',
    category: 'JavaScript',
    difficulty: 'easy',
    fact: "Became a built-in JavaScript object in ES2015, after years of libraries like Q and Bluebird.",
    definition: 'An object representing a value that will be available in the future, or an error if the operation fails.',
    explanation:
      'It starts pending, then becomes either fulfilled or rejected, exactly once. You attach handlers with .then and .catch, or wait for it with await. It replaced deeply nested callbacks with chainable, readable async code.',
    example: 'fetch() returns one that resolves to the HTTP response.',
    code: {
      language: 'js',
      snippet: `const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

await wait(500);`,
    },
    hints: [
      'It is how JavaScript represents async results.',
      'It is pending, then fulfilled or rejected.',
      'Also what you make when you swear to do something later.',
    ],
  },
  {
    id: 'generics',
    word: 'Generics',
    category: 'TypeScript',
    difficulty: 'medium',
    fact: "Java added them in 2004, C# in 2005, and Go finally in 2022.",
    definition: 'Type parameters that let a function, class or type work with many types while keeping type safety.',
    explanation:
      'Instead of using any, you write a placeholder like <T> and the compiler fills it in from usage. The return type then stays linked to the input type, so you keep autocomplete and error checking.',
    example: 'Array<T>, Promise<T> and React\'s useState<T> are all built this way.',
    code: {
      language: 'ts',
      snippet: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]); // n: number | undefined`,
    },
    hints: [
      'A type system feature.',
      'Usually written with angle brackets like <T>.',
      'The opposite of "brand-name" products at the supermarket.',
    ],
  },
  {
    id: 'type-guard',
    word: 'Type Guard',
    category: 'TypeScript',
    difficulty: 'hard',
    fact: "The compiler's control-flow analysis uses these to narrow unions without any casting.",
    definition: 'A runtime check that tells the TypeScript compiler to narrow a value to a more specific type.',
    explanation:
      'Checks like typeof, instanceof or "key in obj" narrow types inside an if block. You can also write your own function that returns "value is Type", which the compiler trusts.',
    example: 'Checking if an API response is an error object before reading its message field.',
    code: {
      language: 'ts',
      snippet: `function isString(v: unknown): v is string {
  return typeof v === 'string';
}

if (isString(input)) input.toUpperCase();`,
    },
    hints: [
      'It helps the compiler narrow a union to something more specific.',
      'A custom one has a return annotation like "value is string".',
      'Two words: the first is the kind of thing being checked, the second is someone protecting a gate.',
    ],
  },
  {
    id: 'reconciliation',
    word: 'Reconciliation',
    category: 'React',
    difficulty: 'hard',
    fact: "React Fiber, released in 2017, was a complete rewrite of this algorithm.",
    definition: 'React\'s process of comparing the new element tree with the previous one to work out the minimal DOM updates.',
    explanation:
      'React uses heuristics: elements of different types produce entirely new subtrees, and the key prop identifies list items across renders. That is why stable keys matter; using an array index can make React reuse the wrong component state.',
    example: 'Reordering a todo list with proper keys moves the DOM nodes instead of recreating them.',
    hints: [
      'It is the diffing algorithm inside React.',
      'The key prop exists to help this process.',
      'In everyday language it means making up after a fight, or matching up accounts.',
    ],
  },
  {
    id: 'observable',
    word: 'Observable',
    category: 'Angular',
    difficulty: 'medium',
    fact: "RxJS, which provides it, is downloaded more than 40 million times a week.",
    definition: 'A stream that can deliver many values over time to whoever subscribes to it.',
    explanation:
      'Unlike a promise, which resolves once, it can emit zero, one or many values, and it is lazy: nothing happens until something subscribes. RxJS provides operators like map, filter and switchMap to compose streams. Angular\'s HttpClient returns them.',
    example: 'An Angular search box piping keystrokes through debounceTime and switchMap to an API.',
    code: {
      language: 'ts',
      snippet: `this.http.get<User[]>('/api/users')
  .pipe(map(users => users.filter(u => u.active)))
  .subscribe(users => this.users = users);`,
    },
    hints: [
      'A core RxJS type used heavily in Angular.',
      'It emits many values over time, and nothing happens until you subscribe.',
      'The adjective for something you can watch.',
    ],
  },
  {
    id: 'rebase',
    word: 'Rebase',
    category: 'Git & Version Control',
    difficulty: 'medium',
    fact: "Its \"golden rule\": never do it on a public branch that others have pulled.",
    definition: 'A Git operation that replays your commits on top of another branch, rewriting their history.',
    explanation:
      'Instead of creating a merge commit, your commits are reapplied one by one onto the new base, which gives a straight, linear history. Because it creates new commit hashes, you should not do it on branches others have already pulled.',
    example: 'Updating a feature branch with the latest main before opening a pull request.',
    code: {
      language: 'bash',
      snippet: `git fetch origin
git rebase origin/main
# resolve conflicts, then
git rebase --continue`,
    },
    hints: [
      'A Git command, an alternative to merge.',
      'It moves your commits so they start from a new point.',
      'Its interactive mode lets you squash and reorder commits.',
    ],
  },
  {
    id: 'cherry-pick',
    word: 'Cherry Pick',
    category: 'Git & Version Control',
    difficulty: 'medium',
    fact: "Linux kernel maintainers use it constantly to backport fixes to stable releases.",
    definition: 'A Git command that copies one specific commit from another branch onto the current branch.',
    explanation:
      'It applies the change from a single commit as a new commit, without merging the whole branch. Useful for moving a hotfix into a release branch, but overuse duplicates commits across branches.',
    example: 'Applying a security fix made on main to the v2.1 release branch.',
    code: {
      language: 'bash',
      snippet: `git checkout release/2.1
git cherry-pick a1b2c3d`,
    },
    hints: [
      'A Git command.',
      'It takes a single commit from elsewhere and applies it here.',
      'Named after selecting only the best fruit from a tree.',
    ],
  },
  {
    id: 'container',
    word: 'Container',
    category: 'DevOps',
    difficulty: 'easy',
    fact: "Docker made them mainstream in 2013; Linux cgroups had existed since 2007.",
    definition: 'A lightweight, isolated package containing an application and everything it needs to run.',
    explanation:
      'It shares the host operating system kernel but has its own filesystem, processes and network. That makes it much lighter than a virtual machine and means it runs the same on a laptop, a CI server and production.',
    example: 'Shipping a Node.js API as a Docker image so it runs identically everywhere.',
    code: {
      language: 'dockerfile',
      snippet: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]`,
    },
    hints: [
      'A DevOps building block, popularized by Docker.',
      'Lighter than a virtual machine because it shares the host kernel.',
      'Also the big metal box that ships carry.',
    ],
  },
  {
    id: 'kubernetes',
    word: 'Kubernetes',
    category: 'DevOps',
    difficulty: 'medium',
    fact: "Open-sourced by Google in 2014, based on its internal system called Borg.",
    definition: 'An open-source platform that deploys, scales and manages containerized applications across a cluster.',
    explanation:
      'You declare the desired state (for example, "3 replicas of this image") and it keeps reality matching it: restarting crashed containers, spreading load and rolling out updates. Its building blocks include pods, deployments and services.',
    example: 'Running dozens of microservices that automatically recover when a server dies.',
    code: {
      language: 'yaml',
      snippet: `apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3`,
    },
    hints: [
      'A container orchestration platform, originally from Google.',
      'It uses pods, deployments and services.',
      'Often shortened to K8s; its name is Greek for helmsman.',
    ],
  },
  {
    id: 'idempotency',
    word: 'Idempotency',
    category: 'Backend Development',
    difficulty: 'hard',
    fact: "Stripe's API lets you send a special header so retried payments never charge twice.",
    definition: 'The property that performing an operation several times has the same effect as performing it once.',
    explanation:
      'Networks fail, so clients retry. If a retried request can double-charge a card, you have a problem. APIs make writes safe to retry by accepting a unique key and returning the original result for repeats. In HTTP, GET, PUT and DELETE are defined this way; POST is not.',
    example: 'Stripe accepts an Idempotency-Key header so a retried payment request never charges twice.',
    hints: [
      'An important property for safe retries in APIs.',
      'Doing it twice equals doing it once.',
      'HTTP PUT has this property; POST does not.',
    ],
  },
  {
    id: 'load-balancer',
    word: 'Load Balancer',
    category: 'Cloud Computing',
    difficulty: 'easy',
    fact: "Netflix, Google and AWS route billions of requests a day through these.",
    definition: 'A component that distributes incoming traffic across multiple servers.',
    explanation:
      'It spreads requests using strategies like round robin or least connections, and runs health checks so it stops sending traffic to failed servers. It enables horizontal scaling and high availability.',
    example: 'AWS ALB spreading requests across five web servers, skipping any that fail health checks.',
    hints: [
      'It sits in front of a group of servers.',
      'It spreads incoming traffic so no single server gets swamped.',
      'Two words: the work being done, and something that keeps things even.',
    ],
  },
  {
    id: 'serverless',
    word: 'Serverless',
    category: 'Cloud Computing',
    difficulty: 'easy',
    fact: "AWS Lambda launched this model in 2014 and bills in 1-millisecond increments.",
    definition: 'A cloud model where you deploy functions and the provider runs, scales and bills them per execution.',
    explanation:
      'There are still servers, but you never manage them. Code runs on demand in response to events, scales to zero when idle, and you pay only for execution time. The trade-offs are cold starts and vendor lock-in.',
    example: 'An AWS Lambda function that resizes images whenever a file is uploaded to S3.',
    hints: [
      'A cloud computing model.',
      'You deploy functions and pay only when they run.',
      'Its name is a lie: the machines still exist, you just never see them.',
    ],
  },
  {
    id: 'autoscaling',
    word: 'Autoscaling',
    category: 'Cloud Computing',
    difficulty: 'medium',
    fact: "Retailers rely on it to survive Black Friday traffic spikes.",
    definition: 'Automatically adding or removing compute resources based on current demand.',
    explanation:
      'Rules watch metrics like CPU or request count. When load rises, new instances are launched; when it drops, they are removed to save money. It handles traffic spikes without manual intervention.',
    example: 'An online store growing from 2 to 20 servers during a sale, then shrinking afterward.',
    hints: [
      'A cloud feature for handling changing traffic.',
      'It adds and removes instances based on metrics.',
      'One word made of "automatic" and growing in size.',
    ],
  },
  {
    id: 'encryption',
    word: 'Encryption',
    category: 'Cybersecurity',
    difficulty: 'easy',
    fact: "AES, today's standard for it, was selected by NIST in 2001 after a public competition.",
    definition: 'Transforming data with a key so that only someone with the right key can read it.',
    explanation:
      'Symmetric schemes (like AES) use one shared key; asymmetric schemes (like RSA) use a public key to lock and a private key to unlock. Data is protected both in transit (HTTPS) and at rest (encrypted disks).',
    example: 'HTTPS protecting your password between the browser and the server.',
    hints: [
      'A fundamental security technique.',
      'It turns readable data into ciphertext using a key.',
      'AES and RSA are well-known algorithms for it.',
    ],
  },
  {
    id: 'phishing',
    word: 'Phishing',
    category: 'Cybersecurity',
    difficulty: 'easy',
    fact: "Behind over 80% of reported security incidents, according to many industry surveys.",
    definition: 'A social-engineering attack that tricks people into revealing credentials or running malware.',
    explanation:
      'Attackers impersonate trusted senders, such as a bank or a colleague, using fake emails or lookalike sites. Defenses include training, multi-factor authentication, email filtering and checking the real domain before clicking.',
    example: 'An email claiming "Your account is locked" that links to a fake login page.',
    hints: [
      'An attack that targets people, not machines.',
      'It uses fake emails or sites to steal credentials.',
      'Sounds like a relaxing hobby by the lake, spelled differently.',
    ],
  },
  {
    id: 'sql-injection',
    word: 'SQL Injection',
    category: 'Cybersecurity',
    difficulty: 'medium',
    fact: "Has appeared in the OWASP Top 10 web risks list since the list began in 2003.",
    definition: 'An attack where user input is inserted into a database query and executed as code.',
    explanation:
      'If a query is built by gluing strings together, an attacker can enter text like \' OR 1=1 -- to change its meaning. The fix is parameterized queries, which keep data and code separate.',
    example: 'A login form that lets anyone in by typing a crafted string as the username.',
    code: {
      language: 'js',
      snippet: `// vulnerable
db.query("SELECT * FROM users WHERE name = '" + name + "'");

// safe
db.query('SELECT * FROM users WHERE name = $1', [name]);`,
    },
    hints: [
      'A classic web vulnerability from the OWASP Top 10.',
      'Malicious input changes the meaning of a database query.',
      'Prevented with parameterized queries. The first word is a query language.',
    ],
  },
  {
    id: 'hashing',
    word: 'Hashing',
    category: 'Cybersecurity',
    difficulty: 'medium',
    fact: "Bitcoin mining is essentially doing this with SHA-256 trillions of times per second.",
    definition: 'Turning any input into a fixed-size value with a one-way function.',
    explanation:
      'The same input always gives the same output, but you cannot reverse it. Passwords are stored this way (with salt and slow algorithms like bcrypt or Argon2) so a database leak does not expose them. It is also used for checksums and hash tables.',
    example: 'Storing bcrypt("hunter2") instead of the password itself.',
    hints: [
      'A one-way transformation.',
      'SHA-256 and bcrypt are examples.',
      'Also a name for chopped potatoes fried for breakfast.',
    ],
  },
  {
    id: 'neural-network',
    word: 'Neural Network',
    category: 'Artificial Intelligence',
    difficulty: 'easy',
    fact: "The perceptron, an early version, was built by Frank Rosenblatt in 1958.",
    definition: 'A model made of layers of connected nodes that learns patterns by adjusting the weights between them.',
    explanation:
      'Each node computes a weighted sum of its inputs and passes it through an activation function. During training, backpropagation adjusts the weights to reduce the error. Deep versions with many layers power image recognition and language models.',
    example: 'Recognizing handwritten digits in the classic MNIST dataset.',
    hints: [
      'The core of deep learning.',
      'Layers of nodes with weights adjusted by backpropagation.',
      'Two words, inspired by the cells in your brain.',
    ],
  },
  {
    id: 'overfitting',
    word: 'Overfitting',
    category: 'Artificial Intelligence',
    difficulty: 'medium',
    fact: "Kaggle competitions use a hidden test set to punish models that suffer from it.",
    definition: 'When a model learns its training data too closely, including noise, and performs poorly on new data.',
    explanation:
      'The model memorizes instead of generalizing: training accuracy is high but validation accuracy is low. Remedies include more data, regularization, dropout, simpler models and early stopping.',
    example: 'A model scoring 99% on training images but 60% on images it has never seen.',
    hints: [
      'A common problem when training machine learning models.',
      'Great on training data, bad on new data.',
      'Its opposite is under-something.',
    ],
  },
  {
    id: 'embedding',
    word: 'Embedding',
    category: 'Artificial Intelligence',
    difficulty: 'hard',
    fact: "Word2Vec (2013) showed that king − man + woman ≈ queen using these.",
    definition: 'A list of numbers (a vector) that represents the meaning of a word, image or item.',
    explanation:
      'Similar things end up close together in vector space, so you can measure meaning with distance. They power semantic search, recommendations and retrieval-augmented generation (RAG) with vector databases.',
    example: 'Searching docs by meaning: "reset password" finds an article titled "Recover account access".',
    hints: [
      'A representation used across modern AI.',
      'It is a vector where similar meanings are close together.',
      'Vector databases store these for semantic search.',
    ],
  },
  {
    id: 'binary-search',
    word: 'Binary Search',
    category: 'Computer Science',
    difficulty: 'easy',
    fact: "Jon Bentley found that about 90% of professional programmers wrote it with a bug.",
    definition: 'An algorithm that finds an item in a sorted list by repeatedly halving the search range.',
    explanation:
      'Compare the target with the middle element, then throw away the half that cannot contain it. It runs in O(log n): about 20 steps for a million items. The catch is that the data must be sorted.',
    example: 'git bisect uses the same idea to find the commit that introduced a bug.',
    code: {
      language: 'js',
      snippet: `function search(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    arr[mid] < target ? (lo = mid + 1) : (hi = mid - 1);
  }
  return -1;
}`,
    },
    hints: [
      'A classic algorithm with O(log n) time.',
      'It only works on sorted data.',
      'Two words: "two-valued", and looking for something.',
    ],
  },
  {
    id: 'microservices',
    word: 'Microservices',
    category: 'Software Architecture',
    difficulty: 'medium',
    fact: "Netflix and Amazon run thousands of them; the term took off around 2014.",
    definition: 'An architecture where an application is split into small, independently deployable services.',
    explanation:
      'Each service owns one business capability and its own data, and communicates via APIs or messages. Teams can deploy and scale services independently. The cost is distributed-systems complexity: network failures, tracing and data consistency.',
    example: 'An e-commerce platform with separate services for catalog, cart, payments and shipping.',
    hints: [
      'An architectural style, the opposite of a monolith.',
      'Small services that are deployed independently.',
      'Its prefix means "very small".',
    ],
  },
  {
    id: 'singleton',
    word: 'Singleton',
    category: 'Software Architecture',
    difficulty: 'easy',
    fact: "One of the 23 patterns in the 1994 \"Gang of Four\" design patterns book.",
    definition: 'A design pattern that ensures a class has only one instance and provides global access to it.',
    explanation:
      'Useful for shared resources such as configuration or a logger. It is often criticized because it is global state in disguise, which makes testing harder. Dependency injection containers often manage single instances instead.',
    example: 'A single database connection pool shared by the whole app.',
    code: {
      language: 'ts',
      snippet: `class Config {
  private static instance?: Config;
  static get() {
    return (this.instance ??= new Config());
  }
  private constructor() {}
}`,
    },
    hints: [
      'A Gang of Four design pattern.',
      'Only one instance can ever exist.',
      'In cards, it is a hand with just one card of a suit.',
    ],
  },
  {
    id: 'latency',
    word: 'Latency',
    category: 'Networking',
    difficulty: 'easy',
    fact: "Amazon found that every extra 100 ms of it cost them about 1% in sales.",
    definition: 'The time delay between a request being sent and the response starting to arrive.',
    explanation:
      'It is measured in milliseconds and limited by physics (distance), routing and processing time. It is different from bandwidth, which is how much data can flow per second. CDNs and edge servers reduce it by moving content closer to users.',
    example: 'A user in India getting slow responses from a server in the US until a CDN is added.',
    hints: [
      'A key network performance metric.',
      'Measured in milliseconds; ping shows it.',
      'Not the same as bandwidth.',
    ],
  },
  {
    id: 'dns',
    word: 'DNS',
    category: 'Networking',
    difficulty: 'easy',
    fact: "Created in 1983 by Paul Mockapetris to replace a single shared hosts file.",
    definition: 'The system that translates human-readable domain names into IP addresses.',
    explanation:
      'When you type a domain, a resolver asks root, top-level-domain and authoritative servers in turn, then caches the answer for its TTL. Record types include A (IPv4), AAAA (IPv6), CNAME (alias) and MX (mail).',
    example: 'Your browser turning github.com into 140.82.x.x before connecting.',
    hints: [
      'The phonebook of the internet. A three-letter acronym.',
      'It maps domain names to IP addresses.',
      '"It\'s always ___" is a famous sysadmin joke.',
    ],
  },
  {
    id: 'context-switch',
    word: 'Context Switch',
    category: 'Operating Systems',
    difficulty: 'hard',
    fact: "A modern CPU can do one in a few microseconds, thousands of times per second.",
    definition: 'The CPU saving the state of one thread or process and loading another\'s so it can run.',
    explanation:
      'The operating system scheduler does this many times per second to make many programs appear to run at once. Each one has a cost: saving registers, swapping memory mappings and cold caches. Too many of them hurts performance.',
    example: 'Hundreds of threads fighting for 4 CPU cores spending more time swapping than working.',
    hints: [
      'Something the OS scheduler does constantly.',
      'It saves one thread\'s registers and loads another\'s.',
      'Developers also use it for the cost of jumping between tasks.',
    ],
  },
  {
    id: 'normalization',
    word: 'Normalization',
    category: 'Databases',
    difficulty: 'medium',
    fact: "Edgar F. Codd defined its first normal forms in 1970-71 at IBM.",
    definition: 'Organizing relational tables to reduce data duplication and avoid update anomalies.',
    explanation:
      'Data is split into related tables so each fact is stored once, following normal forms (1NF, 2NF, 3NF). The opposite, adding duplication on purpose, is sometimes done to speed up reads.',
    example: 'Storing a customer\'s address once in a customers table instead of on every order row.',
    hints: [
      'A relational database design process.',
      'It follows rules like 1NF, 2NF and 3NF.',
      'It removes duplication by splitting tables.',
    ],
  },
  {
    id: 'transaction',
    word: 'Transaction',
    category: 'Databases',
    difficulty: 'medium',
    fact: "The ACID acronym describing it was coined in 1983 by Härder and Reuter.",
    definition: 'A group of database operations that either all succeed together or all fail together.',
    explanation:
      'They follow ACID: Atomicity, Consistency, Isolation and Durability. If anything fails before COMMIT, a ROLLBACK undoes every change, so the data is never left half-updated.',
    example: 'A bank transfer that debits one account and credits another, never just one of them.',
    code: {
      language: 'sql',
      snippet: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
    },
    hints: [
      'It guarantees all-or-nothing database changes.',
      'Described by the acronym ACID.',
      'Starts with BEGIN, ends with COMMIT or ROLLBACK.',
    ],
  },
  {
    id: 'currying',
    word: 'Currying',
    category: 'Programming Concepts',
    difficulty: 'hard',
    fact: "Named after logician Haskell Curry, who also gave his first name to a language.",
    definition: 'Transforming a function that takes several arguments into a chain of functions that each take one.',
    explanation:
      'f(a, b, c) becomes f(a)(b)(c). This makes partial application natural: you can fix the first arguments and reuse the resulting function. It comes from functional programming and is named after the logician Haskell Curry.',
    example: 'Creating a reusable logger: const errorLog = log("error"); errorLog("Disk full").',
    code: {
      language: 'js',
      snippet: `const add = (a) => (b) => a + b;
const addTen = add(10);
addTen(5); // 15`,
    },
    hints: [
      'A functional programming technique.',
      'It turns f(a, b) into f(a)(b).',
      'Named after a logician, and sounds like a spicy dish.',
    ],
  },
  {
    id: 'immutability',
    word: 'Immutability',
    category: 'Programming Concepts',
    difficulty: 'medium',
    fact: "Redux, Elm and Clojure are all built around this principle.",
    definition: 'The practice of never changing data after it is created; updates produce new copies instead.',
    explanation:
      'Because data never changes in place, it is easy to track what changed (just compare references), share data safely between threads and implement undo. React and Redux rely on it to detect state changes.',
    example: 'Updating React state with setItems([...items, newItem]) instead of items.push(newItem).',
    code: {
      language: 'js',
      snippet: `const user = { name: 'Ada', age: 36 };
const older = { ...user, age: 37 }; // new object
user === older; // false`,
    },
    hints: [
      'A principle of functional programming and React state.',
      'Data is never modified in place.',
      'The quality of being unable to change.',
    ],
  },
  {
    id: 'tree-shaking',
    word: 'Tree Shaking',
    category: 'JavaScript',
    difficulty: 'hard',
    fact: "Rollup popularized the term in 2015; the idea comes from Lisp dead-code elimination.",
    definition: 'A build step that removes unused exports from the final JavaScript bundle.',
    explanation:
      'Bundlers like Rollup, Vite and webpack analyze static ES module imports to see which exports are actually used, then drop the rest. It only works well with ES modules and code without side effects.',
    example: 'Importing only debounce from lodash-es and shipping just that function instead of the whole library.',
    hints: [
      'A bundler optimization.',
      'It removes dead code that is never imported.',
      'Two words: a plant, and what you do to it to make the dead leaves fall.',
    ],
  },
  {
    id: 'merge-conflict',
    word: 'Merge Conflict',
    category: 'Git & Version Control',
    difficulty: 'easy',
    fact: "Git marks them with seven < characters, seven = characters and seven > characters.",
    definition: 'When Git cannot combine two branches automatically because both changed the same lines.',
    explanation:
      'Git marks the conflicting area with <<<<<<<, ======= and >>>>>>> markers. You choose or combine the changes, remove the markers, stage the file and continue. Small, frequent merges keep them rare.',
    example: 'Two developers editing the same function on different branches.',
    hints: [
      'Every developer using Git has met one.',
      'It shows <<<<<<< and >>>>>>> markers in your file.',
      'Two words: combining branches, and a disagreement.',
    ],
  },
  {
    id: 'prototype',
    word: 'Prototype',
    category: 'JavaScript',
    difficulty: 'hard',
    fact: "Brendan Eich borrowed this inheritance model from the language Self when creating JavaScript.",
    definition: 'The object another object inherits properties and methods from in JavaScript.',
    explanation:
      'When you read a property that an object does not have, JavaScript looks it up along a chain of linked objects until it finds it or reaches null. The class keyword is syntactic sugar over this mechanism.',
    example: 'Every array can call .map() because it is defined once on Array\'s shared object, not on each array.',
    code: {
      language: 'js',
      snippet: `const animal = { speak() { return 'sound'; } };
const dog = Object.create(animal);
dog.speak(); // found up the chain`,
    },
    hints: [
      'The basis of inheritance in JavaScript.',
      'Property lookups walk up a chain of these.',
      'Also the word for an early model of a product.',
    ],
  },
  {
    id: 'lazy-loading',
    word: 'Lazy Loading',
    category: 'React',
    difficulty: 'medium',
    fact: "Browsers support it natively for images with a single HTML attribute since 2019.",
    definition: 'Delaying the loading of code or resources until they are actually needed.',
    explanation:
      'Instead of shipping everything up front, parts of the app are split into separate chunks and fetched on demand. This shrinks the initial bundle and speeds up the first load. In React it is done with React.lazy and Suspense.',
    example: 'Loading the heavy admin dashboard code only when an admin opens that route.',
    code: {
      language: 'tsx',
      snippet: `const Admin = React.lazy(() => import('./Admin'));

<Suspense fallback={<Spinner />}>
  <Admin />
</Suspense>`,
    },
    hints: [
      'A performance technique.',
      'Things are fetched only when they are needed.',
      'Two words: the first describes someone who avoids work.',
    ],
  },
  {
    id: 'firewall',
    word: 'Firewall',
    category: 'Cybersecurity',
    difficulty: 'easy',
    fact: "The first commercial one, DEC SEAL, shipped in 1992.",
    definition: 'A system that filters network traffic based on security rules.',
    explanation:
      'It sits between networks and allows or blocks traffic by IP, port, protocol or even application content. Cloud security groups and web application firewalls (WAFs) are modern forms.',
    example: 'Allowing only ports 80 and 443 to reach a public web server.',
    hints: [
      'A network security barrier.',
      'It allows or blocks traffic based on rules.',
      'In buildings, it stops flames from spreading between rooms.',
    ],
  },
  {
    id: 'pipeline',
    word: 'Pipeline',
    category: 'DevOps',
    difficulty: 'easy',
    fact: "GitHub Actions runs millions of these every day for open-source projects.",
    definition: 'An automated sequence of steps that builds, tests and deploys code when changes are pushed.',
    explanation:
      'In CI/CD, each push triggers stages such as install, lint, test, build and deploy. If any stage fails, the process stops, so broken code does not reach production.',
    example: 'A GitHub Actions workflow that runs tests on every pull request.',
    code: {
      language: 'yaml',
      snippet: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test`,
    },
    hints: [
      'A CI/CD concept.',
      'Stages like build, test and deploy run in sequence.',
      'Also what carries oil across long distances.',
    ],
  },
];

export const WORDS: WordEntry[] = [...CORE_WORDS, ...MORE_WORDS, ...LEVEL_WORDS];

export const WORD_MAP: Record<string, WordEntry> = Object.fromEntries(WORDS.map((w) => [w.id, w]));

export function getWord(id: string): WordEntry | undefined {
  return WORD_MAP[id];
}
