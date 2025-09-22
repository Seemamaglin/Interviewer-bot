// Mock implementation of LLM service
// In a real implementation, this would connect to an actual LLM API

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock explanations database
const mockExplanations = {
  Python: {
    "What is the difference between a list and a tuple in Python?": "Lists are mutable, meaning you can modify them after creation (add, remove, or change elements). They use square brackets [] for definition. Tuples are immutable, meaning once created, they cannot be changed. They use parentheses () for definition. Tuples are generally faster for accessing elements and can be used as dictionary keys, while lists cannot.",
    "Explain Python decorators.": "Decorators are a way to modify or enhance functions or methods without permanently changing their code. They are implemented using higher-order functions and can be applied using the @ symbol. For example, @staticmethod is a decorator that makes a method static.",
    "What is the purpose of the __init__ method in Python classes?": "The __init__ method is a special method in Python classes that is automatically called when a new instance of the class is created. It initializes the object's attributes and is commonly known as the constructor method.",
    "How does garbage collection work in Python?": "Python uses automatic garbage collection to manage memory. It primarily uses reference counting, where each object keeps track of how many references point to it. When the count reaches zero, the object is automatically deallocated. Python also has a cyclic garbage collector to handle reference cycles.",
    "What are Python's built-in data types?": "Python has several built-in data types including: Numeric (int, float, complex), Sequence (list, tuple, range), Text (str), Mapping (dict), Set (set, frozenset), Boolean (bool), and Binary (bytes, bytearray, memoryview).",
    "Explain the concept of Python's GIL (Global Interpreter Lock).": "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously. This means Python threads cannot run in parallel on multiple CPU cores, but it simplifies memory management and prevents race conditions.",
    "What is the difference between deep copy and shallow copy?": "A shallow copy creates a new object but inserts references to the original elements. A deep copy creates a new object and recursively copies all objects found in the original, creating completely independent clones.",
    "How do you handle exceptions in Python?": "Exceptions in Python are handled using try, except, else, and finally blocks. The try block contains code that might raise an exception, except handles specific exceptions, else runs if no exceptions occur, and finally always executes regardless of exceptions.",
    "Explain the use of *args and **kwargs in Python functions.": "*args allows a function to accept any number of positional arguments as a tuple. **kwargs allows a function to accept any number of keyword arguments as a dictionary. They provide flexibility in function definitions when the exact number of arguments is unknown.",
    "What is a Python virtual environment and why is it useful?": "A virtual environment is an isolated Python environment that allows you to install packages separately from your system's Python installation. It's useful for managing dependencies for different projects without conflicts and maintaining clean project environments."
  },
  SQL: {
    "What is the difference between INNER JOIN and LEFT JOIN?": "INNER JOIN returns only rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right table. If there's no match, the result will contain NULL values for columns from the right table.",
    "Explain the use of indexes in SQL.": "Indexes are special lookup tables that help speed up data retrieval. They work like a book's index, allowing the database to find rows without scanning the entire table. However, indexes slow down data insertion and updates, so they should be used judiciously.",
    "What is a primary key and foreign key?": "A primary key is a column or set of columns that uniquely identifies each row in a table. It must contain unique values and cannot be NULL. A foreign key is a column or set of columns that establishes a link between data in two tables, referencing the primary key of another table.",
    "How would you optimize a slow SQL query?": "Query optimization techniques include: using indexes appropriately, avoiding SELECT *, limiting the result set with WHERE clauses, using EXPLAIN to analyze query execution plans, avoiding functions in WHERE clauses, and considering query rewriting or database normalization.",
    "What is the difference between DELETE and TRUNCATE?": "DELETE removes rows one by one and can be rolled back. It activates triggers and can use WHERE clauses to delete specific rows. TRUNCATE removes all rows by deallocating data pages, is faster, cannot be rolled back in some databases, and resets identity columns.",
    "Explain the ACID properties of database transactions.": "ACID stands for Atomicity (transactions are all-or-nothing), Consistency (transactions bring database from one valid state to another), Isolation (concurrent transactions don't interfere), and Durability (committed transactions survive system failures).",
    "What is normalization and why is it important?": "Normalization is the process of organizing data to minimize redundancy and dependency. It involves dividing large tables into smaller ones and defining relationships between them. It's important for data integrity, storage efficiency, and reducing update anomalies.",
    "How do you prevent SQL injection attacks?": "Prevention methods include using parameterized queries or prepared statements, validating and sanitizing user inputs, using stored procedures, implementing least privilege for database accounts, and escaping special characters in user inputs.",
    "Explain the difference between WHERE and HAVING clauses.": "WHERE filters rows before grouping and aggregation, while HAVING filters groups after aggregation. WHERE cannot be used with aggregate functions, but HAVING can. WHERE is applied first in the query execution order, followed by GROUP BY, then HAVING.",
    "What are window functions in SQL and how are they used?": "Window functions perform calculations across a set of table rows related to the current row without collapsing them into a single output row. They're used for ranking, running totals, moving averages, and other analytical computations with the OVER() clause."
  },
  Networking: {
    "Explain the OSI model and its layers.": "The OSI model has 7 layers: Physical (transmits raw bits), Data Link (node-to-node data transfer), Network (routing and forwarding), Transport (end-to-end communication), Session (establishes, manages, terminates connections), Presentation (data translation and encryption), and Application (network services to applications).",
    "What is the difference between TCP and UDP?": "TCP (Transmission Control Protocol) is connection-oriented, reliable, and ensures data delivery in order. UDP (User Datagram Protocol) is connectionless, faster, but doesn't guarantee delivery or order. TCP is used for web browsing and email, while UDP is used for streaming and gaming.",
    "Describe the process of a DNS lookup.": "DNS lookup involves: 1) Checking browser cache, 2) Checking OS cache, 3) Querying ISP DNS server, 4) If not found, querying root servers, 5) Then TLD servers, 6) Finally authoritative DNS servers, 7) Returning the IP address to the client, 8) Caching the result for future use.",
    "What is a subnet mask and how is it used?": "A subnet mask determines which part of an IP address is the network portion and which is the host portion. It's used to divide IP addresses into subnetworks, helping routers determine if a destination IP is on the local network or needs to be routed externally.",
    "Explain the concept of load balancing.": "Load balancing distributes network or application traffic across multiple servers to prevent overloading. It improves responsiveness, availability, and prevents server downtime. Common algorithms include round-robin, least connections, and IP hash.",
    "What is the difference between HTTP and HTTPS?": "HTTP (Hypertext Transfer Protocol) is unencrypted and insecure. HTTPS (HTTP Secure) uses SSL/TLS encryption to secure data transmission. HTTPS requires certificates, is slower due to encryption overhead, but provides authentication and data integrity.",
    "Explain how a firewall works.": "A firewall monitors and controls incoming and outgoing network traffic based on predetermined security rules. It acts as a barrier between trusted and untrusted networks, filtering traffic by IP addresses, ports, protocols, and packet inspection.",
    "What is the purpose of ARP (Address Resolution Protocol)?": "ARP resolves IP addresses to MAC addresses in a local network. When a device needs to communicate with another on the same network, it uses ARP to find the physical address (MAC) corresponding to the IP address.",
    "Describe the differences between IPv4 and IPv6.": "IPv4 uses 32-bit addresses (4.3 billion addresses) while IPv6 uses 128-bit addresses (340 undecillion addresses). IPv6 has better security, auto-configuration, and eliminates the need for NAT. IPv4 uses dotted decimal notation, IPv6 uses hexadecimal.",
    "What is a CDN (Content Delivery Network) and how does it work?": "A CDN is a distributed network of servers that delivers content based on geographic location. It caches content at edge servers closer to users, reducing latency and bandwidth usage. It also provides DDoS protection and improves website loading times."
  },
  HR: {
    "Tell me about yourself.": "This question is an opportunity to give a concise professional summary. Focus on your relevant experience, skills, and achievements that align with the position. Structure your response with a brief educational background, key professional experiences, and relevant personal interests.",
    "What are your strengths and weaknesses?": "For strengths, mention skills relevant to the job with examples. For weaknesses, discuss genuine areas for improvement and what you're doing to address them. This shows self-awareness and commitment to growth.",
    "Why do you want to work here?": "Research the company's mission, values, and recent achievements. Connect your professional goals with the company's direction. Mention specific projects, culture, or growth opportunities that appeal to you.",
    "Describe a challenging situation you faced at work and how you handled it.": "Use the STAR method (Situation, Task, Action, Result). Describe a specific challenge, your role, actions taken, and the positive outcome. Focus on problem-solving skills and resilience.",
    "Where do you see yourself in 5 years?": "Show ambition aligned with the company's growth. Mention skill development, leadership opportunities, or specialization you're interested in. Demonstrate commitment to long-term growth with the organization.",
    "How do you handle stress and pressure?": "Discuss specific techniques like prioritization, time management, or mindfulness. Give examples of successfully managing pressure in previous roles. Show that you thrive under pressure while maintaining quality work.",
    "Tell me about a time you worked in a team.": "Describe a specific team project, your role, and contributions. Highlight collaboration, communication, and conflict resolution skills. Mention the successful outcome and what you learned from the experience.",
    "What motivates you in your work?": "Discuss intrinsic motivators like problem-solving, learning new skills, or achieving goals. Connect your motivators to the position and company. Mention how you find meaning in your work and drive results.",
    "How do you deal with failure or setbacks?": "Show resilience and learning mindset. Describe a specific setback, what you learned from it, and how you improved. Emphasize that failures are growth opportunities and how they've made you stronger.",
    "Why should we hire you?": "Summarize your unique value proposition. Connect your skills, experience, and achievements to the job requirements. Mention your passion for the role and company. Demonstrate confidence without arrogance."
  }
};

// Mock detailed explanations for concepts
const mockDetailedExplanations = {
  Python: {
    "What is the difference between a list and a tuple in Python?": "Lists and tuples are both sequence data types in Python, but they have key differences:\n\n1. Mutability: Lists are mutable (can be changed), tuples are immutable (cannot be changed)\n2. Syntax: Lists use square brackets [], tuples use parentheses ()\n3. Performance: Tuples are faster for accessing elements due to their immutability\n4. Use cases: Lists are used for collections that may change, tuples for fixed data like coordinates\n5. Dictionary keys: Tuples can be used as dictionary keys, lists cannot\n\nExample:\n# List (mutable)\nmy_list = [1, 2, 3]\nmy_list.append(4)  # This works\n\n# Tuple (immutable)\nmy_tuple = (1, 2, 3)\nmy_tuple.append(4)  # This would raise an error",
    "Explain Python decorators.": "Decorators are a powerful feature in Python that allow you to modify the behavior of functions or classes. They are implemented using higher-order functions and can be applied using the @ symbol.\n\nKey points:\n1. Decorators wrap another function to extend its behavior\n2. They are applied using the @ syntax before function definitions\n3. Common decorators include @property, @staticmethod, and @classmethod\n\nExample:\n```python\ndef my_decorator(func):\n    def wrapper():\n        print('Before function')\n        func()\n        print('After function')\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print('Hello!')\n\nsay_hello()  # Output: Before function, Hello!, After function\n```",
    "What is the purpose of the __init__ method in Python classes?": "The __init__ method is a special method in Python classes that serves as the constructor. It's automatically called when a new instance of the class is created.\n\nKey features:\n1. Initializes object attributes\n2. Can accept parameters to customize object creation\n3. First parameter is always 'self' (the instance being created)\n\nExample:\n```python\nclass Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\nperson1 = Person('Alice', 30)  # Creates a person with name 'Alice' and age 30\n```",
    "How does garbage collection work in Python?": "Python uses automatic garbage collection to manage memory:\n\n1. Reference counting: Each object keeps track of references to it\n2. When reference count reaches zero, the object is deallocated\n3. Cyclic garbage collector: Handles reference cycles that reference counting can't resolve\n4. Generational collection: Objects are categorized by age for efficient collection\n\nThis prevents memory leaks but can be less efficient than manual memory management.",
    "What are Python's built-in data types?": "Python has several built-in data types:\n\nNumeric: int, float, complex\nSequence: list, tuple, range\nText: str\nMapping: dict\nSet: set, frozenset\nBoolean: bool\nBinary: bytes, bytearray, memoryview\n\nEach type has specific use cases and methods. Understanding these is crucial for effective Python programming.",
    "Explain the concept of Python's GIL (Global Interpreter Lock).": "The GIL is a mutex that protects Python objects:\n\n1. Only one thread can execute Python bytecode at a time\n2. Prevents race conditions in memory management\n3. Simplifies C extension implementation\n4. Makes threading ineffective for CPU-bound tasks\n\nFor CPU-bound tasks, use multiprocessing instead of threading to utilize multiple cores.",
    "What is the difference between deep copy and shallow copy?": "Copying in Python:\n\nShallow copy: Creates a new object but references the same elements\n```python\nimport copy\noriginal = [[1, 2], [3, 4]]\nshallow = copy.copy(original)\nshallow[0][0] = 9  # This changes original too\n```\n\nDeep copy: Creates a completely independent clone\n```python\ndeep = copy.deepcopy(original)\ndeep[0][0] = 9  # This doesn't affect original\n```",
    "How do you handle exceptions in Python?": "Exception handling in Python uses try-except blocks:\n\n```python\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print('Cannot divide by zero')\nelse:\n    print('Division successful')  # Runs if no exception\nfinally:\n    print('Cleanup code')  # Always runs\n```\n\nYou can catch multiple exceptions and use exception hierarchy for broader handling.",
    "Explain the use of *args and **kwargs in Python functions.": "*args and **kwargs provide flexibility in function parameters:\n\n*args: Accepts variable number of positional arguments as a tuple\n```python\ndef sum_numbers(*args):\n    return sum(args)\n\nsum_numbers(1, 2, 3, 4)  # Returns 10\n```\n\n**kwargs: Accepts variable number of keyword arguments as a dictionary\n```python\ndef print_info(**kwargs):\n    for key, value in kwargs.items():\n        print(f'{key}: {value}')\n\nprint_info(name='Alice', age=30)  # Prints name: Alice, age: 30\n```",
    "What is a Python virtual environment and why is it useful?": "Virtual environments isolate project dependencies:\n\nCreation: python -m venv myenv\nActivation (Windows): myenv\\Scripts\\activate\nActivation (Unix/Mac): source myenv/bin/activate\n\nBenefits:\n1. Prevents dependency conflicts between projects\n2. Keeps global Python installation clean\n3. Allows different Python versions per project\n4. Makes projects reproducible with requirements.txt"
  },
  SQL: {
    "What is the difference between INNER JOIN and LEFT JOIN?": "JOINs combine rows from different tables:\n\nINNER JOIN: Returns only matching rows from both tables\n```sql\nSELECT * FROM customers INNER JOIN orders ON customers.id = orders.customer_id;\n```\n\nLEFT JOIN: Returns all rows from left table, matching rows from right table\n```sql\nSELECT * FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;\n```\n\nIf no match exists, columns from the right table will be NULL. RIGHT JOIN and FULL OUTER JOIN work similarly but with different table priorities.",
    "Explain the use of indexes in SQL.": "Indexes improve query performance:\n\nCreation: CREATE INDEX idx_name ON table_name (column_name);\n\nBenefits:\n1. Faster data retrieval\n2. Improved sorting performance\n3. Faster JOIN operations\n\nDrawbacks:\n1. Slower INSERT/UPDATE/DELETE operations\n2. Additional storage space\n3. Maintenance overhead\n\nUse indexes on frequently queried columns but avoid over-indexing.",
    "What is a primary key and foreign key?": "Keys establish relationships between tables:\n\nPrimary Key:\n- Uniquely identifies each row\n- Cannot be NULL\n- One per table\n\nForeign Key:\n- References primary key in another table\n- Can be NULL (unless specified otherwise)\n- Establishes relationships between tables\n\nExample:\n```sql\nCREATE TABLE customers (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n\nCREATE TABLE orders (\n  id INT PRIMARY KEY,\n  customer_id INT,\n  FOREIGN KEY (customer_id) REFERENCES customers(id)\n);\n```",
    "How would you optimize a slow SQL query?": "Query optimization techniques:\n\n1. Use EXPLAIN to analyze execution plan\n2. Add appropriate indexes\n3. Avoid SELECT * - specify only needed columns\n4. Use WHERE clauses to limit result set\n5. Avoid functions in WHERE clauses\n6. Consider query rewriting\n7. Normalize or denormalize appropriately\n\nExample of optimization:\nBefore: SELECT * FROM users WHERE UPPER(name) = 'ALICE';\nAfter: SELECT id, name, email FROM users WHERE name = 'Alice';",
    "What is the difference between DELETE and TRUNCATE?": "Both remove data but work differently:\n\nDELETE:\n- Removes rows one by one\n- Can be rolled back\n- Activates triggers\n- Can use WHERE clauses\n- Slower but more precise\n\nTRUNCATE:\n- Removes all rows by deallocating pages\n- Cannot be rolled back in some databases\n- Doesn't activate triggers\n- Resets identity columns\n- Faster but less precise\n\nUse DELETE for specific rows, TRUNCATE for all rows.",
    "Explain the ACID properties of database transactions.": "ACID ensures reliable database transactions:\n\nAtomicity: All operations in a transaction succeed or fail together\nConsistency: Database moves from one valid state to another\nIsolation: Concurrent transactions don't interfere with each other\nDurability: Committed transactions survive system failures\n\nThese properties ensure data integrity and reliability in database operations.",
    "What is normalization and why is it important?": "Normalization organizes data to minimize redundancy:\n\nNormal Forms:\n1. 1NF: Eliminate repeating groups\n2. 2NF: Remove partial dependencies\n3. 3NF: Remove transitive dependencies\n\nBenefits:\n1. Reduced storage space\n2. Improved data integrity\n3. Easier maintenance\n\nDrawbacks:\n1. More complex queries\n2. Potential performance impact\n\nBalance normalization with performance needs.",
    "How do you prevent SQL injection attacks?": "SQL injection prevention:\n\n1. Use parameterized queries:\n```sql\n# Safe approach\nquery = 'SELECT * FROM users WHERE id = ?'\nparams = (user_id,)\n```\n\n2. Validate and sanitize inputs\n3. Use stored procedures\n4. Implement least privilege for database accounts\n5. Escape special characters\n\nNever concatenate user inputs directly into SQL strings.",
    "Explain the difference between WHERE and HAVING clauses.": "WHERE vs HAVING:\n\nWHERE:\n- Filters rows before grouping\n- Cannot use aggregate functions\n- Applied first in execution order\n\nHAVING:\n- Filters groups after aggregation\n- Can use aggregate functions\n- Applied after GROUP BY\n\nExample:\n```sql\nSELECT department, COUNT(*) FROM employees\nWHERE salary > 50000\nGROUP BY department\nHAVING COUNT(*) > 5;\n```\n\nWHERE filters high-salary employees, HAVING filters departments with more than 5 such employees.",
    "What are window functions in SQL and how are they used?": "Window functions perform calculations across related rows:\n\nSyntax: function_name() OVER (PARTITION BY column ORDER BY column)\n\nExamples:\n1. ROW_NUMBER() - assigns sequential numbers\n2. RANK() - assigns ranks with gaps\n3. DENSE_RANK() - assigns ranks without gaps\n4. SUM() - running totals\n\n```sql\nSELECT name, salary,\n       ROW_NUMBER() OVER (ORDER BY salary DESC) as rank\nFROM employees;\n```\n\nUseful for analytics and reporting without collapsing rows."
  },
  Networking: {
    "Explain the OSI model and its layers.": "The OSI model standardizes network communication:\n\n7. Application - Network services to applications\n6. Presentation - Data translation and encryption\n5. Session - Establishes, manages, terminates connections\n4. Transport - End-to-end communication (TCP/UDP)\n3. Network - Routing and forwarding (IP)\n2. Data Link - Node-to-node data transfer (Ethernet)\n1. Physical - Transmits raw bits (cables, signals)\n\nEach layer provides services to the layer above and uses services from the layer below. Understanding this model helps troubleshoot network issues effectively.",
    "What is the difference between TCP and UDP?": "Transport layer protocols:\n\nTCP (Transmission Control Protocol):\n- Connection-oriented\n- Reliable delivery\n- Ordered delivery\n- Error checking and correction\n- Slower due to overhead\n- Used for web browsing, email\n\nUDP (User Datagram Protocol):\n- Connectionless\n- No delivery guarantee\n- No ordering guarantee\n- Minimal overhead\n- Faster\n- Used for streaming, gaming, DNS\n\nChoose TCP for reliability, UDP for speed when some data loss is acceptable.",
    "Describe the process of a DNS lookup.": "DNS lookup process:\n\n1. Browser cache check\n2. OS cache check\n3. ISP DNS server query\n4. Root server query (if needed)\n5. TLD server query (.com, .org, etc.)\n6. Authoritative DNS server query\n7. Return IP address to client\n8. Cache result for future use\n\nThis hierarchical system makes DNS lookups efficient and scalable. Recursive and iterative queries work together to resolve domain names to IP addresses.",
    "What is a subnet mask and how is it used?": "Subnet masks divide IP addresses:\n\nPurpose:\n- Separates network and host portions\n- Defines network boundaries\n- Used in routing decisions\n\nExample:\nIP: 192.168.1.100\nSubnet mask: 255.255.255.0 (or /24)\nNetwork portion: 192.168.1\nHost portion: 100\n\nCIDR notation (/24) indicates the number of network bits. Subnetting allows efficient IP address allocation and network organization.",
    "Explain the concept of load balancing.": "Load balancing distributes traffic:\n\nBenefits:\n1. Improved performance\n2. Better reliability\n3. Scalability\n4. Prevents server overload\n\nAlgorithms:\n1. Round-robin - rotates through servers\n2. Least connections - sends to least busy server\n3. IP hash - distributes based on client IP\n4. Weighted - considers server capacity\n\nLoad balancers can be hardware or software solutions. They're essential for high-traffic websites and applications.",
    "What is the difference between HTTP and HTTPS?": "HTTP vs HTTPS:\n\nHTTP (Hypertext Transfer Protocol):\n- Unencrypted communication\n- Vulnerable to eavesdropping\n- Faster\n- Default port 80\n\nHTTPS (HTTP Secure):\n- Encrypted with SSL/TLS\n- Secure communication\n- Authentication and integrity\n- Slower due to encryption overhead\n- Default port 443\n\nHTTPS is required for secure transactions and is increasingly becoming the standard for all web communication.",
    "Explain how a firewall works.": "Firewalls filter network traffic:\n\nTypes:\n1. Packet filtering - examines packets\n2. Stateful inspection - tracks connection state\n3. Application layer - filters application traffic\n4. Proxy - acts as intermediary\n\nFunctionality:\n- Blocks unauthorized access\n- Allows authorized traffic\n- Logs network activity\n- Prevents malicious traffic\n\nFirewalls can be hardware, software, or cloud-based. They're a critical component of network security infrastructure.",
    "What is the purpose of ARP (Address Resolution Protocol)?": "ARP resolves IP to MAC addresses:\n\nProcess:\n1. Device needs to communicate with IP address\n2. Check ARP cache for MAC address\n3. Send ARP request if not found\n4. Receive ARP reply with MAC address\n5. Update ARP cache\n\nThis is essential for local network communication. Without ARP, devices couldn't send frames to the correct physical addresses. ARP spoofing is a common security concern.",
    "Describe the differences between IPv4 and IPv6.": "IP versions comparison:\n\nIPv4:\n- 32-bit addresses\n- ~4.3 billion addresses\n- Dotted decimal notation (192.168.1.1)\n- Requires NAT for address conservation\n\nIPv6:\n- 128-bit addresses\n- 340 undecillion addresses\n- Hexadecimal notation (2001:0db8::1)\n- Built-in security (IPsec)\n- Auto-configuration\n- No NAT needed\n\nIPv6 adoption is increasing due to IPv4 address exhaustion. Transition mechanisms like dual-stack help with migration.",
    "What is a CDN (Content Delivery Network) and how does it work?": "CDNs deliver content efficiently:\n\nComponents:\n1. Edge servers - distributed globally\n2. Origin server - original content source\n3. Caching mechanisms\n4. Load balancing\n\nBenefits:\n1. Reduced latency\n2. Improved performance\n3. Bandwidth savings\n4. DDoS protection\n5. Global reach\n\nPopular CDNs include Cloudflare, Akamai, and Amazon CloudFront. They're essential for high-performance websites and applications."
  },
  HR: {
    "Tell me about yourself.": "This is your opportunity to make a strong first impression:\n\nStructure your response as:\n1. Professional background (education, key experiences)\n2. Relevant skills and achievements\n3. Personal interests that connect to the role\n\nExample:\n'I graduated with a degree in Computer Science and have 5 years of experience in software development. My expertise is in Python and React, and I've led several successful projects. Outside of work, I contribute to open-source projects and enjoy mentoring junior developers, which aligns with your company's collaborative culture.'\n\nKeep it concise (1-2 minutes) and tailored to the position.",
    "What are your strengths and weaknesses?": "Answer strategically:\n\nStrengths:\n- Mention job-relevant skills\n- Provide specific examples\n- Show measurable results\n\nWeaknesses:\n- Choose genuine but non-critical weaknesses\n- Show improvement efforts\n- Connect to professional development\n\nExample:\n'My strength is problem-solving - I recently debugged a critical system issue that saved our team 20 hours of work. As for weaknesses, I sometimes focus too much on details, but I've been working on prioritizing tasks to maintain project timelines.'",
    "Why do you want to work here?": "Research and connect:\n\n1. Company mission/values\n2. Recent achievements/news\n3. Growth opportunities\n4. Culture fit\n\nExample:\n'I'm impressed by your commitment to innovation and recent expansion into AI technologies. My background in machine learning aligns with your direction, and I'm excited about contributing to projects that make a real impact.'\n\nAvoid generic answers like 'I want to grow professionally.'",
    "Describe a challenging situation you faced at work and how you handled it.": "Use the STAR method:\n\nSituation - Set the context\nTask - Define your responsibility\nAction - Explain what you did\nResult - Share the outcome\n\nExample:\n'In my previous role, our team faced a tight deadline for a critical client project (Situation). I was responsible for the backend implementation (Task). I organized daily standups, prioritized tasks, and worked extra hours to ensure quality delivery (Action). We delivered two days early with positive client feedback (Result).'",
    "Where do you see yourself in 5 years?": "Show ambition with realism:\n\n1. Skill development goals\n2. Leadership aspirations\n3. Company growth alignment\n\nExample:\n'In five years, I see myself as a senior developer specializing in cloud architecture. I'm interested in mentoring others and contributing to your technical leadership program. I hope to be part of projects that drive your expansion into new markets.'\n\nAvoid mentioning leaving the company or unrelated career paths.",
    "How do you handle stress and pressure?": "Demonstrate effective techniques:\n\n1. Prioritization methods\n2. Time management strategies\n3. Stress relief practices\n4. Real examples\n\nExample:\n'I handle pressure by breaking tasks into manageable steps and prioritizing based on impact. During a recent product launch, I used time-blocking to focus on critical tasks while delegating appropriately. I also practice mindfulness to maintain clarity under stress.'",
    "Tell me about a time you worked in a team.": "Highlight collaboration skills:\n\n1. Team context\n2. Your role\n3. Challenges faced\n4. Actions taken\n5. Results achieved\n\nExample:\n'On a cross-functional project, I worked with designers, backend developers, and product managers. I facilitated communication by organizing weekly syncs and creating shared documentation. When conflicts arose over priorities, I helped mediate discussions that led to a compromise everyone accepted. The project was delivered on time with excellent results.'",
    "What motivates you in your work?": "Connect to job requirements:\n\n1. Intrinsic motivators\n2. Alignment with role\n3. Company values\n\nExample:\n'I'm motivated by solving complex problems and seeing my work make a real difference. In my last role, I was particularly energized when our team's optimization efforts reduced server costs by 30%. I'm also driven by continuous learning and staying current with technologies.'",
    "How do you deal with failure or setbacks?": "Show resilience and growth mindset:\n\n1. Acknowledge the setback\n2. Explain your response\n3. Share what you learned\n4. Connect to improvement\n\nExample:\n'When a project I led missed its deadline due to underestimating integration complexity, I took responsibility and conducted a thorough post-mortem. I learned to better assess technical risks and now include buffer time for integrations. This experience made me a more careful planner and better leader.'",
    "Why should we hire you?": "Summarize your unique value:\n\n1. Relevant experience\n2. Key skills\n3. Cultural fit\n4. Passion for role/company\n\nExample:\n'You should hire me because I bring both technical expertise and leadership experience that directly aligns with this role. My track record of delivering projects under budget and my enthusiasm for your mission make me an ideal fit. I'm committed to growing with the company and contributing to its success.'"
  }
};

// Mock questions database organized by difficulty level
const mockQuestions = {
  Python: {
    easy: [
      "What is the difference between a list and a tuple in Python?",
      "How do you create a function in Python?",
      "What is the purpose of indentation in Python?",
      "How do you comment code in Python?",
      "What is the difference between == and is in Python?"
    ],
    medium: [
      "Explain Python decorators.",
      "What is the purpose of the __init__ method in Python classes?",
      "How does garbage collection work in Python?",
      "Explain the use of *args and **kwargs in Python functions.",
      "What is the difference between deep copy and shallow copy?"
    ],
    hard: [
      "What are Python's built-in data types?",
      "Explain the concept of Python's GIL (Global Interpreter Lock).",
      "How do you handle exceptions in Python?",
      "What is a Python virtual environment and why is it useful?",
      "Explain Python's memory management system."
    ]
  },
  SQL: {
    easy: [
      "What is the difference between INNER JOIN and LEFT JOIN?",
      "How do you select all columns from a table named 'users'?",
      "What is the purpose of the WHERE clause in SQL?",
      "How do you insert a new record into a table?",
      "What does the DISTINCT keyword do in SQL?"
    ],
    medium: [
      "Explain the use of indexes in SQL.",
      "What is a primary key and foreign key?",
      "Explain the difference between WHERE and HAVING clauses.",
      "What is the difference between DELETE and TRUNCATE?",
      "How do you sort results in SQL?"
    ],
    hard: [
      "How would you optimize a slow SQL query?",
      "Explain the ACID properties of database transactions.",
      "What is normalization and why is it important?",
      "How do you prevent SQL injection attacks?",
      "What are window functions in SQL and how are they used?"
    ]
  },
  Networking: {
    easy: [
      "What is an IP address?",
      "Explain the difference between TCP and UDP.",
      "What is DNS and what does it do?",
      "What is a router?",
      "What is the difference between HTTP and HTTPS?"
    ],
    medium: [
      "Explain the OSI model and its layers.",
      "Describe the process of a DNS lookup.",
      "What is a subnet mask and how is it used?",
      "Explain how a firewall works.",
      "What is the purpose of ARP (Address Resolution Protocol)?"
    ],
    hard: [
      "Explain the concept of load balancing.",
      "Describe the differences between IPv4 and IPv6.",
      "What is a CDN (Content Delivery Network) and how does it work?",
      "Explain how SSL/TLS works.",
      "What are the differences between symmetric and asymmetric encryption?"
    ]
  },
  HR: {
    easy: [
      "Tell me about yourself.",
      "Why do you want to work here?",
      "What are your strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Why should we hire you?"
    ],
    medium: [
      "Describe a challenging situation you faced at work and how you handled it.",
      "How do you handle stress and pressure?",
      "Tell me about a time you worked in a team.",
      "What motivates you in your work?",
      "How do you prioritize your work?"
    ],
    hard: [
      "Tell me about a time you failed and how you handled it.",
      "How do you deal with failure or setbacks?",
      "Describe a situation where you had to persuade someone.",
      "Tell me about a time you showed leadership.",
      "How do you handle conflict in the workplace?"
    ]
  }
};

// Mock interviewer responses with subject-specific feedback
const mockInterviewerResponses = {
  Python: {
    "What is the difference between a list and a tuple in Python?": {
      excellent: {
        score: 9,
        feedback: "Excellent answer! You've correctly identified that lists are mutable while tuples are immutable. Your explanation of use cases for each is spot on - lists for collections that change and tuples for fixed data. You also mentioned the performance implications correctly. To make it perfect, you could have mentioned that tuples can be used as dictionary keys while lists cannot."
      },
      good: {
        score: 7,
        feedback: "Good answer with correct information about mutability. You've explained that lists can be modified while tuples cannot. However, you missed some important details like the performance differences and use cases. Also, it would be beneficial to mention that tuples can be used as dictionary keys due to their immutability."
      },
      fair: {
        score: 5,
        feedback: "You've touched on the basic difference but your answer lacks depth. Lists are indeed mutable and tuples immutable, but you should elaborate more on when to use each. For example, tuples are often used for heterogeneous data and lists for homogeneous data. You also missed mentioning that tuples can be dictionary keys."
      },
      poor: {
        score: 3,
        feedback: "Your answer needs improvement. While you mentioned that lists and tuples are different, you didn't clearly explain the key difference - mutability. You should also discuss performance implications and appropriate use cases for each data structure."
      }
    }
  },
  SQL: {
    "What is the difference between INNER JOIN and LEFT JOIN?": {
      excellent: {
        score: 9,
        feedback: "Perfect explanation! You've clearly described that INNER JOIN returns only matching records from both tables while LEFT JOIN returns all records from the left table and matching records from the right table. Your example with NULL values for non-matching records in LEFT JOIN is exactly right. You could add that RIGHT JOIN and FULL OUTER JOIN are other types of joins."
      },
      good: {
        score: 7,
        feedback: "Good answer with correct information. You've explained that INNER JOIN only returns matching rows while LEFT JOIN returns all rows from the left table. However, you could be more specific about what happens to non-matching rows in a LEFT JOIN (they appear with NULL values for right table columns)."
      },
      fair: {
        score: 5,
        feedback: "You've got the basic concept but your explanation lacks precision. INNER JOIN does return matching records from both tables, but LEFT JOIN returns ALL records from the left table regardless of matches. You should also explain how NULL values appear in the result set for non-matching records."
      },
      poor: {
        score: 3,
        feedback: "Your answer needs significant improvement. You haven't clearly explained the fundamental difference between these joins. INNER JOIN returns only records with matches in both tables, while LEFT JOIN returns all records from the left table and only matching records from the right table."
      }
    }
  },
  Networking: {
    "What is the difference between TCP and UDP?": {
      excellent: {
        score: 9,
        feedback: "Excellent answer! You've correctly identified that TCP is connection-oriented and reliable while UDP is connectionless and unreliable. Your explanation of TCP's three-way handshake and UDP's speed advantage is spot on. You also correctly mentioned use cases like web browsing for TCP and streaming for UDP."
      },
      good: {
        score: 7,
        feedback: "Good explanation of the key differences. You've correctly identified that TCP is reliable and UDP is faster but unreliable. However, you could elaborate more on why TCP is slower (due to acknowledgments and retransmissions) and provide more specific use cases for each protocol."
      },
      fair: {
        score: 5,
        feedback: "You've touched on some differences but your answer lacks depth. TCP is indeed reliable but you should explain how (through acknowledgments, sequencing, and retransmissions). UDP is faster but you should explain why (no connection setup, no acknowledgments). Include specific examples like HTTP for TCP and DNS for UDP."
      },
      poor: {
        score: 3,
        feedback: "Your answer needs improvement. You haven't clearly explained the fundamental differences between TCP and UDP. TCP provides reliable, ordered delivery through connection establishment and acknowledgments, while UDP is faster but doesn't guarantee delivery or order."
      }
    }
  },
  HR: {
    "Tell me about yourself.": {
      excellent: {
        score: 9,
        feedback: "Great response! You've structured your answer well with a logical flow from education to experience to interests. You've highlighted relevant skills without just repeating your resume. Your answer is concise yet comprehensive, showing self-awareness and fit for the role."
      },
      good: {
        score: 7,
        feedback: "Good structure but could be more focused on professional aspects. You've covered your background but should emphasize skills and experiences most relevant to this position. Try to connect your personal interests to professional development or company values."
      },
      fair: {
        score: 5,
        feedback: "Your answer is too generic or too personal. Instead of just listing facts about your life, focus on creating a narrative that connects your background to why you're a good fit for the role. Emphasize professional experiences and skills that align with the job description."
      },
      poor: {
        score: 3,
        feedback: "This answer doesn't effectively communicate your value. It's either too vague, too detailed about irrelevant aspects, or doesn't show how your background makes you suitable for the position. Structure your response to highlight key experiences and skills relevant to the job."
      }
    }
  }
};

export const getNextQuestion = async (subject, currentIndex = 0) => {
  // Simulate API delay
  await delay(1000);
  
  // Get the next question from the subject based on difficulty progression
  // In a real implementation, we would track which questions have been asked
  const subjectQuestions = mockQuestions[subject] || mockQuestions.HR;
  
  // Determine difficulty level based on question index
  let difficultyLevel = 'easy';
  if (currentIndex >= 10) {
    difficultyLevel = 'hard';
  } else if (currentIndex >= 5) {
    difficultyLevel = 'medium';
  }
  
  // Get questions for the current difficulty level
  const questions = subjectQuestions[difficultyLevel] || subjectQuestions.easy;
  
  // Return the next question in the sequence for this difficulty level
  const nextIndex = currentIndex % questions.length;
  return questions[nextIndex];
};

export const evaluateAnswer = async (subject, question, answer) => {
  // Simulate API delay
  await delay(1500);
  
  if (!subject || !question || !answer) {
    throw new Error('Subject, question, and answer are required');
  }
  
  // In a real implementation, this would call an LLM API with the specified behavior
  // For this mock implementation, we'll provide tailored feedback based on the answer
  
  // Check for "don't know" type responses
  const dontKnowResponses = [
    "don't know",
    "dont know",
    "i don't know",
    "i dont know",
    "idk",
    "not sure",
    "unsure",
    "i'm not sure",
    "im not sure",
    "no idea",
    "i have no idea",
    "i am not sure",
    "i don't have knowledge",
    "i dont have knowledge",
    "i don't understand",
    "i dont understand",
    "can't answer",
    "cant answer",
    "cannot answer",
    "i can't answer",
    "i cant answer",
    "i cannot answer"
  ];
  
  const trimmedAnswer = answer.trim().toLowerCase();
  const isDontKnowResponse = dontKnowResponses.some(response => trimmedAnswer === response || trimmedAnswer.startsWith(response));
  
  if (isDontKnowResponse) {
    // Don't penalize score for "don't know" responses
    return {
      score: 0,
      feedback: "It's ok, I will explain you the concept clearly:"
    };
  }
  
  // Check if we have a specific response for this question
  if (mockInterviewerResponses[subject] && mockInterviewerResponses[subject][question]) {
    // Simple logic to determine response quality based on answer length
    // In a real implementation, an LLM would analyze the content
    const answerLength = answer.trim().length;
    
    if (answerLength > 100) {
      return mockInterviewerResponses[subject][question].excellent;
    } else if (answerLength > 50) {
      return {
        score: mockInterviewerResponses[subject][question].good.score,
        feedback: "Good attempt, but you missed some details. Here's the complete explanation:"
      };
    } else if (answerLength > 20) {
      return {
        score: mockInterviewerResponses[subject][question].fair.score,
        feedback: "Good attempt, but you missed some details. Here's the complete explanation:"
      };
    } else {
      return mockInterviewerResponses[subject][question].poor;
    }
  }
  
  // Default response if no specific question feedback is available
  const answerLength = answer.trim().length;
  let score, feedback;
  
  if (answerLength > 100) {
    score = 8;
    feedback = "Great answer! You've demonstrated a solid understanding of the topic. Keep up the good work!";
  } else if (answerLength > 50) {
    score = 6;
    feedback = "Good attempt, but you missed some details. Here's the complete explanation:";
  } else if (answerLength > 20) {
    score = 4;
    feedback = "Good attempt, but you missed some details. Here's the complete explanation:";
  } else {
    score = 2;
    feedback = "Your answer is too brief to properly evaluate your understanding. Here's a more comprehensive explanation:";
  }
  
  return {
    score,
    feedback
  };
};

export const getExplanation = (subject, question) => {
  // Return detailed explanation if available, otherwise return basic explanation
  if (mockDetailedExplanations[subject] && mockDetailedExplanations[subject][question]) {
    return mockDetailedExplanations[subject][question];
  }
  
  if (mockExplanations[subject] && mockExplanations[subject][question]) {
    return mockExplanations[subject][question];
  }
  
  // Default explanation if none found
  return "I don't have a detailed explanation for this question yet. In a real implementation, this would be generated dynamically based on the question and subject.";
};

// Function to get the next question in a subject after answering
export const continueInterview = async (subject, question, answer, currentIndex = 0) => {
  // Simulate API delay
  await delay(1500);
  
  // First evaluate the answer if provided
  let evaluation = null;
  if (answer && answer.trim().length > 0) {
    try {
      evaluation = await evaluateAnswer(subject, question, answer);
    } catch (error) {
      // If evaluation fails, continue with next question anyway
      evaluation = {
        score: 0,
        feedback: "I couldn't evaluate your answer properly, but let's move on to the next question."
      };
    }
  }
  
  // Then get the next question based on difficulty progression
  let nextQuestion = "Tell me about yourself.";
  
  if (mockQuestions[subject]) {
    // Determine difficulty level based on question index
    let difficultyLevel = 'easy';
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= 10) {
      difficultyLevel = 'hard';
    } else if (nextIndex >= 5) {
      difficultyLevel = 'medium';
    }
    
    // Get questions for the current difficulty level
    const questions = mockQuestions[subject][difficultyLevel] || mockQuestions[subject].easy;
    
    // Select the next question in the sequence for this difficulty level
    nextQuestion = questions[nextIndex % questions.length];
  }
  
  // Return JSON response as specified in requirements
  return {
    question: nextQuestion,
    evaluation: evaluation,
    explanation: evaluation && evaluation.score < 7 ? getExplanation(subject, question) : null
  };
};
