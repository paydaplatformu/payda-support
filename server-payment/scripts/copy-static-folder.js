
const { cp, rm } = require('shelljs');

rm('-rf', 'dist/static');
cp('-R', 'src/static/', 'dist/static');
