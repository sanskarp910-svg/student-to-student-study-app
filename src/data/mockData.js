// Mock Data Structure for Student to Student Study App

export const CURRENT_USER = {
  uid: "STD-2024-8842",
  name: "Aarav Sharma",
  college: "Apex Institute of Engineering & Technology",
  course: "B.Tech Computer Science & Engineering",
  semester: "Semester 4",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  subjects: ["Maths", "C Programming", "Data Structures", "Operating Systems", "Physics", "Digital Electronics"],
  stats: {
    doubtsAsked: 6,
    doubtsSolved: 14,
    notesShared: 5,
    reputation: 4.8
  }
};

export const MOCK_USERS = [
  CURRENT_USER,
  {
    uid: "STD-2023-1102",
    name: "Priya Venkatesh",
    college: "Apex Institute of Engineering & Technology",
    course: "B.Tech Information Technology",
    semester: "Semester 6",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    subjects: ["Operating Systems", "Database Systems", "C Programming", "Computer Networks"],
    isTutor: true,
    rating: 4.9,
    reviewsCount: 38,
    bio: "Senior CS undergrad. Dean's list, passionate about demystifying OS kernels & C pointers. Regular peer tutor."
  },
  {
    uid: "STD-2023-3391",
    name: "Rohan Kulkarni",
    college: "Apex Institute of Engineering & Technology",
    course: "B.Tech Mechanical & Applied Maths",
    semester: "Semester 6",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    subjects: ["Maths", "Physics", "Thermodynamics", "Linear Algebra"],
    isTutor: true,
    rating: 4.8,
    reviewsCount: 42,
    bio: "Math Olympiad medallist. I turn complex differential calculus and vector spaces into intuitive step-by-step visuals."
  },
  {
    uid: "STD-2024-5509",
    name: "Ananya Iyer",
    college: "Apex Institute of Engineering & Technology",
    course: "B.Tech Electronics & Comm",
    semester: "Semester 4",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    subjects: ["Digital Electronics", "Physics", "Signals & Systems"],
    isTutor: true,
    rating: 4.7,
    reviewsCount: 24,
    bio: "ECE peer mentor. I specialize in circuit logic, Boolean algebra simplification, and electromagnetics."
  },
  {
    uid: "STD-2023-9941",
    name: "Dev Patel",
    college: "Apex Institute of Engineering & Technology",
    course: "B.Tech Computer Science",
    semester: "Semester 8",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    subjects: ["C Programming", "Data Structures", "Algorithms", "System Design"],
    isTutor: true,
    rating: 5.0,
    reviewsCount: 56,
    bio: "Final year senior, placed at top tech firm. Free weekend mock interviews & algorithm debugging sessions."
  }
];

export const SUBJECT_OPTIONS = [
  "All Subjects",
  "Maths",
  "Physics",
  "C Programming",
  "Data Structures",
  "Operating Systems",
  "Digital Electronics",
  "Chemistry",
  "Computer Networks"
];

export const SEMESTER_OPTIONS = [
  "All Semesters",
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8"
];

export const INITIAL_RATINGS = [
  {
    id: "rat-1",
    helperId: "STD-2023-1102",
    helperName: "Priya Venkatesh",
    doubtId: "dbt-1",
    score: 5,
    feedbackText: "Super clear explanation of memory segmentation vs paging! Saved my mid-term prep.",
    date: "2 days ago",
    raterName: "Aarav Sharma"
  },
  {
    id: "rat-2",
    helperId: "STD-2023-3391",
    helperName: "Rohan Kulkarni",
    doubtId: "dbt-2",
    score: 5,
    feedbackText: "Rohan broke down Fourier series integrals step-by-step with hand-drawn bounds. Amazing tutor!",
    date: "3 days ago",
    raterName: "Sneha Sen"
  },
  {
    id: "rat-3",
    helperId: "STD-2023-9941",
    helperName: "Dev Patel",
    doubtId: "dbt-3",
    score: 4,
    feedbackText: "Great recursive tree visualization for pointer dereferencing in linked lists.",
    date: "5 days ago",
    raterName: "Kabir Khan"
  }
];

export const INITIAL_DOUBTS = [
  {
    id: "dbt-1",
    title: "How to fix segmentation fault in C when allocating dynamic 2D array?",
    questionText: "I am trying to allocate a 2D matrix dynamically using malloc in C. When I loop to initialize arr[i][j], my code crashes with a Segmentation fault (core dumped) on row index 3. What am I missing with the double pointers (int**)?",
    codeSnippet: "int **arr = (int**)malloc(rows * sizeof(int*));\nfor(int i = 0; i <= rows; i++) {\n    arr[i] = (int*)malloc(cols * sizeof(int));\n}",
    subject: "C Programming",
    semester: "Semester 2",
    authorName: "Vikram Mehta",
    authorUid: "STD-2024-3401",
    authorCollege: "Apex Institute of Eng",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    createdAt: "2 hours ago",
    views: 89,
    bestAnswerFlag: true,
    answers: [
      {
        id: "ans-1",
        authorName: "Dev Patel",
        authorUid: "STD-2023-9941",
        authorCollege: "Apex Institute of Eng (Sem 8)",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        answerText: "Look closely at your outer loop condition: `i <= rows`. In C, array indices are 0-indexed, so an array with `rows` elements has valid indices from `0` to `rows - 1`.\n\nChanging it to `for(int i = 0; i < rows; i++)` will prevent writing out of bounds into unallocated memory! Also remember to free each `arr[i]` before freeing `arr` when done.",
        createdAt: "1 hour ago",
        upvotes: 14,
        isBestAnswer: true,
        ratings: [
          { score: 5, feedback: "Spot on! That index bug caught me off guard.", rater: "Vikram Mehta" }
        ]
      },
      {
        id: "ans-2",
        authorName: "Priya Venkatesh",
        authorUid: "STD-2023-1102",
        authorCollege: "Apex Institute of Eng (Sem 6)",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        answerText: "Dev is 100% right about the `i < rows` bounds error. Also consider allocating a single contiguous block: `int *arr = malloc(rows * cols * sizeof(int))` and accessing elements as `arr[i * cols + j]`. It improves CPU cache locality and avoids double indirection overhead.",
        createdAt: "45 mins ago",
        upvotes: 6,
        isBestAnswer: false,
        ratings: []
      }
    ]
  },
  {
    id: "dbt-2",
    title: "Intuitive explanation of Eigenvalues and Eigenvectors in Engineering Maths?",
    questionText: "We are currently doing Linear Algebra in Maths Unit 2. While I can calculate det(A - λI) = 0 algebraically, I cannot build intuition for what eigenvectors physically represent in 2D/3D transformations. Can someone explain with a real world analogy?",
    subject: "Maths",
    semester: "Semester 3",
    authorName: "Neha Gupta",
    authorUid: "STD-2024-9112",
    authorCollege: "Apex Institute of Eng",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    createdAt: "5 hours ago",
    views: 142,
    bestAnswerFlag: true,
    answers: [
      {
        id: "ans-3",
        authorName: "Rohan Kulkarni",
        authorUid: "STD-2023-3391",
        authorCollege: "Apex Institute of Eng (Sem 6)",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        answerText: "Think of a matrix transformation as stretching, shearing, or rotating a sheet of rubber. Almost every vector drawn on that sheet rotates and changes direction.\n\nHowever, **Eigenvectors are the special directions that do NOT rotate**—they only get stretched or shrunk along their original line! The amount they stretch by is the **Eigenvalue (λ)**. If λ=2, that vector just doubles in length along the same axis.",
        createdAt: "3 hours ago",
        upvotes: 27,
        isBestAnswer: true,
        ratings: [
          { score: 5, feedback: "The rubber sheet analogy clicked instantly!", rater: "Neha Gupta" }
        ]
      }
    ]
  },
  {
    id: "dbt-3",
    title: "Difference between Gauss's Law in integral form vs differential form?",
    questionText: "In Physics Electrodynamics, when do we prefer using the surface integral format ∮E·dA = Q/ε₀ versus the divergence format ∇·E = ρ/ε₀? Also, how do we transition between them using the Divergence Theorem?",
    subject: "Physics",
    semester: "Semester 2",
    authorName: "Siddharth Rao",
    authorUid: "STD-2024-7723",
    authorCollege: "Apex Institute of Eng",
    authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    createdAt: "1 day ago",
    views: 110,
    bestAnswerFlag: false,
    answers: [
      {
        id: "ans-4",
        authorName: "Ananya Iyer",
        authorUid: "STD-2024-5509",
        authorCollege: "Apex Institute of Eng (Sem 4)",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        answerText: "Use Integral Form when you have high spatial symmetry (spherical, cylindrical, or planar) because the magnitude |E| can be factored out of the integral easily. Use Differential Form when solving boundary value problems with non-uniform charge density using Poisson's equation ∇²V = -ρ/ε₀.",
        createdAt: "18 hours ago",
        upvotes: 9,
        isBestAnswer: false,
        ratings: []
      }
    ]
  },
  {
    id: "dbt-4",
    title: "Why does QuickSort degrade to O(N²) when the array is already sorted?",
    questionText: "If standard Lomuto partition picks the last element as the pivot, why does picking already-sorted elements result in quadratic time complexity? How does randomized pivot or median-of-three fix this?",
    subject: "Data Structures",
    semester: "Semester 3",
    authorName: "Tanvi Saxena",
    authorUid: "STD-2024-6014",
    authorCollege: "Apex Institute of Eng",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    createdAt: "2 days ago",
    views: 175,
    bestAnswerFlag: false,
    answers: []
  }
];

export const INITIAL_NOTES = [
  {
    id: "not-1",
    title: "Maths Unit 1: Multivariable Calculus & Jacobians",
    subject: "Maths",
    semester: "Semester 1",
    uploaderName: "Rohan Kulkarni",
    uploaderUid: "STD-2023-3391",
    fileLink: "#download-maths-unit1",
    fileSize: "4.2 MB",
    pages: 28,
    fileType: "PDF",
    downloads: 412,
    rating: 4.9,
    description: "Complete handwritten notes covering partial derivatives, Euler's theorem on homogeneous functions, Jacobians, and Taylor series with solved past paper questions.",
    featured: true
  },
  {
    id: "not-2",
    title: "C Programming: Pointers, Memory & Structs Masterclass",
    subject: "C Programming",
    semester: "Semester 2",
    uploaderName: "Dev Patel",
    uploaderUid: "STD-2023-9941",
    fileLink: "#download-c-programming",
    fileSize: "3.8 MB",
    pages: 35,
    fileType: "PDF",
    downloads: 628,
    rating: 5.0,
    description: "In-depth guide with code listings, memory map diagrams, dynamic memory allocation (malloc, calloc, realloc), bitwise operations, and mock lab exam questions.",
    featured: true
  },
  {
    id: "not-3",
    title: "Physics: Maxwell's Equations & Wave Optics Unit 3",
    subject: "Physics",
    semester: "Semester 2",
    uploaderName: "Ananya Iyer",
    uploaderUid: "STD-2024-5509",
    fileLink: "#download-physics-unit3",
    fileSize: "5.1 MB",
    pages: 42,
    fileType: "PDF",
    downloads: 290,
    rating: 4.8,
    description: "Electrodynamics formulas summary, Poynting vector derivations, wave packet group velocity, and diffraction grating formula proofs.",
    featured: false
  },
  {
    id: "not-4",
    title: "Data Structures: Trees, Graphs & Dynamic Programming",
    subject: "Data Structures",
    semester: "Semester 3",
    uploaderName: "Aarav Sharma",
    uploaderUid: "STD-2024-8842",
    fileLink: "#download-dsa-unit4",
    fileSize: "6.4 MB",
    pages: 56,
    fileType: "PDF",
    downloads: 510,
    rating: 4.9,
    description: "AVL trees rotations, Dijkstra algorithm trace, Prim vs Kruskal, and 0/1 Knapsack code implementations with time complexity breakdown.",
    featured: true
  },
  {
    id: "not-5",
    title: "Operating Systems: Process Scheduling & Deadlocks",
    subject: "Operating Systems",
    semester: "Semester 4",
    uploaderName: "Priya Venkatesh",
    uploaderUid: "STD-2023-1102",
    fileLink: "#download-os-unit2",
    fileSize: "3.1 MB",
    pages: 24,
    fileType: "PDF",
    downloads: 388,
    rating: 4.7,
    description: "Round Robin, SJF, Bankers Algorithm numericals with step-by-step state matrix solutions and semaphore synchronization problems.",
    featured: false
  },
  {
    id: "not-6",
    title: "Digital Electronics: K-Maps, Flip-Flops & Counters",
    subject: "Digital Electronics",
    semester: "Semester 3",
    uploaderName: "Ananya Iyer",
    uploaderUid: "STD-2024-5509",
    fileLink: "#download-de-unit2",
    fileSize: "2.9 MB",
    pages: 22,
    fileType: "PDF",
    downloads: 245,
    rating: 4.6,
    description: "Simplification of 4 & 5 variable Karnaugh maps, synchronous counter design state tables, and race-around condition prevention in JK flip flops.",
    featured: false
  }
];

export const INITIAL_STUDY_GROUPS = [
  {
    id: "grp-1",
    name: "C Programming & DSA Lab Squad",
    subject: "C Programming",
    semester: "Semester 2 & 3",
    course: "Computer Science & IT",
    membersCount: 42,
    maxMembers: 60,
    isJoined: true,
    schedule: "Daily 7:30 PM • Discord Voice / Lab 2",
    moderator: "Dev Patel",
    description: "Daily peer coding sessions, debugging each other's segmentation faults, and reviewing lab assignment problems together.",
    avatarBg: "bg-teal-500",
    tags: ["Coding", "Lab Practical", "Live Debugging"]
  },
  {
    id: "grp-2",
    name: "Engineering Maths - Calculus Crushers",
    subject: "Maths",
    semester: "Semester 2 & 4",
    course: "All Engineering Branches",
    membersCount: 68,
    maxMembers: 100,
    isJoined: false,
    schedule: "Tuesdays & Thursdays 6:00 PM • Library Hall B",
    moderator: "Rohan Kulkarni",
    description: "Conquering Differential Equations, Fourier series, and Complex Integration before the midterms. Past paper drill every weekend.",
    avatarBg: "bg-orange-500",
    tags: ["Maths Unit 1-4", "Past Papers", "Peer Study"]
  },
  {
    id: "grp-3",
    name: "Physics & Circuit Theory Collective",
    subject: "Physics",
    semester: "Semester 2",
    course: "ECE / EEE / Mechanical",
    membersCount: 29,
    maxMembers: 50,
    isJoined: false,
    schedule: "Mondays & Wednesdays 5:00 PM • Google Meet",
    moderator: "Ananya Iyer",
    description: "Focusing on Maxwell's equations, Optics derivations, and circuit network theorems. Group notes shared after each meeting.",
    avatarBg: "bg-blue-600",
    tags: ["Physics", "Circuits", "Derivations"]
  },
  {
    id: "grp-4",
    name: "OS Kernel & System Architecture Deep Dive",
    subject: "Operating Systems",
    semester: "Semester 4",
    course: "Computer Science",
    membersCount: 35,
    maxMembers: 50,
    isJoined: true,
    schedule: "Saturdays 11:00 AM • Room 304 & Zoom",
    moderator: "Priya Venkatesh",
    description: "Understanding process concurrency, memory paging, file system internals, and solving previous year mid-term problem sets.",
    avatarBg: "bg-amber-600",
    tags: ["Operating Systems", "Mid-term Prep", "Concurrency"]
  }
];

export const PEER_TUTORS = [
  {
    id: "STD-2023-9941",
    name: "Dev Patel",
    college: "Apex Institute of Eng",
    course: "B.Tech Computer Science (Final Year)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    reviewsCount: 56,
    subjects: ["C Programming", "Data Structures", "Algorithms"],
    rate: "Free (Peer Credit)",
    availability: "Weekends & Evenings",
    badge: "Top Contributor",
    bio: "Senior placed at top tech tier. Mentored 80+ juniors in pointers, dynamic memory, trees, and lab viva preparation."
  },
  {
    id: "STD-2023-3391",
    name: "Rohan Kulkarni",
    college: "Apex Institute of Eng",
    course: "B.Tech Mech & Applied Mathematics",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviewsCount: 42,
    subjects: ["Maths", "Physics", "Linear Algebra"],
    rate: "Free (Peer Credit)",
    availability: "Mon, Wed, Fri 6-8 PM",
    badge: "Math Specialist",
    bio: "Passionate about making calculus, Fourier transforms, and Laplace integrals intuitive without rote memorization."
  },
  {
    id: "STD-2023-1102",
    name: "Priya Venkatesh",
    college: "Apex Institute of Eng",
    course: "B.Tech Information Technology",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviewsCount: 38,
    subjects: ["Operating Systems", "Database Systems", "C Programming"],
    rate: "Free (Peer Credit)",
    availability: "Flexible After 5 PM",
    badge: "Senior Peer Mentor",
    bio: "Dean's list student. Helped over 40 peers ace their OS concepts, deadlock numericals, and SQL schema design."
  },
  {
    id: "STD-2024-5509",
    name: "Ananya Iyer",
    college: "Apex Institute of Eng",
    course: "B.Tech Electronics & Comm",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    rating: 4.7,
    reviewsCount: 24,
    subjects: ["Digital Electronics", "Physics", "Signals & Systems"],
    rate: "Free (Peer Credit)",
    availability: "Tue & Thu 4-7 PM",
    badge: "Hardware & Physics",
    bio: "ECE sophomore with expertise in logic minimization, K-maps, timing diagrams, and electromagnetic theory."
  }
];
