import type { WordEntry } from '../game/types';

/** Language- and framework-specific words: Node.js, Java, C#, Python, Angular, and language names. */
export const MORE_WORDS: WordEntry[] = [
  /* ---------- Node.js ---------- */
  {
    id: 'event-emitter',
    word: 'Event Emitter',
    category: 'Node.js',
    difficulty: 'medium',
    fact: 'Node\'s HTTP servers, streams and sockets all inherit from this one core class.',
    definition: 'A Node.js object that lets code register listeners for named events and trigger them later.',
    explanation:
      'You call .on(name, handler) to subscribe and .emit(name, data) to notify every subscriber. It is the publish/subscribe pattern built into Node, and the reason so much of the Node API is event-driven.',
    example: 'An HTTP server emitting a "request" event for every incoming request.',
    code: {
      language: 'js',
      snippet: `const { EventEmitter } = require('events');
const bus = new EventEmitter();

bus.on('order', (id) => console.log('new order', id));
bus.emit('order', 42);`,
    },
    hints: [
      'A core Node.js class behind servers, sockets and streams.',
      'You subscribe with .on() and notify with .emit().',
      'Two words: something that happens, and something that sends it out.',
    ],
  },
  {
    id: 'stream',
    word: 'Stream',
    category: 'Node.js',
    difficulty: 'medium',
    fact: 'Lets Node copy a 10 GB file while using only a few megabytes of memory.',
    definition: 'An interface for processing data piece by piece as it arrives, instead of loading it all into memory.',
    explanation:
      'Data flows in chunks through readable, writable, duplex or transform objects. You can pipe them together, and backpressure slows the source down when the destination cannot keep up.',
    example: 'Serving a large video file to a browser without reading the whole file first.',
    code: {
      language: 'js',
      snippet: `const fs = require('fs');
fs.createReadStream('big.log')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('big.log.gz'));`,
    },
    hints: [
      'A core Node.js concept for handling data in chunks.',
      'Comes in readable, writable, duplex and transform flavors, joined with .pipe().',
      'In nature, it is a small flowing river.',
    ],
  },
  {
    id: 'buffer',
    word: 'Buffer',
    category: 'Node.js',
    difficulty: 'easy',
    fact: 'Node added this class because early JavaScript had no way to handle raw binary data.',
    definition: 'A fixed-size chunk of raw binary memory used to handle bytes in Node.js.',
    explanation:
      'Files, network packets and images are bytes, not text. This class stores those bytes outside the JavaScript heap and lets you convert them to and from strings with encodings like utf8 or base64.',
    example: 'Reading an uploaded image and converting it to a base64 string for an API.',
    code: {
      language: 'js',
      snippet: `const b = Buffer.from('hi', 'utf8');
console.log(b);              // <... 68 69>
console.log(b.toString('base64')); // aGk=`,
    },
    hints: [
      'A Node.js class for raw bytes.',
      'You convert it to text with .toString(\'utf8\').',
      'Also the word for a waiting area for data, as in "video is ...ing".',
    ],
  },
  {
    id: 'libuv',
    word: 'Libuv',
    category: 'Node.js',
    difficulty: 'hard',
    fact: 'This C library gives Node its thread pool of 4 workers by default.',
    definition: 'The C library that gives Node.js its event loop and asynchronous I/O on every operating system.',
    explanation:
      'JavaScript in Node runs on one thread, but file system work, DNS lookups and compression are handed to this library. It uses OS features like epoll, kqueue and IOCP, plus a small thread pool, then reports results back to the event loop.',
    example: 'fs.readFile finishing on a background thread while your JavaScript keeps running.',
    hints: [
      'A C library under the hood of Node.js.',
      'It provides the event loop and a thread pool for async I/O.',
      'Starts with "lib", the usual prefix for a library.',
    ],
  },
  {
    id: 'commonjs',
    word: 'CommonJS',
    category: 'Node.js',
    difficulty: 'medium',
    fact: 'Node used this module system exclusively for its first 6 years.',
    definition: 'The original Node.js module system, using require() to import and module.exports to export.',
    explanation:
      'Modules load synchronously at runtime, which suits servers reading from disk. Modern JavaScript uses ES modules (import/export) instead, and Node supports both, which is why you see .cjs and .mjs file extensions.',
    example: 'const express = require(\'express\') at the top of an older Node project.',
    hints: [
      'A JavaScript module format.',
      'It uses require() and module.exports.',
      'Its file extension is .cjs; the name ends with the language it is for.',
    ],
  },

  /* ---------- Java ---------- */
  {
    id: 'jvm',
    word: 'JVM',
    category: 'Java',
    difficulty: 'easy',
    fact: 'Runs not only Java but also Kotlin, Scala, Groovy and Clojure.',
    definition: 'The virtual machine that runs compiled Java bytecode on any operating system.',
    explanation:
      'Java code compiles to platform-neutral bytecode. This program loads that bytecode, verifies it, and runs it, using a just-in-time compiler to turn hot code into fast native machine code. It also manages memory with garbage collection.',
    example: 'The same .jar file running unchanged on Windows, Linux and macOS servers.',
    hints: [
      'A three-letter acronym at the heart of the Java platform.',
      'It is the reason for the slogan "write once, run anywhere".',
      'The last two letters stand for "Virtual Machine".',
    ],
  },
  {
    id: 'bytecode',
    word: 'Bytecode',
    category: 'Java',
    difficulty: 'medium',
    fact: 'Every compiled Java class file starts with the magic number 0xCAFEBABE.',
    definition: 'A compact, platform-independent instruction set that a virtual machine executes.',
    explanation:
      'javac does not produce machine code. It produces instructions for a virtual machine, stored in .class files. This middle layer is what makes Java portable, and Python and C# use the same idea.',
    example: 'Running javap -c MyClass.class to see the instructions the compiler produced.',
    hints: [
      'What the Java compiler outputs.',
      'Stored in .class files and executed by a virtual machine.',
      'One word: a unit of 8 bits, plus another name for source.',
    ],
  },
  {
    id: 'checked-exception',
    word: 'Checked Exception',
    category: 'Java',
    difficulty: 'hard',
    fact: 'Almost no language after Java copied this feature, including Kotlin and C#.',
    definition: 'A Java exception that the compiler forces you to either catch or declare with throws.',
    explanation:
      'Exceptions like IOException must be handled explicitly or the code will not compile. The goal is to make recoverable failures visible in method signatures. Critics say it leads to boilerplate and empty catch blocks.',
    example: 'Being forced to wrap Files.readString() in try/catch because it throws IOException.',
    code: {
      language: 'java',
      snippet: `String read(Path p) throws IOException {
  return Files.readString(p);
}`,
    },
    hints: [
      'A Java error-handling concept enforced by the compiler.',
      'You must catch it or declare it with "throws".',
      'Two words: "verified", and an error you throw.',
    ],
  },
  {
    id: 'spring-boot',
    word: 'Spring Boot',
    category: 'Java',
    difficulty: 'easy',
    fact: 'The most popular Java web framework; its starter site has generated millions of projects.',
    definition: 'A Java framework that sets up production-ready Spring applications with almost no configuration.',
    explanation:
      'It auto-configures common pieces (web server, JSON, database) based on what is on the classpath and embeds a server like Tomcat, so an app is a single runnable jar.',
    example: 'A REST API built with @RestController and started with java -jar app.jar.',
    code: {
      language: 'java',
      snippet: `@SpringBootApplication
public class App {
  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }
}`,
    },
    hints: [
      'A hugely popular Java framework.',
      'It auto-configures everything and embeds the web server.',
      'Two words: a season, and what you start a computer with.',
    ],
  },
  {
    id: 'annotation',
    word: 'Annotation',
    category: 'Java',
    difficulty: 'medium',
    fact: 'Added in Java 5 (2004); frameworks like Spring and JUnit are driven by them.',
    definition: 'Metadata attached to code with an @ symbol that tools and frameworks can read.',
    explanation:
      'They do not change what code does by themselves. The compiler, build tools or a framework reads them, at compile time or at runtime through reflection, and acts on them.',
    example: '@Override, @Test and @Autowired.',
    code: {
      language: 'java',
      snippet: `@Override
public String toString() { return "User"; }`,
    },
    hints: [
      'Java metadata written with an @ sign.',
      'Frameworks read them to wire up behavior.',
      'Also means a note written in the margin of a book.',
    ],
  },

  /* ---------- C# ---------- */
  {
    id: 'linq',
    word: 'LINQ',
    category: 'C#',
    difficulty: 'medium',
    fact: 'Shipped with C# 3.0 in 2007 and inspired similar libraries in many other languages.',
    definition: 'A C# feature for querying collections, databases and XML with one consistent syntax.',
    explanation:
      'You chain methods like Where, Select and OrderBy, or use SQL-like query syntax. With Entity Framework, the same query is translated into SQL and runs on the database.',
    example: 'users.Where(u => u.Active).OrderBy(u => u.Name).ToList()',
    code: {
      language: 'cs',
      snippet: `var adults = people
  .Where(p => p.Age >= 18)
  .Select(p => p.Name);`,
    },
    hints: [
      'A C# querying feature, written as a four-letter acronym.',
      'It gives you Where, Select and OrderBy on any collection.',
      'Stands for Language-Integrated Query.',
    ],
  },
  {
    id: 'delegate',
    word: 'Delegate',
    category: 'C#',
    difficulty: 'medium',
    fact: 'Every C# event and every lambda you pass around is built on this type.',
    definition: 'A C# type that holds a reference to a method, so methods can be passed around like values.',
    explanation:
      'It is a type-safe function pointer. Func<> and Action<> are built-in generic versions, and events are built on top of them.',
    example: 'Passing a comparison method into a sort routine.',
    code: {
      language: 'cs',
      snippet: `Func<int, int> square = x => x * x;
Console.WriteLine(square(5)); // 25`,
    },
    hints: [
      'A C# type for method references.',
      'Func<> and Action<> are built-in versions of it.',
      'Also a person sent to represent others at a conference.',
    ],
  },
  {
    id: 'extension-method',
    word: 'Extension Method',
    category: 'C#',
    difficulty: 'hard',
    fact: 'All of LINQ is implemented as a large set of these on IEnumerable.',
    definition: 'A static C# method that appears as if it were a new instance method on an existing type.',
    explanation:
      'You write a static method whose first parameter is marked with "this". Then you can call it with dot syntax on that type, even on classes you do not own like string.',
    example: 'Adding a .IsEmail() method to string.',
    code: {
      language: 'cs',
      snippet: `public static class StringX {
  public static bool IsBlank(this string s)
    => string.IsNullOrWhiteSpace(s);
}`,
    },
    hints: [
      'A C# feature for bolting new functions onto types you do not own.',
      'Its first parameter is marked with the "this" keyword.',
      'Two words: making something longer, and a function on a class.',
    ],
  },
  {
    id: 'async-await',
    word: 'Async Await',
    category: 'C#',
    difficulty: 'easy',
    fact: 'C# introduced these keywords in 2012; JavaScript and Python copied them later.',
    definition: 'Keywords that let you write asynchronous code that reads like normal sequential code.',
    explanation:
      'Marking a method with the first keyword lets you use the second one to pause until a Task completes without blocking the thread. The compiler rewrites the method into a state machine behind the scenes.',
    example: 'Calling an HTTP API without freezing a desktop app\'s UI.',
    code: {
      language: 'cs',
      snippet: `public async Task<string> LoadAsync() {
  var json = await http.GetStringAsync(url);
  return json;
}`,
    },
    hints: [
      'A pair of keywords for non-blocking code.',
      'They work with Task in C# and Promise in JavaScript.',
      'One keyword marks the method; the other pauses until a result is ready.',
    ],
  },
  {
    id: 'nullable',
    word: 'Nullable',
    category: 'C#',
    difficulty: 'easy',
    fact: 'Tony Hoare called inventing null his "billion-dollar mistake".',
    definition: 'A type that can hold either a value or null, written with a ? after the type in C#.',
    explanation:
      'int? can be a number or null. Since C# 8, reference types can opt into the same checks, so the compiler warns when you might dereference null.',
    example: 'A database column for an optional birthday mapped to DateTime?.',
    code: {
      language: 'cs',
      snippet: `int? age = null;
Console.WriteLine(age ?? 0); // 0`,
    },
    hints: [
      'A C# type modifier.',
      'Written with a question mark, like int?.',
      'An adjective meaning "can be empty / nothing".',
    ],
  },

  /* ---------- Python ---------- */
  {
    id: 'decorator',
    word: 'Decorator',
    category: 'Python',
    difficulty: 'medium',
    fact: 'Flask and FastAPI define every web route with one of these on top of a function.',
    definition: 'A function that wraps another function to add behavior, applied with the @ syntax in Python.',
    explanation:
      'It takes a function and returns a new function that usually calls the original with extra logic before or after. Common uses are logging, caching, timing and access control.',
    example: '@app.get("/users") in FastAPI, or @functools.lru_cache for caching.',
    code: {
      language: 'py',
      snippet: `def shout(fn):
    def wrapper(*args):
        return fn(*args).upper()
    return wrapper

@shout
def greet(name):
    return f"hi {name}"`,
    },
    hints: [
      'A Python feature applied with @ above a function.',
      'It wraps a function to add behavior without changing its code.',
      'Also a person who designs the inside of a room.',
    ],
  },
  {
    id: 'list-comprehension',
    word: 'List Comprehension',
    category: 'Python',
    difficulty: 'easy',
    fact: 'Python borrowed this syntax from Haskell in 2000 (Python 2.0).',
    definition: 'A concise Python syntax for building a new list from an existing iterable in one line.',
    explanation:
      'It combines a loop, an optional condition and an expression inside square brackets. It is usually faster and more readable than appending in a for loop.',
    example: 'Collecting the squares of all even numbers in a range.',
    code: {
      language: 'py',
      snippet: `squares = [n * n for n in range(10) if n % 2 == 0]
# [0, 4, 16, 36, 64]`,
    },
    hints: [
      'A Python one-liner with square brackets.',
      'It looks like [x * 2 for x in items].',
      'Two words: a collection type, and understanding.',
    ],
  },
  {
    id: 'generator',
    word: 'Generator',
    category: 'Python',
    difficulty: 'medium',
    fact: 'Can describe an infinite sequence while using almost no memory.',
    definition: 'A function that produces values lazily, one at a time, using yield.',
    explanation:
      'Each call to next() runs the function until the next yield, then pauses and keeps its local state. Nothing is computed until it is asked for, which makes it ideal for large or infinite sequences.',
    example: 'Reading a huge log file line by line.',
    code: {
      language: 'py',
      snippet: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

list(countdown(3))  # [3, 2, 1]`,
    },
    hints: [
      'A Python function that pauses and resumes.',
      'It uses the yield keyword.',
      'Also a machine that produces electricity.',
    ],
  },
  {
    id: 'gil',
    word: 'GIL',
    category: 'Python',
    difficulty: 'hard',
    fact: 'Python 3.13 (2024) shipped an experimental build that can run without it.',
    definition: 'A lock in CPython that lets only one thread execute Python bytecode at a time.',
    explanation:
      'It keeps CPython\'s memory management simple and safe, but it means CPU-heavy threads cannot run in parallel. Workarounds are multiprocessing, native extensions that release the lock, or async I/O for waiting tasks.',
    example: 'Why four threads doing heavy math in Python are no faster than one.',
    hints: [
      'A three-letter acronym about Python threads.',
      'Only one thread can run Python code at a time because of it.',
      'Stands for Global Interpreter Lock.',
    ],
  },
  {
    id: 'virtual-environment',
    word: 'Virtual Environment',
    category: 'Python',
    difficulty: 'easy',
    fact: 'Built into Python since 3.3 as the "venv" module.',
    definition: 'An isolated Python folder with its own interpreter and packages for one project.',
    explanation:
      'It stops projects from fighting over package versions. You create one per project, activate it, and pip installs packages only there.',
    example: 'One project needing Django 4 and another needing Django 5 on the same laptop.',
    code: {
      language: 'bash',
      snippet: `python -m venv .venv
source .venv/bin/activate
pip install requests`,
    },
    hints: [
      'A Python tool for isolating dependencies.',
      'You usually create it in a .venv folder.',
      'Two words: "not physically real", and your surroundings.',
    ],
  },

  /* ---------- Angular ---------- */
  {
    id: 'directive',
    word: 'Directive',
    category: 'Angular',
    difficulty: 'medium',
    fact: 'Angular ships built-in ones like ngIf, ngFor and ngClass.',
    definition: 'An Angular class that adds behavior to elements in a template.',
    explanation:
      'Components are actually a special kind with a template. Attribute ones change an element\'s look or behavior; structural ones (with *) add or remove elements.',
    example: 'A custom appHighlight attribute that changes an element\'s background on hover.',
    code: {
      language: 'ts',
      snippet: `@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @HostListener('mouseenter') on() { /* ... */ }
}`,
    },
    hints: [
      'An Angular building block for templates.',
      '*ngIf and *ngFor are structural ones.',
      'In plain English, an official instruction or order.',
    ],
  },
  {
    id: 'change-detection',
    word: 'Change Detection',
    category: 'Angular',
    difficulty: 'hard',
    fact: 'Angular used zone.js for years to trigger it after every async event.',
    definition: 'Angular\'s process of checking component data and updating the DOM when it changes.',
    explanation:
      'After events, timers or HTTP calls, Angular walks the component tree and compares bindings. The OnPush strategy and signals make it skip components whose inputs did not change, which improves performance.',
    example: 'Setting ChangeDetectionStrategy.OnPush on a large table component.',
    hints: [
      'An Angular rendering mechanism.',
      'The OnPush strategy makes it run less often.',
      'Two words: something becoming different, and noticing it.',
    ],
  },
  {
    id: 'signal',
    word: 'Signal',
    category: 'Angular',
    difficulty: 'medium',
    fact: 'Angular added them in version 16 (2023); SolidJS and Preact use the same idea.',
    definition: 'A reactive value wrapper that notifies everything that reads it when it changes.',
    explanation:
      'You read it by calling it, set it with .set() or .update(), and derive values with computed(). The framework knows exactly which parts of the UI depend on it, so it updates only those.',
    example: 'A cart count that updates the header badge automatically.',
    code: {
      language: 'ts',
      snippet: `count = signal(0);
double = computed(() => this.count() * 2);

this.count.update(n => n + 1);`,
    },
    hints: [
      'A reactive primitive in modern Angular.',
      'You read it like a function and derive from it with computed().',
      'Also what a traffic light or a phone antenna gives.',
    ],
  },

  /* ---------- Programming Languages ---------- */
  {
    id: 'java',
    word: 'Java',
    category: 'Programming Languages',
    difficulty: 'easy',
    fact: 'Its installer famously claimed it runs on 3 billion devices.',
    definition: 'A statically typed, object-oriented language that runs on a virtual machine.',
    explanation:
      'Created at Sun Microsystems by James Gosling and released in 1995. Code compiles to bytecode that runs anywhere its virtual machine exists. It dominates enterprise back ends and was the original Android language.',
    example: 'Banking systems, Android apps and big-data tools like Hadoop and Kafka.',
    hints: [
      'A language released by Sun Microsystems in 1995.',
      'Slogan: "write once, run anywhere".',
      'Also an Indonesian island, and slang for coffee.',
    ],
  },
  {
    id: 'python',
    word: 'Python',
    category: 'Programming Languages',
    difficulty: 'easy',
    fact: 'The most used language for AI and data science; named after a comedy group, not a snake.',
    definition: 'A high-level, dynamically typed language known for readable, indentation-based syntax.',
    explanation:
      'Created by Guido van Rossum and released in 1991. Its huge library ecosystem (NumPy, pandas, PyTorch, Django) makes it the default for data science, machine learning, scripting and automation.',
    example: 'Training machine learning models with PyTorch, or automating spreadsheets.',
    hints: [
      'A language created by Guido van Rossum.',
      'Whitespace and indentation define its code blocks.',
      'Shares its name with a large snake.',
    ],
  },
  {
    id: 'rust',
    word: 'Rust',
    category: 'Programming Languages',
    difficulty: 'medium',
    fact: 'Voted the "most admired" language in Stack Overflow surveys for years in a row.',
    definition: 'A systems language that guarantees memory safety without a garbage collector.',
    explanation:
      'Its ownership and borrowing rules are checked at compile time, preventing whole classes of bugs like use-after-free and data races while keeping C-like speed. It is now used in the Linux kernel, browsers and cloud infrastructure.',
    example: 'Parts of Firefox, Discord\'s back end, and Cloudflare\'s proxies.',
    hints: [
      'A systems language started at Mozilla.',
      'Famous for its borrow checker and ownership model.',
      'Also what iron gets when left in the rain.',
    ],
  },
  {
    id: 'kotlin',
    word: 'Kotlin',
    category: 'Programming Languages',
    difficulty: 'medium',
    fact: 'Google made it the preferred language for Android development in 2019.',
    definition: 'A modern, concise language from JetBrains that runs on the JVM and interoperates with Java.',
    explanation:
      'It fixes many Java pain points with null safety, data classes, extension functions and coroutines, while working with existing Java libraries. It can also compile to JavaScript and native code.',
    example: 'Most new Android apps are written in it.',
    hints: [
      'A JVM language made by JetBrains.',
      'The preferred language for Android since 2019.',
      'Named after an island near St. Petersburg, Russia.',
    ],
  },
  {
    id: 'swift',
    word: 'Swift',
    category: 'Programming Languages',
    difficulty: 'easy',
    fact: 'Apple introduced it in 2014 as a replacement for Objective-C.',
    definition: 'Apple\'s modern, safe and fast language for iOS, macOS, watchOS and server apps.',
    explanation:
      'It has optionals for null safety, type inference, value types and modern concurrency with async/await. SwiftUI lets you build Apple interfaces declaratively.',
    example: 'Building an iPhone app with SwiftUI.',
    hints: [
      'A language made by Apple.',
      'The main language for iPhone apps today.',
      'Also a small fast bird, and an adjective for "quick".',
    ],
  },
];
