// Import some modules
var
    Q =            require('q'),
    del =          require('del'),
    merge =        require('merge2'),
    gulp =         require('gulp'),
    babel =        require("gulp-babel"),
    run =          require('gulp-run'),
    bump =         require('gulp-bump'),
    rename =       require('gulp-rename'),
    ts =           require('gulp-typescript'),
    uglify =       require('gulp-uglify'),
    gitTagV =      require('gulp-tag-version'),
    umd =          require('gulp-umd'),
    replace =      require('gulp-replace'),
    mocha =        require('gulp-mocha')
;

/**
 * Deletes everything inside the dist folder
 * to ensure we don't get stale artifacts.
 */
gulp.task('clean', function (done)
{
    del(['./dist/**/*'], done);
});

/**
 * Compiles all typescript source files into javascript.
 */
gulp.task('compile-src', function()
{
    // Read in the TypeScript Project
    var tsProject = ts.createProject('tsconfig.json',
    {
        outFile: 'ts-linq.js',
        declarationFiles: true,
        noExternalResolve: true,
        sortOutput: true,
        typescript: require('typescript')
    });

    // Compile the TypeScript to ES6
    var tsResult = tsProject.src().pipe(ts(tsProject));

    // Compile the ES6 to ES5 with Babel
    var babelResult = tsResult.js.pipe(babel());

    // Wrap the result into a UMD
    var umdWraped = babelResult.pipe(umd
    ({
        dependencies: function(file)
        {
            return [{
                name: 'babel-polyfill',
                amd: 'babel-polyfill',
                cjs: 'babel-polyfill',
                global: '_babelPolyfill',
                param: 'babel'
            }];
        },
        exports: function(file)
        {
            return "TsLinq";
        },
        namespace: function(file)
        {
            return "TsLinq";
        }
    }));

    // Finally output some artifacts to disk
    return merge
    ([
        // Output the TypeScript Definitions
        tsResult.dts.pipe(gulp.dest('./dist')),

        // Output the compiled unminified javascript
        umdWraped.pipe(gulp.dest('./dist'))

        // Minify the js, rename it and save the minfied version
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./dist'))
    ]);
});

/**
 * Compiles the typescript tests into javascript.
 */
gulp.task('compile-tests', function()
{
    return gulp.src
    ([
        'tests/**/*.ts',
        './typings/tsd.d.ts',
        './dist/ts-linq.d.ts'
    ])
    .pipe(ts
    ({
        "target": "es6",
        "module": "es6",
        "moduleResolution": "node",
        "declaration": false,
        "noImplicitAny": false,
        "removeComments": false,
        "noLib": false,
        "preserveConstEnums": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }))
    .pipe(babel())
    .pipe(replace(/require\(['|"]{1}ts-linq['|"]{1}\)/g, "require('../dist/ts-linq.js')"))
    .pipe(gulp.dest('tests'));
});

/**
 * Creates a fresh build from all source files.
 */
gulp.task('build', ['clean', 'compile-src']);

/**
 * Runs the mocha/chai unit tests
 */
gulp.task('test', ['compile-tests'], function()
{
    return gulp.src('./tests/**/*.js', {read: false}).pipe(mocha());
});

/**
 * Watches source for changes and will continuously re-build until stopped.
 */
gulp.task('watch', ['build'], function()
{
    gulp.watch('./src/**/*.ts', ['compile-src']);
});

/**
 * Increments the version number of the main package.json file.
 */
gulp.task('bump', function()
{
    gulp.src('./package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

/**
 * Creates a new git tag and pushes to github.
 */
gulp.task('tag', ['build', 'bump'], function()
{
    var deferred = Q.defer();

    var complete = 0, done = function()
    {
        ++complete; if (complete == 2) deferred.resolve();
    };

    run('git add -A').exec(function()
    {
        run("git commit -m NewBuild").exec(function()
        {
            run('git push').exec(done);

            gulp.src('./package.json').pipe(gitTagV()).on('end', function()
            {
                run('git push --tags').exec(done);
            });
        });
    });

    return deferred.promise;
});

/**
 * Publishes the npm package to npmjs.com
 */
gulp.task('publish', ['test','tag'], function(done)
{
    run("npm publish").exec(done);
});
