// DSA by pattern: what to learn, when it applies, and the must-do problems.
// Problems are seeded into the dsa_problems table; statuses live in the DB.

export const DSA_STATUSES = ["To do", "Solved", "Revise"] as const;

type P = [title: string, slug: string, diff: "E" | "M" | "H"];

export const DSA_PATTERNS: { pattern: string; week: number; idea: string; signals: string; problems: P[] }[] = [
  {
    pattern: "Arrays & Hashing", week: 1,
    idea: "Trade space for time: a hash map/set gives O(1) lookups, counting and grouping.",
    signals: "“Find a pair”, “duplicates”, “group by”, “frequency”, need better than O(n²).",
    problems: [
      ["Two Sum", "two-sum", "E"],
      ["Contains Duplicate", "contains-duplicate", "E"],
      ["Valid Anagram", "valid-anagram", "E"],
      ["Group Anagrams", "group-anagrams", "M"],
      ["Top K Frequent Elements", "top-k-frequent-elements", "M"],
      ["Product of Array Except Self", "product-of-array-except-self", "M"],
      ["Longest Consecutive Sequence", "longest-consecutive-sequence", "M"],
    ],
  },
  {
    pattern: "Prefix Sum", week: 1,
    idea: "Precompute running sums so any range sum is prefix[j] − prefix[i]; pair with a hash map for “subarray sums to k”.",
    signals: "“Subarray sum”, “range sum”, “equal 0s and 1s”, many range queries.",
    problems: [
      ["Range Sum Query - Immutable", "range-sum-query-immutable", "E"],
      ["Find Pivot Index", "find-pivot-index", "E"],
      ["Subarray Sum Equals K", "subarray-sum-equals-k", "M"],
      ["Contiguous Array", "contiguous-array", "M"],
    ],
  },
  {
    pattern: "Two Pointers", week: 1,
    idea: "Move two indices toward each other (sorted input) or same direction (read/write) to avoid nested loops.",
    signals: "Sorted array, palindromes, “pair/triplet with sum”, in-place rearranging.",
    problems: [
      ["Valid Palindrome", "valid-palindrome", "E"],
      ["Move Zeroes", "move-zeroes", "E"],
      ["Two Sum II - Input Array Is Sorted", "two-sum-ii-input-array-is-sorted", "M"],
      ["3Sum", "3sum", "M"],
      ["Container With Most Water", "container-with-most-water", "M"],
      ["Trapping Rain Water", "trapping-rain-water", "H"],
    ],
  },
  {
    pattern: "Sliding Window", week: 2,
    idea: "Grow the right edge, shrink the left while the window is invalid; track counts in a map.",
    signals: "“Longest/shortest substring/subarray with …”, contiguous, at most K.",
    problems: [
      ["Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "E"],
      ["Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "M"],
      ["Longest Repeating Character Replacement", "longest-repeating-character-replacement", "M"],
      ["Permutation in String", "permutation-in-string", "M"],
      ["Minimum Size Subarray Sum", "minimum-size-subarray-sum", "M"],
      ["Minimum Window Substring", "minimum-window-substring", "H"],
    ],
  },
  {
    pattern: "Binary Search", week: 2,
    idea: "Halve the search space each step — on the array, or on the answer range when a check(x) is monotonic.",
    signals: "Sorted/rotated input, “minimum X such that…”, O(log n) required.",
    problems: [
      ["Binary Search", "binary-search", "E"],
      ["Search a 2D Matrix", "search-a-2d-matrix", "M"],
      ["Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "M"],
      ["Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "M"],
      ["Koko Eating Bananas", "koko-eating-bananas", "M"],
      ["Time Based Key-Value Store", "time-based-key-value-store", "M"],
    ],
  },
  {
    pattern: "Stack & Monotonic Stack", week: 3,
    idea: "LIFO for matching/nesting; a monotonic stack finds the next greater/smaller element in O(n).",
    signals: "Brackets, “next greater”, “days until warmer”, histogram areas, expression eval.",
    problems: [
      ["Valid Parentheses", "valid-parentheses", "E"],
      ["Next Greater Element I", "next-greater-element-i", "E"],
      ["Min Stack", "min-stack", "M"],
      ["Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "M"],
      ["Daily Temperatures", "daily-temperatures", "M"],
      ["Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "H"],
    ],
  },
  {
    pattern: "Linked List", week: 3,
    idea: "Pointer rewiring, dummy head, fast/slow pointers for middle and cycles.",
    signals: "Reverse, merge, cycle, “nth from end”, reorder, LRU.",
    problems: [
      ["Reverse Linked List", "reverse-linked-list", "E"],
      ["Merge Two Sorted Lists", "merge-two-sorted-lists", "E"],
      ["Linked List Cycle", "linked-list-cycle", "E"],
      ["Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "M"],
      ["Reorder List", "reorder-list", "M"],
      ["Add Two Numbers", "add-two-numbers", "M"],
      ["LRU Cache", "lru-cache", "M"],
    ],
  },
  {
    pattern: "Trees (DFS & BFS)", week: 4,
    idea: "Recursion returns info up the tree (DFS); a queue walks level by level (BFS). BST = sorted inorder.",
    signals: "Depth, paths, levels, “right side view”, LCA, validate/construct a tree.",
    problems: [
      ["Invert Binary Tree", "invert-binary-tree", "E"],
      ["Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "E"],
      ["Same Tree", "same-tree", "E"],
      ["Diameter of Binary Tree", "diameter-of-binary-tree", "E"],
      ["Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "M"],
      ["Binary Tree Right Side View", "binary-tree-right-side-view", "M"],
      ["Validate Binary Search Tree", "validate-binary-search-tree", "M"],
      ["Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "M"],
      ["Lowest Common Ancestor of a Binary Search Tree", "lowest-common-ancestor-of-a-binary-search-tree", "M"],
      ["Construct Binary Tree from Preorder and Inorder Traversal", "construct-binary-tree-from-preorder-and-inorder-traversal", "M"],
    ],
  },
  {
    pattern: "Heap / Top K", week: 4,
    idea: "A min/max heap keeps the best K items in O(n log k); two heaps track a running median.",
    signals: "“Kth largest”, “top K”, “closest K”, merge K sorted, scheduling.",
    problems: [
      ["Last Stone Weight", "last-stone-weight", "E"],
      ["Kth Largest Element in an Array", "kth-largest-element-in-an-array", "M"],
      ["K Closest Points to Origin", "k-closest-points-to-origin", "M"],
      ["Task Scheduler", "task-scheduler", "M"],
      ["Merge k Sorted Lists", "merge-k-sorted-lists", "H"],
      ["Find Median from Data Stream", "find-median-from-data-stream", "H"],
    ],
  },
  {
    pattern: "Intervals", week: 4,
    idea: "Sort by start (or end), then merge or count overlaps in one pass.",
    signals: "Meetings, ranges, “merge overlapping”, “minimum to remove”.",
    problems: [
      ["Merge Intervals", "merge-intervals", "M"],
      ["Insert Interval", "insert-interval", "M"],
      ["Non-overlapping Intervals", "non-overlapping-intervals", "M"],
      ["Minimum Number of Arrows to Burst Balloons", "minimum-number-of-arrows-to-burst-balloons", "M"],
    ],
  },
  {
    pattern: "Graphs (BFS, DFS, Topo, Union-Find)", week: 5,
    idea: "Model as nodes + edges; BFS for shortest steps, DFS for flood fill, topo sort for dependencies, Dijkstra for weights.",
    signals: "Grids/islands, prerequisites, “minimum steps”, connected components, networks.",
    problems: [
      ["Number of Islands", "number-of-islands", "M"],
      ["Clone Graph", "clone-graph", "M"],
      ["Rotting Oranges", "rotting-oranges", "M"],
      ["Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "M"],
      ["Course Schedule", "course-schedule", "M"],
      ["Course Schedule II", "course-schedule-ii", "M"],
      ["Number of Provinces", "number-of-provinces", "M"],
      ["Network Delay Time", "network-delay-time", "M"],
    ],
  },
  {
    pattern: "Backtracking", week: 5,
    idea: "Choose → explore → un-choose; prune early. Generates all subsets/permutations/combinations.",
    signals: "“All possible”, “generate every”, combinations, word search on a grid.",
    problems: [
      ["Subsets", "subsets", "M"],
      ["Permutations", "permutations", "M"],
      ["Combination Sum", "combination-sum", "M"],
      ["Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "M"],
      ["Generate Parentheses", "generate-parentheses", "M"],
      ["Word Search", "word-search", "M"],
    ],
  },
  {
    pattern: "Greedy", week: 6,
    idea: "Make the locally best choice and prove it never hurts; Kadane for max subarray.",
    signals: "“Can you reach”, “minimum jumps”, max subarray, circular route.",
    problems: [
      ["Maximum Subarray", "maximum-subarray", "M"],
      ["Jump Game", "jump-game", "M"],
      ["Jump Game II", "jump-game-ii", "M"],
      ["Gas Station", "gas-station", "M"],
    ],
  },
  {
    pattern: "1D Dynamic Programming", week: 6,
    idea: "Define dp[i] from smaller answers; start with recursion + memo, then tabulate.",
    signals: "“Number of ways”, “minimum cost”, “max without adjacent”, overlapping subproblems.",
    problems: [
      ["Climbing Stairs", "climbing-stairs", "E"],
      ["House Robber", "house-robber", "M"],
      ["Decode Ways", "decode-ways", "M"],
      ["Coin Change", "coin-change", "M"],
      ["Word Break", "word-break", "M"],
      ["Longest Increasing Subsequence", "longest-increasing-subsequence", "M"],
      ["Partition Equal Subset Sum", "partition-equal-subset-sum", "M"],
    ],
  },
  {
    pattern: "2D Dynamic Programming", week: 6,
    idea: "dp[i][j] over two strings or a grid; fill row by row.",
    signals: "Two strings (LCS, edit distance), grid paths, buy/sell with states.",
    problems: [
      ["Unique Paths", "unique-paths", "M"],
      ["Longest Common Subsequence", "longest-common-subsequence", "M"],
      ["Best Time to Buy and Sell Stock with Cooldown", "best-time-to-buy-and-sell-stock-with-cooldown", "M"],
      ["Edit Distance", "edit-distance", "M"],
    ],
  },
  {
    pattern: "Trie", week: 7,
    idea: "Prefix tree of characters; fast prefix search and autocomplete.",
    signals: "“Starts with”, word dictionary, autocomplete, wildcard search.",
    problems: [
      ["Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "M"],
      ["Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "M"],
    ],
  },
  {
    pattern: "Bit Manipulation", week: 7,
    idea: "XOR cancels pairs; n & (n−1) drops the lowest set bit.",
    signals: "“Appears once”, counting bits, missing number, O(1) space tricks.",
    problems: [
      ["Single Number", "single-number", "E"],
      ["Number of 1 Bits", "number-of-1-bits", "E"],
      ["Counting Bits", "counting-bits", "E"],
      ["Missing Number", "missing-number", "E"],
    ],
  },
];

export const DSA_TOTAL = DSA_PATTERNS.reduce((a, p) => a + p.problems.length, 0);
