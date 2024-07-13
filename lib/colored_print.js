// Define methods for printing colored text
const coloredPrint = {
  blue: (text) => {
    console.log('\x1b[34m%s\x1b[0m', text);
  },
  yellow: (text) => {
    console.log('\x1b[33m%s\x1b[0m', text);
  },
  red: (text) => {
    console.log('\x1b[31m%s\x1b[0m', text);
  }
};

module.exports = coloredPrint;