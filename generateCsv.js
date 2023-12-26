import csvWriter from 'csv-writer';

export function generateCsv(data) {
    console.log(data)
    const writer = csvWriter.createObjectCsvWriter({
        path: './result.csv',
        header: [
            { id: 'a', title: 'Index' },
            { id: 'Team', title: 'Team' },
            { id: 'P', title: 'P' },
            { id: 'PTS', title: 'PTS' },
            { id: '%', title: '%' },
            { id: 'W', title: 'W' },
            { id: 'L', title: 'L' },
            { id: 'D', title: 'D' },
            { id: 'BYE', title: 'BYE' },
            { id: 'F', title: 'F' },
            { id: 'A', title: 'A' },
            { id: 'FORF', title: 'FORF' },
        ],
    });
    // console.log(data)
    writer.writeRecords(data).then(() => {
        console.log('Done!');
    });
}