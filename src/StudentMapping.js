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
    const githubUsernameIndex = getIndicesForHeader('Github Username')[0];
    const tutorIndex = getIndicesForHeader('Tutor')[0];
    const supervisorIndex = getIndicesForHeader('Supervisor')[0];
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

      const githubUsername = row[githubUsernameIndex].toLowerCase().trim();
      const tutor = row[tutorIndex];
      const supervisor = row[supervisorIndex].split(',');
      const reviewer = row[reviewerIndex];
      const labels = labelIndices.map(index => row[index]);

      data[githubUsername] = {
        tutor, supervisor, reviewer, labels
      };
    });

    this.data = data;
  }

  getInfoForStudent(studentGithubUsername) {
    return this.data[studentGithubUsername.toLowerCase().trim()];
  }
}

module.exports = StudentMapping;
