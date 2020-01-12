const lessons = [
  {
    lessonNumber: 1,
    intro: "Scratch是麻省理工媒體實驗室終身幼稚園組開發的一套電腦程式開發平台",
    title: "Scratch平台",
    contents: `<h1><a href="https://cs50.harvard.edu/x/2020/notes/0/#lecture-0" target="_blank" style="color: rgb(33, 37, 41);">Lecture 0</a></h1><ul><li><a href="https://cs50.harvard.edu/x/2020/notes/0/#welcome" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Welcome</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/0/#what-is-computer-science" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>What is computer science?</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/0/#binary" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Binary</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/0/#representing-data" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Representing data</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/0/#algorithms" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Algorithms</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/0/#pseudocode" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Pseudocode</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/0/#scratch" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Scratch</u></strong></a></li></ul><h2><a href="https://cs50.harvard.edu/x/2020/notes/0/#welcome" target="_blank" style="color: rgb(33, 37, 41);">Welcome</a></h2><ul><li><span style="color: rgb(33, 37, 41);">When David was a first year, he was too intimidated to take any computer science courses. By the time he was a sophomore, he found the courage to take the equivalent of CS50, but only pass/fail.</span></li><li><span style="color: rgb(33, 37, 41);">In fact, two-thirds of CS50 students have never taken a CS course before.</span></li></ul><blockquote class="ql-indent-1"><span style="color: rgb(33, 37, 41);">And importantly, too:what ultimately matters in this course is not so much where you end up relative to your classmates but where you end up relative to yourself when you began</span></blockquote><h2><a href="https://cs50.harvard.edu/x/2020/notes/0/#what-is-computer-science" target="_blank" style="color: rgb(33, 37, 41);">What is computer science?</a></h2><ul><li><span style="color: rgb(33, 37, 41);">Computer science is fundamentally problem-solving.</span></li><li><span style="color: rgb(33, 37, 41);">We can think of problem-solving as the process of taking some input (details about our problem) and generate some output (the solution to our problem). The “black box” in the middle is computer science.</span></li></ul><p class="ql-indent-1"><span style="color: rgb(33, 37, 41);"><img src="https://cs50.harvard.edu/x/2020/notes/0/input_output.png"></span></p><ul><li><span style="color: rgb(33, 37, 41);">We need a way to represent inputs, such that we can store and work with information in a standard way.</span></li></ul><p><br></p>`,
    videoURL: "https://www.youtube.com/embed/jjqgP9dpD1k",
    image: "", // 不用填
    totalTime: 62, // 依照影片長度
    isPreview: false, // 固定
    visible: true, // 固定
    CourseId: 1, // 從1開始
    createdAt: new Date(), // 固定
    updatedAt: new Date() // 固定
  },
  {
    lessonNumber: 2,
    intro:
      "Today we’ll learn a new language, C: a programming language that has all the features of Scratch.",
    title: "C Language",
    contents: `<h2><a href="https://cs50.harvard.edu/x/2020/notes/1/#lecture-1" target="_blank" style="color: rgb(33, 37, 41);">Lecture 1</a></h2><ul><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#c" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>C</u></strong></a></li><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#hello-world" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>hello, world</u></strong></a></li><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#compilers" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Compilers</u></strong></a></li><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#string" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>String</u></strong></a></li><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#scratch-blocks-in-c" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Scratch blocks in C</u></strong></a></li><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#types-formats-operators" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Types, formats, operators</u></strong></a></li><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#more-examples" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>More examples</u></strong></a><a href="https://cs50.harvard.edu/x/2020/notes/1/#screens" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Screens</u></strong></a></li><li class="ql-indent-1"><a href="https://cs50.harvard.edu/x/2020/notes/1/#memory-imprecision-and-overflow" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Memory, imprecision, and overflow</u></strong></a></li></ul><p><span style="color: rgb(33, 37, 41);">﻿</span></p><h2><a href="https://cs50.harvard.edu/x/2020/notes/1/#c" target="_blank" style="color: rgb(33, 37, 41);">C</a></h2><ul><li class="ql-indent-1">Today we’ll learn a new language,&nbsp;C: a programming language that has all the features of Scratch and more, but perhaps a little less friendly since it’s purely in text:</li></ul><pre class="ql-syntax" spellcheck="false">﻿<span class="hljs-comment">#include &lt;stdio.h&gt;</span>
 
 int main(void)
 {
     printf(<span class="hljs-string">"hello, world\n"</span>);
 }
 </pre><p><br></p><ul><li class="ql-indent-1"><span style="color: rgb(33, 37, 41);">Though the words are new, the ideas are exactly as same as the “when green flag clicked” and “say (hello, world)” blocks in Scratch:</span></li></ul><p class="ql-indent-2"><span style="color: rgb(33, 37, 41);"><img src="https://cs50.harvard.edu/x/2020/notes/1/when_green_flag.png"></span></p><p class="ql-indent-1"><br></p><ul><li class="ql-indent-1"><span style="color: rgb(33, 37, 41);">Though cryptic, don’t forget that 2/3 of CS50 students have never taken CS before, so don’t be daunted! And though at first, to borrow a phrase from MIT, trying to absorb all these new concepts may feel like drinking from a fire hose, be assured that by the end of the semester we’ll be empowered by and experienced at learning and applying these concepts.</span></li></ul><p class="ql-indent-1"><br></p><ul><li class="ql-indent-1"><span style="color: rgb(33, 37, 41);">We can compare a lot of the constructs in C, to blocks we’ve already seen and used in Scratch. The syntax is far less important than the principles, which we’ve already been introduced to.</span></li></ul><p><br></p>`,
    videoURL: "https://www.youtube.com/embed/e9Eds2Rc_x8",
    image: "",
    totalTime: 106,
    isPreview: false,
    visible: true,
    CourseId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    lessonNumber: 3,
    intro:
      "Compiling, Debugging, Data Types, Memory, Arrays, Strings, Command-line arguments, Readability, Encryption",
    title: "Arrays",
    contents: `<h2><a href="https://cs50.harvard.edu/x/2020/notes/2/#lecture-2" target="_blank" style="color: rgb(33, 37, 41);">Lecture 2</a></h2><ul><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#compiling" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Compiling</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#debugging" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Debugging</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#help50-and-printf" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>help50 and printf</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#debug50" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>debug50</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#check50-and-style50" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>check50 and style50</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#data-types" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Data Types</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#memory" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Memory</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#arrays" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Arrays</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#strings" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Strings</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#command-line-arguments" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Command-line arguments</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#readability" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Readability</u></strong></a></li><li><a href="https://cs50.harvard.edu/x/2020/notes/2/#encryption" target="_blank" style="color: rgb(33, 37, 41);"><strong><u>Encryption</u></strong></a></li></ul><p><strong style="color: rgb(33, 37, 41);"><u><span class="ql-cursor">﻿</span></u></strong></p><h2><a href="https://cs50.harvard.edu/x/2020/notes/2/#compiling" target="_blank" style="color: rgb(33, 37, 41);">Compiling</a></h2><p><br></p><ul><li><span style="color: rgb(33, 37, 41);">Last time, we learned to write our first program in C. We learned the syntax for the&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">main</code><span style="color: rgb(33, 37, 41);">&nbsp;function in our program, the&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">printf</code><span style="color: rgb(33, 37, 41);">&nbsp;function for printing to the terminal, how to create strings with double quotes, and how to include&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">stdio.h</code><span style="color: rgb(33, 37, 41);">&nbsp;for the&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">printf</code><span style="color: rgb(33, 37, 41);">&nbsp;function.</span></li></ul><p><br></p><ul><li>Then, we compiled it with&nbsp;<code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">clang hello.c</code><span style="color: rgb(33, 37, 41);">&nbsp;to be able to run&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">./a.out</code><span style="color: rgb(33, 37, 41);">&nbsp;(the default name), and then&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">clang -o hello hello.c</code><span style="color: rgb(33, 37, 41);">&nbsp;(passing in a command-line argument for the output’s name) to be able to run&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">./hello</code><span style="color: rgb(33, 37, 41);">.</span></li></ul><p><br></p><ul><li>If we wanted to use CS50’s library, via&nbsp;<code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">#include &lt;cs50.h&gt;</code><span style="color: rgb(33, 37, 41);">, for strings and the&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">get_string</code><span style="color: rgb(33, 37, 41);">&nbsp;function, we also have to add a flag:&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">clang -o hello hello.c -lcs50</code><span style="color: rgb(33, 37, 41);">. The&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">-l</code><span style="color: rgb(33, 37, 41);">&nbsp;flag links the&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">cs50</code><span style="color: rgb(33, 37, 41);">&nbsp;file, which is already installed in the CS50 Sandbox, and includes prototypes, or definitions of strings and&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">get_string</code><span style="color: rgb(33, 37, 41);">&nbsp;(among more) that our program can then refer to and use.</span></li></ul><p><br></p><ul><li>We write our source code in C, but need to compile it to machine code, in binary, before our computers can run it.</li><li><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">clang</code><span style="color: rgb(33, 37, 41);">&nbsp;is the compiler, and&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">make</code><span style="color: rgb(33, 37, 41);">&nbsp;is a utility that helps us run&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">clang</code><span style="color: rgb(33, 37, 41);">&nbsp;without having to indicate all the options manually.</span></li></ul><p><br></p><ul><li>“Compiling” source code into machine code is actually made up of smaller steps:</li><li>preprocessing</li></ul><p><br></p><ul><li>compiling</li></ul><p><br></p><ul><li>assembling</li></ul><p><br></p><ul><li>linking</li></ul><p><br></p><ul><li>Preprocessing&nbsp;involves looking at lines that start with a&nbsp;<code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">#</code><span style="color: rgb(33, 37, 41);">, like&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">#include</code><span style="color: rgb(33, 37, 41);">, before everything else. For example,&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">#include &lt;cs50.h&gt;</code><span style="color: rgb(33, 37, 41);">&nbsp;will tell&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">clang</code><span style="color: rgb(33, 37, 41);">&nbsp;to look for that header file first, since it contains content that we want to include in our program. Then,&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">clang</code><span style="color: rgb(33, 37, 41);">&nbsp;will essentially replace the contents of those header files into our program.</span></li></ul><p><br></p><pre class="ql-syntax" spellcheck="false">For example …<span class="hljs-comment">#include &lt;cs50.h&gt;</span>
 <span class="hljs-comment">#include &lt;stdio.h&gt;</span>
 
 int main(void)
 {
     string name = get_string(<span class="hljs-string">"Name: "</span>);
     printf(<span class="hljs-string">"hello, %s\n"</span>, name);
 }
 </pre><p><br></p><pre class="ql-syntax" spellcheck="false">… will be preprocessed into:string get_string(string prompt);
 int printf(<span class="hljs-keyword">const</span> char *format, ...);
 
 int main(<span class="hljs-keyword">void</span>)
 {
     string name = get_string(<span class="hljs-string">"Name: "</span>);
     printf(<span class="hljs-string">"hello, %s\n"</span>, name);
 }
 </pre><p><br></p><pre class="ql-syntax" spellcheck="false">Compiling&nbsp;takes our source code, <span class="hljs-keyword">in</span> C, <span class="hljs-keyword">and</span> converts it to assembly code, which looks like <span class="hljs-symbol">this:</span>...
 <span class="hljs-symbol">main:</span>                         <span class="hljs-comment"># <span class="hljs-doctag">@main</span></span>
     .cfi_startproc
 <span class="hljs-comment"># BB#0:</span>
     pushq    %rbp
 .<span class="hljs-symbol">Ltmp0:</span>
     .cfi_def_cfa_offset <span class="hljs-number">16</span>
 .<span class="hljs-symbol">Ltmp1:</span>
     .cfi_offset %rbp, -<span class="hljs-number">16</span>
     movq    %rsp, %rbp
 .<span class="hljs-symbol">Ltmp2:</span>
     .cfi_def_cfa_register %rbp
     subq    $16, %rsp
     xorl    %eax, %eax
     movl    %eax, %edi
     movabsq    $.L.str, %rsi
     movb    $0, %al
     callq    get_string
     movabsq    $.L.str.<span class="hljs-number">1</span>, %rdi
     movq    %rax, -<span class="hljs-number">8</span>(%rbp)
     movq    -<span class="hljs-number">8</span>(%rbp), %rsi
     movb    $0, %al
     callq    printf
     ...
 </pre><p><br></p><ul><li><span style="color: rgb(33, 37, 41);">These instructions are lower-level and is closer to the binary instructions that a computer’s CPU can directly understand. They generally operate on bytes themselves, as opposed to abstractions like variable names.</span></li></ul><p><br></p><ul><li><span style="color: rgb(33, 37, 41);">The next step is to take the assembly code and translate it to instructions in binary by&nbsp;assembling&nbsp;it. The instructions in binary are called&nbsp;machine code, which a computer’s CPU can run directly.</span></li></ul><p><br></p><ul><li><span style="color: rgb(33, 37, 41);">The last step is&nbsp;linking, where the contents of previously compiled libraries that we want to link, like&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">cs50.c</code><span style="color: rgb(33, 37, 41);">, are actually combined with the binary of our program. So we end up with one binary file,&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">a.out</code><span style="color: rgb(33, 37, 41);">&nbsp;or&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">hello</code><span style="color: rgb(33, 37, 41);">, that is the compiled version of&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">hello.c</code><span style="color: rgb(33, 37, 41);">,&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">cs50.c</code><span style="color: rgb(33, 37, 41);">, and&nbsp;</span><code style="color: rgb(33, 37, 41); background-color: rgba(27, 31, 35, 0.05);">printf.c</code><span style="color: rgb(33, 37, 41);">.</span></li></ul><p><br></p><p><br></p>`,
    videoURL: "https://www.youtube.com/embed/8PrOp9t0PyQ",
    image: "",
    totalTime: 107,
    isPreview: true,
    visible: true,
    CourseId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = lessons;
