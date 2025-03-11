Assignment for GSoC 2025: RNTuple in JSROOT
-------------------------------------------

## Preface

Hello and thank you for your interest in our project proposal!
We hope that this assignment will not only help us get an idea of your experience and way of approaching a problem,
but most importantly help *you* get a better idea of what you will be working on in case you are the selected person.

Our criteria for evaluating the test will not be strictly based on the completion of the work given, but more on your
way of systematically approach, evaluate and solve the given problem, so please feel free and even encouraged to
comment on your choices in whatever degree of detail you prefer. You can do so either with inline comments in the code
or in a separate text file, as you prefer (please use strictly plain text files, no Word/Google Docs or similar).

And please, refrain from using LLMs to write the code for you. This would go against the whole point of the
collaboration and we much prefer seeing incomplete but well-thought-out code to working code that had no plan or
creative process behind it.

Good luck!

## Assignment

In this assignment you are tasked with parsing a simple custom binary format called DummyNTuple.

DummyNTuple is a toy data format that is able to store arrays of floating point numbers in a way that vaguely resembles
RNTuple.

You are given the following files:
	- format.md: a document formally describing the DummyNTuple format;
	- buffer.mjs: a small ES6 module containing two simple classes for the reading and writing of binary files;
	- hash.mjs: an even smaller ES6 module exporting a single hash function that DummyNTuple uses for its checksums
	            (see format.md for more details);
    - main.mjs and main.html: stubs for the application entrypoint that provide a simple webpage with an Upload button
      and a function hooked to it that receives the binary payload to parse.
	- DummyNTuple.bin: a binary file containing a single DummyNTuple. 

Your objective is to parse the binary file into a Javascript object that contains the DummyNTuple data and metadata.
You are free to specify the schema of this object as you wish, but it should resemble the on-disk structure as
described in format.md.

### Rules

- The output of your assignment should be a simple static web page that allows a user to upload the binary file,
  click on a button and display the contents in a table or something. Feel free to choose the way the data is displayed
  (mind that the DummyNTuple content may be relatively large...).
  Note: a simple way to handle file uploads without CORS-related issues is starting a local web server with
  `python3 -m http.server` in the assignment's root directory.

- You are encouraged to use the provided modules for the reading (and writing, should you need it) or binary files,
  but you are free to roll your own implementation if you wish (in that case you should probably justify the decision).

- The code must be written in Javascript/ES6 directly, not a dialect thereof nor translated from another language
  (like Coffeescript or similar).

- Your code must work on all major browsers, particularly Firefox and Chrome. You should not rely (or need) any
  browser-specific code for this task.

### Deadline and upload link

Take your time to do the assignment, but please try to complete it within a week. Once you are done with it, zip it
and upload it to this URL: https://cernbox.cern.ch/s/iy5SEhpp5cEZ1fr
If you want you can also notify us via mail:

- giacomo.parolini@cern.ch
- S.Linev@gsi.de

