const Papa = require('babyparse');

// Maps csv data file to an object
// Name of keys in the resulting objects are based on csv headers
class StudentMapping {
  constructor(dataPath) {
    const rows = Papa.parseFiles(dataPath).data;

    // First row include headers
    const headers = rows[0];
    const indexRange = Array.from(Array(headers.length).keys());
    const getIndicesForHeader =
      header => indexRange.filter(index => headers[index].toLowerCase() === header.toLowerCase());
    const githubIdIndex = getIndicesForHeader('Github ID')[0];
    const tutorIndex = getIndicesForHeader('Tutor')[0];
    const reviewerIndex = getIndicesForHeader('Reviewer')[0];
    const labelIndices = getIndicesForHeader('Label');

    // The rest are data rows
    let data = {};
    rows.slice(1).forEach(row => {
      // Make sure that the row is not blank
      // Reason is Excel may leave some blank rows
      if (row[0] === '') {
        return;
      }

      const githubId = row[githubIdIndex].toLowerCase();
      const tutor = row[tutorIndex];
      const reviewer = row[reviewerIndex];
      const labels = labelIndices.map(index => row[index]);

      data[githubId] = {
        tutor, reviewer, labels
      };
    });

    this.data = data;
  }

  getInfoForStudent(studentGithubId) {
    return this.data[studentGithubId.toLowerCase()];
  }
}

module.exports = StudentMapping;
