var jshint = require('gulp-jshint');
var gulp = require('gulp');
var yargs = require('yargs');

// var karma = require('karma').Server;


var jsHintFiles = [
    'src/**/*.js',
];


gulp.task('build', function() {
    //todo
});

gulp.task('jsHint', ['build'], function() {
    var stream = gulp.src(jsHintFiles)
        .pipe(jshint.extract('auto'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

    if (yargs.argv.failTaskOnError) {
        stream = stream.pipe(jshint.reporter('fail'));
    }
    return stream;
});


function isTravisPullRequest() {
    return process.env.TRAVIS_PULL_REQUEST !== undefined &&
        process.env.TRAVIS_PULL_REQUEST !== 'false';
}

gulp.task('deploy-s3', function(done) {
    if (isTravisPullRequest()) {
        console.log('Skipping deployment for non-pull request.');
        return;
    }

    var argv = yargs.usage('Usage: delpoy -b [Bucket Name] -d [Upload Directory]')
        .demand(['b', 'd']).argv;

    var uploadDirectory = argv.d;
    var bucketName = argv.b;
    var cacheControl = argv.c ? argv.c : 'max-age=3600';

    if (argv.confirm) {
        // skip prompt for travis
        deployApp(bucketName, uploadDirectory, cacheControl, done);
        return;
    }

    var iface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // prompt for confirmation
    iface.question('Files from your computer will be published to the ' + bucketName + ' bucket. Continue? [y/n] ', function(answer) {
        iface.close();
        if (answer === 'y') {
            deployApp(bucketName, uploadDirectory, cacheControl, done);
        } else {
            console.log('Deploy aborted by user.');
            done();
        }
    });


});


// Deploy app to s3
function deployApp(bucketName, uploadDirectory, cacheControl, done) {
    console.log(bucketName, uploadDirectory, cacheControl, done);
    //todo
}