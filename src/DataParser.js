const Papa = require('babyparse');

class DataParser {
  parse(dataPath) {
    let rows = Papa.parseFiles(dataPath).data;

    // First row include headers
    let headers = rows[0];
    let indexRange = Array.from(Array(headers.length).keys());
    let getIndicesForHeader = header => indexRange.filter(index => headers[index].toLowerCase() === header.toLowerCase());
    let githubIdIndex = getIndicesForHeader('Github ID')[0];
    let tutorIndex = getIndicesForHeader('Tutor')[0];
    let reviewerIndex = getIndicesForHeader('Reviewer')[0];
    let labelIndices = getIndicesForHeader('Label');

    // The rest are data rows
    let data = {};
    rows.slice(1).forEach(row => {
      // Make sure that the row is not blank
      // Reason is Excel may leave some blank rows
      if (row[0] === '') {
        return;
      }

      let githubId = row[githubIdIndex];
      let tutor = row[tutorIndex];
      let reviewer = row[reviewerIndex];
      let labels = labelIndices.map(index => row[index]);

      data[githubId] = {
        tutor, reviewer, labels
      };
    })

    return data;
  }
}

module.exports = DataParser;
