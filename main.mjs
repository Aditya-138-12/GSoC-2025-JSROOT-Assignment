'use strict';

import { ReadBuffer } from "./buffer.mjs";
import { simpleHash } from "./hash.mjs";

// `buf` is an ArrayBuffer containing a binary DummyNTuple
function deserializeNTuple(buf) {
  console.log(`Loaded ${buf.byteLength} bytes or ${buf.byteLength * 1024} bits.`);


  // This is the initial testing to get familiar with the process. After this i will try to create a well defined dynamic 
  // way to read a DummyNTuple file... for that please go to line: 279
  // ###########################################################################################################################################
  // ###########################################################################################################################################
  // ###########################################################################################################################################
  // ###########################################################################################################################################
  // ###########################################################################################################################################

  let rawBuffer = buf;

  let readBuf = new ReadBuffer(rawBuffer);

  for(let i = 0; i < 4; i++){
    console.log(parseInt(readBuf.readU8(), 16));
  }

  for(let i = 0; i < 1; i++){
    console.log("This is the Version:", readBuf.readU16());
  }

  console.log("This is the name:", readBuf.readString());

  console.log("This is the description of the Dataset:", readBuf.readString());

  // This is offset of the Footer section.
  let footerOffset = readBuf.readU32();
  console.log("This is the offset to the footer:", footerOffset);

  // This is the checksum, to make sure that the data is valid.
  let fileCheckSum = readBuf.readU32();

  // So the complete value would be 4 + 2 + 4 + 11 + 4 + 14 + 4
  let concatArr = readBuf.getByteView(0, 43);
  let calculatedCheckSum = simpleHash(concatArr);

  if(fileCheckSum == calculatedCheckSum){
    console.log("The data for the header seciton is valid!!")
  }else{
    console.log("The data for the Header seciton is not valid.")
  }

  readBuf.seek(footerOffset);

  // Reading the number of pages in the pages section.
  let numberOfPages = readBuf.readU32();
  console.log("Number of pages in the pages section are:", numberOfPages);

  console.log("");

  // Page-1 Information
  let pageOneOffset = readBuf.readU32(); console.log("Page-1 Offset is:", pageOneOffset);
  let pageOneSize = readBuf.readU32(); console.log("Page-1 Size is:", pageOneSize);
  let pageOneElements = readBuf.readU32(); console.log("Page-1 Elements are:", pageOneElements);
  // Verfiy the Page-1 Size
  if(pageOneSize == (4 * pageOneElements)){
    console.log("The Page-1 Size is cross checked successfully.");
  }

  console.log("");


  // Page-2 Information
  let pageTwoOffset = readBuf.readU32(); console.log("Page-2 Offset is:", pageTwoOffset);
  let pageTwoSize = readBuf.readU32(); console.log("Page-2 Size is:", pageTwoSize);
  let pageTwoElements = readBuf.readU32(); console.log("Page-2 Elements are:", pageTwoElements);
  // VErify the Page-2 Size
  if(pageTwoSize == (4 * pageTwoElements)){
    console.log("The Page-2 Size is cross checked successfully");
  }

  console.log("");

  // Page-3 Information
  let pageThreeOffset = readBuf.readU32(); console.log("Page-3 Offset is:", pageThreeOffset);
  let pageThreeSize = readBuf.readU32(); console.log("Page-3 Size is:", pageThreeSize);
  let pageThreeElements = readBuf.readU32(); console.log("Page-3 Elements are:", pageThreeElements);
  // VErify the Page-3 Size
  if(pageThreeSize == (4 * pageThreeElements)){
    console.log("The Page-3 Size is cross checked successfully");
  }

  console.log("");

  // Page-4 Information
  let pageFourOffset = readBuf.readU32(); console.log("Page-4 Offset is:", pageFourOffset);
  let pageFourSize = readBuf.readU32(); console.log("Page-4 Size is:", pageFourSize);
  let pageFourElements = readBuf.readU32(); console.log("Page-4 Elements are:", pageFourElements);
  // VErify the Page-4 Size
  if(pageFourSize == (4 * pageFourElements)){
    console.log("The Page-4 Size is cross checked successfully");
  }

  console.log("");

  // Page-5 Information
  let pageFiveOffset = readBuf.readU32(); console.log("Page-5 Offset is:", pageFiveOffset);
  let pageFiveSize = readBuf.readU32(); console.log("Page-5 Size is:", pageFiveSize);
  let pageFiveElements = readBuf.readU32(); console.log("Page-5 Elements are:", pageFiveElements);
  // VErify the Page-5 Size
  if(pageFiveSize == (4 * pageFiveElements)){
    console.log("The Page-5 Size is cross checked successfully");
  }

  console.log("");

  // Checksum of the footer section
  let footerSectionChecksum = readBuf.readU32();

  // Calculated Footer Section Checksum: total 64 bytes
  let footerSectionConcatArray = readBuf.getByteView(footerOffset, footerOffset + 64);
  let calculateFooterSectionChecksum = simpleHash(footerSectionConcatArray);
  
  if(footerSectionChecksum == calculateFooterSectionChecksum){
    console.log("The data for the footer section is valid!!");
  }else{
    console.log("The data for the footer section is not valid.")
  }


  // Reading Page-1
  console.log("");
  console.log("Reading Page-1");
  console.log("");

  readBuf.seek(pageOneOffset);
  console.log("The data for the Page-1 is");
  console.log("");
  for(let i = 0; i < pageOneElements; i++){
    console.log(readBuf.readF32());
  }

  let storedPageOneChecksum = readBuf.readU32(); console.log("Stored Page-1 Of Checksum is:", storedPageOneChecksum);
  //let concatPageOneArray = readBuf.getByteView(pageOneOffset, pageOneOffset + pageOneSize);
  let concatPageOneArray = [];
  readBuf.seek(pageOneOffset);
  for(let i = 0; i < pageOneElements; i++){
    concatPageOneArray.push(readBuf.readF32());
  }
  let calculatedPageOneChecksum = simpleHash(concatPageOneArray);
  console.log("Calculated Page-1 Checksum is:", calculatedPageOneChecksum);
  if(storedPageOneChecksum == calculatedPageOneChecksum){
    console.log("The data in Page-1 is valid!!");
  }else{
    console.log("The data in Page-1 is not valid.")
  }


  // Reading Page-2
  console.log("");
  console.log("Reading Page-2");
  console.log("");

  readBuf.seek(pageTwoOffset);
  console.log("The data for the Page-2 is");
  for(let i = 0; i < pageTwoElements; i++){
    console.log(readBuf.readF32());
  }

  let storedPageTwoChecksum = readBuf.readU32(); console.log("The stored Page-2 Checksum is:", storedPageTwoChecksum);
  //let concatPageTwoArray = readBuf.getByteView(pageTwoOffset, pageTwoOffset + pageTwoSize);
  let concatPageTwoArray = [];
  readBuf.seek(pageTwoOffset);
  for(let i = 0; i < pageTwoElements; i++){
    concatPageTwoArray.push(readBuf.readF32());
  }
  let calculatedPageTwoChecksum = simpleHash(concatPageTwoArray); console.log("The calculated Page-2 checksum is:", calculatedPageTwoChecksum);
  if(storedPageTwoChecksum == calculatedPageTwoChecksum){
    console.log("The data in Page-2 is valid!!");
  }else{
    console.log("The data in Page-2 is not valid.")
  }


  // Reading Page-3
  console.log("");
  console.log("Reading Page-3");
  console.log("");

  readBuf.seek(pageThreeOffset);

  console.log("The data for the Page-3 is");
  for(let i = 0; i < pageThreeElements; i++){
    console.log(readBuf.readF32());
  }

  let storedPageThreeChecksum = readBuf.readU32(); console.log("The stored Page-3 Checksum is:", storedPageThreeChecksum);
  //let concatPageThreeArray = readBuf.getByteView(pageThreeOffset, pageThreeOffset + pageThreeSize);
  let concatPageThreeArray = [];
  readBuf.seek(pageThreeOffset);
  for(let i = 0; i < pageThreeElements; i++){
    concatPageThreeArray.push(readBuf.readF32());
  }
  let calculatedPageThreeChecksum = simpleHash(concatPageThreeArray); console.log("The calculated Page-3 checksum is:", calculatedPageThreeChecksum);
  if(storedPageThreeChecksum == calculatedPageThreeChecksum){
    console.log("The data in Page-3 is valid!!")
  }else{
    console.log("The data in Page-3 is not valid.")
  }

  // Reading Page-4
  console.log("");
  console.log("Reading Page-4");
  console.log("");

  readBuf.seek(pageFourOffset);

  console.log("The data for the Page-4 is");
  let count = 0;
  for(let i = 0; i < pageFourElements; i++){
    console.log(readBuf.readF32());
    count += 1;
  }
  console.log(count);

  let storedPageFourChecksum = readBuf.readU32();
  //let concatPageFourArray = readBuf.getByteView(pageFourOffset, pageFourOffset + pageFourSize);
  let concatPageFourArray = [];
  readBuf.seek(pageFourOffset);
  for(let i = 0; i < pageFourElements; i++){
    concatPageFourArray.push(readBuf.readF32());
  }
  let calculatedPageFourChecksum = simpleHash(concatPageFourArray);
  if(storedPageFourChecksum == calculatedPageFourChecksum){
    console.log("The data in Page-4 is valid!!")
  }else{
    console.log("The data in Page-4 is not valid.");
  }

  // Reading Page-5
  console.log("");
  console.log("Reading Page-5");
  console.log();

  readBuf.seek(pageFiveOffset);

  console.log("The  data for the Page-5 is");
  for(let i = 0; i < pageFiveElements; i++){
    console.log(readBuf.readF32());
  }

  let storedPageFiveChecksum = readBuf.readU32();
  //let concatPageFiveArray = readBuf.getByteView(pageFiveOffset, pageFiveOffset + pageFiveSize); console.log(concatPageFiveArray); Getting 2 extra values after each element?
  let concatPageFiveArray = [];
  readBuf.seek(pageFiveOffset);
  for(let i = 0; i <pageFiveElements; i++){
    concatPageFiveArray.push(readBuf.readF32());
  }
  let calculatedPageFiveChecksum = simpleHash(concatPageFiveArray);
  if(storedPageFiveChecksum == calculatedPageFiveChecksum){
    console.log("The data in Page-5 is valid!!");
  }else{
    console.log("The data in Page-5 is not valid.")
  }


  // let x1 = readBuf.readU8();
  // let str = x1.toString();
  // console.log(x1);
  // console.log(str);

  // ###########################################################################################################################################
  // ###########################################################################################################################################
  // ###########################################################################################################################################
  // ###########################################################################################################################################
  // ###########################################################################################################################################



  // Insert deserialization logic here

  // Now creating a well defined way to first read all the fields like Header, Footer, PagesInfo, and finally the Pages, 
  // and store them into a JS object, so that it can be used further. Well right now i am thinking to use some kind of 
  // Data structures below too, but the idea on that is still vague.

  // First initializing a JS Object to store the serialized data of the dummyNTuple.
  const dummyNTuple = {
    Header: {
      magicWord: String,
      version: Int16Array,
      name: {length: Int32Array, payload: String},
      description: {length: Int32Array, payload: String},
      footerOffset: Int32Array,
      headerChecksum: Int32Array
    },
    Pages: {
      pageData: [], // It will be a array of objects- (in which the object again will contain one array for the elements), containing data for each page. [{pageNumber: 0, pageElements: [1.2, 2.3, ....]}, ...]
      pagesChecksum: Int32Array
    },
    Footer: {
      numerOfPages: Int32Array,
      pagesInfo: [],  // It will be a array of objects, containing info about each page regarding- Page Offset, Page size in bytes and Page Elements. [{pageNumber: 0, pageOffset: 23323, pageSize: 20, pageElements: 5}, ...]
      footerChecksum: Int32Array
    }
  };

  let flag = true; // Defined a flag variable to enter the Binary file and to come out of it, we will only come out when either the checksum fails or 
                   // other errors related to parsing occurs.
  readBuf.seek(0)  // Setting the offset at the starting of the file.

  while(flag){
    // First Reading the Header Section.
    
    // Reading the magic number and storing it in Object.
    console.log(""); console.log("");
    let magicWord = "";
    for(let i = 0; i < 4; i++){
      magicWord += String.fromCharCode(readBuf.readU8());
    }
    //console.log(magicWord);
    dummyNTuple.Header.magicWord = magicWord;
    
    // Now Reading the version from the Header
    let version = readBuf.readU16();
    dummyNTuple.Header.version = version;

    // Now Reading the Name from the Header
    let nameLength = readBuf.readU32();
    let name = "";
    for(let i = 0; i < nameLength; ++i){
      name += String.fromCharCode(readBuf.readU8());
    }
    //console.log(name);
    dummyNTuple.Header.name.length = nameLength;
    dummyNTuple.Header.name.payload = name;

    // Now reading the description from the Header
    let headerDescLength = readBuf.readU32();
    let headerDesc = "";
    for(let i = 0; i < headerDescLength; ++i){
      headerDesc += String.fromCharCode(readBuf.readU8());
    }
    //console.log(headerDesc);
    dummyNTuple.Header.description.length = headerDescLength;
    dummyNTuple.Header.description.payload = headerDesc;

    // Now Reading the Footer Offset from the Header.
    let footerOffset = readBuf.readU32();
    dummyNTuple.Header.footerOffset = footerOffset; 

    // Now reading and checking the checksum of the Header section
    let storedHeaderChecksum = readBuf.readU32();
    let concatHeaderArr = readBuf.getByteView(0, 43);
    let calculatedHeaderChecksum = simpleHash(concatHeaderArr);
    if(storedHeaderChecksum != calculatedHeaderChecksum){
      flag = false;
      console.log("The Header's checksum didn't matched.");
      break;
    }else{
      flag = true;
      console.log("The Header's checksum matcehd.");
    }
    /* ---- */

    // Now Reading the Footer section using the Footer Offset obtained from the header section.

    readBuf.seek(dummyNTuple.Header.footerOffset);
    let numberOfPages = readBuf.readU32();
    dummyNTuple.Footer.numerOfPages = numberOfPages;

    // Now reading the pages info dynamically and storing it in the object.
    for(let i = 0; i < dummyNTuple.Footer.numerOfPages; i++){
      let pageNumber = i + 1;
      let pageOffset = readBuf.readU32();
      let pageSize = readBuf.readU32();
      let pageElements = readBuf.readU32();

      dummyNTuple.Footer.pagesInfo.push({pageNumber, pageOffset, pageSize, pageElements});

      if(pageSize != (4 * pageElements)){
        flag = false; // If the pageSize does not matches the desired calculation as mentioned in the format, come out of the loop and throw error, as there is not compression for now, like zlib - 'Z''L''\x08'
        break;
      }else{
        continue;
      }
    }

    // Now reading the checksum of Footer section and checking it.
    let storedFooterChecksum = readBuf.readU32();
    let concatFooterArr = readBuf.getByteView(footerOffset, footerOffset + 64);
    let calculatedFooterChecksum = simpleHash(concatFooterArr);
    if(storedFooterChecksum != calculateFooterSectionChecksum){
      flag = false;
      console.log("The Footer's checksum didn't matched.");
      break;
    }else{
      flag = true;
      console.log("The Footer's checksum matched.");
    }
    /* ---- */


    // Now Reading the Pages and its Elements and storing it in the Object.

    let pageElementsArray = []; // Array which store the main data of the dummyNTuple i.e. the values

    for(let i = 0; i < dummyNTuple.Footer.numerOfPages; i++){
      readBuf.seek(dummyNTuple.Footer.pagesInfo[i].pageOffset);
      pageElementsArray = [];
      for(let j = 0; j < dummyNTuple.Footer.pagesInfo[i].pageElements; j++){
        pageElementsArray.push(readBuf.readF32());
      }
      // Now reading the checksum of Each Page to verify the data integrity of pages data
      let storedPageChecksum = readBuf.readU32();
      let concatPageArr = [];
      readBuf.seek(dummyNTuple.Footer.pagesInfo[i].pageOffset);
      for(let k = 0; k < dummyNTuple.Footer.pagesInfo[i].pageElements; k++){
        concatPageArr.push(readBuf.readF32());
      }
      let calculatedPageChecksum = simpleHash(concatPageArr);
      if(storedPageChecksum != calculatedPageChecksum){
        flag = false;
        console.log("The", i + 1, "Page checksum didn't matched");
        break;
      }else{
        flag = true;
        console.log("The", i + 1, "Page checksum matched.")
      }
      /* ---- */
      dummyNTuple.Pages.pageData.push({pageElementsArray});
    }
    if(flag == false){
      break;
      console.log("The data is not complete as the checksums didn't matched");
    }
    flag = false; // Setting the flag to false, to stop the parsing.
                  // set the flag to false if the checksum is not matching.
  }


  return dummyNTuple; // Returns a Javascript Object which will be used to display the values and other functions.
}

export { deserializeNTuple };