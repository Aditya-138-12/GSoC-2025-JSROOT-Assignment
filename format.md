The DummyNTuple Binary Format (version 10001)
---------------------------------------------

A DummyNTuple is a binary file with the following format:

```
+---------------------------------------+
|               HEADER                  |
+---------------------------------------+
|               PAGES                   |
+---------------------------------------+
|               FOOTER                  |
+---------------------------------------+
```


All of these sections have a variable size but a fixed schema.

**IMPORTANT NOTE**: a reader should NOT assume that these sections are contiguous: they might be separated by
an arbitrary amount of padding and may even be in a different order. The only guarantee is that the HEADER section
is always the first.
The HEADER contains enough information to navigate to all the other sections, as explained below.

# Header #

The HEADER section contains some high-level information about the DummyNTuple plus a "pointer" to the FOOTER section.
It has the following schema:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+--------------------------------+------------------------------+
|                        Magic Number                           |
+--------------------------------+------------------------------+
|            Version             |     Name  (variable size)    .
+--------------------------------+                              .
.                                                               .
.                    Description (variable size)                .
.                                                               .
+--------------------------------+------------------------------+
|                        Footer Offset                          |
+--------------------------------+------------------------------+
|                            Checksum                           |
+--------------------------------+------------------------------+
```

- Magic Number: 4 bytes spelling the word "DMMY" (0x44, 0x4d, 0x4d, 0x59);
- Version: a 16 bit little-endian unsigned integer containing the format version. This should be equal to "10001";
- Name: a string (see the "Strings Schema" section) containing the name of the dataset;
- Description: a string containing the description of the dataset.
- Footer Offset: a 32 bit little-endian unsigned integer containing the offset of the FOOTER section,
  **relative to the start of the DummyNTuple** (i.e. relative to the start of the HEADER).
- Checksum: a 32 bit little-endian unsigned integer containing a value hashed from all the bytes
  in the header (except the checksum itself, of course). See the "Checksums" section for more info.


# Pages #

The PAGES section contains the actual payload of the DummyNTuple. It has the following schema:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+--------------------------------+------------------------------+
.                                                               .
.                             (pages)                           .
.                                                               .
.                                                               .
+--------------------------------+------------------------------+
```

In DummyNTuple, pages are simply arrays of 32 bit floating point numbers. They may be empty.
Each PAGE has the following schema:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+--------------------------------+------------------------------+
.                                                               .
.                             (elements)                        .
.                                                               .
+--------------------------------+------------------------------+
|                            Checksum                           |
+--------------------------------+------------------------------+
```

Each element, as mentioned above, is simply a 32-bit float. Each individual page also has its own checksum which is
defined as usual as the hash of all its elements.

NOTE that it is not guaranteed that all pages are contiguous: in order to read the pages' payload, a reader should
rely exclusively on the information given by the PageInfos stored in the FOOTER (see "Footer" section below).

# Footer #

The FOOTER section contains information about the pages, their length and offset.
It has the following schema:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+--------------------------------+------------------------------+
|                      Number of pages                          |
+--------------------------------+------------------------------+
|                           PageInfo 0                          |
+--------------------------------+------------------------------+
|                           PageInfo 1                          |
+--------------------------------+------------------------------+
.                                .                              .
.                 (info of all other pages)                     .
.                                .                              .
+--------------------------------+------------------------------+
|                           Checksum                            |
+--------------------------------+------------------------------+

```

- Number of pages: a 32 bit little-endian unsigned integer telling how many pages are contained in the PAGES section -
  and therefore how many PageInfos are contained in the FOOTER itself; the PageInfo immediately follow;
- PageInfos: exactly `Number of pages` PageInfos, whose schema is described below;
- Checksum: a 32 bit little-endian unsigned integer containing the checksum of the section (see the "Checksums" section
  below)

Each PageInfo has the following schema:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+--------------------------------+------------------------------+
|                      Page Offset                              |
+--------------------------------+------------------------------+
|                      Page Size in Bytes                       |
+--------------------------------+------------------------------+
|                    Number of Page Elements                    |
+--------------------------------+------------------------------+
```

- Page Offset: a 32 bit little-endian unsigned integer containing the offset of the first element of the page. This
  offset is, as usual, relative to the start of the DummyNTuple;
- Page Size in Bytes: a 32 bit little-endian unsigned integer containing the size in bytes of the page payload. Since
  the current version of the DummyNTuple format doesn't handle compression, this will always be equal to
  (4 * Number of Page Elements). A reader should double-check that the two pieces of information match;
- Number of Page Elements: a 32 bit little-endian unsigned integer containing the number of values (floats) stored in
  the page.


# Important Notes #
## Strings schema

DummyNTuple only supports ASCII strings. A string is encoded on-disk as follows:

- Length: a 32 bit little-endian unsigned integer containing the string length
- Payload: exactly `Length` bytes representing the string content.

Example:  

  the string "Hello World" will be encoded as:

```
    length (= 11)                        ASCII codes for "Hello World"
 ~~~~~~~~~~v~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~v~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[0x0b, 0x0, 0x0, 0x0, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64]
```

Note that a length of 0 is valid, in which case the string is empty (but still takes up 4 bytes on disk).


## Checksums
Some section of the DummyNTuple format are followed by a mandatory 32-bit hash that should be
checked by the reader to verify the integrity of the data. In all cases, the checksum is calculated from
the concatenation of all the bytes in the section from its start to just before the checksum itself.

All DummyNTuple checksums use the same simple hashing function, defined as follows:

```js
function simpleHash(bytes) {
  let hash = 5381;
  for (let byte of bytes)
    hash = hash * 33 ^ byte;
  return hash >>> 0;
}
```
