function exportCSV() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var rows = ConvertToCSV(this.responseText);
      var csvContent = "data:text/csv;charset=utf-8," + encodeURI(rows);
      window.open(csvContent);
    }
  }

  xhttp.open("GET", "http://localhost:5000/registration/v1/list", true);
  xhttp.setRequestHeader("Authorization", "Bearer foobar");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

function jsonToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length)
}
