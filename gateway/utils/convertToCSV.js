const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

function convert() {
  // const readTableStream = fs.createReadStream(path.resolve('~/Downloads'));

  // fs.readFile('~/Downloads', {}, (err, data) => {
  //   console.log('read', data.meta);
  //
  // });
  // xlsx.stream.set_readable(Readable);
  // xlsx.set_cptable(xlsx.cpexcel);
  // console.log(path.parse('~/Downloads'));
  const workbook = xlsx.readFile('/Users/osavran/Downloads');
  /* get first worksheet */
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw_data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  raw_data.forEach((r, i) => {
    console.log('row', i, r);
  });

  /* select data rows */
  // const rows = raw_data.filter((r) => r[0] >= 2007 && r[0] <= 2029 && r[2] > 0);
  //
  // /* generate row objects */
  // const objects = rows.map((r) => ({ FY: r[0], FQ: r[1], total: r[8] }));
  //
  // /* print header row */
  // console.log('FY\tQ\tTotal');
  // /* print tab-separated values */
  // objects.forEach((o) => {
  //   console.log(`${o.FY}\t${o.FQ || ''}\t${o.total}`);
  // });
}

convert();
